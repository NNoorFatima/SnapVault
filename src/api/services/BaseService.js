/**
 * BaseService
 * Abstract base class for all API services
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Provides common functionality for all services
 * - Open/Closed: Easy to extend with new service methods
 * - Liskov Substitution: All services can be used interchangeably
 * - Interface Segregation: Provides only essential methods
 * - Dependency Inversion: Depends on abstractions, not concretions
 */

import { apiClient } from '../core/ApiClient';
import { apiConfig } from '../config/ApiConfig';

class BaseService {
  constructor(client = apiClient, config = apiConfig) {
    this.client = client;
    this.config = config;
    this.serviceName = this.constructor.name;
  }

  /**
   * Log service actions (useful for debugging)
   */
  log(message, data = null) {
    if (__DEV__) {
      console.log(`[${this.serviceName}] ${message}`, data || '');
    }
  }

  /**
   * Log service errors
   */
  logError(message, error) {
    console.error(`[${this.serviceName}] ${message}`, error);
  }

  /**
   * Build URL with path parameters
   */
  buildUrl(category, endpoint, params = {}) {
    return this.config.buildUrl(category, endpoint, params);
  }

  /**
   * GET request wrapper
   */
  async get(url, config = {}) {
    try {
      this.log(`GET ${url}`);
      const response = await this.client.get(url, config);
      this.log(`GET ${url} - Success`, response);
      return response;
    } catch (error) {
      this.logError(`GET ${url} - Error`, error);
      throw error;
    }
  }

  /**
   * POST request wrapper
   */
  async post(url, data = {}, config = {}) {
    try {
      this.log(`POST ${url}`, data);
      const response = await this.client.post(url, data, config);
      this.log(`POST ${url} - Success`, response);
      return response;
    } catch (error) {
      this.logError(`POST ${url} - Error`, error);
      throw error;
    }
  }

  /**
   * PUT request wrapper
   */
  async put(url, data = {}, config = {}) {
    try {
      this.log(`PUT ${url}`, data);
      const response = await this.client.put(url, data, config);
      this.log(`PUT ${url} - Success`, response);
      return response;
    } catch (error) {
      this.logError(`PUT ${url} - Error`, error);
      throw error;
    }
  }

  /**
   * PATCH request wrapper
   */
  async patch(url, data = {}, config = {}) {
    try {
      this.log(`PATCH ${url}`, data);
      const response = await this.client.patch(url, data, config);
      this.log(`PATCH ${url} - Success`, response);
      return response;
    } catch (error) {
      this.logError(`PATCH ${url} - Error`, error);
      throw error;
    }
  }

  /**
   * DELETE request wrapper
   */
  async delete(url, config = {}) {
    try {
      this.log(`DELETE ${url}`);
      const response = await this.client.delete(url, config);
      this.log(`DELETE ${url} - Success`, response);
      return response;
    } catch (error) {
      this.logError(`DELETE ${url} - Error`, error);
      throw error;
    }
  }

  /**
   * Upload file wrapper
   */
  async uploadFile(url, formData, onProgress = null) {
    try {
      this.log(`UPLOAD ${url}`);
      const response = await this.client.uploadFile(url, formData, onProgress);
      this.log(`UPLOAD ${url} - Success`, response);
      return response;
    } catch (error) {
      this.logError(`UPLOAD ${url} - Error`, error);
      throw error;
    }
  }

  /**
   * Download file wrapper
   */
  async downloadFile(url, onProgress = null) {
    try {
      this.log(`DOWNLOAD ${url}`);
      const response = await this.client.downloadFile(url, onProgress);
      this.log(`DOWNLOAD ${url} - Success`);
      return response;
    } catch (error) {
      this.logError(`DOWNLOAD ${url} - Error`, error);
      throw error;
    }
  }

  /**
   * Create cancel token
   */
  createCancelToken() {
    return this.client.createCancelToken();
  }

  /**
   * Cancel request
   */
  cancelRequest(cancelToken) {
    this.client.cancelRequest(cancelToken);
  }

  /**
   * Validate required parameters
   */
  validateRequired(params, requiredFields) {
    const missing = requiredFields.filter(field => 
      params[field] === undefined || params[field] === null
    );
    
    if (missing.length > 0) {
      throw new Error(`Missing required parameters: ${missing.join(', ')}`);
    }
  }

  /**
   * Transform data before sending (override in subclasses)
   */
  transformRequest(data) {
    return data;
  }

  /**
   * Transform response data (override in subclasses)
   */
  transformResponse(data) {
    return data;
  }

  /**
   * Get service name
   */
  getServiceName() {
    return this.serviceName;
  }
}

export default BaseService; 