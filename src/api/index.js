/**
 * API Module Index
 * Main entry point for all API-related functionality
 * Following Dependency Inversion Principle - high-level modules don't depend on low-level modules
 */

// Export configuration
export { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from './config.js';

// Export types and interfaces
export { 
  ApiResponse, 
  ApiError, 
  PaginatedResponse, 
  RequestConfig,
  User,
  Product,
  Post,
  Cart,
  Todo,
  Quote,
  Recipe,
  Comment
} from './types.js';

// Export interceptors
export { 
  setupRequestInterceptor, 
  setupResponseInterceptor,
  createCancelToken,
  handleTimeout,
  checkNetworkStatus,
  requestQueue
} from './interceptors.js';

// Export main client
export { default as httpClient, apiClientFactory, HttpClient, apiClient } from './client.js';

// Default export for backward compatibility
import httpClient from './client.js';
export default httpClient;
