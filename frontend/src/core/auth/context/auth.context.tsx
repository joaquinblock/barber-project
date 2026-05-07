import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginCredentials } from "../types";
import { AuthService } from "../services/auth.service";
import type { User, UserRole } from "@barber/shared/types";
import { AUTH_STORAGE_KEYS } from "../constants/auth.constants";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AuthContextType = {
  user: User | null;
  barbershopId: string | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean; //carga inicial de la app, si existe el token y es valido lo rehidrata
  isLoading: boolean; // carga del login
  login: (credentials: LoginCredentials, slug: string) => Promise<void>;
  logout: () => void; 
};

export const AuthContext = createContext<AuthContextType>(null!);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // 1. Query para Sesión (Rehidratación)
  // Reemplaza el useEffect. Intenta validar el token si existe.
  const { 
    data: sessionData, 
    isLoading: isSessionLoading 
  } = useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      if (!token) return null;
      
      try {
        return await AuthService.getProfile(token);
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        return null;
      }
    },
    staleTime: Infinity, // La sesión no expira a menos que cerremos sesión o el token sea inválido
  });

  // 2. Mutation para Login
  const loginMutation = useMutation({
    mutationFn: ({ credentials, slug }: { credentials: LoginCredentials; slug: string }) => 
      AuthService.login(credentials, slug),
    onSuccess: (data) => {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(data.user));
      localStorage.setItem(AUTH_STORAGE_KEYS.BARBERSHOP_ID, data.barbershopId);
      
      // Actualizamos el cache de la sesión
      queryClient.setQueryData(['auth', 'session'], {
        user: data.user,
        barbershopId: data.barbershopId
      });
    }
  });

  const login = async (credentials: LoginCredentials, slug: string) => {
    await loginMutation.mutateAsync({ credentials, slug });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_STORAGE_KEYS.BARBERSHOP_ID);
    queryClient.setQueryData(['auth', 'session'], null);
    queryClient.removeQueries({ queryKey: ['auth'] });
  };

  const user = sessionData?.user || null;
  const barbershopId = sessionData?.barbershopId || null;

  const value: AuthContextType = {
    user,
    barbershopId,
    isAuthenticated: !!user,
    isInitialLoading: isSessionLoading,
    isLoading: loginMutation.isPending,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }

  const { user, isInitialLoading } = context;

  // ✅ Fix del error de roles — hasRole chequea correctamente el union type
  const hasRole = (role: UserRole): boolean =>
    user?.roles.includes(role as never) ?? false;

  const isAdmin = hasRole("ADMIN");
  const isBarber = hasRole("BARBER");
  const isCustomer = hasRole("CUSTOMER");

  return {
    ...context,

    // Estados de carga
    isInitialLoading,
    isAdmin,
    isBarber,
    isCustomer,

    // Vistas — quién puede ver qué
    isBarberView: isBarber,           // barberos y admin-barberos
    isBarberAdminView: isAdmin && isBarber, // solo admin con perfil de barbero
    isAdminView: isAdmin,
    isCustomerView: isCustomer,

    // Atajos — evitan hacer user?.barber?.id en cada componente
    barberId: user?.roles.includes("BARBER" as never)
      ? (user as Extract<typeof user, { roles: ("BARBER" | "ADMIN")[] }>)?.barber?.id ?? null
      : null,
    customerId: user?.roles.includes("CUSTOMER" as never)
      ? (user as Extract<typeof user, { roles: ("CUSTOMER")[] }>)?.customer?.id ?? null
      : null,
    userName: user?.fullName ?? "Invitado",
  };
};