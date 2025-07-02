/**
 * Item Service
 * Handles all item-related API operations
 * Following Single Responsibility Principle - only handles item operations
 */

import { BaseService } from './baseService.js';
import { ApiResponse, ApiError } from '../api/types.js';

/**
 * Item Service Class
 * Extends BaseService to provide item-specific functionality
 */
export class ItemService extends BaseService {
  constructor(httpClient) {
    super(httpClient);
    this.baseEndpoint = '/items';
  }

  /**
   * Get all items with pagination
   * @param {Object} params - Query parameters (limit, skip, page)
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Items response
   */
  async getAllItems(params = {}, options = {}) {
    this.logOperation('getAllItems', { params, options });

    const paginationParams = this.handlePaginationParams(params);
    const url = this.buildUrl(this.baseEndpoint, paginationParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get item by ID
   * @param {number} itemId - Item ID
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Item response
   */
  async getItemById(itemId, options = {}) {
    this.logOperation('getItemById', { itemId, options });

    this.validateRequiredParams({ itemId }, ['itemId']);

    const url = `${this.baseEndpoint}/${itemId}`;

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Create a new item
   * @param {Object} itemData - Item data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Created item
   */
  async createItem(itemData, options = {}) {
    this.logOperation('createItem', { itemData, options });

    this.validateRequiredParams(itemData, ['name', 'description']);

    return this.executeRequest(
      () => this.client.post(this.baseEndpoint, itemData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Update item by ID
   * @param {number} itemId - Item ID
   * @param {Object} itemData - Updated item data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Updated item
   */
  async updateItem(itemId, itemData, options = {}) {
    this.logOperation('updateItem', { itemId, itemData, options });

    this.validateRequiredParams({ itemId }, ['itemId']);

    const url = `${this.baseEndpoint}/${itemId}`;

    return this.executeRequest(
      () => this.client.put(url, itemData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Delete item by ID
   * @param {number} itemId - Item ID
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Deletion result
   */
  async deleteItem(itemId, options = {}) {
    this.logOperation('deleteItem', { itemId, options });

    this.validateRequiredParams({ itemId }, ['itemId']);

    const url = `${this.baseEndpoint}/${itemId}`;

    return this.executeRequest(
      () => this.client.delete(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Search items
   * @param {string} query - Search query
   * @param {Object} params - Additional parameters
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Search results
   */
  async searchItems(query, params = {}, options = {}) {
    this.logOperation('searchItems', { query, params, options });

    this.validateRequiredParams({ query }, ['query']);

    const searchParams = { ...params, q: query };
    const url = this.buildUrl(this.baseEndpoint, searchParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get items by category
   * @param {string} category - Category name
   * @param {Object} params - Query parameters
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Items by category
   */
  async getItemsByCategory(category, params = {}, options = {}) {
    this.logOperation('getItemsByCategory', { category, params, options });

    this.validateRequiredParams({ category }, ['category']);

    const categoryParams = { ...params, category };
    const url = this.buildUrl(this.baseEndpoint, categoryParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Get items with price range filter
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @param {Object} params - Additional parameters
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Filtered items
   */
  async getItemsByPriceRange(minPrice, maxPrice, params = {}, options = {}) {
    this.logOperation('getItemsByPriceRange', { minPrice, maxPrice, params, options });

    this.validateRequiredParams({ minPrice, maxPrice }, ['minPrice', 'maxPrice']);

    const filterParams = { ...params, minPrice, maxPrice };
    const url = this.buildUrl(this.baseEndpoint, filterParams);

    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Bulk create items
   * @param {Array} itemsData - Array of item data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Created items
   */
  async bulkCreateItems(itemsData, options = {}) {
    this.logOperation('bulkCreateItems', { itemsCount: itemsData.length, options });

    if (!Array.isArray(itemsData) || itemsData.length === 0) {
      throw new ApiError('Items data must be a non-empty array', 400);
    }

    return this.executeRequest(
      () => this.client.post(`${this.baseEndpoint}/bulk`, itemsData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Bulk update items
   * @param {Array} itemsData - Array of items with IDs and update data
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Updated items
   */
  async bulkUpdateItems(itemsData, options = {}) {
    this.logOperation('bulkUpdateItems', { itemsCount: itemsData.length, options });

    if (!Array.isArray(itemsData) || itemsData.length === 0) {
      throw new ApiError('Items data must be a non-empty array', 400);
    }

    return this.executeRequest(
      () => this.client.put(`${this.baseEndpoint}/bulk`, itemsData, this.createRequestConfig(options)),
      options
    );
  }

  /**
   * Bulk delete items
   * @param {Array} itemIds - Array of item IDs to delete
   * @param {Object} options - Request options
   * @returns {Promise<ApiResponse>} Deletion result
   */
  async bulkDeleteItems(itemIds, options = {}) {
    this.logOperation('bulkDeleteItems', { itemsCount: itemIds.length, options });

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      throw new ApiError('Item IDs must be a non-empty array', 400);
    }

    return this.executeRequest(
      () => this.client.delete(`${this.baseEndpoint}/bulk`, {
        ...this.createRequestConfig(options),
        data: { itemIds },
      }),
      options
    );
  }

  /**
   * Handle item-specific errors
   * @param {ApiError} error - API error
   * @returns {ApiError} Processed error
   */
  handleServiceError(error) {
    // Add item-specific error handling here
    switch (error.statusCode) {
      case 404:
        error.message = 'Item not found';
        break;
      case 409:
        error.message = 'Item already exists';
        break;
      case 422:
        error.message = 'Invalid item data';
        break;
      default:
        // Use default error handling
        break;
    }

    return super.handleServiceError(error);
  }
}

export default ItemService;