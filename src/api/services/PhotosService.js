/**
 * PhotosService
 * Handles photo-related API calls
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles photo operations
 * - Open/Closed: Easy to extend with new photo methods
 * - Liskov Substitution: Can be swapped with different photo implementations
 * - Interface Segregation: Provides focused photo interface
 * - Dependency Inversion: Depends on abstractions (BaseService)
 */

import BaseService from './BaseService';

class PhotosService extends BaseService {
  /**
   * Get photos for a group
   * @param {string} groupId - Group ID
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} Group photos
   */
  async getGroupPhotos(groupId, options = {}) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      const url = this.buildUrl('PHOTOS', 'GROUP_PHOTOS', { groupId });
      const config = {
        params: {
          page: options.page || 1,
          limit: options.limit || 20,
        }
      };
      
      const response = await this.get(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get group photos failed', error);
      throw error;
    }
  }

  /**
   * Upload photo to group
   * @param {string} groupId - Group ID
   * @param {Object} photoData - Photo data
   * @param {string} photoData.uri - Photo URI
   * @param {string} photoData.type - Photo type
   * @param {string} photoData.name - Photo name
   * @param {string} photoData.caption - Photo caption (optional)
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Upload response
   */
  async uploadPhoto(groupId, photoData, onProgress = null) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      this.validateRequired(photoData, ['uri']);
      
      const url = this.buildUrl('PHOTOS', 'UPLOAD');
      const formData = new FormData();
      
      formData.append('photo', {
        uri: photoData.uri,
        type: photoData.type || 'image/jpeg',
        name: photoData.name || 'photo.jpg',
      });
      
      formData.append('groupId', groupId);
      
      if (photoData.caption) {
        formData.append('caption', photoData.caption);
      }
      
      const response = await this.uploadFile(url, formData, onProgress);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Upload photo failed', error);
      throw error;
    }
  }

  /**
   * Upload multiple photos
   * @param {string} groupId - Group ID
   * @param {Array} photos - Array of photo data
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Object>} Upload response
   */
  async uploadMultiplePhotos(groupId, photos, onProgress = null) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      if (!Array.isArray(photos) || photos.length === 0) {
        throw new Error('Photos array is required and must not be empty');
      }
      
      const url = this.buildUrl('PHOTOS', 'UPLOAD_MULTIPLE');
      const formData = new FormData();
      
      formData.append('groupId', groupId);
      
      photos.forEach((photo, index) => {
        this.validateRequired(photo, ['uri']);
        
        formData.append(`photos[${index}]`, {
          uri: photo.uri,
          type: photo.type || 'image/jpeg',
          name: photo.name || `photo_${index}.jpg`,
        });
        
        if (photo.caption) {
          formData.append(`captions[${index}]`, photo.caption);
        }
      });
      
      const response = await this.uploadFile(url, formData, onProgress);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Upload multiple photos failed', error);
      throw error;
    }
  }

  /**
   * Delete photo
   * @param {string} photoId - Photo ID
   * @returns {Promise<Object>} Delete response
   */
  async deletePhoto(photoId) {
    try {
      this.validateRequired({ photoId }, ['photoId']);
      
      const url = this.buildUrl('PHOTOS', 'DELETE', { id: photoId });
      const response = await this.delete(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Delete photo failed', error);
      throw error;
    }
  }

  /**
   * Like/Unlike photo
   * @param {string} photoId - Photo ID
   * @param {boolean} isLiked - Whether to like or unlike
   * @returns {Promise<Object>} Like response
   */
  async toggleLike(photoId, isLiked = true) {
    try {
      this.validateRequired({ photoId }, ['photoId']);
      
      const url = this.buildUrl('PHOTOS', 'LIKE', { id: photoId });
      const data = { isLiked };
      
      const response = await this.post(url, data);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Toggle like failed', error);
      throw error;
    }
  }

  /**
   * Add comment to photo
   * @param {string} photoId - Photo ID
   * @param {string} comment - Comment text
   * @returns {Promise<Object>} Comment response
   */
  async addComment(photoId, comment) {
    try {
      this.validateRequired({ photoId, comment }, ['photoId', 'comment']);
      
      const url = this.buildUrl('PHOTOS', 'COMMENTS', { id: photoId });
      const data = { comment: comment.trim() };
      
      const response = await this.post(url, data);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Add comment failed', error);
      throw error;
    }
  }

  /**
   * Get photo comments
   * @param {string} photoId - Photo ID
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} Photo comments
   */
  async getComments(photoId, options = {}) {
    try {
      this.validateRequired({ photoId }, ['photoId']);
      
      const url = this.buildUrl('PHOTOS', 'COMMENTS', { id: photoId });
      const config = {
        params: {
          page: options.page || 1,
          limit: options.limit || 20,
        }
      };
      
      const response = await this.get(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get comments failed', error);
      throw error;
    }
  }

  /**
   * Delete comment
   * @param {string} photoId - Photo ID
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteComment(photoId, commentId) {
    try {
      this.validateRequired({ photoId, commentId }, ['photoId', 'commentId']);
      
      const url = this.buildUrl('PHOTOS', 'COMMENTS', { id: photoId });
      const config = { data: { commentId } };
      
      const response = await this.delete(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Delete comment failed', error);
      throw error;
    }
  }

  /**
   * Update photo caption
   * @param {string} photoId - Photo ID
   * @param {string} caption - New caption
   * @returns {Promise<Object>} Update response
   */
  async updateCaption(photoId, caption) {
    try {
      this.validateRequired({ photoId }, ['photoId']);
      
      const url = this.buildUrl('PHOTOS', 'CAPTION', { id: photoId });
      const data = { caption: caption?.trim() || '' };
      
      const response = await this.put(url, data);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update caption failed', error);
      throw error;
    }
  }

  /**
   * Get photo details
   * @param {string} photoId - Photo ID
   * @returns {Promise<Object>} Photo details
   */
  async getPhotoDetails(photoId) {
    try {
      this.validateRequired({ photoId }, ['photoId']);
      
      const url = this.buildUrl('PHOTOS', 'DETAILS', { id: photoId });
      const response = await this.get(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get photo details failed', error);
      throw error;
    }
  }

  /**
   * Download photo
   * @param {string} photoId - Photo ID
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Blob>} Photo blob
   */
  async downloadPhoto(photoId, onProgress = null) {
    try {
      this.validateRequired({ photoId }, ['photoId']);
      
      const url = this.buildUrl('PHOTOS', 'DOWNLOAD', { id: photoId });
      const response = await this.downloadFile(url, onProgress);
      
      return response;
    } catch (error) {
      this.logError('Download photo failed', error);
      throw error;
    }
  }

  /**
   * Search photos
   * @param {Object} searchOptions - Search options
   * @param {string} searchOptions.query - Search query
   * @param {string} searchOptions.groupId - Group ID (optional)
   * @param {number} searchOptions.page - Page number
   * @param {number} searchOptions.limit - Items per page
   * @returns {Promise<Object>} Search results
   */
  async searchPhotos(searchOptions) {
    try {
      this.validateRequired(searchOptions, ['query']);
      
      const url = this.buildUrl('PHOTOS', 'SEARCH');
      const config = {
        params: {
          q: searchOptions.query,
          groupId: searchOptions.groupId,
          page: searchOptions.page || 1,
          limit: searchOptions.limit || 20,
        }
      };
      
      const response = await this.get(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Search photos failed', error);
      throw error;
    }
  }

  /**
   * Get photo statistics
   * @param {string} photoId - Photo ID
   * @returns {Promise<Object>} Photo statistics
   */
  async getPhotoStats(photoId) {
    try {
      this.validateRequired({ photoId }, ['photoId']);
      
      const url = this.buildUrl('PHOTOS', 'STATS', { id: photoId });
      const response = await this.get(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get photo stats failed', error);
      throw error;
    }
  }

  /**
   * Transform response data (override from BaseService)
   */
  transformResponse(data) {
    if (data.photos) {
      return {
        ...data,
        photos: data.photos.map(photo => this.transformPhoto(photo))
      };
    }
    
    if (data.photo) {
      return {
        ...data,
        photo: this.transformPhoto(data.photo)
      };
    }
    
    return data;
  }

  /**
   * Transform individual photo data
   * @param {Object} photo - Photo data
   * @returns {Object} Transformed photo
   */
  transformPhoto(photo) {
    return {
      ...photo,
      url: photo.url ? this.getFullImageUrl(photo.url) : null,
      thumbnail_url: photo.thumbnail_url ? this.getFullImageUrl(photo.thumbnail_url) : null,
      created_at: photo.created_at ? new Date(photo.created_at) : null,
      updated_at: photo.updated_at ? new Date(photo.updated_at) : null,
    };
  }

  /**
   * Get full image URL
   * @param {string} relativePath - Relative image path
   * @returns {string} Full image URL
   */
  getFullImageUrl(relativePath) {
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    return `${this.config.getBaseURL()}${relativePath}`;
  }

  /**
   * Validate photo data
   * @param {Object} photoData - Photo data to validate
   * @returns {Object} Validation result
   */
  validatePhotoData(photoData) {
    const errors = [];
    
    // Validate required fields
    if (!photoData.uri) {
      errors.push('Photo URI is required');
    }
    
    // Validate file type
    if (photoData.type && !this.isValidImageType(photoData.type)) {
      errors.push('Invalid image type. Supported types: JPEG, PNG, GIF, WebP');
    }
    
    // Validate caption length
    if (photoData.caption && photoData.caption.length > 500) {
      errors.push('Caption must be less than 500 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if image type is valid
   * @param {string} type - Image type
   * @returns {boolean} True if valid
   */
  isValidImageType(type) {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
    
    return validTypes.includes(type.toLowerCase());
  }

  /**
   * Get supported image formats
   * @returns {Array} Supported formats
   */
  getSupportedFormats() {
    return [
      { extension: 'jpg', mimeType: 'image/jpeg' },
      { extension: 'jpeg', mimeType: 'image/jpeg' },
      { extension: 'png', mimeType: 'image/png' },
      { extension: 'gif', mimeType: 'image/gif' },
      { extension: 'webp', mimeType: 'image/webp' },
    ];
  }
}

// Export singleton instance
export const photosService = new PhotosService();
export { PhotosService }; 