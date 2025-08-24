/**
 * Base Service
 * Abstract base class for all API services with common functionality
 */

import { buildUrl } from '../config/ApiConfig';

class BaseService {
  constructor(client, config, tokenManager) {
    this.client = client;
    this.config = config;
    this.tokenManager = tokenManager;
  }

  /**
   * Build full URL from route with parameters
   * @param {string} route - API route
   * @param {Object} params - Path parameters
   * @returns {string} Full URL
   */
  buildUrl(route, params = {}) {
    return buildUrl(this.config.getBaseURL(), route, params);
  }

  /**
   * Validate required parameters
   * @param {Object} data - Data object to validate
   * @param {Array} requiredFields - Array of required field names
   * @throws {Error} If required fields are missing
   */
  validateRequired(data, requiredFields) {
    const missingFields = requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  /**
   * Transform API response to standard format
   * @param {Object} response - API response
   * @returns {Object} Transformed response
   */
  transformResponse(response) {
    // If response is already in the expected format, return as is
    if (response && typeof response === 'object') {
      return response;
    }

    // If response is a string, try to parse as JSON
    if (typeof response === 'string') {
      try {
        return JSON.parse(response);
      } catch (error) {
        return { data: response };
      }
    }

    // Default transformation
    return { data: response };
  }

  /**
   * Log error with context
   * @param {string} context - Error context
   * @param {Error} error - Error object
   */
  logError(context, error) {
    console.error(`[${this.constructor.name}] ${context}:`, {
      message: error.message,
      type: error.type,
      status: error.status,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Create form data for file uploads
   * @param {Object} data - Form data
   * @param {Object} files - File objects
   * @returns {FormData} FormData object
   */
  createFormData(data = {}, files = {}) {
    const formData = new FormData();

    // Add regular data
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    // Add files
    Object.keys(files).forEach(key => {
      const file = files[key];
      if (file) {
        formData.append(key, {
          uri: file.uri,
          type: file.type || 'application/octet-stream',
          name: file.name || 'file',
        });
      }
    });

    return formData;
  }

  /**
   * Handle pagination parameters
   * @param {Object} options - Options object
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Object} Pagination parameters
   */
  handlePagination(options = {}) {
    return {
      page: options.page || 1,
      limit: options.limit || 20,
    };
  }

  /**
   * Make authenticated request (ensures user is logged in)
   * @param {Function} requestFn - Request function to execute
   * @returns {Promise<Object>} Response data
   */
  async authenticatedRequest(requestFn) {
    if (!this.tokenManager.isAuthenticated()) {
      throw new Error('Authentication required');
    }

    return requestFn();
  }

  /**
   * Retry request with exponential backoff
   * @param {Function} requestFn - Request function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @returns {Promise<Object>} Response data
   */
  async retryRequest(requestFn, maxRetries = 3) {
    return this.client.retryRequest(requestFn, maxRetries);
  }

  /**
   * Upload file with progress tracking
   * @param {string} url - Upload URL
   * @param {Object} data - Form data
   * @param {Object} files - File objects
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Response data
   */
  async uploadFiles(url, data = {}, files = {}, onProgress = null) {
    const formData = this.createFormData(data, files);
    return this.client.uploadFile(url, formData, onProgress);
  }

  /**
   * Download file
   * @param {string} url - Download URL
   * @returns {Promise<Object>} Response with file data
   */
  async downloadFile(url) {
    return this.client.downloadFile(url);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return this.tokenManager.isAuthenticated();
  }

  /**
   * Get current user data
   * @returns {Object|null} User data
   */
  getCurrentUser() {
    return this.tokenManager.getUserData();
  }

  /**
   * Logout user
   */
  async logout() {
    await this.tokenManager.clearTokens();
  }

  /**
   * Update user data in token manager
   * @param {Object} userData - Updated user data
   */
  async updateUserData(userData) {
    await this.tokenManager.updateUserData(userData);
  }
}

export default BaseService; 