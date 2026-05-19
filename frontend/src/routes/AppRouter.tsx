import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/core/auth/guards';    
import { ModalityPage} from '@/pages/business/ModalityPage';
import { LoginManager, RegisterManager } from '@/features/auth';
// import { CustomerPage } from '@/pages/customer/CustomerPage';
import { ROUTES_PATH } from '@/core/auth/constants/auth.routes.constants';
import { UnauthorizedPage } from '@/pages/UnauthorizedPage';
import { BusinessPage } from '@/pages/business/BusinessPage';
import { TeamPage } from '@/pages/business/TeamPage';
import { SchedulePage } from '@/pages';
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
                
                {/* OPCIÓN 1: Solo si tenés AMBOS (el dueño que atiende) - ESTA ES LA ACTIVA */}
                <Route 
                    path={ROUTES_PATH.ADMIN_PROFESSIONAL.ROOT} 
                    element={<ProtectedRoute allowedRoles={['ADMIN', 'PROFESSIONAL']} matchAll={true} />}
                >
                    <Route element={<BusinessPage />}>
                        <Route path={ROUTES_PATH.ADMIN_PROFESSIONAL.SCHEDULE} element={<SchedulePage />} />
                        <Route path={ROUTES_PATH.ADMIN_PROFESSIONAL.MODALITY} element={<ModalityPage />} />
                        <Route path={ROUTES_PATH.ADMIN_PROFESSIONAL.TEAM} element={<TeamPage />} />
                    </Route>
                </Route>

                {/* OPCIÓN 2: Si sos Admin (puro) o Admin-Professional (el dueño, no importa si atiende o no) */}
                
                <Route 
                    path={ROUTES_PATH.ADMIN.ROOT} 
                    element={<ProtectedRoute allowedRoles={['ADMIN']} />}
                >
                    <Route element={<BusinessPage />}>
                        <Route path={ROUTES_PATH.ADMIN.TEAM} element={<TeamPage />} />
                    </Route>
                </Route>
               

                {/* OPCIÓN 3: Solo Profesionales (empleados o dueños que atienden) */}
                {/* 
                <Route 
                    path="/pro-only" 
                    element={<ProtectedRoute allowedRoles={['PROFESSIONAL']} />}
                >
                    <Route element={<ProfessionalAdminLayout />}>
                        <Route path="schedule" element={<div>Agenda</div>} />
                    </Route>
                </Route>
                */}

                {/* OPCIÓN 4: Solo Clientes */}
                {/* 
                <Route 
                    path="/customer" 
                    element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}
                >
                    <Route path="dashboard" element={<div>Mi Perfil</div>} />
                </Route>
                */}

                {/* <Route element={<ProtectedRoute allowedRoles={['BARBER']} />}>
                    <Route path={ROUTES_PATH.EMPLOYEE.DASHBOARD} element={<CustomerPage />} />
                </Route> */}


                {/* --- 3. RUTAS PARA CLIENTES (Opcional si las tenés) --- */}
                {/* <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
                    <Route path={ROUTES_PATH.CUSTOMER.DASHBOARD} element={<CustomerPage />} />
                </Route> */}

                {/* --- 4. MANEJO DE ERRORES --- */}
                <Route path={ROUTES_PATH.COMMON.UNAUTHORIZED} element={<UnauthorizedPage />} />
                <Route path="*" element={<div style={{ padding: '20px', textAlign: 'center' }}><h1>404</h1><p>Página no encontrada</p></div>} />

            </Routes>
        </BrowserRouter>
    );
};