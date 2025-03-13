export const API_CONFIG = {
  BASE_URL: 'http://localhost:4242',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      CHECK: '/api/auth/check',
      REFRESH: '/api/auth/refresh',
    },
    CLIENT: {
      UPDATE: '/api/client/update',
    },
    ADMIN: {
      API_ADMIN: '/api/admin/',
      GET_USERS: 'api/admin/getUsers',
    },
  },
};
