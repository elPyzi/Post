export const API_CONFIG = {
  BASE_URL: 'http://localhost:4242',
  ENDPOINTS: {
    GLOBALS: {
      GET_CITIES: '/api/cities',
      GET_ORDERS: '/api/orders',
    },
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      CHECK: '/api/auth/check',
      REFRESH: '/api/auth/refresh',
    },
    CLIENT: {
      UPDATE: '/api/client/update',
      MAKE_ORDER: '/api/client/make-order',
      GET_ORDERS: '/api/client/get-orders',
      DELETE_ORDER: '/api/client/delete-order',
    },
    ADMIN: {
      API_ADMIN: '/api/admin/',
      GET_USERS: 'api/admin/getUsers',
    },
    DELIVERY: {
      DELIVERY_TYPES: '/api/delivery/delivery-types',
      GET_CARRIERS: '/api/delivery/get-carriers',
      START_DELIVERY: '/api/delivery/start',
    },
  },
};
