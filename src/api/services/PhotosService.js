/**
 * Photos Service
 * Handles photo-related API calls
 */

import BaseService from './BaseService';
import { API_ROUTES } from '../config/ApiConfig';

class PhotosService extends BaseService {
  /**
   * Upload photo to group
   * @param {number} groupId - Group ID
   * @param {Object} photoData - Photo upload data
   * @param {Object} photoData.file - Photo file object
   * @returns {Promise<Object>} Upload response
   */
  async uploadPhoto(groupId, photoData) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      this.validateRequired(photoData, ['file']);

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(photoData.file.type)) {
        throw new Error('Only JPG, JPEG, and PNG files are allowed');
      }

      const url = this.buildUrl(API_ROUTES.PHOTOS.UPLOAD);
      
      // Create form data for the backend API
      const formData = new FormData();
      formData.append('group_id', groupId);
      formData.append('files', {
        uri: photoData.file.uri,
        type: photoData.file.type,
        name: photoData.file.fileName || `photo_${Date.now()}.jpg`
      });

      const response = await this.authenticatedRequest(() =>
        this.client.uploadFile(url, formData)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Upload photo failed', error);
      throw error;
    }
  }

  /**
   * Get photos from a specific group
   * @param {number} groupId - Group ID
   * @returns {Promise<Array>} List of photos
   */
  async getGroupPhotos(groupId) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      const url = this.buildUrl(API_ROUTES.PHOTOS.GET_GROUP_PHOTOS, { group_id: groupId });
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get group photos failed', error);
      throw error;
    }
  }

  /**
   * Get all photos where user appears (face recognition)
   * @returns {Promise<Array>} List of photos with user
   */
  async getMyPhotos() {
    try {
      const url = this.buildUrl(API_ROUTES.PHOTOS.GET_MY_PHOTOS);
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get my photos failed', error);
      throw error;
    }
  }

  /**
   * Get photos where user appears in a specific group
   * @param {number} groupId - Group ID
   * @returns {Promise<Array>} List of photos with user in group
   */
  async getMyPhotosInGroup(groupId) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      const url = this.buildUrl(API_ROUTES.PHOTOS.GET_MY_PHOTOS_IN_GROUP, { group_id: groupId });
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get my photos in group failed', error);
      throw error;
    }
  }

  /**
   * Get specific photo details
   * @param {number} photoId - Photo ID
   * @returns {Promise<Object>} Photo details
   */
  async getPhoto(photoId) {
    try {
      if (!photoId || photoId <= 0) {
        throw new Error('Invalid photo ID');
      }

      const url = this.buildUrl(API_ROUTES.PHOTOS.GET_PHOTO, { photo_id: photoId });
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get photo failed', error);
      throw error;
    }
  }

  /**
   * Download photo file
   * @param {number} photoId - Photo ID
   * @returns {Promise<Object>} Photo file data
   */
  async downloadPhoto(photoId) {
    try {
      if (!photoId || photoId <= 0) {
        throw new Error('Invalid photo ID');
      }

      // First get photo details to get file path
      const photoDetails = await this.getPhoto(photoId);
      
      if (!photoDetails.file_path) {
        throw new Error('Photo file path not found');
      }

      // Download the file
      const response = await this.authenticatedRequest(() =>
        this.client.downloadFile(photoDetails.file_path)
      );

      return response;
    } catch (error) {
      this.logError('Download photo failed', error);
      throw error;
    }
  }

  /**
   * Upload multiple photos to group
   * @param {number} groupId - Group ID
   * @param {Array} photos - Array of photo file objects
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Array>} Array of upload responses
   */
  async uploadMultiplePhotos(groupId, photos, onProgress = null) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      if (!Array.isArray(photos) || photos.length === 0) {
        throw new Error('No photos provided');
      }

      const url = this.buildUrl(API_ROUTES.PHOTOS.UPLOAD);
      
      // Create form data for multiple files
      const formData = new FormData();
      formData.append('group_id', groupId);
      
      photos.forEach((photo, index) => {
        formData.append('files', {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName || `photo_${Date.now()}_${index}.jpg`
        });
      });

      const response = await this.authenticatedRequest(() =>
        this.client.uploadFile(url, formData)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Upload multiple photos failed', error);
      throw error;
    }
  }

  /**
   * Validate photo file
   * @param {Object} file - File object to validate
   * @returns {Object} Validation result
   */
  validatePhotoFile(file) {
    const errors = [];

    // Check if file exists
    if (!file) {
      errors.push('Photo file is required');
      return { isValid: false, errors };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Only JPG, JPEG, and PNG files are allowed');
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size && file.size > maxSize) {
      errors.push('File size must be less than 10MB');
    }

    // Check if file has required properties
    if (!file.uri) {
      errors.push('File URI is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get photo file URL
   * @param {string} filePath - File path from API response
   * @returns {string} Full photo URL
   */
  getPhotoUrl(filePath) {
    if (!filePath) {
      return null;
    }

    // If it's already a full URL, return as is
    if (filePath.startsWith('http')) {
      return filePath;
    }

    // Handle relative paths from backend
    if (filePath.startsWith('uploads/')) {
      return `${this.config.getBaseURL()}/${filePath}`;
    }

    // Otherwise, construct full URL
    return `${this.config.getBaseURL()}${filePath}`;
  }

  /**
   * Transform photo response to include full URLs
   * @param {Object} response - API response
   * @returns {Object} Transformed response
   */
  transformResponse(response) {
    // Handle axios response structure
    const data = response.data || response;
    
    if (Array.isArray(data)) {
      return data.map(photo => this.transformPhoto(photo));
    }

    if (data && typeof data === 'object' && data.file_path) {
      return this.transformPhoto(data);
    }

    return data;
  }

  /**
   * Transform individual photo object
   * @param {Object} photo - Photo object
   * @returns {Object} Transformed photo
   */
  transformPhoto(photo) {
    return {
      ...photo,
      file_url: this.getPhotoUrl(photo.file_path),
      created_at: photo.created_at ? new Date(photo.created_at) : null,
      updated_at: photo.updated_at ? new Date(photo.updated_at) : null,
    };
  }
}

export default PhotosService; 