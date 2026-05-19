import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "@business/shared/types";
import { ROUTES_PATH } from "../constants/auth.routes.constants";
import { useAuth } from "../hooks/useAuth";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[]; 
  matchAll?: boolean;
};

//Hacemos dos chequeos en uno si esta logueado y que rol tiene
export const ProtectedRoute = ({ allowedRoles, matchAll = false }: ProtectedRouteProps) => {

  const { isAuthenticated, isInitialLoading, user } = useAuth();

  if (isInitialLoading) return <div>Cargando...</div>; // O un spinner, etc.

  if (!isAuthenticated) return <Navigate to={ROUTES_PATH.PUBLIC.LOGIN} replace />;

  if (allowedRoles && user) {
    const userRoles = user.roles as UserRole[];
    const hasRoles = matchAll 
      ? allowedRoles.every(role => userRoles.includes(role))
      : allowedRoles.some(role => userRoles.includes(role));

    if (!hasRoles) {
      return <Navigate to={ROUTES_PATH.COMMON.UNAUTHORIZED} replace />;
    }
  }

  //Si pasa todos los chequeos, renderizamos el componente protegido seria lo que dentro de ProtectedRoute en el AppRouter, por ejemplo <ProtectedRoute allowedRoles={["ADMIN"]}><AdminPage/></ProtectedRoute>
  return <Outlet />;
};
