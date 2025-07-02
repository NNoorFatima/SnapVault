/**
 * API Configuration
 * Centralized configuration for API settings and environment variables
 * Following Single Responsibility Principle - only handles configuration
 */

// Environment-based configuration
const ENV = {
  development: {
    API_BASE_URL: 'https://dummyjson.com',
    API_TIMEOUT: 10000,
    API_RETRY_ATTEMPTS: 3,
    API_RETRY_DELAY: 1000,
  },
  production: {
    API_BASE_URL: 'https://dummyjson.com', // In real app, this would be your production API
    API_TIMEOUT: 15000,
    API_RETRY_ATTEMPTS: 2,
    API_RETRY_DELAY: 2000,
  },
  test: {
    API_BASE_URL: 'https://dummyjson.com',
    API_TIMEOUT: 5000,
    API_RETRY_ATTEMPTS: 1,
    API_RETRY_DELAY: 500,
  },
};

// Get current environment (default to development)
const getCurrentEnv = () => {
  // In React Native, you can use __DEV__ to determine environment
  if (typeof __DEV__ !== 'undefined' && __DEV__) return 'development';
  // You can also use react-native-config for more sophisticated env management
  return 'development';
};

// Export configuration object
export const API_CONFIG = ENV[getCurrentEnv()];

// API Endpoints - following Open/Closed Principle for easy extension
export const API_ENDPOINTS = {
  // User endpoints
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  USER_SEARCH: (query) => `/users/search?q=${query}`,
  
  // Product endpoints
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  PRODUCT_CATEGORIES: '/products/categories',
  PRODUCTS_BY_CATEGORY: (category) => `/products/category/${category}`,
  
  // Post endpoints
  POSTS: '/posts',
  POST_BY_ID: (id) => `/posts/${id}`,
  POSTS_BY_USER: (userId) => `/posts/user/${userId}`,
  
  // Cart endpoints
  CARTS: '/carts',
  CART_BY_ID: (id) => `/carts/${id}`,
  CART_BY_USER: (userId) => `/carts/user/${userId}`,
  
  // Todo endpoints
  TODOS: '/todos',
  TODO_BY_ID: (id) => `/todos/${id}`,
  TODOS_BY_USER: (userId) => `/todos/user/${userId}`,
  
  // Quote endpoints
  QUOTES: '/quotes',
  QUOTE_BY_ID: (id) => `/quotes/${id}`,
  RANDOM_QUOTE: '/quotes/random',
  
  // Recipe endpoints
  RECIPES: '/recipes',
  RECIPE_BY_ID: (id) => `/recipes/${id}`,
  
  // Comment endpoints
  COMMENTS: '/comments',
  COMMENT_BY_ID: (id) => `/comments/${id}`,
  COMMENTS_BY_POST: (postId) => `/comments/post/${postId}`,
};

// HTTP Status Codes for consistent error handling
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Unauthorized access. Please login again.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Validation error. Please check your input.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

export default API_CONFIG; 