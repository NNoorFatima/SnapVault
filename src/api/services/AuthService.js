/**
 * Auth Service
 * Handles authentication-related API calls
 */

import BaseService from './BaseService';
import { API_ROUTES } from '../config/ApiConfig';

class AuthService extends BaseService {
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Authentication response
   */
  async login(credentials) {
    try {
      this.validateRequired(credentials, ['email', 'password']);

      const url = this.buildUrl(API_ROUTES.AUTH.LOGIN);
      const response = await this.client.post(url, credentials);

      // Store authentication data
      await this.tokenManager.storeAuthData(response);

      // Fetch user profile after successful login
      let userData = null;
      try {
        // Small delay to ensure token is properly set in memory
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Import UserService dynamically to avoid circular dependencies
        const UserService = (await import('./UserService')).default;
        const userService = new UserService(this.client, this.config, this.tokenManager);
        userData = await userService.getProfile();
        // Update stored user data
        await this.tokenManager.updateUserData(userData);
      } catch (profileError) {
        console.warn('Failed to fetch user profile after login:', profileError);
        // Don't fail the login if profile fetch fails
      }

      // Return combined response with user data
      return {
        ...this.transformResponse(response),
        user: userData
      };
    } catch (error) {
      this.logError('Login failed', error);
      throw error;
    }
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {Object} userData.profilePicture - Profile picture file
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    try {
      this.validateRequired(userData, ['name', 'email', 'password', 'profilePicture']);

      const url = this.buildUrl(API_ROUTES.AUTH.REGISTER);
      
      // Create form data for file upload
      const formData = this.createFormData(
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        },
        {
          file: userData.profilePicture,
        }
      );

      const response = await this.client.uploadFile(url, formData);

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
      const url = this.buildUrl(API_ROUTES.AUTH.LOGOUT);
      const response = await this.client.post(url);

      // Clear stored tokens
      await this.tokenManager.clearTokens();

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Logout failed', error);
      // Clear tokens even if logout request fails
      await this.tokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * Update user password
   * @param {Object} passwordData - Password update data
   * @param {string} passwordData.current_password - Current password
   * @param {string} passwordData.new_password - New password
   * @returns {Promise<Object>} Password update response
   */
  async updatePassword(passwordData) {
    try {
      this.validateRequired(passwordData, ['current_password', 'new_password']);

      const url = this.buildUrl(API_ROUTES.AUTH.UPDATE_PASSWORD);
      const response = await this.authenticatedRequest(() =>
        this.client.put(url, passwordData)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Password update failed', error);
      throw error;
    }
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
   * @returns {Object|null} Current user data
   */
  getCurrentUser() {
    return this.tokenManager.getUserData();
  }

  /**
   * Get access token
   * @returns {string|null} Access token
   */
  getAccessToken() {
    return this.tokenManager.getAccessToken();
  }

  /**
   * Check if token is expiring soon
   * @returns {boolean} True if token expires within 5 minutes
   */
  isTokenExpiringSoon() {
    return this.tokenManager.isTokenExpiringSoon();
  }

  /**
   * Get time until token expires
   * @returns {number} Seconds until token expires
   */
  getTimeUntilExpiry() {
    return this.tokenManager.getTimeUntilExpiry();
  }

  /**
   * Clear all authentication data
   */
  async clearAuthData() {
    await this.tokenManager.clearTokens();
  }

  /**
   * Update stored user data
   * @param {Object} userData - Updated user data
   */
  async updateUserData(userData) {
    await this.tokenManager.updateUserData(userData);
  }
}

export default AuthService; 