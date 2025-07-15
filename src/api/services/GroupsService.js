/**
 * GroupsService
 * Handles group-related API calls
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Only handles group operations
 * - Open/Closed: Easy to extend with new group methods
 * - Liskov Substitution: Can be swapped with different group implementations
 * - Interface Segregation: Provides focused group interface
 * - Dependency Inversion: Depends on abstractions (BaseService)
 */

import BaseService from './BaseService';

class GroupsService extends BaseService {
  /**
   * Get user's groups
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} User groups
   */
  async getMyGroups(options = {}) {
    try {
      const url = this.buildUrl('GROUPS', 'MY_GROUPS');
      const config = {
        params: {
          page: options.page || 1,
          limit: options.limit || 20,
        }
      };
      
      const response = await this.get(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get my groups failed', error);
      throw error;
    }
  }

  /**
   * Create new group
   * @param {Object} groupData - Group data
   * @param {string} groupData.name - Group name
   * @param {string} groupData.description - Group description
   * @param {boolean} groupData.isPrivate - Is group private
   * @returns {Promise<Object>} Created group
   */
  async createGroup(groupData) {
    try {
      this.validateRequired(groupData, ['name']);
      
      const url = this.buildUrl('GROUPS', 'CREATE');
      const transformedData = this.transformRequest(groupData);
      
      const response = await this.post(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Create group failed', error);
      throw error;
    }
  }

  /**
   * Get group details
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Group details
   */
  async getGroupDetails(groupId) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      const url = this.buildUrl('GROUPS', 'DETAILS', { id: groupId });
      const response = await this.get(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get group details failed', error);
      throw error;
    }
  }

  /**
   * Update group
   * @param {string} groupId - Group ID
   * @param {Object} groupData - Updated group data
   * @returns {Promise<Object>} Updated group
   */
  async updateGroup(groupId, groupData) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      const url = this.buildUrl('GROUPS', 'DETAILS', { id: groupId });
      const transformedData = this.transformRequest(groupData);
      
      const response = await this.put(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update group failed', error);
      throw error;
    }
  }

  /**
   * Delete group
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteGroup(groupId) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      const url = this.buildUrl('GROUPS', 'DETAILS', { id: groupId });
      const response = await this.delete(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Delete group failed', error);
      throw error;
    }
  }

  /**
   * Join group
   * @param {Object} joinData - Join data
   * @param {string} joinData.groupId - Group ID
   * @param {string} joinData.inviteCode - Invite code (optional)
   * @returns {Promise<Object>} Join response
   */
  async joinGroup(joinData) {
    try {
      this.validateRequired(joinData, ['groupId']);
      
      const url = this.buildUrl('GROUPS', 'JOIN');
      const transformedData = this.transformRequest(joinData);
      
      const response = await this.post(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Join group failed', error);
      throw error;
    }
  }

  /**
   * Leave group
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Leave response
   */
  async leaveGroup(groupId) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      const url = this.buildUrl('GROUPS', 'LEAVE');
      const data = { groupId };
      
      const response = await this.post(url, data);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Leave group failed', error);
      throw error;
    }
  }

  /**
   * Get group members
   * @param {string} groupId - Group ID
   * @param {Object} options - Query options
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} Group members
   */
  async getGroupMembers(groupId, options = {}) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      const url = this.buildUrl('GROUPS', 'MEMBERS', { id: groupId });
      const config = {
        params: {
          page: options.page || 1,
          limit: options.limit || 20,
        }
      };
      
      const response = await this.get(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get group members failed', error);
      throw error;
    }
  }

  /**
   * Add member to group
   * @param {string} groupId - Group ID
   * @param {Object} memberData - Member data
   * @param {string} memberData.userId - User ID to add
   * @param {string} memberData.role - Member role (optional)
   * @returns {Promise<Object>} Add member response
   */
  async addMember(groupId, memberData) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      this.validateRequired(memberData, ['userId']);
      
      const url = this.buildUrl('GROUPS', 'MEMBERS', { id: groupId });
      const transformedData = this.transformRequest(memberData);
      
      const response = await this.post(url, transformedData);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Add member failed', error);
      throw error;
    }
  }

  /**
   * Remove member from group
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<Object>} Remove member response
   */
  async removeMember(groupId, userId) {
    try {
      this.validateRequired({ groupId, userId }, ['groupId', 'userId']);
      
      const url = this.buildUrl('GROUPS', 'MEMBERS', { id: groupId });
      const config = { data: { userId } };
      
      const response = await this.delete(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Remove member failed', error);
      throw error;
    }
  }

  /**
   * Update member role
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID
   * @param {string} role - New role
   * @returns {Promise<Object>} Update role response
   */
  async updateMemberRole(groupId, userId, role) {
    try {
      this.validateRequired({ groupId, userId, role }, ['groupId', 'userId', 'role']);
      
      const url = this.buildUrl('GROUPS', 'MEMBERS', { id: groupId });
      const data = { userId, role };
      
      const response = await this.put(url, data);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update member role failed', error);
      throw error;
    }
  }

  /**
   * Search groups
   * @param {Object} searchOptions - Search options
   * @param {string} searchOptions.query - Search query
   * @param {number} searchOptions.page - Page number
   * @param {number} searchOptions.limit - Items per page
   * @returns {Promise<Object>} Search results
   */
  async searchGroups(searchOptions) {
    try {
      this.validateRequired(searchOptions, ['query']);
      
      const url = this.buildUrl('GROUPS', 'SEARCH');
      const config = {
        params: {
          q: searchOptions.query,
          page: searchOptions.page || 1,
          limit: searchOptions.limit || 20,
        }
      };
      
      const response = await this.get(url, config);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Search groups failed', error);
      throw error;
    }
  }

  /**
   * Get group invite code
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Invite code
   */
  async getInviteCode(groupId) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      const url = this.buildUrl('GROUPS', 'INVITE_CODE', { id: groupId });
      const response = await this.get(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get invite code failed', error);
      throw error;
    }
  }

  /**
   * Generate new invite code
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} New invite code
   */
  async generateInviteCode(groupId) {
    try {
      this.validateRequired({ groupId }, ['groupId']);
      
      const url = this.buildUrl('GROUPS', 'INVITE_CODE', { id: groupId });
      const response = await this.post(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Generate invite code failed', error);
      throw error;
    }
  }

  /**
   * Transform request data (override from BaseService)
   */
  transformRequest(data) {
    const transformed = { ...data };
    
    // Ensure group name is trimmed
    if (transformed.name) {
      transformed.name = transformed.name.trim();
    }
    
    // Ensure description is trimmed
    if (transformed.description) {
      transformed.description = transformed.description.trim();
    }
    
    return transformed;
  }

  /**
   * Transform response data (override from BaseService)
   */
  transformResponse(data) {
    if (data.groups) {
      return {
        ...data,
        groups: data.groups.map(group => this.transformGroup(group))
      };
    }
    
    if (data.group) {
      return {
        ...data,
        group: this.transformGroup(data.group)
      };
    }
    
    return data;
  }

  /**
   * Transform individual group data
   * @param {Object} group - Group data
   * @returns {Object} Transformed group
   */
  transformGroup(group) {
    return {
      ...group,
      avatar_url: group.avatar_url ? this.getFullImageUrl(group.avatar_url) : null,
      created_at: group.created_at ? new Date(group.created_at) : null,
      updated_at: group.updated_at ? new Date(group.updated_at) : null,
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
   * Validate group data
   * @param {Object} groupData - Group data to validate
   * @returns {Object} Validation result
   */
  validateGroupData(groupData) {
    const errors = [];
    
    // Validate name
    if (!groupData.name || groupData.name.trim().length < 3) {
      errors.push('Group name must be at least 3 characters');
    }
    
    if (groupData.name && groupData.name.length > 50) {
      errors.push('Group name must be less than 50 characters');
    }
    
    // Validate description
    if (groupData.description && groupData.description.length > 500) {
      errors.push('Group description must be less than 500 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const groupsService = new GroupsService();
export { GroupsService }; 