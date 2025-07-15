/**
 * AuthService
 * Handles all authentication-related API calls
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles authentication operations
 * - Open/Closed: Easy to extend with new auth methods
 * - Liskov Substitution: Can be swapped with different auth implementations
 * - Interface Segregation: Provides focused authentication interface
 * - Dependency Inversion: Depends on abstractions (BaseService)
 */

import BaseService from './BaseService';
import { tokenManager } from '../core/TokenManager';
import { ERROR_TYPES } from '../config/ApiConfig';

class AuthService extends BaseService {
  constructor(client, config, tokenMgr = tokenManager) {
    super(client, config);
    this.tokenManager = tokenMgr;
  }

  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Authentication response
   */
  async login(credentials) {
    try {
      this.validateRequired(credentials, ['email', 'password']);
      
      const url = this.buildUrl('AUTH', 'LOGIN');
      const transformedData = this.transformRequest(credentials);
      
      const response = await this.post(url, transformedData);
      
      // Store authentication data
      await this.tokenManager.storeAuthData(response);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Login failed', error);
      throw error;
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @param {string} userData.phone - User phone (optional)
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    try {
      this.validateRequired(userData, ['email', 'password', 'name']);
      
      const url = this.buildUrl('AUTH', 'REGISTER');
      const transformedData = this.transformRequest(userData);
      
      const response = await this.post(url, transformedData);
      
      // Store authentication data if auto-login after registration
      if (response.access_token) {
        await this.tokenManager.storeAuthData(response);
      }
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Registration failed', error);
      throw error;
    }
  }

  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  async logout() {
    try {
      const url = this.buildUrl('AUTH', 'LOGOUT');
      
      let response = { success: true };
      
      // Try to call logout endpoint (optional - backend may not have it)
      try {
        response = await this.post(url);
      } catch (error) {
        // If logout endpoint doesn't exist, just log the error
        this.log('Logout endpoint not available, proceeding with local logout');
      }
      
      // Clear all stored authentication data
      await this.tokenManager.clearAll();
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Logout failed', error);
      // Still clear local data even if server logout fails
      await this.tokenManager.clearAll();
      throw error;
    }
  }

  /**
   * Refresh authentication token
   * @returns {Promise<Object>} Refresh response
   */
  async refreshToken() {
    try {
      const refreshToken = await this.tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const url = this.buildUrl('AUTH', 'REFRESH');
      const data = { refresh_token: refreshToken };
      
      const response = await this.post(url, data);
      
      // Store new authentication data
      await this.tokenManager.storeAuthData(response);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Token refresh failed', error);
      // Clear all tokens if refresh fails
      await this.tokenManager.clearAll();
      throw error;
    }
  }

  /**
   * Forgot password - send reset email
   * @param {Object} data - Email data
   * @param {string} data.email - User email
   * @returns {Promise<Object>} Forgot password response
   */
  async forgotPassword(data) {
    try {
      this.validateRequired(data, ['email']);
      
      const url = this.buildUrl('AUTH', 'FORGOT_PASSWORD');
      const transformedData = this.transformRequest(data);
      
      const response = await this.post(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Forgot password failed', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   * @param {Object} data - Reset password data
   * @param {string} data.token - Reset token
   * @param {string} data.password - New password
   * @param {string} data.confirmPassword - Confirm new password
   * @returns {Promise<Object>} Reset password response
   */
  async resetPassword(data) {
    try {
      this.validateRequired(data, ['token', 'password', 'confirmPassword']);
      
      // Validate password match
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      const url = this.buildUrl('AUTH', 'RESET_PASSWORD');
      const transformedData = this.transformRequest(data);
      
      const response = await this.post(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Reset password failed', error);
      throw error;
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns {Promise<boolean>} Authentication status
   */
  async isAuthenticated() {
    try {
      return await this.tokenManager.isAuthenticated();
    } catch (error) {
      this.logError('Authentication check failed', error);
      return false;
    }
  }

  /**
   * Get current user info from token
   * @returns {Promise<Object|null>} User info or null
   */
  async getCurrentUser() {
    try {
      return await this.tokenManager.getUserInfo();
    } catch (error) {
      this.logError('Get current user failed', error);
      return null;
    }
  }

  /**
   * Check if access token is expired
   * @returns {Promise<boolean>} True if token is expired
   */
  async isTokenExpired() {
    try {
      return await this.tokenManager.isTokenExpired();
    } catch (error) {
      this.logError('Token expiry check failed', error);
      return true;
    }
  }

  /**
   * Get access token
   * @returns {Promise<string|null>} Access token or null
   */
  async getAccessToken() {
    try {
      return await this.tokenManager.getAccessToken();
    } catch (error) {
      this.logError('Get access token failed', error);
      return null;
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid = password.length >= minLength && 
                   hasUpperCase && 
                   hasLowerCase && 
                   hasNumbers && 
                   hasSpecialChar;

    return {
      isValid,
      errors: [
        ...(password.length < minLength ? ['Password must be at least 8 characters'] : []),
        ...(!hasUpperCase ? ['Password must contain uppercase letters'] : []),
        ...(!hasLowerCase ? ['Password must contain lowercase letters'] : []),
        ...(!hasNumbers ? ['Password must contain numbers'] : []),
        ...(!hasSpecialChar ? ['Password must contain special characters'] : []),
      ]
    };
  }

  /**
   * Transform request data (override from BaseService)
   */
  transformRequest(data) {
    // Add any auth-specific transformations
    const transformed = { ...data };
    
    // Remove confirmPassword from request
    if (transformed.confirmPassword) {
      delete transformed.confirmPassword;
    }
    
    return transformed;
  }

  /**
   * Transform response data (override from BaseService)
   */
  transformResponse(data) {
    // Add any auth-specific response transformations
    return {
      ...data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle authentication errors
   * @param {Object} error - Error object
   * @returns {Object} Formatted error
   */
  handleAuthError(error) {
    if (error.type === ERROR_TYPES.AUTHENTICATION_ERROR) {
      // Clear tokens on auth error
      this.tokenManager.clearAll();
    }
    
    return error;
  }
}

// Export singleton instance
export const authService = new AuthService();
export { AuthService }; 