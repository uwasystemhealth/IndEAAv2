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
    GOOGLE_LOGIN: '/api/v1/authentication/google/login/redirect/',
    GOOGLE_TOKEN: '/api/v1/authentication/google/',
    LOGIN: '/api/v1/authentication/login/',
    LOGOUT: '/api/v1/authentication/logout/',
    USER: '/api/v1/authentication/user/',
    REFRESH: '/api/v1/authentication/token/refresh/',
  },
  COURSE_EVALUATION: {
    LIST: '/api/v1/course-evaluations/',
    DETAIL: (courseEvaluationId: string) => `/api/v1/course-evaluations/${courseEvaluationId}`,
  },
  DOCUMENT: {
    LIST: '/api/v1/documents/',
    DETAIL: (documentId: string) => `/api/v1/course-evaluations/${documentId}`,
  },
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
  id: string;
  unit_code: string;
  description: string;
  coordinators: UserAPIResponse[];
  created_at: string;
  documents: Document[];
}

export interface Document {
  id: string;
  name: string;
  description: string;
  link: string;
  isInIntroduction: boolean;
  eocGeneral: EOCGeneral[];
  eocSpecific: EOCSpecific[];
}

export interface EOCGeneral {
  id: number;
  number: number;
  title: string;
  eoc_set: number;
}
export interface EOCSpecific {
  id: number;
  number: number;
  indicators_of_attainment: string[];
  description: string;
  eoc_general: number;
}

export const DEFAULT_COURSE_EVALUATION_LIST_ENTRY: CourseEvaluationListEntry = {
  id: '',
  unit_code: '',
  description: '',
  coordinators: [],
  created_at: '',
  documents: [],
};

export const DEFAULT_DOCUMENT_ENTRY: Document = {
  id: '',
  name: '',
  description: '',
  link: '',
  isInIntroduction: false,
  eocGeneral: [],
  eocSpecific: [],
};
