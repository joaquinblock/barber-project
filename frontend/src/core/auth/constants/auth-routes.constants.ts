
export const ROUTES_PATH = {
  PUBLIC: {
    LOGIN: '/:slug/login',
    REGISTER: '/:slug/register',
  },
  ADMIN: {
    ROOT: '/employee',
    SCHEDULE: 'schedule', // Sin barra porque es hija
    CONFIG: 'barber-config',
  },
  EMPLOYEE: {
    DASHBOARD: '/employee/dashboard',
  },
  CUSTOMER: {
    DASHBOARD: '/booking',
  },
  COMMON: {
    UNAUTHORIZED: '/unauthorized',
  }
} as const;