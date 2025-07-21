/**
 * Token Manager
 * Handles authentication token storage, retrieval, and management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'snapvault_access_token',
  USER_DATA: 'snapvault_user_data',
  REFRESH_TOKEN: 'snapvault_refresh_token',
  TOKEN_EXPIRY: 'snapvault_token_expiry',
};

class TokenManager {
  constructor() {
    this.accessToken = null;
    this.userData = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Initialize token manager by loading stored tokens
   */
  async initialize() {
    try {
      const [accessToken, userData, refreshToken, tokenExpiry] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);

      this.accessToken = accessToken;
      this.userData = userData ? JSON.parse(userData) : null;
      this.refreshToken = refreshToken;
      this.tokenExpiry = tokenExpiry ? new Date(tokenExpiry) : null;

      return {
        isAuthenticated: this.isAuthenticated(),
        userData: this.userData,
      };
    } catch (error) {
      console.error('TokenManager initialization failed:', error);
      return {
        isAuthenticated: false,
        userData: null,
      };
    }
  }

  /**
   * Store authentication data after successful login
   * @param {Object} authData - Authentication response data
   */
  async storeAuthData(authData) {
    try {
      const { access_token, user, refresh_token, expires_in } = authData;
      
      // Calculate token expiry
      const expiryDate = expires_in 
        ? new Date(Date.now() + expires_in * 1000)
        : new Date(Date.now() + 24 * 60 * 60 * 1000); // Default 24 hours

      this.accessToken = access_token;
      this.userData = user || null; // Handle case where user data is not provided
      this.refreshToken = refresh_token || null;
      this.tokenExpiry = expiryDate;
      


      // Store in AsyncStorage - only store non-null values
      const storagePromises = [
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryDate.toISOString()),
      ];

      // Only store user data if it exists
      if (user) {
        storagePromises.push(AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)));
      }

      // Only store refresh token if it exists
      if (refresh_token) {
        storagePromises.push(AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh_token));
      }

      await Promise.all(storagePromises);

      console.log('Authentication data stored successfully');
    } catch (error) {
      console.error('Failed to store authentication data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  /**
   * Get current access token
   * @returns {string|null} Access token
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Get current user data
   * @returns {Object|null} User data
   */
  getUserData() {
    return this.userData;
  }

  /**
   * Get refresh token
   * @returns {string|null} Refresh token
   */
  getRefreshToken() {
    return this.refreshToken;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    if (!this.accessToken) {
      return false;
    }

    // Check if token is expired
    if (this.tokenExpiry && new Date() > this.tokenExpiry) {
      this.clearTokens();
      return false;
    }

    return true;
  }

  /**
   * Get authorization header for API requests
   * @returns {string|null} Authorization header
   */
  getAuthHeader() {
    if (!this.isAuthenticated()) {
      return null;
    }
    // Return just the token without "Bearer " prefix as per API requirements
    return this.accessToken;
  }

  /**
   * Update access token (for token refresh)
   * @param {string} newAccessToken - New access token
   * @param {number} expiresIn - Token expiry time in seconds
   */
  async updateAccessToken(newAccessToken, expiresIn = 3600) {
    try {
      this.accessToken = newAccessToken;
      this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);

      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, this.tokenExpiry.toISOString());

      console.log('Access token updated successfully');
    } catch (error) {
      console.error('Failed to update access token:', error);
      throw new Error('Failed to update access token');
    }
  }

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  async updateUserData(userData) {
    try {
      this.userData = { ...this.userData, ...userData };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.userData));
      console.log('User data updated successfully');
    } catch (error) {
      console.error('Failed to update user data:', error);
      throw new Error('Failed to update user data');
    }
  }

  /**
   * Clear all stored tokens and user data
   */
  async clearTokens() {
    try {
      this.accessToken = null;
      this.userData = null;
      this.refreshToken = null;
      this.tokenExpiry = null;

      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY),
      ]);

      console.log('All tokens cleared successfully');
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      throw new Error('Failed to clear tokens');
    }
  }

  /**
   * Check if token is about to expire (within 5 minutes)
   * @returns {boolean} True if token expires soon
   */
  isTokenExpiringSoon() {
    if (!this.tokenExpiry) {
      return false;
    }

    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return this.tokenExpiry <= fiveMinutesFromNow;
  }

  /**
   * Get token expiry time
   * @returns {Date|null} Token expiry date
   */
  getTokenExpiry() {
    return this.tokenExpiry;
  }

  /**
   * Get time until token expires in seconds
   * @returns {number} Seconds until expiry
   */
  getTimeUntilExpiry() {
    if (!this.tokenExpiry) {
      return 0;
    }

    const now = new Date();
    const timeUntilExpiry = this.tokenExpiry.getTime() - now.getTime();
    return Math.max(0, Math.floor(timeUntilExpiry / 1000));
  }
}

export default TokenManager; 