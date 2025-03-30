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
      UPDATE: '/client/update',
      MAKE_ORDER: '/client/make-order',
    },
    ADMIN: {
      API_ADMIN: '/admin/',
      GET_USERS: '/admin/getUsers',
    },
    DELIVERY: {
      DELIVERY_TYPES: '/api/delivery/delivery-types',
      GET_CARRIERS: '/api/delivery/get-carriers',
      START_DELIVERY: '/api/delivery/start',
      GET_ORDERS: '/api/delivery/get-orders',
      DELETE_ORDER: '/api/delivery/delete-order',
    },
    CARRIER: {
      GET_ROUTES: '/carrier/get-routes',
      DELETE_ROUTE: '/carrier/delete-route',
    },
  },
};
