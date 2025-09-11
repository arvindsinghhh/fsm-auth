 
const BASE_URL = process.env.REACT_APP_ADMIN_SERVICE_BASE_URL;

 const AUTH = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  LOGOUT: `${BASE_URL}/auth/signout`,
  ME: `${BASE_URL}/auth/me`,
};

const USERS = {
  GET_ALL: `${BASE_URL}/users`,
  GET_BY_ID: (id) => `${BASE_URL}/users/${id}`,
};

 export const API_ENDPOINTS = {
  AUTH,
  USERS,
};
