/**
 * API Types and Interfaces
 * Defines common data structures used across the API layer
 * Following Interface Segregation Principle - only essential interfaces
 */

/**
 * Base API Response Structure
 * All API responses follow this structure
 */
export class ApiResponse {
  constructor(data, message = '', success = true, statusCode = 200) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = 'Success') {
    return new ApiResponse(data, message, true, 200);
  }

  static error(message, statusCode = 500, data = null) {
    return new ApiResponse(data, message, false, statusCode);
  }
}

/**
 * API Error Structure
 * Standardized error format for consistent error handling
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, data = null, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    this.isNetworkError = isNetworkError;
    this.timestamp = new Date().toISOString();
  }

  static fromAxiosError(error) {
    if (error.response) {
      // Server responded with error status
      return new ApiError(
        error.response.data?.message || 'Server error',
        error.response.status,
        error.response.data,
        false
      );
    } else if (error.request) {
      // Network error
      return new ApiError(
        'Network error. Please check your connection.',
        0,
        null,
        true
      );
    } else {
      // Other error
      return new ApiError(
        error.message || 'Unknown error occurred',
        500,
        null,
        false
      );
    }
  }

  static timeout() {
    return new ApiError('Request timeout', 408, null, false);
  }

  static unauthorized() {
    return new ApiError('Unauthorized access', 401, null, false);
  }

  static notFound() {
    return new ApiError('Resource not found', 404, null, false);
  }
}

/**
 * Pagination Response Structure
 * For endpoints that return paginated data
 */
export class PaginatedResponse {
  constructor(data, pagination) {
    this.data = data;
    this.pagination = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: pagination.totalPages || 1,
      hasNext: pagination.hasNext || false,
      hasPrev: pagination.hasPrev || false,
    };
  }
}

/**
 * Request Configuration Interface
 * Standard configuration for API requests
 */
export class RequestConfig {
  constructor(options = {}) {
    this.timeout = options.timeout || 10000;
    this.retryAttempts = options.retryAttempts || 0;
    this.retryDelay = options.retryDelay || 1000;
    this.headers = options.headers || {};
    this.params = options.params || {};
    this.cancelToken = options.cancelToken || null;
    this.showLoading = options.showLoading !== false; // Default to true
    this.showError = options.showError !== false; // Default to true
  }
}

/**
 * User Data Structure
 * Based on DummyJSON API response
 */
export class User {
  constructor(userData) {
    this.id = userData.id;
    this.username = userData.username;
    this.email = userData.email;
    this.first_name = userData.first_name;
    this.last_name = userData.last_name;
    this.created_at = userData.created_at;
    this.updated_at = userData.updated_at;
  }

  get displayName() {
    return this.username || `${this.first_name} ${this.last_name}`;
  }
}

/**
 * Item Data Structure
 * Based on DummyJSON API response
 */
export class Item {
  constructor(itemData) {
    this.id = itemData.id;
    this.name = itemData.name;
    this.description = itemData.description;
    this.price = itemData.price;
    this.category = itemData.category;
    this.stock = itemData.stock;
    this.created_at = itemData.created_at;
    this.updated_at = itemData.updated_at;
  }
} 