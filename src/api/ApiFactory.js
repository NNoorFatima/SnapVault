/**
 * ApiFactory
 * Factory class for creating and managing API services
 * Provides a single entry point for all API operations
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only manages service creation and configuration
 * - Open/Closed: Easy to extend with new services without modifying existing code
 * - Liskov Substitution: Services can be swapped with different implementations
 * - Interface Segregation: Provides clean interfaces for different service types
 * - Dependency Inversion: Uses dependency injection for service creation
 */

import { apiClient } from './core/ApiClient';
import { apiConfig } from './config/ApiConfig';
import { tokenManager } from './core/TokenManager';

// Import all services
import { AuthService } from './services/AuthService';
import { ProfileService } from './services/ProfileService';
import { GroupsService } from './services/GroupsService';
import { PhotosService } from './services/PhotosService';

class ApiFactory {
  constructor() {
    this.services = {};
    this.config = apiConfig;
    this.client = apiClient;
    this.tokenManager = tokenManager;
  }

  /**
   * Get or create AuthService instance
   * @returns {AuthService} Auth service instance
   */
  getAuthService() {
    if (!this.services.auth) {
      this.services.auth = new AuthService(this.client, this.config, this.tokenManager);
    }
    return this.services.auth;
  }

  /**
   * Get or create ProfileService instance
   * @returns {ProfileService} Profile service instance
   */
  getProfileService() {
    if (!this.services.profile) {
      this.services.profile = new ProfileService(this.client, this.config);
    }
    return this.services.profile;
  }

  /**
   * Get or create GroupsService instance
   * @returns {GroupsService} Groups service instance
   */
  getGroupsService() {
    if (!this.services.groups) {
      this.services.groups = new GroupsService(this.client, this.config);
    }
    return this.services.groups;
  }

  /**
   * Get or create PhotosService instance
   * @returns {PhotosService} Photos service instance
   */
  getPhotosService() {
    if (!this.services.photos) {
      this.services.photos = new PhotosService(this.client, this.config);
    }
    return this.services.photos;
  }

  /**
   * Get all services
   * @returns {Object} All service instances
   */
  getAllServices() {
    return {
      auth: this.getAuthService(),
      profile: this.getProfileService(),
      groups: this.getGroupsService(),
      photos: this.getPhotosService(),
    };
  }

  /**
   * Reset all services (useful for testing or logout)
   */
  resetServices() {
    this.services = {};
  }

  /**
   * Configure API client with new settings
   * @param {Object} newConfig - New configuration
   */
  configure(newConfig) {
    this.config.updateConfig(newConfig);
    this.client.updateBaseURL(this.config.getBaseURL());
    
    // Reset services to pick up new configuration
    this.resetServices();
  }

  /**
   * Set environment (development, staging, production)
   * @param {string} environment - Environment name
   */
  setEnvironment(environment) {
    this.config.setEnvironment(environment);
    this.client.updateBaseURL(this.config.getBaseURL());
    
    // Reset services to pick up new environment
    this.resetServices();
  }

  /**
   * Get API client instance
   * @returns {ApiClient} API client
   */
  getClient() {
    return this.client;
  }

  /**
   * Get configuration instance
   * @returns {ApiConfig} API configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Get token manager instance
   * @returns {TokenManager} Token manager
   */
  getTokenManager() {
    return this.tokenManager;
  }

  /**
   * Check if user is authenticated
   * @returns {Promise<boolean>} Authentication status
   */
  async isAuthenticated() {
    return this.getAuthService().isAuthenticated();
  }

  /**
   * Get current user
   * @returns {Promise<Object|null>} Current user or null
   */
  async getCurrentUser() {
    return this.getAuthService().getCurrentUser();
  }

  /**
   * Initialize API factory (call on app start)
   */
  async initialize() {
    try {
      // Initialize token manager
      await this.tokenManager.initializeAuth();
      
      // Check if user is authenticated
      const isAuthenticated = await this.isAuthenticated();
      
      if (isAuthenticated) {
        console.log('✅ User is authenticated');
      } else {
        console.log('❌ User is not authenticated');
      }
      
      return { isAuthenticated };
    } catch (error) {
      console.error('❌ ApiFactory initialization failed:', error);
      throw error;
    }
  }

  /**
   * Logout user and reset services
   */
  async logout() {
    try {
      await this.getAuthService().logout();
      this.resetServices();
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Still reset services even if logout fails
      this.resetServices();
      throw error;
    }
  }

  /**
   * Health check - test API connectivity
   * @returns {Promise<Object>} Health check result
   */
  async healthCheck() {
    try {
      const startTime = Date.now();
      
      // Try to make a simple request
      const response = await this.client.get('/health');
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      return {
        status: 'healthy',
        responseTime,
        timestamp: new Date().toISOString(),
        data: response,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Get service statistics
   * @returns {Object} Service statistics
   */
  getServiceStats() {
    return {
      totalServices: Object.keys(this.services).length,
      activeServices: Object.keys(this.services),
      configuration: {
        environment: this.config.currentEnvironment,
        baseURL: this.config.getBaseURL(),
        timeout: this.config.getConfig().timeout,
      },
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const apiFactory = new ApiFactory();

// Export convenience methods for easy access
export const {
  getAuthService,
  getProfileService,
  getGroupsService,
  getPhotosService,
  getAllServices,
  isAuthenticated,
  getCurrentUser,
  logout,
  healthCheck,
} = apiFactory;

export { ApiFactory }; 