import { createContext, useContext, type ReactNode } from "react";
import type { LoginCredentials } from "../types";
import type { AuthResponseDTO } from "@business/shared/types";
import { useAuthActions, useAuthSession } from "../hooks/useAuth";

export type AuthContextType = {
  user: AuthResponseDTO['user'] | null;
  businessId: AuthResponseDTO['businessId'] | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean; 
  isLoading: boolean;        
  login: (credentials: LoginCredentials, slug: string) => Promise<void>;
  logout: () => void; 
};

// Se permite que el contexto inicial sea null!, pero AuthContextType define los campos requeridos
export const AuthContext = createContext<AuthContextType>(null!);

/* ------------------------------------------
  CONTEXT - Hook para obtener el contexto de autenticación
-------------------------------------------- */

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}


/* ------------------------------------------
  AUTH PROVIDER - Proveedor de contexto de autenticación
-------------------------------------------- */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: sessionData, isLoading: isSessionLoading } = useAuthSession();
  const { loginMutation, logout } = useAuthActions();

  const login = async (credentials: LoginCredentials, slug: string) => {
    await loginMutation.mutateAsync({ credentials, slug });
  };

  const value = {
    user: sessionData?.user || null,
    businessId: sessionData?.businessId || null,
    isAuthenticated: !!sessionData?.user,
    isInitialLoading: isSessionLoading,
    isLoading: loginMutation.isPending,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
