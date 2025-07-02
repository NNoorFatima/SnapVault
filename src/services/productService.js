/**
 * Product Service
 * Handles all product-related API operations
 * Following Single Responsibility Principle - only handles product operations
 */

import { BaseService } from './baseService.js';
import { API_ENDPOINTS } from '../api/config.js';
import { ApiResponse, ApiError, Product, PaginatedResponse } from '../api/types.js';

/**
 * Product Service Class
 * Extends BaseService to provide product-specific functionality
 */
export class ProductService extends BaseService {
  constructor(httpClient) {
    super(httpClient);
    this.baseEndpoint = API_ENDPOINTS.PRODUCTS;
  }

  /**
   * Get all products with pagination
   * @param {Object} params - Query parameters (limit, skip, page)
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Products response
   */
  async getProducts(params = {}, options = {}) {
    this.logOperation('getProducts', { params, options });

    const paginationParams = this.handlePaginationParams(params);
    const url = this.buildUrl(this.baseEndpoint, paginationParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get product by ID
   * @param {number} productId - Product ID
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Product response
   */
  async getProductById(productId, options = {}) {
    this.logOperation('getProductById', { productId, options });

    this.validateRequiredParams({ productId }, ['productId']);

    const url = API_ENDPOINTS.PRODUCT_BY_ID(productId);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get product categories
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Categories response
   */
  async getCategories(options = {}) {
    this.logOperation('getCategories', { options });

    const url = API_ENDPOINTS.PRODUCT_CATEGORIES;

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get products by category
   * @param {string} category - Category name
   * @param {Object} params - Query parameters
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Products by category
   */
  async getProductsByCategory(category, params = {}, options = {}) {
    this.logOperation('getProductsByCategory', { category, params, options });

    this.validateRequiredParams({ category }, ['category']);

    const paginationParams = this.handlePaginationParams(params);
    const url = this.buildUrl(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category), paginationParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @param {Object} params - Query parameters
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Search results
   */
  async searchProducts(query, params = {}, options = {}) {
    this.logOperation('searchProducts', { query, params, options });

    this.validateRequiredParams({ query }, ['query']);

    const searchParams = { ...params, q: query };
    const url = this.buildUrl(this.baseEndpoint, searchParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Created product
   */
  async createProduct(productData, options = {}) {
    this.logOperation('createProduct', { productData, options });

    this.validateRequiredParams(productData, ['title', 'price', 'category']);

    return this.executeRequest(
      () => this.client.post(this.baseEndpoint, productData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Update product by ID
   * @param {number} productId - Product ID
   * @param {Object} productData - Updated product data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Updated product
   */
  async updateProduct(productId, productData, options = {}) {
    this.logOperation('updateProduct', { productId, productData, options });

    this.validateRequiredParams({ productId }, ['productId']);

    const url = API_ENDPOINTS.PRODUCT_BY_ID(productId);

    return this.executeRequest(
      () => this.client.put(url, productData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Delete product by ID
   * @param {number} productId - Product ID
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Deletion result
   */
  async deleteProduct(productId, options = {}) {
    this.logOperation('deleteProduct', { productId, options });

    this.validateRequiredParams({ productId }, ['productId']);

    const url = API_ENDPOINTS.PRODUCT_BY_ID(productId);

    return this.executeRequest(
      () => this.client.delete(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get products with price range filter
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @param {Object} params - Additional parameters
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Filtered products
   */
  async getProductsByPriceRange(minPrice, maxPrice, params = {}, options = {}) {
    this.logOperation('getProductsByPriceRange', { minPrice, maxPrice, params, options });

    this.validateRequiredParams({ minPrice, maxPrice }, ['minPrice', 'maxPrice']);

    const filterParams = { ...params, price_min: minPrice, price_max: maxPrice };
    const url = this.buildUrl(this.baseEndpoint, filterParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get products with rating filter
   * @param {number} minRating - Minimum rating
   * @param {Object} params - Additional parameters
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Filtered products
   */
  async getProductsByRating(minRating, params = {}, options = {}) {
    this.logOperation('getProductsByRating', { minRating, params, options });

    this.validateRequiredParams({ minRating }, ['minRating']);

    const filterParams = { ...params, rating_min: minRating };
    const url = this.buildUrl(this.baseEndpoint, filterParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Transform response to include Product objects
   * @param {Object} response - Raw response
   * @returns {ApiResponse} Transformed response
   */
  transformResponse(response) {
    const { data } = response;

    // Handle paginated response
    if (data.products && Array.isArray(data.products)) {
      const products = data.products.map(productData => new Product(productData));
      const pagination = {
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
      
      return ApiResponse.success(
        new PaginatedResponse(products, pagination),
        'Products retrieved successfully'
      );
    }

    // Handle single product response
    if (data.id && data.title) {
      return ApiResponse.success(
        new Product(data),
        'Product retrieved successfully'
      );
    }

    // Handle array of products
    if (Array.isArray(data)) {
      const products = data.map(productData => new Product(productData));
      return ApiResponse.success(
        products,
        'Products retrieved successfully'
      );
    }

    // Handle categories response
    if (Array.isArray(data) && typeof data[0] === 'string') {
      return ApiResponse.success(
        data,
        'Categories retrieved successfully'
      );
    }

    // Default transformation
    return super.transformResponse(response);
  }

  /**
   * Handle product-specific errors
   * @param {ApiError} error - API error
   * @returns {ApiError} Processed error
   */
  handleServiceError(error) {
    // Add product-specific error handling here
    switch (error.statusCode) {
      case 404:
        error.message = 'Product not found';
        break;
      case 409:
        error.message = 'Product already exists';
        break;
      case 422:
        error.message = 'Invalid product data';
        break;
      default:
        // Use default error handling
        break;
    }

    return super.handleServiceError(error);
  }
}

export default ProductService; 