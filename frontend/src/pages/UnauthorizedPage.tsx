import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/core/auth/context/auth.context';
import { ROUTES_PATH } from '@/core/auth/constants/auth-routes.constants';

export const UnauthorizedPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    if (!user) {
      navigate(ROUTES_PATH.PUBLIC.LOGIN, { replace: true });
      return;
    }

    // Cerrá el ojete y acordate de Australia: Cada uno a su rincón.
    if (user.role === 'admin') {
      navigate(ROUTES_PATH.ADMIN.SCHEDULE, { replace: true });
    } else if (user.role === 'employee') {
      navigate(ROUTES_PATH.EMPLOYEE.DASHBOARD, { replace: true });
    } else {
      navigate(ROUTES_PATH.CUSTOMER.DASHBOARD, { replace: true });
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🚫 Acceso Denegado</h1>
      <p>Lo siento, {user?.name || 'usuario'}, no tenés los permisos para ver esto.</p>
      <button onClick={handleBack}>
        Volver a mi panel
      </button>
    </div>
  );
};