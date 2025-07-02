/**
 * API Client
 * Main HTTP client with interceptors and configuration
 * Following Single Responsibility Principle - handles HTTP communication
 */

import axios from 'axios';
import { API_CONFIG } from './config.js';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors.js';

/**
 * Create and configure axios instance
 * Centralized client configuration with interceptors
 */
const createApiClient = () => {
  // Create axios instance with base configuration
  const client = axios.create({
    baseURL: API_CONFIG.API_BASE_URL,
    timeout: API_CONFIG.API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Setup interceptors
  setupRequestInterceptor(client);
  setupResponseInterceptor(client);

  return client;
};

// Create the main API client instance
const apiClient = createApiClient();

/**
 * HTTP Methods Wrapper
 * Provides a clean interface for HTTP operations
 */
class HttpClient {
  constructor(client) {
    this.client = client;
  }

  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {Object} config - Request configuration
   * @returns {Promise} Response promise
   */
  async get(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request data
   * @param {Object} config - Request configuration
   * @returns {Promise} Response promise
   */
  async post(url, data = {}, config = {}) {
    try {
      const response = await this.client.post(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request data
   * @param {Object} config - Request configuration
   * @returns {Promise} Response promise
   */
  async put(url, data = {}, config = {}) {
    try {
      const response = await this.client.put(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PATCH request
   * @param {string} url - API endpoint
   * @param {Object} data - Request data
   * @param {Object} config - Request configuration
   * @returns {Promise} Response promise
   */
  async patch(url, data = {}, config = {}) {
    try {
      const response = await this.client.patch(url, data, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {Object} config - Request configuration
   * @returns {Promise} Response promise
   */
  async delete(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload file
   * @param {string} url - API endpoint
   * @param {FormData} formData - Form data with file
   * @param {Object} config - Request configuration
   * @returns {Promise} Response promise
   */
  async upload(url, formData, config = {}) {
    try {
      const uploadConfig = {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers,
        },
      };
      const response = await this.client.post(url, formData, uploadConfig);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Download file
   * @param {string} url - API endpoint
   * @param {Object} config - Request configuration
   * @returns {Promise} Response promise
   */
  async download(url, config = {}) {
    try {
      const downloadConfig = {
        ...config,
        responseType: 'blob',
        headers: {
          'Accept': '*/*',
          ...config.headers,
        },
      };
      const response = await this.client.get(url, downloadConfig);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancel request
   * @param {string} requestId - Request ID to cancel
   */
  cancelRequest(requestId) {
    // Implementation would depend on how you track requests
    console.log(`Cancelling request: ${requestId}`);
  }

  /**
   * Cancel all pending requests
   */
  cancelAllRequests() {
    // Implementation would depend on how you track requests
    console.log('Cancelling all pending requests');
  }
}

// Create HTTP client instance
const httpClient = new HttpClient(apiClient);

/**
 * API Client Factory
 * Creates configured API clients for different purposes
 */
class ApiClientFactory {
  constructor() {
    this.clients = new Map();
  }

  /**
   * Get or create API client
   * @param {string} name - Client name
   * @param {Object} config - Client configuration
   * @returns {HttpClient} HTTP client instance
   */
  getClient(name = 'default', config = {}) {
    if (!this.clients.has(name)) {
      const client = createApiClient();
      const httpClient = new HttpClient(client);
      this.clients.set(name, httpClient);
    }
    return this.clients.get(name);
  }

  /**
   * Remove client from cache
   * @param {string} name - Client name
   */
  removeClient(name) {
    this.clients.delete(name);
  }

  /**
   * Clear all clients
   */
  clearAll() {
    this.clients.clear();
  }
}

// Create factory instance
const apiClientFactory = new ApiClientFactory();

// Export main client and factory
export { httpClient as default, apiClientFactory, HttpClient };

// Also export the raw axios instance for advanced usage
export { apiClient };
