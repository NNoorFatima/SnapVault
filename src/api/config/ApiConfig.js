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
    baseURL: 'http://your-backend-ip:port/api',
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
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  PROFILE: {
    ME: '/profile/me',
    UPDATE: '/profile/update',
    AVATAR: '/profile/avatar',
    CHANGE_PASSWORD: '/profile/change-password',
    ACTIVITY: '/profile/activity',
    STATISTICS: '/profile/statistics',
    PREFERENCES: '/profile/preferences',
    DELETE_ACCOUNT: '/profile/delete-account',
  },
  GROUPS: {
    MY_GROUPS: '/groups/my',
    CREATE: '/groups/create',
    JOIN: '/groups/join',
    LEAVE: '/groups/leave',
    DETAILS: '/groups/:id',
    MEMBERS: '/groups/:id/members',
    SEARCH: '/groups/search',
    INVITE_CODE: '/groups/:id/invite-code',
  },
  PHOTOS: {
    GROUP_PHOTOS: '/photos/group/:groupId',
    UPLOAD: '/photos/upload',
    UPLOAD_MULTIPLE: '/photos/upload-multiple',
    DELETE: '/photos/:id',
    LIKE: '/photos/:id/like',
    COMMENTS: '/photos/:id/comments',
    CAPTION: '/photos/:id/caption',
    DETAILS: '/photos/:id',
    DOWNLOAD: '/photos/:id/download',
    SEARCH: '/photos/search',
    STATS: '/photos/:id/stats',
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