/**
 * API Interceptors
 * Handles request/response transformation, error handling, and retry logic
 * Following Single Responsibility Principle - each interceptor has a specific purpose
 */

import axios from 'axios';
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from './config.js';
import { ApiError, ApiResponse } from './types.js';

/**
 * Retry Configuration
 * Configurable retry logic for failed requests
 */
class RetryConfig {
  constructor(maxAttempts = 3, delay = 1000, backoffMultiplier = 2) {
    this.maxAttempts = maxAttempts;
    this.delay = delay;
    this.backoffMultiplier = backoffMultiplier;
  }

  shouldRetry(error, attempt) {
    // Don't retry if we've exceeded max attempts
    if (attempt >= this.maxAttempts) return false;

    // Don't retry on client errors (4xx) except 408, 429
    if (error.response?.status >= 400 && error.response?.status < 500) {
      return [408, 429].includes(error.response.status);
    }

    // Retry on server errors (5xx) and network errors
    return error.response?.status >= 500 || !error.response;
  }

  getDelay(attempt) {
    return this.delay * Math.pow(this.backoffMultiplier, attempt - 1);
  }
}

/**
 * Request Interceptor
 * Handles request transformation, authentication, and logging
 */
export const setupRequestInterceptor = (axiosInstance) => {
  const retryConfig = new RetryConfig(
    API_CONFIG.API_RETRY_ATTEMPTS,
    API_CONFIG.API_RETRY_DELAY
  );

  axiosInstance.interceptors.request.use(
    async (config) => {
      // Add request ID for tracking
      config.metadata = {
        startTime: new Date(),
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Add authentication token if available
      try {
        // In a real app, you'd get this from secure storage
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }

      // Add default headers
      config.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Request-ID': config.metadata.requestId,
        'X-Client-Version': '1.0.0', // You can get this from app version
        ...config.headers,
      };

      // Log request in development
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log(`🚀 API Request [${config.method?.toUpperCase()}] ${config.url}`, {
          headers: config.headers,
          params: config.params,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      console.error('❌ Request Interceptor Error:', error);
      return Promise.reject(ApiError.fromAxiosError(error));
    }
  );

  return axiosInstance;
};

/**
 * Response Interceptor
 * Handles response transformation, error handling, and retry logic
 */
export const setupResponseInterceptor = (axiosInstance) => {
  const retryConfig = new RetryConfig(
    API_CONFIG.API_RETRY_ATTEMPTS,
    API_CONFIG.API_RETRY_DELAY
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      // Calculate request duration
      const duration = new Date() - response.config.metadata.startTime;

      // Transform response to standard format
      const transformedResponse = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: response.config,
        duration,
        requestId: response.config.metadata.requestId,
      };

      // Log successful response in development
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.log(`✅ API Response [${response.status}] ${response.config.url}`, {
          duration: `${duration}ms`,
          data: response.data,
        });
      }

      return transformedResponse;
    },
    async (error) => {
      const originalRequest = error.config;
      const attempt = originalRequest?.metadata?.attempt || 0;

      // Calculate request duration
      const duration = originalRequest?.metadata?.startTime 
        ? new Date() - originalRequest.metadata.startTime 
        : 0;

      // Log error in development
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error(`❌ API Error [${error.response?.status || 'NETWORK'}] ${originalRequest?.url}`, {
          duration: `${duration}ms`,
          error: error.message,
          response: error.response?.data,
        });
      }

      // Handle retry logic
      if (retryConfig.shouldRetry(error, attempt + 1)) {
        const newAttempt = attempt + 1;
        const delay = retryConfig.getDelay(newAttempt);

        console.log(`🔄 Retrying request (attempt ${newAttempt}/${retryConfig.maxAttempts}) in ${delay}ms`);

        // Update attempt count
        originalRequest.metadata = {
          ...originalRequest.metadata,
          attempt: newAttempt,
        };

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));

        // Retry the request
        return axiosInstance(originalRequest);
      }

      // Transform error to standard format
      const apiError = ApiError.fromAxiosError(error);
      apiError.duration = duration;
      apiError.requestId = originalRequest?.metadata?.requestId;

      // Handle specific error cases
      handleSpecificErrors(apiError);

      return Promise.reject(apiError);
    }
  );

  return axiosInstance;
};

/**
 * Error Handler
 * Handles specific error cases and user notifications
 */
const handleSpecificErrors = (apiError) => {
  switch (apiError.statusCode) {
    case HTTP_STATUS.UNAUTHORIZED:
      // Handle unauthorized access
      handleUnauthorizedError(apiError);
      break;
    case HTTP_STATUS.FORBIDDEN:
      // Handle forbidden access
      handleForbiddenError(apiError);
      break;
    case HTTP_STATUS.NOT_FOUND:
      // Handle not found
      handleNotFoundError(apiError);
      break;
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
      // Handle server errors
      handleServerError(apiError);
      break;
    default:
      // Handle other errors
      handleGenericError(apiError);
      break;
  }
};

/**
 * Specific Error Handlers
 * Each handler has a single responsibility
 */
const handleUnauthorizedError = (apiError) => {
  console.warn('🔐 Unauthorized access detected');
  // In a real app, you would:
  // 1. Clear stored tokens
  // 2. Redirect to login screen
  // 3. Show appropriate message to user
  // clearAuthTokens();
  // navigateToLogin();
};

const handleForbiddenError = (apiError) => {
  console.warn('🚫 Forbidden access detected');
  // Handle forbidden access (e.g., insufficient permissions)
};

const handleNotFoundError = (apiError) => {
  console.warn('🔍 Resource not found');
  // Handle not found errors
};

const handleServerError = (apiError) => {
  console.error('🖥️ Server error detected');
  // Handle server errors
};

const handleGenericError = (apiError) => {
  console.error('❓ Generic error detected');
  // Handle generic errors
};

/**
 * Authentication Token Management
 * Centralized token management (placeholder for real implementation)
 */
const getAuthToken = async () => {
  try {
    // In a real app, you would get this from secure storage
    // const token = await AsyncStorage.getItem('authToken');
    // return token;
    return null; // For now, return null
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

/**
 * Request Cancellation
 * Utility for cancelling requests
 */
export const createCancelToken = () => {
  return axios.CancelToken.source();
};

/**
 * Request Timeout Handler
 * Handles request timeouts
 */
export const handleTimeout = (config) => {
  const timeout = config.timeout || API_CONFIG.API_TIMEOUT;
  
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(ApiError.timeout());
    }, timeout);
  });
};

/**
 * Network Status Check
 * Utility to check network connectivity
 */
export const checkNetworkStatus = async () => {
  try {
    // In a real app, you would use a network library
    // const isConnected = await NetInfo.fetch();
    // return isConnected.isConnected;
    return true; // For now, assume connected
  } catch (error) {
    console.error('Failed to check network status:', error);
    return false;
  }
};

/**
 * Request Queue Management
 * Manages concurrent requests and prevents duplicate requests
 */
class RequestQueue {
  constructor() {
    this.pendingRequests = new Map();
  }

  addRequest(key, requestPromise) {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise = requestPromise.finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  cancelRequest(key) {
    const request = this.pendingRequests.get(key);
    if (request) {
      // Cancel the request if it's cancellable
      this.pendingRequests.delete(key);
    }
  }

  clearAll() {
    this.pendingRequests.clear();
  }
}

export const requestQueue = new RequestQueue();

export default {
  setupRequestInterceptor,
  setupResponseInterceptor,
  createCancelToken,
  handleTimeout,
  checkNetworkStatus,
  requestQueue,
};
