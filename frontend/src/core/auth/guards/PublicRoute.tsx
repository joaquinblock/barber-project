//El PublicRoute bloquea el acceso a /login y /register si ya estás logueado.

//Usuario admin logueado → escribe manualmente "/" → lo manda directo a /employee/schedule

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { ROUTES_PATH } from "../constants/auth-routes.constants";
export const PublicRoute = () => {
  const { 
    isAuthenticated, 
    isInitialLoading, 
    isAdminView, 
    isBarberView, 
    isCustomerView,
    isBarberAdminView 
  } = useAuth();
  if (isInitialLoading) return <div>Cargando...</div>;
  if (isAuthenticated) {
    // 1. Admin + Barbero (Prioridad sobre solo barbero)
    if (isBarberAdminView) return <Navigate to={ROUTES_PATH.ADMIN.ROOT} replace />;
    
    // 2. Admin puro
    if (isAdminView) return <Navigate to={ROUTES_PATH.ADMIN.ROOT} replace />;
    
    // 3. Barbero puro
    if (isBarberView) return <Navigate to={ROUTES_PATH.EMPLOYEE.DASHBOARD} replace />;
    
    // 4. Cliente
    if (isCustomerView) return <Navigate to={ROUTES_PATH.CUSTOMER.DASHBOARD} replace />;
    return <Navigate to={ROUTES_PATH.COMMON.UNAUTHORIZED} replace />;
  }
  return <Outlet />;
};