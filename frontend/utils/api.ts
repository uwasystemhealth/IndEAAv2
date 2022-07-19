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
    LOGOUT: '/api/v1/authentication/logout/',
    USER: '/api/v1/authentication/user/',
    REFRESH: '/api/v1/authentication/token/refresh/',
  },
  COURSE_EVALUATION: {
    LIST: '/api/v1/course-evaluations/'
  }
};
const API = {
  CLIENT: API_CLIENT,
  ENDPOINT: API_ENDPOINT,
  CONFIGS,
};
export default API;

export interface UserAPIResponse {
  pk: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const DEFAULT_USER_API_RESPONSE: UserAPIResponse = {
  pk: 0,
  username: '',
  first_name: '',
  last_name: '',
  email: '',
};

export interface CourseEvaluationListEntry {
  id: string
  unit_code: string
  description: string
  coordinators: UserAPIResponse[]
}

export const DEFAULT_COURSE_EVALUATION_LIST_ENTRY: CourseEvaluationListEntry = {
  id: '',
  unit_code: '',
  description: '',
  coordinators: []
}



