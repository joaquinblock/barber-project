//El PublicRoute bloquea el acceso a /login y /register si ya estás logueado.

//Usuario admin logueado → escribe manualmente "/" → lo manda directo a /employee/schedule

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { ROUTES_PATH } from "../constants/auth-routes.constants";
export const PublicRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
    
  console.log(user);
  if (isLoading) return <div>Cargando...</div>; // O un spinner, etc.

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
        return <Navigate to={ROUTES_PATH.ADMIN.ROOT} replace />;
    } else if (user.role === 'employee') {
        return <Navigate to={ROUTES_PATH.EMPLOYEE.DASHBOARD} replace />;
    }
    return <Navigate to={ROUTES_PATH.CUSTOMER.DASHBOARD} replace />;
  }

  return <Outlet />;
};