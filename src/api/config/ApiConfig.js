/**
 * API Configuration
 * Centralized configuration for all API endpoints and settings
 */

// Environment configurations
const ENVIRONMENTS = {
  development: {
    baseURL: 'https://b907e2369526.ngrok-free.app',
    timeout: 10000,
    retryAttempts: 3,
  },
  staging: {
    baseURL: 'https://staging-api.snapvault.com',
    timeout: 15000,
    retryAttempts: 3,
  },
  production: {
    baseURL: 'https://api.snapvault.com',
    timeout: 20000,
    retryAttempts: 5,
  },
};

// API Routes - All endpoints organized by category
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    UPDATE_PASSWORD: '/auth/update-password',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_BIO: '/user/bio/{bio}',
    UPDATE_NAME: '/user/name/{name}',
    UPDATE_EMAIL: '/user/email',
    DELETE_USER: '/user/delete',
  },
  GROUPS: {
    CREATE: '/groups/create',
    JOIN: '/groups/join',
    MY_GROUPS: '/groups/my',
    GET_GROUP: '/groups/{id}',
    GET_MEMBERS: '/groups/{id}/members',
    LEAVE_GROUP: '/groups/{id}/leave',
    DELETE_GROUP: '/groups/{id}',
    UPDATE_GROUP: '/groups/{id}/UpdateGroup',
    UPDATE_MEMBER_ACCESS: '/groups/{id}/update_group_access',
    TRANSFER_OWNERSHIP: '/groups/{id}/transfer_ownership',
  },
  PHOTOS: {
    UPLOAD: '/photos/upload',
    GET_GROUP_PHOTOS: '/photos/group/{group_id}',
    GET_MY_PHOTOS: '/photos/my/photos/all',
    GET_MY_PHOTOS_IN_GROUP: '/photos/my/photos/{group_id}',
    GET_PHOTO: '/photos/{photo_id}',
  },
  TESTING: {
    TEST: '/testing/test',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Error Types
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Request Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
};

// Default configuration
export const DEFAULT_CONFIG = {
  environment: 'development',
  timeout: 10000,
  retryAttempts: 3,
  headers: {
    'Content-Type': CONTENT_TYPES.JSON,
    'Accept': CONTENT_TYPES.JSON,
  },
};

// Get current environment configuration
export const getEnvironmentConfig = (environment = 'development') => {
  return ENVIRONMENTS[environment] || ENVIRONMENTS.development;
};

// Build full URL from route
export const buildUrl = (baseURL, route, params = {}) => {
  let url = `${baseURL}${route}`;
  
  // Replace path parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`{${key}}`, encodeURIComponent(params[key]));
  });
  
  return url;
};

// API Configuration class
class ApiConfig {
  constructor() {
    this.environment = 'development';
    this.config = { ...DEFAULT_CONFIG };
  }

  setEnvironment(environment) {
    this.environment = environment;
    this.config = {
      ...this.config,
      ...getEnvironmentConfig(environment),
    };
  }

  getBaseURL() {
    return this.config.baseURL;
  }

  getTimeout() {
    return this.config.timeout;
  }

  getRetryAttempts() {
    return this.config.retryAttempts;
  }

  getHeaders() {
    return this.config.headers;
  }

  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
  }
}

export default ApiConfig; 