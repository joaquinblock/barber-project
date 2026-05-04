import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import type { UserRole } from "@barber/shared/types";
import { ROUTES_PATH } from "../constants/auth-routes.constants";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[]; 
};

//Hacemos dos chequeos en uno si esta logueado y que rol tiene
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {

  const { isAuthenticated, isInitialLoading, user } = useAuth();

  if (isInitialLoading) return <div>Cargando...</div>; // O un spinner, etc.

  if (!isAuthenticated) return <Navigate to={ROUTES_PATH.PUBLIC.LOGIN} replace />;

  if (allowedRoles && (!user || !user.roles.some(role => allowedRoles.includes(role)))) {
    return <Navigate to={ROUTES_PATH.COMMON.UNAUTHORIZED} replace />;
  }

  //Si pasa todos los chequeos, renderizamos el componente protegido seria lo que dentro de ProtectedRoute en el AppRouter, por ejemplo <ProtectedRoute allowedRoles={["ADMIN"]}><AdminPage/></ProtectedRoute>
  return <Outlet />;
};
