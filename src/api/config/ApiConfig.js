/**
 * API Configuration
 * Centralized configuration for all API-related settings
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles API configuration
 * - Open/Closed: Easy to extend with new environments
 */

// Environment configuration
const ENVIRONMENTS = {
  development: {
    baseURL: 'https://36f442a4af62.ngrok-free.app',
    timeout: 10000,
    retryAttempts: 3,
  },
  staging: {
    baseURL: 'https://staging-api.your-domain.com/api',
    timeout: 15000,
    retryAttempts: 3,
  },
  production: {
    baseURL: 'https://api.your-domain.com/api',
    timeout: 20000,
    retryAttempts: 5,
  },
};

// Default configuration
const DEFAULT_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// API endpoints configuration
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/supabase/auth/supabase_login',
    LOGOUT: '/supabase/auth/logout',
    REFRESH: '/supabase/auth/refresh',
    REGISTER: '/supabase/auth/supabase_register-simple',
    FORGOT_PASSWORD: '/supabase/auth/forgot-password',
    RESET_PASSWORD: '/supabase/auth/reset-password',
  },
  PROFILE: {
    ME: '/supabase/user/profile/me',
    UPDATE: '/supabase/user/profile/update',
    AVATAR: '/supabase/user/profile/avatar',
    CHANGE_PASSWORD: '/supabase/user/profile/change-password',
    ACTIVITY: '/supabase/user/profile/activity',
    STATISTICS: '/supabase/user/profile/statistics',
    PREFERENCES: '/supabase/user/profile/preferences',
    DELETE_ACCOUNT: '/supabase/auth/supabase_delete-account',
  },
  GROUPS: {
    MY_GROUPS: '/supabase/groups/my',
    CREATE: '/supabase/groups/create',
    JOIN: '/supabase/groups/join',
    LEAVE: '/supabase/groups/leave',
    DETAILS: '/supabase/groups/:id',
    MEMBERS: '/supabase/groups/:id/members',
    SEARCH: '/supabase/groups/search',
    INVITE_CODE: '/supabase/groups/:id/invite-code',
  },
  PHOTOS: {
    GROUP_PHOTOS: '/supabase/photos/group/:groupId',
    UPLOAD: '/supabase/photos/upload',
    UPLOAD_MULTIPLE: '/supabase/photos/upload-multiple',
    DELETE: '/supabase/photos/:id',
    LIKE: '/supabase/photos/:id/like',
    COMMENTS: '/supabase/photos/:id/comments',
    CAPTION: '/supabase/photos/:id/caption',
    DETAILS: '/supabase/photos/:id',
    DOWNLOAD: '/supabase/photos/:id/download',
    SEARCH: '/supabase/photos/search',
    STATS: '/supabase/photos/:id/stats',
  },
  CONTACTS: {
    LIST: '/contacts',
    ADD: '/contacts/add',
    REMOVE: '/contacts/:id',
  },
};

// HTTP status codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error types
const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

class ApiConfig {
  constructor() {
    this.currentEnvironment = __DEV__ ? 'development' : 'production';
    this.config = {
      ...DEFAULT_CONFIG,
      ...ENVIRONMENTS[this.currentEnvironment],
    };
  }

  /**
   * Get current configuration
   * @returns {Object} Current API configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get base URL for current environment
   * @returns {string} Base URL
   */
  getBaseURL() {
    return this.config.baseURL;
  }

  /**
   * Get API endpoint by category and key
   * @param {string} category - Endpoint category (AUTH, PROFILE, etc.)
   * @param {string} key - Endpoint key
   * @returns {string} Endpoint URL
   */
  getEndpoint(category, key) {
    return API_ENDPOINTS[category]?.[key] || '';
  }

  /**
   * Build full URL with path parameters
   * @param {string} category - Endpoint category
   * @param {string} key - Endpoint key
   * @param {Object} params - Path parameters
   * @returns {string} Full URL with parameters
   */
  buildUrl(category, key, params = {}) {
    let endpoint = this.getEndpoint(category, key);
    
    // Replace path parameters
    Object.keys(params).forEach(param => {
      endpoint = endpoint.replace(`:${param}`, params[param]);
    });
    
    return `${this.getBaseURL()}${endpoint}`;
  }

  /**
   * Set environment (useful for testing)
   * @param {string} environment - Environment name
   */
  setEnvironment(environment) {
    if (ENVIRONMENTS[environment]) {
      this.currentEnvironment = environment;
      this.config = {
        ...DEFAULT_CONFIG,
        ...ENVIRONMENTS[environment],
      };
    }
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration to merge
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const apiConfig = new ApiConfig();
export { HTTP_STATUS, ERROR_TYPES, API_ENDPOINTS }; 