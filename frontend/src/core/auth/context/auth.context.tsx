import { createContext, useEffect, useState, useContext, type ReactNode } from "react";
import type { LoginCredentials, AuthErrorCode } from "../types";
import { AuthService } from "../services/auth.service";
import type { User, UserRole } from "@barber/shared/types";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AuthContextType = {
  user: User | null;
  barbershopId: string | null; // útil para hooks, no es sensible
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: AuthErrorCode | null;
  login: (credentials: LoginCredentials, slug: string) => Promise<void>;
  logout: () => void; 
};

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType>(null!);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [barbershopId, setBarbershopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthErrorCode | null>(null);

  // Rehidratación — recupera sesión si el usuario refresca la página
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    const savedBarbershopId = localStorage.getItem("auth_barbershop_id");
    const token = localStorage.getItem("auth_token");

    if (savedUser && savedBarbershopId && token) {
      setUser(JSON.parse(savedUser));
      setBarbershopId(savedBarbershopId);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials, slug: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);

    const result = await AuthService.login(credentials, slug);

    if (!result.success) {
      setAuthError(result.error.code as AuthErrorCode);
      setIsLoading(false);
      return;
    }

    const { user: apiUser, token, barbershopId: apiBarbershopId } = result.data;

    // Token se guarda pero nunca se expone fuera del contexto
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_user", JSON.stringify(apiUser));
    localStorage.setItem("auth_barbershop_id", apiBarbershopId);

    setUser(apiUser);
    setBarbershopId(apiBarbershopId);
    setIsLoading(false);
  };

  // No es async — solo limpia estado y localStorage
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_barbershop_id");
    setUser(null);
    setBarbershopId(null);
    setAuthError(null);
  };

  const value: AuthContextType = {
    user,
    barbershopId,
    isAuthenticated: !!user,
    isLoading,
    authError,
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

  const { user } = context;

  // ✅ Fix del error de roles — hasRole chequea correctamente el union type
  const hasRole = (role: UserRole): boolean =>
    user?.roles.includes(role as never) ?? false;

  const isAdmin = hasRole("ADMIN");
  const isBarber = hasRole("BARBER");
  const isCustomer = hasRole("CUSTOMER");

  return {
    ...context,

    // Roles
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