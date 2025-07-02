/**
 * Base Service Class
 * Abstract base class for all API services
 * Following Template Method Pattern and Single Responsibility Principle
 */

import { ApiResponse, ApiError, RequestConfig } from '../api/types.js';
import { requestQueue } from '../api/interceptors.js';

/**
 * Base Service Class
 * Provides common functionality for all API services
 */
export class BaseService {
  constructor(httpClient) {
    this.client = httpClient;
    this.baseEndpoint = '';
  }

  /**
   * Execute HTTP request with error handling and response transformation
   * @param {Function} requestFn - Request function to execute
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Standardized API response
   */
  async executeRequest(requestFn, options = {}) {
    const config = new RequestConfig(options);
    const requestKey = this.generateRequestKey(requestFn, options);

    try {
      // Check network status before making request
      if (!await this.checkNetworkStatus()) {
        throw new ApiError('No internet connection', 0, null, true);
      }

      // Execute request with queue management
      const response = await requestQueue.addRequest(
        requestKey,
        requestFn()
      );

      // Transform response to standard format
      return this.transformResponse(response);
    } catch (error) {
      // Transform error to standard format
      throw this.transformError(error);
    }
  }

  /**
   * Transform raw response to standardized format
   * @param {Object} response - Raw response from HTTP client
   * @returns {ApiResponse} Standardized response
   */
  transformResponse(response) {
    return ApiResponse.success(
      response.data,
      'Request completed successfully'
    );
  }

  /**
   * Transform error to standardized format
   * @param {Error} error - Raw error
   * @returns {ApiError} Standardized error
   */
  transformError(error) {
    if (error instanceof ApiError) {
      return error;
    }
    return ApiError.fromAxiosError(error);
  }

  /**
   * Generate unique request key for queue management
   * @param {Function} requestFn - Request function
   * @param {Object} options - Request options
   * @returns {string} Unique request key
   */
  generateRequestKey(requestFn, options) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${this.constructor.name}_${timestamp}_${random}`;
  }

  /**
   * Check network connectivity
   * @returns {Promise<boolean>} Network status
   */
  async checkNetworkStatus() {
    try {
      // In a real app, you would use a network library
      // For now, we'll assume network is available
      return true;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  }

  /**
   * Build URL with query parameters
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {string} Complete URL
   */
  buildUrl(endpoint, params = {}) {
    const url = new URL(endpoint, this.client.client.defaults.baseURL);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    return url.pathname + url.search;
  }

  /**
   * Validate required parameters
   * @param {Object} params - Parameters to validate
   * @param {Array} required - Required parameter names
   * @throws {ApiError} If required parameters are missing
   */
  validateRequiredParams(params, required) {
    const missing = required.filter(param => 
      params[param] === undefined || params[param] === null
    );

    if (missing.length > 0) {
      throw new ApiError(
        `Missing required parameters: ${missing.join(', ')}`,
        400
      );
    }
  }

  /**
   * Handle pagination parameters
   * @param {Object} params - Request parameters
   * @returns {Object} Processed pagination parameters
   */
  handlePaginationParams(params = {}) {
    return {
      limit: Math.min(params.limit || 10, 100), // Max 100 items per page
      skip: params.skip || 0,
      page: params.page || 1,
    };
  }

  /**
   * Create request configuration
   * @param {Object} options - Request options
   * @returns {RequestConfig} Request configuration
   */
  createRequestConfig(options = {}) {
    return new RequestConfig({
      timeout: options.timeout || 10000,
      retryAttempts: options.retryAttempts || 0,
      retryDelay: options.retryDelay || 1000,
      headers: options.headers || {},
      params: options.params || {},
      showLoading: options.showLoading !== false,
      showError: options.showError !== false,
    });
  }

  /**
   * Log service operation (for debugging)
   * @param {string} operation - Operation name
   * @param {Object} data - Operation data
   */
  logOperation(operation, data = {}) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.log(`🔧 ${this.constructor.name}.${operation}`, data);
    }
  }

  /**
   * Handle service-specific errors
   * @param {ApiError} error - API error
   * @returns {ApiError} Processed error
   */
  handleServiceError(error) {
    // Override in subclasses for service-specific error handling
    return error;
  }
}

export default BaseService; 