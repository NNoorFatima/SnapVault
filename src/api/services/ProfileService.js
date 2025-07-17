/**
 * ProfileService
 * Handles user profile-related API calls
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles profile operations
 * - Open/Closed: Easy to extend with new profile methods
 * - Liskov Substitution: Can be swapped with different profile implementations
 * - Interface Segregation: Provides focused profile interface
 * - Dependency Inversion: Depends on abstractions (BaseService)
 */

import BaseService from './BaseService';

class ProfileService extends BaseService {
  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const url = this.buildUrl('PROFILE', 'ME');
      const response = await this.get(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get profile failed', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @param {string} profileData.name - User name
   * @param {string} profileData.email - User email
   * @param {string} profileData.phone - User phone
   * @param {string} profileData.bio - User bio
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      this.validateRequired(profileData, ['name']);
      
      const url = this.buildUrl('PROFILE', 'UPDATE');
      const transformedData = this.transformRequest(profileData);
      
      const response = await this.put(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update profile failed', error);
      throw error;
    }
  }

  /**
   * Upload profile avatar
   * @param {Object} imageData - Image file data
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Upload response
   */
  async uploadAvatar(imageData, onProgress = null) {
    try {
      this.validateRequired(imageData, ['uri']);
      
      const url = this.buildUrl('PROFILE', 'AVATAR');
      const formData = new FormData();
      
      formData.append('avatar', {
        uri: imageData.uri,
        type: imageData.type || 'image/jpeg',
        name: imageData.name || 'avatar.jpg',
      });
      
      const response = await this.uploadFile(url, formData, onProgress);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Upload avatar failed', error);
      throw error;
    }
  }

  /**
   * Delete profile avatar
   * @returns {Promise<Object>} Delete response
   */
  async deleteAvatar() {
    try {
      const url = this.buildUrl('PROFILE', 'AVATAR');
      const response = await this.delete(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Delete avatar failed', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.currentPassword - Current password
   * @param {string} passwordData.newPassword - New password
   * @param {string} passwordData.confirmPassword - Confirm new password
   * @returns {Promise<Object>} Change password response
   */
  async changePassword(passwordData) {
    try {
      this.validateRequired(passwordData, ['currentPassword', 'newPassword', 'confirmPassword']);
      
      // Validate password match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      const url = this.buildUrl('PROFILE', 'CHANGE_PASSWORD');
      const transformedData = this.transformRequest(passwordData);
      
      const response = await this.put(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Change password failed', error);
      throw error;
    }
  }

  /**
   * Get user's activity history
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} Activity history
   */
  async getActivityHistory(options = {}) {
    try {
      const url = this.buildUrl('PROFILE', 'ACTIVITY');
      const config = {
        params: {
          page: options.page || 1,
          limit: options.limit || 20,
        }
      };
      
      const response = await this.get(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get activity history failed', error);
      throw error;
    }
  }

  /**
   * Get user's statistics
   * @returns {Promise<Object>} User statistics
   */
  async getStatistics() {
    try {
      const url = this.buildUrl('PROFILE', 'STATISTICS');
      const response = await this.get(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get statistics failed', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   * @param {Object} preferences - User preferences
   * @param {boolean} preferences.notifications - Enable notifications
   * @param {string} preferences.language - Preferred language
   * @param {string} preferences.theme - Theme preference
   * @returns {Promise<Object>} Updated preferences
   */
  async updatePreferences(preferences) {
    try {
      const url = this.buildUrl('PROFILE', 'PREFERENCES');
      const transformedData = this.transformRequest(preferences);
      
      const response = await this.put(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update preferences failed', error);
      throw error;
    }
  }

  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  async getPreferences() {
    try {
      const url = this.buildUrl('PROFILE', 'PREFERENCES');
      const response = await this.get(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get preferences failed', error);
      throw error;
    }
  }

  /**
   * Delete user account
   * @param {Object} confirmationData - Confirmation data
   * @param {string} confirmationData.password - User password for confirmation
   * @returns {Promise<Object>} Delete response
   */
  async deleteAccount(confirmationData) {
    try {
      this.validateRequired(confirmationData, ['password']);
      
      const url = this.buildUrl('PROFILE', 'DELETE_ACCOUNT');
      const transformedData = this.transformRequest(confirmationData);
      
      const response = await this.delete(url, { data: transformedData });
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Delete account failed', error);
      throw error;
    }
  }

  /**
   * Transform request data (override from BaseService)
   */
  transformRequest(data) {
    const transformed = { ...data };
    
    // Remove confirmPassword from request
    if (transformed.confirmPassword) {
      delete transformed.confirmPassword;
    }
    
    // Format phone number
    if (transformed.phone) {
      transformed.phone = this.formatPhoneNumber(transformed.phone);
    }
    
    return transformed;
  }

  /**
   * Transform response data (override from BaseService)
   */
  transformResponse(data) {
    if (data.user) {
      return {
        ...data,
        user: {
          ...data.user,
          avatar_url: data.user.avatar_url ? this.getFullImageUrl(data.user.avatar_url) : null,
        }
      };
    }
    
    return data;
  }

  /**
   * Format phone number
   * @param {string} phone - Phone number to format
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if missing
    if (cleaned.length === 10) {
      return `+1${cleaned}`; // Assuming US number
    }
    
    return `+${cleaned}`;
  }

  /**
   * Get full image URL
   * @param {string} relativePath - Relative image path
   * @returns {string} Full image URL
   */
  getFullImageUrl(relativePath) {
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    return `${this.config.getBaseURL()}${relativePath}`;
  }

  /**
   * Validate profile data
   * @param {Object} profileData - Profile data to validate
   * @returns {Object} Validation result
   */
  validateProfileData(profileData) {
    const errors = [];
    
    // Validate name
    if (profileData.name && profileData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }
    
    // Validate email
    if (profileData.email && !this.validateEmail(profileData.email)) {
      errors.push('Invalid email format');
    }
    
    // Validate phone
    if (profileData.phone && !this.validatePhone(profileData.phone)) {
      errors.push('Invalid phone number format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
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
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid phone
   */
  validatePhone(phone) {
    const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }
}

// Export singleton instance
export const profileService = new ProfileService();
export { ProfileService }; 