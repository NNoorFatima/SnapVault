/**
 * Groups Service
 * Handles group-related API calls
 */

import BaseService from './BaseService';
import { API_ROUTES } from '../config/ApiConfig';

class GroupsService extends BaseService {
  /**
   * Get user's groups
   * @returns {Promise<Array>} List of user's groups
   */
  async getMyGroups() {
    try {
      const url = this.buildUrl(API_ROUTES.GROUPS.MY_GROUPS);
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get my groups failed', error);
      throw error;
    }
  }

  /**
   * Create a new group
   * @param {Object} groupData - Group creation data
   * @param {string} groupData.name - Group name
   * @param {string} groupData.description - Group description
   * @returns {Promise<Object>} Created group data
   */
  async createGroup(groupData) {
    try {
      this.validateRequired(groupData, ['name', 'description']);

      if (!groupData.name || groupData.name.trim() === '') {
        throw new Error('Group name cannot be empty');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.CREATE);
      const response = await this.authenticatedRequest(() =>
        this.client.post(url, groupData)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Create group failed', error);
      throw error;
    }
  }

  /**
   * Join a group using invite code
   * @param {Object} joinData - Join group data
   * @param {string} joinData.invite_code - Group invite code
   * @returns {Promise<Object>} Join response
   */
  async joinGroup(joinData) {
    try {
      this.validateRequired(joinData, ['invite_code']);

      if (!joinData.invite_code || joinData.invite_code.trim() === '') {
        throw new Error('Invite code cannot be empty');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.JOIN);
      const response = await this.authenticatedRequest(() =>
        this.client.post(url, joinData)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Join group failed', error);
      throw error;
    }
  }

  /**
   * Get specific group details
   * @param {number} groupId - Group ID
   * @returns {Promise<Object>} Group details
   */
  async getGroup(groupId) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.GET_GROUP, { id: groupId });
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get group failed', error);
      throw error;
    }
  }

  /**
   * Get group members
   * @param {number} groupId - Group ID
   * @returns {Promise<Object>} Group members data
   */
  async getGroupMembers(groupId) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.GET_MEMBERS, { id: groupId });
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get group members failed', error);
      throw error;
    }
  }

  /**
   * Leave a group
   * @param {number} groupId - Group ID
   * @returns {Promise<Object>} Leave response
   */
  async leaveGroup(groupId) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.LEAVE_GROUP, { id: groupId });
      const response = await this.authenticatedRequest(() =>
        this.client.delete(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Leave group failed', error);
      throw error;
    }
  }

  /**
   * Delete a group (only for group owner)
   * @param {number} groupId - Group ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteGroup(groupId) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.DELETE_GROUP, { id: groupId });
      const response = await this.authenticatedRequest(() =>
        this.client.delete(url)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Delete group failed', error);
      throw error;
    }
  }

  /**
   * Update group information (only for group owner)
   * @param {number} groupId - Group ID
   * @param {Object} groupData - Updated group data
   * @param {string} groupData.name - New group name (optional)
   * @param {string} groupData.description - New group description (optional)
   * @returns {Promise<Object>} Updated group data
   */
  async updateGroup(groupId, groupData) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      if (!groupData || Object.keys(groupData).length === 0) {
        throw new Error('No update data provided');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.UPDATE_GROUP, { id: groupId });
      const response = await this.authenticatedRequest(() =>
        this.client.put(url, groupData)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update group failed', error);
      throw error;
    }
  }

  /**
   * Update member access in group (admin only)
   * @param {number} groupId - Group ID
   * @param {number} memberId - Member user ID
   * @param {number} roleId - New role ID
   * @returns {Promise<Object>} Update response
   */
  async updateMemberAccess(groupId, memberId, roleId) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      if (!memberId || memberId <= 0) {
        throw new Error('Invalid member ID');
      }

      if (!roleId || roleId <= 0) {
        throw new Error('Invalid role ID');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.UPDATE_MEMBER_ACCESS, { id: groupId });
      const data = { member_id: memberId, role_id: roleId };
      
      const response = await this.authenticatedRequest(() =>
        this.client.put(url, data)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Update member access failed', error);
      throw error;
    }
  }

  /**
   * Transfer group ownership (super admin only)
   * @param {number} groupId - Group ID
   * @param {number} newOwnerId - New owner user ID
   * @returns {Promise<Object>} Transfer response
   */
  async transferOwnership(groupId, newOwnerId) {
    try {
      if (!groupId || groupId <= 0) {
        throw new Error('Invalid group ID');
      }

      if (!newOwnerId || newOwnerId <= 0) {
        throw new Error('Invalid new owner ID');
      }

      const url = this.buildUrl(API_ROUTES.GROUPS.TRANSFER_OWNERSHIP, { id: groupId });
      const data = { new_owner_id: newOwnerId };
      
      const response = await this.authenticatedRequest(() =>
        this.client.put(url, data)
      );

      return this.transformResponse(response);
    } catch (error) {
      this.logError('Transfer ownership failed', error);
      throw error;
    }
  }

  /**
   * Validate group name
   * @param {string} name - Group name to validate
   * @returns {Object} Validation result
   */
  validateGroupName(name) {
    const minLength = 3;
    const maxLength = 50;

    const isValid = name.length >= minLength && name.length <= maxLength;

    return {
      isValid,
      errors: [
        ...(name.length < minLength ? ['Group name must be at least 3 characters'] : []),
        ...(name.length > maxLength ? ['Group name must be less than 50 characters'] : []),
      ]
    };
  }

  /**
   * Validate group description
   * @param {string} description - Group description to validate
   * @returns {Object} Validation result
   */
  validateGroupDescription(description) {
    const maxLength = 500;

    const isValid = description.length <= maxLength;

    return {
      isValid,
      errors: [
        ...(description.length > maxLength ? ['Group description must be less than 500 characters'] : []),
      ]
    };
  }

  /**
   * Validate invite code format
   * @param {string} inviteCode - Invite code to validate
   * @returns {Object} Validation result
   */
  validateInviteCode(inviteCode) {
    const minLength = 6;
    const maxLength = 10;
    const codeRegex = /^[A-Z0-9]+$/;

    const isValid = inviteCode.length >= minLength && 
                   inviteCode.length <= maxLength && 
                   codeRegex.test(inviteCode);

    return {
      isValid,
      errors: [
        ...(inviteCode.length < minLength ? ['Invite code must be at least 6 characters'] : []),
        ...(inviteCode.length > maxLength ? ['Invite code must be less than 10 characters'] : []),
        ...(!codeRegex.test(inviteCode) ? ['Invite code can only contain uppercase letters and numbers'] : []),
      ]
    };
  }
}

export default GroupsService; 