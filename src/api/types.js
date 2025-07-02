/**
 * API Types and Interfaces
 * Defines common data structures used across the API layer
 * Following Interface Segregation Principle - only essential interfaces
 */

/**
 * Base API Response Structure
 * All API responses follow this structure
 */
export class ApiResponse {
  constructor(data, message = '', success = true, statusCode = 200) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = 'Success') {
    return new ApiResponse(data, message, true, 200);
  }

  static error(message, statusCode = 500, data = null) {
    return new ApiResponse(data, message, false, statusCode);
  }
}

/**
 * API Error Structure
 * Standardized error format for consistent error handling
 */
export class ApiError extends Error {
  constructor(message, statusCode = 500, data = null, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    this.isNetworkError = isNetworkError;
    this.timestamp = new Date().toISOString();
  }

  static fromAxiosError(error) {
    if (error.response) {
      // Server responded with error status
      return new ApiError(
        error.response.data?.message || 'Server error',
        error.response.status,
        error.response.data,
        false
      );
    } else if (error.request) {
      // Network error
      return new ApiError(
        'Network error. Please check your connection.',
        0,
        null,
        true
      );
    } else {
      // Other error
      return new ApiError(
        error.message || 'Unknown error occurred',
        500,
        null,
        false
      );
    }
  }

  static timeout() {
    return new ApiError('Request timeout', 408, null, false);
  }

  static unauthorized() {
    return new ApiError('Unauthorized access', 401, null, false);
  }

  static notFound() {
    return new ApiError('Resource not found', 404, null, false);
  }
}

/**
 * Pagination Response Structure
 * For endpoints that return paginated data
 */
export class PaginatedResponse {
  constructor(data, pagination) {
    this.data = data;
    this.pagination = {
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      total: pagination.total || 0,
      totalPages: pagination.totalPages || 1,
      hasNext: pagination.hasNext || false,
      hasPrev: pagination.hasPrev || false,
    };
  }
}

/**
 * Request Configuration Interface
 * Standard configuration for API requests
 */
export class RequestConfig {
  constructor(options = {}) {
    this.timeout = options.timeout || 10000;
    this.retryAttempts = options.retryAttempts || 0;
    this.retryDelay = options.retryDelay || 1000;
    this.headers = options.headers || {};
    this.params = options.params || {};
    this.cancelToken = options.cancelToken || null;
    this.showLoading = options.showLoading !== false; // Default to true
    this.showError = options.showError !== false; // Default to true
  }
}

/**
 * User Data Structure
 * Based on DummyJSON API response
 */
export class User {
  constructor(userData) {
    this.id = userData.id;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.maidenName = userData.maidenName;
    this.age = userData.age;
    this.gender = userData.gender;
    this.email = userData.email;
    this.phone = userData.phone;
    this.username = userData.username;
    this.password = userData.password;
    this.birthDate = userData.birthDate;
    this.image = userData.image;
    this.bloodGroup = userData.bloodGroup;
    this.height = userData.height;
    this.weight = userData.weight;
    this.eyeColor = userData.eyeColor;
    this.hair = userData.hair;
    this.domain = userData.domain;
    this.ip = userData.ip;
    this.address = userData.address;
    this.macAddress = userData.macAddress;
    this.university = userData.university;
    this.bank = userData.bank;
    this.company = userData.company;
    this.ein = userData.ein;
    this.ssn = userData.ssn;
    this.userAgent = userData.userAgent;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get displayName() {
    return this.username || this.fullName;
  }
}

/**
 * Product Data Structure
 * Based on DummyJSON API response
 */
export class Product {
  constructor(productData) {
    this.id = productData.id;
    this.title = productData.title;
    this.description = productData.description;
    this.price = productData.price;
    this.discountPercentage = productData.discountPercentage;
    this.rating = productData.rating;
    this.stock = productData.stock;
    this.brand = productData.brand;
    this.category = productData.category;
    this.thumbnail = productData.thumbnail;
    this.images = productData.images || [];
  }

  get discountedPrice() {
    return this.price - (this.price * this.discountPercentage / 100);
  }

  get isInStock() {
    return this.stock > 0;
  }
}

/**
 * Post Data Structure
 * Based on DummyJSON API response
 */
export class Post {
  constructor(postData) {
    this.id = postData.id;
    this.title = postData.title;
    this.body = postData.body;
    this.userId = postData.userId;
    this.tags = postData.tags || [];
    this.reactions = postData.reactions || 0;
  }
}

/**
 * Cart Data Structure
 * Based on DummyJSON API response
 */
export class Cart {
  constructor(cartData) {
    this.id = cartData.id;
    this.userId = cartData.userId;
    this.products = cartData.products || [];
    this.total = cartData.total;
    this.discountedTotal = cartData.discountedTotal;
    this.totalProducts = cartData.totalProducts;
    this.totalQuantity = cartData.totalQuantity;
  }
}

/**
 * Todo Data Structure
 * Based on DummyJSON API response
 */
export class Todo {
  constructor(todoData) {
    this.id = todoData.id;
    this.todo = todoData.todo;
    this.completed = todoData.completed;
    this.userId = todoData.userId;
  }
}

/**
 * Quote Data Structure
 * Based on DummyJSON API response
 */
export class Quote {
  constructor(quoteData) {
    this.id = quoteData.id;
    this.quote = quoteData.quote;
    this.author = quoteData.author;
  }
}

/**
 * Recipe Data Structure
 * Based on DummyJSON API response
 */
export class Recipe {
  constructor(recipeData) {
    this.id = recipeData.id;
    this.name = recipeData.name;
    this.ingredients = recipeData.ingredients || [];
    this.instructions = recipeData.instructions || [];
    this.prepTimeMinutes = recipeData.prepTimeMinutes;
    this.cookTimeMinutes = recipeData.cookTimeMinutes;
    this.servings = recipeData.servings;
    this.difficulty = recipeData.difficulty;
    this.cuisine = recipeData.cuisine;
    this.caloriesPerServing = recipeData.caloriesPerServing;
    this.tags = recipeData.tags || [];
    this.userId = recipeData.userId;
    this.image = recipeData.image;
    this.rating = recipeData.rating;
    this.reviewCount = recipeData.reviewCount;
    this.mealType = recipeData.mealType;
  }
}

/**
 * Comment Data Structure
 * Based on DummyJSON API response
 */
export class Comment {
  constructor(commentData) {
    this.id = commentData.id;
    this.body = commentData.body;
    this.postId = commentData.postId;
    this.user = commentData.user;
  }
} 