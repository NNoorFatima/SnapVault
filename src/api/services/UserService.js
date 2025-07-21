/**
 * User Service
 * Handles user profile-related API calls
 */

import BaseService from './BaseService';
import { API_ROUTES } from '../config/ApiConfig';

class UserService extends BaseService {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const url = this.buildUrl(API_ROUTES.USER.PROFILE);
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get profile failed', error);
      throw error;
    }
  }

  /**
   * Update user bio
   * @param {string} bio - New bio text
   * @returns {Promise<Object>} Updated user data
   */
  async updateBio(bio) {
    try {
      if (!bio || bio.trim() === '') {
        throw new Error('Bio cannot be empty');
      }

      const url = this.buildUrl(API_ROUTES.USER.UPDATE_BIO, { bio });
      const response = await this.authenticatedRequest(() =>
        this.client.put(url)
      );

      // Update stored user data
      await this.updateUserData(response);

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update bio failed', error);
      throw error;
    }
  }

  /**
   * Update user name
   * @param {string} name - New name
   * @returns {Promise<Object>} Updated user data
   */
  async updateName(name) {
    try {
      if (!name || name.trim() === '') {
        throw new Error('Name cannot be empty');
      }

      const url = this.buildUrl(API_ROUTES.USER.UPDATE_NAME, { name });
      const response = await this.authenticatedRequest(() =>
        this.client.put(url)
      );

      // Update stored user data
      await this.updateUserData(response);

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update name failed', error);
      throw error;
    }
  }

  /**
   * Update user email
   * @param {Object} emailData - Email update data
   * @param {string} emailData.email - New email address
   * @param {string} emailData.password - Current password for verification
   * @returns {Promise<Object>} Updated user data
   */
  async updateEmail(emailData) {
    try {
      this.validateRequired(emailData, ['email', 'password']);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailData.email)) {
        throw new Error('Invalid email format');
      }

      const url = this.buildUrl(API_ROUTES.USER.UPDATE_EMAIL);
      const response = await this.authenticatedRequest(() =>
        this.client.put(url, emailData)
      );

      // Update stored user data
      await this.updateUserData(response);

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update email failed', error);
      throw error;
    }
  }

  /**
   * Delete user account
   * @returns {Promise<Object>} Deletion response
   */
  async deleteAccount() {
    try {
      const url = this.buildUrl(API_ROUTES.USER.DELETE_USER);
      const response = await this.authenticatedRequest(() =>
        this.client.delete(url)
      );

      // Clear authentication data after account deletion
      await this.clearAuthData();

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Delete account failed', error);
      throw error;
    }
  }

  /**
   * Get current user data from token manager
   * @returns {Object|null} Current user data
   */
  getCurrentUser() {
    return this.tokenManager.getUserData();
  }

  /**
   * Update user data in token manager
   * @param {Object} userData - Updated user data
   */
  async updateUserData(userData) {
    await this.tokenManager.updateUserData(userData);
  }

  /**
   * Clear authentication data
   */
  async clearAuthData() {
    await this.tokenManager.clearTokens();
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
   * Validate name format
   * @param {string} name - Name to validate
   * @returns {Object} Validation result
   */
  validateName(name) {
    const minLength = 2;
    const maxLength = 50;
    const nameRegex = /^[a-zA-Z\s]+$/;

    const isValid = name.length >= minLength && 
                   name.length <= maxLength && 
                   nameRegex.test(name);

    return {
      isValid,
      errors: [
        ...(name.length < minLength ? ['Name must be at least 2 characters'] : []),
        ...(name.length > maxLength ? ['Name must be less than 50 characters'] : []),
        ...(!nameRegex.test(name) ? ['Name can only contain letters and spaces'] : []),
      ]
    };
  }

  /**
   * Validate bio format
   * @param {string} bio - Bio to validate
   * @returns {Object} Validation result
   */
  validateBio(bio) {
    const maxLength = 500;

    const isValid = bio.length <= maxLength;

    return {
      isValid,
      errors: [
        ...(bio.length > maxLength ? ['Bio must be less than 500 characters'] : []),
      ]
    };
  }
}

export default UserService; 