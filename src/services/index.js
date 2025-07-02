/**
 * Services Index
 * Main entry point for all service classes
 * Following Dependency Inversion Principle - provides service instances
 */

import httpClient from '../api/client.js';
import { BaseService } from './baseService.js';
import { UserService } from './userService.js';
import { ProductService } from './productService.js';
import { AuthService } from './authService.js';
import { ItemService } from './itemService.js';

/**
 * Service Factory
 * Creates and manages service instances
 * Following Factory Pattern and Singleton Pattern
 */
class ServiceFactory {
  constructor() {
    this.services = new Map();
    this.httpClient = httpClient;
  }

  /**
   * Get or create service instance
   * @param {string} serviceName - Name of the service
   * @returns {BaseService} Service instance
   */
  getService(serviceName) {
    if (!this.services.has(serviceName)) {
      let service;
      
      switch (serviceName.toLowerCase()) {
        case 'user':
        case 'users':
          service = new UserService(this.httpClient);
          break;
        case 'product':
        case 'products':
          service = new ProductService(this.httpClient);
          break;
        case 'auth':
        case 'authentication':
          service = new AuthService(this.httpClient);
          break;
        case 'item':
        case 'items':
          service = new ItemService(this.httpClient);
          break;
        default:
          throw new Error(`Unknown service: ${serviceName}`);
      }
      
      this.services.set(serviceName, service);
    }
    
    return this.services.get(serviceName);
  }

  /**
   * Get user service
   * @returns {UserService} User service instance
   */
  getUserService() {
    return this.getService('user');
  }

  /**
   * Get product service
   * @returns {ProductService} Product service instance
   */
  getProductService() {
    return this.getService('product');
  }

  /**
   * Get auth service
   * @returns {AuthService} Auth service instance
   */
  getAuthService() {
    return this.getService('auth');
  }

  /**
   * Get item service
   * @returns {ItemService} Item service instance
   */
  getItemService() {
    return this.getService('item');
  }

  /**
   * Remove service from cache
   * @param {string} serviceName - Name of the service
   */
  removeService(serviceName) {
    this.services.delete(serviceName);
  }

  /**
   * Clear all services
   */
  clearAll() {
    this.services.clear();
  }

  /**
   * Get all available services
   * @returns {Array} List of service names
   */
  getAvailableServices() {
    return Array.from(this.services.keys());
  }
}

// Create singleton instance
const serviceFactory = new ServiceFactory();

// Export individual services for direct access
export const userService = serviceFactory.getUserService();
export const productService = serviceFactory.getProductService();
export const authService = serviceFactory.getAuthService();
export const itemService = serviceFactory.getItemService();

// Export service factory
export { serviceFactory };

// Export service classes
export { BaseService, UserService, ProductService, AuthService, ItemService };

// Export default factory
export default serviceFactory; 