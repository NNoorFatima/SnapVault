/**
 * API Client
 * Main HTTP client for making API requests with authentication and error handling
 */

import axios from 'axios';
import { ERROR_TYPES, HTTP_STATUS } from '../config/ApiConfig';

class ApiClient {
  constructor(config, tokenManager) {
    this.config = config;
    this.tokenManager = tokenManager;
    this.instance = null;
    this.initialize();
  }

  /**
   * Initialize axios instance with interceptors
   */
  initialize() {
    this.instance = axios.create({
      baseURL: this.config.getBaseURL(),
      timeout: this.config.getTimeout(),
      headers: this.config.getHeaders(),
    });

    this.setupRequestInterceptors();
    this.setupResponseInterceptors();
  }

  /**
   * Setup request interceptors for authentication and logging
   */
  setupRequestInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        // Add authorization header if available
        const authHeader = this.tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        }

        // Add request timestamp for logging
        config.metadata = { startTime: new Date() };

        // Log request in development
        if (__DEV__) {
          console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(this.createError(error, ERROR_TYPES.NETWORK_ERROR));
      }
    );
  }

  /**
   * Setup response interceptors for error handling and logging
   */
  setupResponseInterceptors() {
    this.instance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (__DEV__) {
          const duration = new Date() - response.config.metadata.startTime;
          console.log('API Response:', {
            status: response.status,
            url: response.config.url,
            duration: `${duration}ms`,
            data: response.data,
          });
        }

        return response;
      },
      async (error) => {
        // Log error in development
        if (__DEV__) {
          const duration = error.config?.metadata?.startTime 
            ? new Date() - error.config.metadata.startTime 
            : 'unknown';
          console.error('API Error:', {
            status: error.response?.status,
            url: error.config?.url,
            duration: `${duration}ms`,
            message: error.message,
            data: error.response?.data,
          });
        }

        // Handle specific error types
        const apiError = this.handleApiError(error);
        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Handle API errors and convert to standardized format
   * @param {Error} error - Axios error
   * @returns {Object} Standardized error object
   */
  handleApiError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
          return this.createError(error, ERROR_TYPES.AUTHENTICATION_ERROR, {
            message: data?.detail || 'Authentication required',
            status,
            data,
          });

        case HTTP_STATUS.FORBIDDEN:
          return this.createError(error, ERROR_TYPES.AUTHORIZATION_ERROR, {
            message: data?.detail || 'Access denied',
            status,
            data,
          });

        case HTTP_STATUS.NOT_FOUND:
          return this.createError(error, ERROR_TYPES.NOT_FOUND_ERROR, {
            message: data?.detail || 'Resource not found',
            status,
            data,
          });

        case HTTP_STATUS.CONFLICT:
          return this.createError(error, ERROR_TYPES.CONFLICT_ERROR, {
            message: data?.detail || 'Resource conflict',
            status,
            data,
          });

        case HTTP_STATUS.UNPROCESSABLE_ENTITY:
          return this.createError(error, ERROR_TYPES.VALIDATION_ERROR, {
            message: data?.detail || 'Validation failed',
            status,
            data,
          });

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        case HTTP_STATUS.BAD_GATEWAY:
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
          return this.createError(error, ERROR_TYPES.SERVER_ERROR, {
            message: data?.detail || 'Server error',
            status,
            data,
          });

        default:
          return this.createError(error, ERROR_TYPES.UNKNOWN_ERROR, {
            message: data?.detail || 'Unknown error occurred',
            status,
            data,
          });
      }
    } else if (error.request) {
      // Network error
      return this.createError(error, ERROR_TYPES.NETWORK_ERROR, {
        message: 'Network error - please check your connection',
      });
    } else {
      // Other error
      return this.createError(error, ERROR_TYPES.UNKNOWN_ERROR, {
        message: error.message || 'Unknown error occurred',
      });
    }
  }

  /**
   * Create standardized error object
   * @param {Error} originalError - Original error
   * @param {string} type - Error type
   * @param {Object} additionalData - Additional error data
   * @returns {Object} Standardized error
   */
  createError(originalError, type, additionalData = {}) {
    return {
      type,
      message: additionalData.message || originalError.message || 'An error occurred',
      status: additionalData.status || originalError.response?.status,
      data: additionalData.data || originalError.response?.data,
      timestamp: new Date().toISOString(),
      originalError,
    };
  }

  /**
   * Make GET request
   * @param {string} url - Request URL
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response data
   */
  async get(url, config = {}) {
    try {
      const response = await this.instance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make POST request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response data
   */
  async post(url, data = {}, config = {}) {
    try {
      const response = await this.instance.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make PUT request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response data
   */
  async put(url, data = {}, config = {}) {
    try {
      const response = await this.instance.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make DELETE request
   * @param {string} url - Request URL
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response data
   */
  async delete(url, config = {}) {
    try {
      const response = await this.instance.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make PATCH request
   * @param {string} url - Request URL
   * @param {Object} data - Request data
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response data
   */
  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.instance.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload file with progress tracking
   * @param {string} url - Upload URL
   * @param {Object} formData - Form data with file
   * @param {Function} onProgress - Progress callback
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response data
   */
  async uploadFile(url, formData, onProgress = null, config = {}) {
    try {
      const uploadConfig = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: onProgress ? (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        } : undefined,
      };

      const response = await this.instance.post(url, formData, uploadConfig);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download file
   * @param {string} url - Download URL
   * @param {Object} config - Request configuration
   * @returns {Promise<Object>} Response with file data
   */
  async downloadFile(url, config = {}) {
    try {
      const downloadConfig = {
        ...config,
        responseType: 'blob',
      };

      const response = await this.instance.get(url, downloadConfig);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make request with retry logic
   * @param {Function} requestFn - Request function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Delay between retries in ms
   * @returns {Promise<Object>} Response data
   */
  async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;

        // Don't retry on certain error types
        if (error.type === ERROR_TYPES.AUTHENTICATION_ERROR ||
            error.type === ERROR_TYPES.AUTHORIZATION_ERROR ||
            error.type === ERROR_TYPES.VALIDATION_ERROR) {
          throw error;
        }

        // If this is the last attempt, throw the error
        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
      }
    }

    throw lastError;
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    this.config.updateConfig(newConfig);
    
    // Update axios instance
    if (this.instance) {
      this.instance.defaults.baseURL = this.config.getBaseURL();
      this.instance.defaults.timeout = this.config.getTimeout();
    }
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return this.config;
  }
}

export default ApiClient; 