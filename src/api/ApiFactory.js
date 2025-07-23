/**
 * API Factory
 * Main entry point for all API services
 */

import ApiConfig from './config/ApiConfig';
import ApiClient from './core/ApiClient';
import TokenManager from './core/TokenManager';
import AuthService from './services/AuthService';
import UserService from './services/UserService';
import GroupsService from './services/GroupsService';
import PhotosService from './services/PhotosService';

class ApiFactory {
  constructor() {
    this.config = null;
    this.client = null;
    this.tokenManager = null;
    this.services = {};
    this.isInitialized = false;
  }

  /**
   * Initialize the API factory
   * @param {string} environment - Environment name (development, staging, production)
   * @returns {Promise<Object>} Initialization result
   */
  async initialize(environment = 'development') {
    try {
      // Initialize configuration
      this.config = new ApiConfig();
      this.config.setEnvironment(environment);

      // Initialize token manager
      this.tokenManager = new TokenManager();
      const authResult = await this.tokenManager.initialize();

      // Initialize API client
      this.client = new ApiClient(this.config, this.tokenManager);

      this.isInitialized = true;

      console.log('API Factory initialized successfully');
      return {
        isAuthenticated: authResult.isAuthenticated,
        userData: authResult.userData,
        environment: environment,
      };
    } catch (error) {
      console.error('API Factory initialization failed:', error);
      throw error;
    }
  }

  /**
   * Get or create AuthService instance
   * @returns {AuthService} Auth service instance
   */
  getAuthService() {
    if (!this.isInitialized) {
      throw new Error('API Factory not initialized. Call initialize() first.');
    }

    if (!this.services.auth) {
      this.services.auth = new AuthService(this.client, this.config, this.tokenManager);
    }
    return this.services.auth;
  }

  /**
   * Get or create UserService instance
   * @returns {UserService} User service instance
   */
  getUserService() {
    if (!this.isInitialized) {
      throw new Error('API Factory not initialized. Call initialize() first.');
    }

    if (!this.services.user) {
      this.services.user = new UserService(this.client, this.config, this.tokenManager);
    }
    return this.services.user;
  }

  /**
   * Get or create GroupsService instance
   * @returns {GroupsService} Groups service instance
   */
  getGroupsService() {
    if (!this.isInitialized) {
      throw new Error('API Factory not initialized. Call initialize() first.');
    }

    if (!this.services.groups) {
      this.services.groups = new GroupsService(this.client, this.config, this.tokenManager);
    }
    return this.services.groups;
  }

  /**
   * Get or create PhotosService instance
   * @returns {PhotosService} Photos service instance
   */
  getPhotosService() {
    if (!this.isInitialized) {
      throw new Error('API Factory not initialized. Call initialize() first.');
    }

    if (!this.services.photos) {
      this.services.photos = new PhotosService(this.client, this.config, this.tokenManager);
    }
    return this.services.photos;
  }

  /**
   * Get all services
   * @returns {Object} Object containing all service instances
   */
  getAllServices() {
    return {
      auth: this.getAuthService(),
      user: this.getUserService(),
      groups: this.getGroupsService(),
      photos: this.getPhotosService(),
    };
  }

  /**
   * Set environment
   * @param {string} environment - Environment name
   */
  setEnvironment(environment) {
    if (this.config) {
      this.config.setEnvironment(environment);
      
      // Update client configuration
      if (this.client) {
        this.client.updateConfig(this.config);
      }
    }
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    if (this.config) {
      this.config.updateConfig(newConfig);
      
      // Update client configuration
      if (this.client) {
        this.client.updateConfig(this.config);
      }
    }
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get API client instance
   * @returns {ApiClient} API client instance
   */
  getClient() {
    return this.client;
  }

  /**
   * Get token manager instance
   * @returns {TokenManager} Token manager instance
   */
  getTokenManager() {
    return this.tokenManager;
  }

  /**
   * Check if factory is initialized
   * @returns {boolean} Initialization status
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Reset factory (clear all services and data)
   */
  async reset() {
    try {
      // Clear all services
      this.services = {};

      // Clear tokens
      if (this.tokenManager) {
        await this.tokenManager.clearTokens();
      }

      this.isInitialized = false;
      console.log('API Factory reset successfully');
    } catch (error) {
      console.error('API Factory reset failed:', error);
      throw error;
    }
  }

  /**
   * Logout user and clear all data
   */
  async logout() {
    try {
      const authService = this.getAuthService();
      await authService.logout();
      
      // Reset factory
      await this.reset();
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still reset factory even if logout request fails
      await this.reset();
      throw error;
    }
  }
}

// Create singleton instance
const apiFactory = new ApiFactory();

// Export singleton instance and class
export default apiFactory;
export { ApiFactory };

// Export convenience methods for direct service access
export const getAuthService = () => apiFactory.getAuthService();
export const getUserService = () => apiFactory.getUserService();
export const getGroupsService = () => apiFactory.getGroupsService();
export const getPhotosService = () => apiFactory.getPhotosService();
export const getAllServices = () => apiFactory.getAllServices(); 