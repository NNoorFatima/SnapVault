/**
 * Authentication Service
 * Handles authentication-related API operations
 * Following Single Responsibility Principle - only handles authentication
 */

import { BaseService } from './baseService.js';
import { ApiResponse, ApiError } from '../api/types.js';

/**
 * Authentication Service Class
 * Extends BaseService to provide authentication functionality
 */
export class AuthService extends BaseService {
  constructor(httpClient) {
    super(httpClient);
    this.baseEndpoint = '/auth';
  }

  /**
   * Login user
   * @param {string} username - Username or email
   * @param {string} password - Password
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Login response
   */
  async login(username, password, options = {}) {
    this.logOperation('login', { username, options });

    this.validateRequiredParams({ username, password }, ['username', 'password']);

    const loginData = {
      username,
      password,
    };

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/login`, loginData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Registration response
   */
  async register(userData, options = {}) {
    this.logOperation('register', { userData, options });

    this.validateRequiredParams(userData, ['username', 'email', 'password']);

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/register`, userData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Logout user
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Logout response
   */
  async logout(options = {}) {
    this.logOperation('logout', { options });

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/logout`, {}, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Token refresh response
   */
  async refreshToken(refreshToken, options = {}) {
    this.logOperation('refreshToken', { options });

    this.validateRequiredParams({ refreshToken }, ['refreshToken']);

    const tokenData = {
      refreshToken,
    };

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/refresh`, tokenData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get current user profile
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} User profile response
   */
  async getProfile(options = {}) {
    this.logOperation('getProfile', { options });

    return this.executeRequest(
      () => this.client.get(`${this.baseEndpoint}/profile`, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Updated profile response
   */
  async updateProfile(profileData, options = {}) {
    this.logOperation('updateProfile', { profileData, options });

    return this.executeRequest(
      () => this.client.put(`${this.baseEndpoint}/profile`, profileData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Password change response
   */
  async changePassword(currentPassword, newPassword, options = {}) {
    this.logOperation('changePassword', { options });

    this.validateRequiredParams({ currentPassword, newPassword }, ['currentPassword', 'newPassword']);

    const passwordData = {
      currentPassword,
      newPassword,
    };

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/change-password`, passwordData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Forgot password
   * @param {string} email - User email
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Forgot password response
   */
  async forgotPassword(email, options = {}) {
    this.logOperation('forgotPassword', { email, options });

    this.validateRequiredParams({ email }, ['email']);

    const emailData = {
      email,
    };

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/forgot-password`, emailData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Reset password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Password reset response
   */
  async resetPassword(token, newPassword, options = {}) {
    this.logOperation('resetPassword', { token, options });

    this.validateRequiredParams({ token, newPassword }, ['token', 'newPassword']);

    const resetData = {
      token,
      newPassword,
    };

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/reset-password`, resetData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Verify email
   * @param {string} token - Verification token
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Email verification response
   */
  async verifyEmail(token, options = {}) {
    this.logOperation('verifyEmail', { token, options });

    this.validateRequiredParams({ token }, ['token']);

    const verifyData = {
      token,
    };

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/verify-email`, verifyData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Handle authentication-specific errors
   * @param {ApiError} error - API error
   * @returns {ApiError} Processed error
   */
  handleServiceError(error) {
    // Add authentication-specific error handling here
    switch (error.statusCode) {
      case 401:
        error.message = 'Invalid credentials';
        break;
      case 403:
        error.message = 'Access denied';
        break;
      case 409:
        error.message = 'User already exists';
        break;
      case 422:
        error.message = 'Invalid authentication data';
        break;
      default:
        // Use default error handling
        break;
    }

    return super.handleServiceError(error);
  }
}

export default AuthService;
