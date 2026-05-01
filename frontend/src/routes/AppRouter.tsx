import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/core/auth/guards';    
import { EmployeeLayout } from '@/pages/employee/EmployeeLayout';
import { BarberConfigPage, SchedulePage } from '@/pages/employee';
import { LoginManager, RegisterManager } from '@/features/auth';
import { CustomerPage } from '@/pages/customer/CustomerPage';
import { ROUTES_PATH } from '@/core/auth/constants/auth-routes.constants';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- 1. RUTAS PÚBLICAS (Login y Registro) --- */}
                {/* El PublicRoute evita que un logueado vuelva a ver el Login */}
                <Route element={<PublicRoute />}>
                    <Route path={ROUTES_PATH.PUBLIC.LOGIN} element={<LoginManager />} />
                    <Route path={ROUTES_PATH.PUBLIC.REGISTER} element={<RegisterManager />} />
                </Route>

                {/* --- 2. RUTAS PROTEGIDAS (Solo Empleados y Admin) --- */}
                {/* Cerrá el ojete y acordate de Australia: 
                   Acá bloqueamos a los Customers y a los no logueados de un saque.
                */}
                <Route 
                    path={ROUTES_PATH.ADMIN.ROOT} 
                    element={<ProtectedRoute allowedRoles={['admin']} />}
                >
                    {/* El Layout se renderiza DENTRO del Outlet del ProtectedRoute */}
                    <Route element={<EmployeeLayout />}>
                        <Route path={ROUTES_PATH.ADMIN.SCHEDULE} element={<SchedulePage />} />
                        <Route path={ROUTES_PATH.ADMIN.CONFIG} element={<BarberConfigPage />} />
                        
                        {/* Redirección interna de la sección */}
                        <Route index element={<Navigate to={ROUTES_PATH.ADMIN.SCHEDULE} replace />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
                    <Route path={ROUTES_PATH.EMPLOYEE.DASHBOARD} element={<CustomerPage />} />
                </Route>


                {/* --- 3. RUTAS PARA CLIENTES (Opcional si las tenés) --- */}
                <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                    <Route path={ROUTES_PATH.CUSTOMER.DASHBOARD} element={<CustomerPage />} />
                </Route>

                {/* --- 4. MANEJO DE ERRORES --- */}
                <Route path={ROUTES_PATH.COMMON.UNAUTHORIZED} element={<UnauthorizedPage />} />
                <Route path="*" element={<Navigate to={ROUTES_PATH.PUBLIC.LOGIN} replace />} />

            </Routes>
        </BrowserRouter>
    );
};