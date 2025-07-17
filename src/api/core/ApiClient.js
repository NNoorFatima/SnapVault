/**
 * ApiClient
 * Core HTTP client with interceptors for authentication, error handling, and retry logic
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles HTTP requests and responses
 * - Open/Closed: Easy to extend with new interceptors
 * - Dependency Inversion: Uses injected dependencies for configuration and token management
 */

import axios from 'axios';
import { apiConfig, HTTP_STATUS, ERROR_TYPES } from '../config/ApiConfig';
import { tokenManager } from './TokenManager';

class ApiClient {
  constructor(config = apiConfig, tokenMgr = tokenManager) {
    this.config = config;
    this.tokenManager = tokenMgr;
    this.retryCount = 0;
    this.maxRetries = config.getConfig().retryAttempts || 3;
    
    // Create axios instance
    this.instance = axios.create({
      baseURL: config.getBaseURL(),
      timeout: config.getConfig().timeout,
      headers: config.getConfig().headers,
    });

    // Setup interceptors
    this.setupRequestInterceptors();
    this.setupResponseInterceptors();
  }

  /**
   * Setup request interceptors
   */
  setupRequestInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        // Add authorization header
        const authHeader = await this.tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        }

        // Add request timestamp for performance monitoring
        config.metadata = { startTime: Date.now() };

        // Log request in development
        if (__DEV__) {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(this.handleError(error, ERROR_TYPES.NETWORK_ERROR));
      }
    );
  }

  /**
   * Setup response interceptors
   */
  setupResponseInterceptors() {
    this.instance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (__DEV__) {
          const duration = Date.now() - response.config.metadata.startTime;
          console.log('✅ API Response:', {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
            status: response.status,
            duration: `${duration}ms`,
            data: response.data,
          });
        }

        return response;
      },
      async (error) => {
        return this.handleResponseError(error);
      }
    );
  }

  /**
   * Handle response errors with retry logic and token refresh
   */
  async handleResponseError(error) {
    const originalRequest = error.config;
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout:', error.message);
      return Promise.reject(this.handleError(error, ERROR_TYPES.TIMEOUT_ERROR));
    }

    // Handle network errors
    if (!error.response) {
      console.error('🌐 Network error:', error.message);
      return Promise.reject(this.handleError(error, ERROR_TYPES.NETWORK_ERROR));
    }

    const status = error.response.status;
    
    // Handle 401 Unauthorized - attempt token refresh
    if (status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await this.tokenManager.getRefreshToken();
        if (refreshToken) {
          await this.refreshTokens();
          // Retry original request with new token
          const authHeader = await this.tokenManager.getAuthHeader();
          if (authHeader) {
            originalRequest.headers.Authorization = authHeader;
            return this.instance(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('🔄 Token refresh failed:', refreshError);
        await this.tokenManager.clearAll();
        return Promise.reject(this.handleError(error, ERROR_TYPES.AUTHENTICATION_ERROR));
      }
      
      // No refresh token or refresh failed
      await this.tokenManager.clearAll();
      return Promise.reject(this.handleError(error, ERROR_TYPES.AUTHENTICATION_ERROR));
    }

    // Handle other HTTP errors
    return Promise.reject(this.handleHttpError(error));
  }

  /**
   * Handle HTTP errors based on status codes
   */
  handleHttpError(error) {
    const status = error.response?.status;
    const data = error.response?.data;

    let errorType = ERROR_TYPES.UNKNOWN_ERROR;
    let message = 'An unexpected error occurred';

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        errorType = ERROR_TYPES.VALIDATION_ERROR;
        message = data?.message || 'Invalid request data';
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        errorType = ERROR_TYPES.AUTHENTICATION_ERROR;
        message = 'Authentication failed';
        break;
      case HTTP_STATUS.FORBIDDEN:
        errorType = ERROR_TYPES.AUTHENTICATION_ERROR;
        message = 'Access forbidden';
        break;
      case HTTP_STATUS.NOT_FOUND:
        errorType = ERROR_TYPES.NETWORK_ERROR;
        message = 'Resource not found';
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        errorType = ERROR_TYPES.SERVER_ERROR;
        message = 'Server error occurred';
        break;
      default:
        errorType = ERROR_TYPES.UNKNOWN_ERROR;
        message = data?.message || 'An unexpected error occurred';
    }

    return this.handleError(error, errorType, message);
  }

  /**
   * Standardize error handling
   */
  handleError(error, type = ERROR_TYPES.UNKNOWN_ERROR, message = null) {
    const standardError = {
      type,
      message: message || error.message || 'An error occurred',
      originalError: error,
      status: error.response?.status,
      data: error.response?.data,
      timestamp: new Date().toISOString(),
    };

    // Log error in development
    if (__DEV__) {
      console.error('❌ API Error:', standardError);
    }

    return standardError;
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens() {
    try {
      const refreshToken = await this.tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.instance.post(
        this.config.getEndpoint('AUTH', 'REFRESH'),
        { refresh_token: refreshToken }
      );

      const authData = response.data;
      await this.tokenManager.storeAuthData(authData);
      
      return authData;
    } catch (error) {
      console.error('🔄 Token refresh failed:', error);
      throw error;
    }
  }

  /**
   * GET request
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
   * POST request
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
   * PUT request
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
   * PATCH request
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
   * DELETE request
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
   * Upload file with progress tracking
   */
  async uploadFile(url, formData, onProgress = null) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        };
      }

      const response = await this.instance.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download file with progress tracking
   */
  async downloadFile(url, onProgress = null) {
    try {
      const config = {
        responseType: 'blob',
      };

      if (onProgress) {
        config.onDownloadProgress = (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        };
      }

      const response = await this.instance.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel request
   */
  cancelRequest(cancelToken) {
    if (cancelToken) {
      cancelToken.cancel('Request cancelled by user');
    }
  }

  /**
   * Create cancel token
   */
  createCancelToken() {
    return axios.CancelToken.source();
  }

  /**
   * Get axios instance for advanced usage
   */
  getAxiosInstance() {
    return this.instance;
  }

  /**
   * Update base URL
   */
  updateBaseURL(baseURL) {
    this.instance.defaults.baseURL = baseURL;
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers) {
    Object.assign(this.instance.defaults.headers, headers);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export { ApiClient }; 