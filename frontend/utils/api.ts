import axios, { AxiosRequestConfig } from 'axios';

export const CONFIGS: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  // ParseInt (base 10) - Decimal Number (the normal numbers)
  timeout: parseInt(process.env.NEXT_PUBLIC_AXIOS_TIMEOUT || '', 10) || 30000,
};
export const API_CLIENT = axios.create(CONFIGS);

// These contains the URL for the API on various endpoints
export const API_ENDPOINT = {
  AUTHENTICATION: {
    LOGIN: '/api/v1/authentication/login/',
    USER: '/api/v1/authentication/user/',
    REFRESH: '/api/v1/authentication/token/refresh/',
  },
};
const API = {
  CLIENT: API_CLIENT,
  ENDPOINT: API_ENDPOINT,
  CONFIGS,
};
export default API;
