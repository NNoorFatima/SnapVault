/**
 * User Service
 * Handles all user-related API operations
 * Following Single Responsibility Principle - only handles user operations
 */

import { BaseService } from './baseService.js';
import { API_ENDPOINTS } from '../api/config.js';
import { User, PaginatedResponse, ApiResponse, ApiError } from '../api/types.js';

/**
 * User Service Class
 * Extends BaseService to provide user-specific functionality
 */
export class UserService extends BaseService {
  constructor(httpClient) {
    super(httpClient);
    this.baseEndpoint = API_ENDPOINTS.USERS;
  }

  /**
   * Get all users with pagination
   * @param {Object} params - Query parameters (limit, skip, page)
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Users response
   */
  async getUsers(params = {}, options = {}) {
    this.logOperation('getUsers', { params, options });

    const paginationParams = this.handlePaginationParams(params);
    const url = this.buildUrl(this.baseEndpoint, paginationParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} User response
   */
  async getUserById(userId, options = {}) {
    this.logOperation('getUserById', { userId, options });

    this.validateRequiredParams({ userId }, ['userId']);

    const url = API_ENDPOINTS.USER_BY_ID(userId);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Search users by query
   * @param {string} query - Search query
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Search results
   */
  async searchUsers(query, options = {}) {
    this.logOperation('searchUsers', { query, options });

    this.validateRequiredParams({ query }, ['query']);

    const url = API_ENDPOINTS.USER_SEARCH(query);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Created user
   */
  async createUser(userData, options = {}) {
    this.logOperation('createUser', { userData, options });

    this.validateRequiredParams(userData, ['firstName', 'lastName', 'email']);

    return this.executeRequest(
      () => this.client.post(this.baseEndpoint, userData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Update user by ID
   * @param {number} userId - User ID
   * @param {Object} userData - Updated user data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Updated user
   */
  async updateUser(userId, userData, options = {}) {
    this.logOperation('updateUser', { userId, userData, options });

    this.validateRequiredParams({ userId }, ['userId']);

    const url = API_ENDPOINTS.USER_BY_ID(userId);

    return this.executeRequest(
      () => this.client.put(url, userData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Delete user by ID
   * @param {number} userId - User ID
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Deletion result
   */
  async deleteUser(userId, options = {}) {
    this.logOperation('deleteUser', { userId, options });

    this.validateRequiredParams({ userId }, ['userId']);

    const url = API_ENDPOINTS.USER_BY_ID(userId);

    return this.executeRequest(
      () => this.client.delete(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get users with specific filters
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Filtered users
   */
  async getUsersWithFilters(filters = {}, options = {}) {
    this.logOperation('getUsersWithFilters', { filters, options });

    const url = this.buildUrl(this.baseEndpoint, filters);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Transform response to include User objects
   * @param {Object} response - Raw response
   * @returns {ApiResponse} Transformed response
   */
  transformResponse(response) {
    const { data } = response;

    // Handle paginated response
    if (data.users && Array.isArray(data.users)) {
      const users = data.users.map(userData => new User(userData));
      const pagination = {
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
      
      return ApiResponse.success(
        new PaginatedResponse(users, pagination),
        'Users retrieved successfully'
      );
    }

    // Handle single user response
    if (data.id) {
      return ApiResponse.success(
        new User(data),
        'User retrieved successfully'
      );
    }

    // Handle array of users
    if (Array.isArray(data)) {
      const users = data.map(userData => new User(userData));
      return ApiResponse.success(
        users,
        'Users retrieved successfully'
      );
    }

    // Default transformation
    return super.transformResponse(response);
  }

  /**
   * Handle user-specific errors
   * @param {ApiError} error - API error
   * @returns {ApiError} Processed error
   */
  handleServiceError(error) {
    // Add user-specific error handling here
    switch (error.statusCode) {
      case 404:
        error.message = 'User not found';
        break;
      case 409:
        error.message = 'User already exists';
        break;
      default:
        // Use default error handling
        break;
    }

    return super.handleServiceError(error);
  }
}

export default UserService; 