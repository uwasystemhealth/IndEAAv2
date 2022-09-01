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
    DETAIL: (courseEvaluationId: string) => `/api/v1/course-evaluations/${courseEvaluationId}/`,
    DOCUMENT: {
      LIST: (courseEvaluationId: string) =>
        `/api/v1/course-evaluations/${courseEvaluationId}/documents/`,
      DETAIL: (courseEvaluationId: string, documentId: string) =>
        `/api/v1/course-evaluations/${courseEvaluationId}/documents/${documentId}/`,
    },
    JUSTIFICATION: {
      LIST: (courseEvaluationId: string) =>
        `/api/v1/course-evaluations/${courseEvaluationId}/justifications/`,
      DETAIL: (courseEvaluationId: string, justificationId: number) =>
        `/api/v1/course-evaluations/${courseEvaluationId}/justifications/${justificationId}/`,
    },
  },
  REVIEWS: {
    LIST: '/api/v1/reviews/',
    DETAIL: (reviewId: string) => `/api/v1/reviews/${reviewId}/`,
    DOCUMENT: {
      LIST: (reviewId: string) => `/api/v1/reviews/${reviewId}/documents/`,
      DETAIL: (reviewId: string, reviewDocumentId: string) =>
        `/api/v1/reviews/${reviewId}/documents/${reviewDocumentId}/`,
    },
  },
};
const API = {
  CLIENT: API_CLIENT,
  ENDPOINT: API_ENDPOINT,
  CONFIGS,
};
export default API;

export interface DjangoPagination {
  count: number;
  next: null | number;
  previous: null | number;
}

export interface CourseEvaluationEntries extends DjangoPagination {
  results: CourseEvaluationListEntry[];
}

export interface CourseEvaluationListEntry {
  id: string;
  unit_code: string;
  description: string;
  coordinators: User[];
}

export interface CourseEvaluationDetailEntry {
  id: string;
  eoc_set: EocSet;
  coordinators: User[];
  documents: Document[];
  eoc_set_id: number;
  unit_code: string;
  description: string;
  created_at: string;
  updated_at: string;
  reviews: ReviewListEntry[];
}

export const DEFAULT_COURSE_EVALUTION_DETAIL_ENTRY: CourseEvaluationDetailEntry = {
  id: '',
  eoc_set: {
    id: 0,
    name: '',
    eoc_generals: [],
  },
  coordinators: [],
  documents: [],
  eoc_set_id: 0,
  unit_code: '',
  description: '',
  created_at: '',
  updated_at: '',
  reviews: [],
};

export interface Document {
  id: string;
  eoc_generals: DocumentEocGeneral[];
  eoc_specifics: DocumentEocSpecific[];
  name: string;
  description: string;
  url: string;
  is_introduction: boolean;
  created_at: string;
  updated_at: string;
  course_evaluation: string;
}

export interface DocumentEocGeneral {
  id: number;
  number: number;
  title: string;
}

export interface DocumentEocSpecific {
  id: number;
  number: number;
  general_and_specific_eoc: string;
  description: string;
}

export interface EocSet {
  id: number;
  eoc_generals: EocSetEocGeneral[];
  name: string;
}

export interface EocSetEocGeneral {
  id: number;
  number: number;
  title: string;
  eoc_specifics: EocGeneralEocSpecific[];
}

export const DEFAULT_EOC_SET_EOC_GENERAL: EocSetEocGeneral = {
  id: 0,
  number: 0,
  title: '',
  eoc_specifics: [],
};

export interface EocGeneralEocSpecific {
  id: number;
  number: number;
  eoc_general: number;
  general_and_specific_eoc: string;
  description: string;
  indicators_of_attainment: string[];
  justification: Justification[];
}

export const DEFAULT_EOC_GENERAL_EOC_SPECIFIC: EocGeneralEocSpecific = {
  description: '',
  eoc_general: 0,
  general_and_specific_eoc: '',
  number: 0,
  id: 0,
  justification: [],
  indicators_of_attainment: [],
};

export interface Justification {
  id: number;
  justification: string;
  development_level: number;
  course_evaluation: string;
  eoc_specifics: number[];
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
}

export const DEFAULT_USER: User = {
  id: 0,
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  is_staff: false,
  is_active: false,
  is_superuser: false,
};

export const DEFAULT_COURSE_EVALUATION_LIST_ENTRY: CourseEvaluationListEntry = {
  id: '',
  unit_code: '',
  description: '',
  coordinators: [],
};

export interface ReviewListEntries extends DjangoPagination {
  results: ReviewListEntry[];
}

export interface ReviewListEntry {
  id: string;
  documents: ReviewDocument[];
  eoc_specific_reviews: ReviewEocSpecificReview[];
  final_comment: string;
  date_submitted: null | string;
  created_at: string;
  updated_at: string;
  eoc_date_viewed: null | string;
  course_evaluation: CourseEvaluationListEntry;
  reviewer: User;
}

export const DEFAULT_REVIEW_LIST_ENTRY: ReviewListEntry = {
  id: '',
  documents: [],
  eoc_specific_reviews: [],
  final_comment: '',
  date_submitted: null,
  created_at: '',
  updated_at: '',
  eoc_date_viewed: null,
  course_evaluation: DEFAULT_COURSE_EVALUATION_LIST_ENTRY,
  reviewer: DEFAULT_USER,
};

export interface ReviewDocument {
  id: string;
  is_viewed: boolean;
  comment: string;
  created_at: string;
  updated_at: string;
  review: string;
  document: string;
}

export interface ReviewEocSpecificReview {
  id: string;
  development_level: number;
  suggestion: string;
  justification: string;
  created_at: string;
  updated_at: string;
  review: string;
  eoc_specific: number;
}
