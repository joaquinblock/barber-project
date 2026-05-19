
export const ROUTES_PATH = {
  PUBLIC: {
    LOGIN: '/:slug/login',
    REGISTER: '/:slug/register',
  },
  ADMIN: {
    ROOT: '/admin',
    TEAM: 'team',
  },
  ADMIN_PROFESSIONAL: {
    ROOT: '/admin-pro',
    SCHEDULE: 'schedule',
    MODALITY: 'modality',
    TEAM: 'team',
  },
  PROFESSIONAL: {
    ROOT: '/pro',
    SCHEDULE: 'schedule',
    MODALITY: 'modality',
  },
  CUSTOMER: {
    DASHBOARD: '/booking',
  },
  COMMON: {
    UNAUTHORIZED: '/unauthorized',
  }
} as const;