/**
 * TokenManager
 * Handles secure storage and retrieval of authentication tokens
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only manages token storage/retrieval
 * - Open/Closed: Easy to extend with different storage methods
 * - Dependency Inversion: Uses interface abstraction for storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  TOKEN_EXPIRY: 'token_expiry',
  USER_INFO: 'user_info',
};

class TokenManager {
  constructor(storageProvider = AsyncStorage) {
    this.storage = storageProvider;
  }

  /**
   * Store access token
   * @param {string} token - Access token
   * @param {number} expiresIn - Token expiry in seconds
   */
  async setAccessToken(token, expiresIn = null) {
    try {
      await this.storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      
      if (expiresIn) {
        const expiryTime = Date.now() + (expiresIn * 1000);
        await this.storage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
      }
    } catch (error) {
      console.error('TokenManager: Error storing access token:', error);
      throw new Error('Failed to store access token');
    }
  }

  /**
   * Get access token
   * @returns {string|null} Access token or null if not found
   */
  async getAccessToken() {
    try {
      const token = await this.storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      
      // Check if token is expired
      if (token && await this.isTokenExpired()) {
        await this.clearAccessToken();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('TokenManager: Error retrieving access token:', error);
      return null;
    }
  }

  /**
   * Store refresh token
   * @param {string} token - Refresh token
   */
  async setRefreshToken(token) {
    try {
      await this.storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('TokenManager: Error storing refresh token:', error);
      throw new Error('Failed to store refresh token');
    }
  }

  /**
   * Get refresh token
   * @returns {string|null} Refresh token or null if not found
   */
  async getRefreshToken() {
    try {
      return await this.storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('TokenManager: Error retrieving refresh token:', error);
      return null;
    }
  }

  /**
   * Store user information
   * @param {Object} userInfo - User information object
   */
  async setUserInfo(userInfo) {
    try {
      await this.storage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    } catch (error) {
      console.error('TokenManager: Error storing user info:', error);
      throw new Error('Failed to store user info');
    }
  }

  /**
   * Get user information
   * @returns {Object|null} User information or null if not found
   */
  async getUserInfo() {
    try {
      const userInfo = await this.storage.getItem(STORAGE_KEYS.USER_INFO);
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('TokenManager: Error retrieving user info:', error);
      return null;
    }
  }

  /**
   * Check if access token is expired
   * @returns {boolean} True if token is expired
   */
  async isTokenExpired() {
    try {
      const expiryTime = await this.storage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      
      if (!expiryTime) {
        return false; // No expiry set, assume token is valid
      }
      
      return Date.now() >= parseInt(expiryTime);
    } catch (error) {
      console.error('TokenManager: Error checking token expiry:', error);
      return true; // Assume expired on error
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid tokens
   */
  async isAuthenticated() {
    try {
      const accessToken = await this.getAccessToken();
      return !!accessToken;
    } catch (error) {
      console.error('TokenManager: Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Clear access token and expiry
   */
  async clearAccessToken() {
    try {
      await Promise.all([
        this.storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        this.storage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);
    } catch (error) {
      console.error('TokenManager: Error clearing access token:', error);
      throw new Error('Failed to clear access token');
    }
  }

  /**
   * Clear refresh token
   */
  async clearRefreshToken() {
    try {
      await this.storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('TokenManager: Error clearing refresh token:', error);
      throw new Error('Failed to clear refresh token');
    }
  }

  /**
   * Clear user information
   */
  async clearUserInfo() {
    try {
      await this.storage.removeItem(STORAGE_KEYS.USER_INFO);
    } catch (error) {
      console.error('TokenManager: Error clearing user info:', error);
      throw new Error('Failed to clear user info');
    }
  }

  /**
   * Clear all stored data
   */
  async clearAll() {
    try {
      await Promise.all([
        this.clearAccessToken(),
        this.clearRefreshToken(),
        this.clearUserInfo(),
      ]);
    } catch (error) {
      console.error('TokenManager: Error clearing all data:', error);
      throw new Error('Failed to clear all data');
    }
  }

  /**
   * Get authorization header value
   * @returns {string|null} Authorization header value or null
   */
  async getAuthHeader() {
    try {
      const token = await this.getAccessToken();
      return token ? `Bearer ${token}` : null;
    } catch (error) {
      console.error('TokenManager: Error getting auth header:', error);
      return null;
    }
  }

  /**
   * Store complete authentication data
   * @param {Object} authData - Authentication data object
   * @param {string} authData.access_token - Access token
   * @param {string} authData.refresh_token - Refresh token (optional)
   * @param {number} authData.expires_in - Token expiry in seconds (optional)
   * @param {Object} authData.user - User information (optional)
   */
  async storeAuthData(authData) {
    try {
      const promises = [];
      
      // Store access token
      if (authData.access_token) {
        promises.push(this.setAccessToken(authData.access_token, authData.expires_in));
      }
      
      // Store refresh token
      if (authData.refresh_token) {
        promises.push(this.setRefreshToken(authData.refresh_token));
      }
      
      // Store user info
      if (authData.user) {
        promises.push(this.setUserInfo(authData.user));
      }
      
      await Promise.all(promises);
    } catch (error) {
      console.error('TokenManager: Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();
export { TokenManager, STORAGE_KEYS }; 