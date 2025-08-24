/**
 * API Usage Examples
 * Comprehensive examples of how to use the new API client system
 */

import apiFactory, { 
  getAuthService, 
  getUserService, 
  getGroupsService, 
  getPhotosService 
} from '../ApiFactory';

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the API factory on app start
 */
export const initializeApi = async () => {
  try {
    const result = await apiFactory.initialize('development');
    
    console.log('API Factory initialized:', {
      isAuthenticated: result.isAuthenticated,
      environment: result.environment,
      userData: result.userData
    });
    
    return result;
  } catch (error) {
    console.error('Failed to initialize API:', error);
    throw error;
  }
};

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  try {
    const authService = getAuthService();
    
    const response = await authService.login({
      email: email,
      password: password
    });
    
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
};

/**
 * Register new user
 */
export const registerUser = async (userData) => {
  try {
    const authService = getAuthService();
    
    const response = await authService.register({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profilePicture: {
        uri: userData.profilePicture.uri,
        type: 'image/jpeg',
        name: 'profile.jpg'
      }
    });
    
    console.log('Registration successful:', response);
    return response;
  } catch (error) {
    console.error('Registration failed:', error.message);
    throw error;
  }
};

/**
 * Update user password
 */
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const authService = getAuthService();
    
    const response = await authService.updatePassword({
      current_password: currentPassword,
      new_password: newPassword
    });
    
    console.log('Password updated successfully');
    return response;
  } catch (error) {
    console.error('Password update failed:', error.message);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    await apiFactory.logout();
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error.message);
    throw error;
  }
};

// ============================================================================
// USER PROFILE EXAMPLES
// ============================================================================

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  try {
    const userService = getUserService();
    
    const profile = await userService.getProfile();
    console.log('User profile:', profile);
    return profile;
  } catch (error) {
    console.error('Failed to get profile:', error.message);
    throw error;
  }
};

/**
 * Update user bio
 */
export const updateUserBio = async (bio) => {
  try {
    const userService = getUserService();
    
    const updatedProfile = await userService.updateBio(bio);
    console.log('Bio updated successfully:', updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update bio:', error.message);
    throw error;
  }
};

/**
 * Update user name
 */
export const updateUserName = async (name) => {
  try {
    const userService = getUserService();
    
    const updatedProfile = await userService.updateName(name);
    console.log('Name updated successfully:', updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update name:', error.message);
    throw error;
  }
};

/**
 * Update user email
 */
export const updateUserEmail = async (email, password) => {
  try {
    const userService = getUserService();
    
    const updatedProfile = await userService.updateEmail({
      email: email,
      password: password
    });
    
    console.log('Email updated successfully:', updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error('Failed to update email:', error.message);
    throw error;
  }
};

/**
 * Delete user account
 */
export const deleteUserAccount = async () => {
  try {
    const userService = getUserService();
    
    await userService.deleteAccount();
    console.log('Account deleted successfully');
  } catch (error) {
    console.error('Failed to delete account:', error.message);
    throw error;
  }
};

// ============================================================================
// GROUPS EXAMPLES
// ============================================================================

/**
 * Get user's groups
 */
export const getUserGroups = async () => {
  try {
    const groupsService = getGroupsService();
    
    const groups = await groupsService.getMyGroups();
    console.log('User groups:', groups);
    return groups;
  } catch (error) {
    console.error('Failed to get groups:', error.message);
    throw error;
  }
};

/**
 * Create new group
 */
export const createGroup = async (name, description) => {
  try {
    const groupsService = getGroupsService();
    
    const newGroup = await groupsService.createGroup({
      name: name,
      description: description
    });
    
    console.log('Group created successfully:', newGroup);
    return newGroup;
  } catch (error) {
    console.error('Failed to create group:', error.message);
    throw error;
  }
};

/**
 * Join group with invite code
 */
export const joinGroup = async (inviteCode) => {
  try {
    const groupsService = getGroupsService();
    
    const response = await groupsService.joinGroup({
      invite_code: inviteCode
    });
    
    console.log('Joined group successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to join group:', error.message);
    throw error;
  }
};

/**
 * Get group details
 */
export const getGroupDetails = async (groupId) => {
  try {
    const groupsService = getGroupsService();
    
    const group = await groupsService.getGroup(groupId);
    console.log('Group details:', group);
    return group;
  } catch (error) {
    console.error('Failed to get group details:', error.message);
    throw error;
  }
};

/**
 * Get group members
 */
export const getGroupMembers = async (groupId) => {
  try {
    const groupsService = getGroupsService();
    
    const members = await groupsService.getGroupMembers(groupId);
    console.log('Group members:', members);
    return members;
    } catch (error) {
    console.error('Failed to get group members:', error.message);
      throw error;
    }
  };
  
/**
 * Leave group
 */
export const leaveGroup = async (groupId) => {
  try {
    const groupsService = getGroupsService();
    
    const response = await groupsService.leaveGroup(groupId);
    console.log('Left group successfully:', response);
    return response;
    } catch (error) {
    console.error('Failed to leave group:', error.message);
      throw error;
    }
  };
  
/**
 * Delete group (owner only)
 */
export const deleteGroup = async (groupId) => {
  try {
    const groupsService = getGroupsService();
    
    const response = await groupsService.deleteGroup(groupId);
    console.log('Group deleted successfully:', response);
    return response;
    } catch (error) {
    console.error('Failed to delete group:', error.message);
    throw error;
  }
};

/**
 * Update group information
 */
export const updateGroup = async (groupId, updates) => {
  try {
    const groupsService = getGroupsService();
    
    const updatedGroup = await groupsService.updateGroup(groupId, updates);
    console.log('Group updated successfully:', updatedGroup);
    return updatedGroup;
    } catch (error) {
    console.error('Failed to update group:', error.message);
    throw error;
  }
};

// ============================================================================
// PHOTOS EXAMPLES
// ============================================================================

/**
 * Upload photo to group
 */
export const uploadPhoto = async (groupId, photoFile) => {
  try {
    const photosService = getPhotosService();
    
    const response = await photosService.uploadPhoto(groupId, {
      file: {
        uri: photoFile.uri,
        type: photoFile.type || 'image/jpeg',
        name: photoFile.name || 'photo.jpg'
      }
    });
    
    console.log('Photo uploaded successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to upload photo:', error.message);
    throw error;
  }
};

/**
 * Get group photos
 */
export const getGroupPhotos = async (groupId) => {
  try {
    const photosService = getPhotosService();
    
    const photos = await photosService.getGroupPhotos(groupId);
    console.log('Group photos:', photos);
    return photos;
  } catch (error) {
    console.error('Failed to get group photos:', error.message);
    throw error;
  }
};

/**
 * Get photos where user appears
 */
export const getMyPhotos = async () => {
  try {
    const photosService = getPhotosService();
    
    const photos = await photosService.getMyPhotos();
    console.log('My photos:', photos);
    return photos;
  } catch (error) {
    console.error('Failed to get my photos:', error.message);
    throw error;
  }
};

/**
 * Get photos where user appears in specific group
 */
export const getMyPhotosInGroup = async (groupId) => {
  try {
    const photosService = getPhotosService();
    
    const photos = await photosService.getMyPhotosInGroup(groupId);
    console.log('My photos in group:', photos);
    return photos;
  } catch (error) {
    console.error('Failed to get my photos in group:', error.message);
    throw error;
  }
};

/**
 * Get specific photo details
 */
export const getPhotoDetails = async (photoId) => {
  try {
    const photosService = getPhotosService();
    
    const photo = await photosService.getPhoto(photoId);
    console.log('Photo details:', photo);
    return photo;
    } catch (error) {
    console.error('Failed to get photo details:', error.message);
    throw error;
  }
};

/**
 * Download photo
 */
export const downloadPhoto = async (photoId) => {
  try {
    const photosService = getPhotosService();
    
    const photoFile = await photosService.downloadPhoto(photoId);
    console.log('Photo downloaded successfully');
    return photoFile;
  } catch (error) {
    console.error('Failed to download photo:', error.message);
    throw error;
  }
};

/**
 * Upload multiple photos
 */
export const uploadMultiplePhotos = async (groupId, photoFiles) => {
  try {
    const photosService = getPhotosService();
    
    const results = await photosService.uploadMultiplePhotos(
      groupId, 
      photoFiles, 
      (progress) => {
        console.log(`Upload progress: ${progress}%`);
      }
    );
    
    console.log('Multiple photos uploaded successfully:', results);
    return results;
    } catch (error) {
    console.error('Failed to upload multiple photos:', error.message);
    throw error;
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if user is authenticated
 */
export const checkAuthentication = () => {
  const authService = getAuthService();
  return authService.isAuthenticated();
};

/**
 * Get current user data
 */
export const getCurrentUser = () => {
  const authService = getAuthService();
  return authService.getCurrentUser();
};

/**
 * Change API environment
 */
export const changeEnvironment = (environment) => {
  apiFactory.setEnvironment(environment);
  console.log(`Environment changed to: ${environment}`);
};

/**
 * Update API configuration
 */
export const updateApiConfig = (config) => {
  apiFactory.updateConfig(config);
  console.log('API configuration updated:', config);
};

/**
 * Reset API factory
 */
export const resetApiFactory = async () => {
  try {
    await apiFactory.reset();
    console.log('API factory reset successfully');
  } catch (error) {
    console.error('Failed to reset API factory:', error.message);
    throw error;
  }
};

// ============================================================================
// ERROR HANDLING EXAMPLES
// ============================================================================

/**
 * Example of comprehensive error handling
 */
export const handleApiError = (error) => {
  switch (error.type) {
    case 'AUTHENTICATION_ERROR':
      console.log('Authentication error - redirect to login');
      // Redirect to login screen
      break;
      
    case 'AUTHORIZATION_ERROR':
      console.log('Authorization error - user lacks permission');
      // Show permission denied message
      break;
      
    case 'NETWORK_ERROR':
      console.log('Network error - check connection');
      // Show network error message
      break;
      
    case 'VALIDATION_ERROR':
      console.log('Validation error - check input data');
      // Show validation error message
      break;
      
    case 'NOT_FOUND_ERROR':
      console.log('Resource not found');
      // Show not found message
      break;
      
    case 'CONFLICT_ERROR':
      console.log('Resource conflict');
      // Show conflict message
      break;
      
    case 'SERVER_ERROR':
      console.log('Server error - try again later');
      // Show server error message
      break;
      
    default:
      console.log('Unknown error occurred');
      // Show generic error message
      break;
  }
};

// ============================================================================
// COMPLETE WORKFLOW EXAMPLES
// ============================================================================

/**
 * Complete user registration workflow
 */
export const completeRegistrationWorkflow = async (userData) => {
  try {
    // 1. Register user
    const registrationResult = await registerUser(userData);
    
    // 2. Create a default group
    const group = await createGroup('My First Group', 'Welcome to SnapVault!');
    
    // 3. Get user profile
    const profile = await getUserProfile();
    
    console.log('Registration workflow completed:', {
      user: registrationResult,
      group: group,
      profile: profile
    });
    
    return { registrationResult, group, profile };
  } catch (error) {
    console.error('Registration workflow failed:', error.message);
    throw error;
  }
};

/**
 * Complete photo sharing workflow
 */
export const completePhotoSharingWorkflow = async (groupId, photoFiles) => {
  try {
    // 1. Upload photos
    const uploadResults = await uploadMultiplePhotos(groupId, photoFiles);
    
    // 2. Get updated group photos
    const groupPhotos = await getGroupPhotos(groupId);
    
    // 3. Get photos where user appears
    const myPhotos = await getMyPhotos();
    
    console.log('Photo sharing workflow completed:', {
      uploaded: uploadResults,
      groupPhotos: groupPhotos,
      myPhotos: myPhotos
    });
    
    return { uploadResults, groupPhotos, myPhotos };
  } catch (error) {
    console.error('Photo sharing workflow failed:', error.message);
    throw error;
  }
};

export default {
  // Initialization
  initializeApi,
  
  // Authentication
  loginUser,
  registerUser,
  updatePassword,
  logoutUser,
  
  // User Profile
  getUserProfile,
  updateUserBio,
  updateUserName,
  updateUserEmail,
  deleteUserAccount,
  
  // Groups
  getUserGroups,
  createGroup,
  joinGroup,
  getGroupDetails,
  getGroupMembers,
  leaveGroup,
  deleteGroup,
  updateGroup,
  
  // Photos
  uploadPhoto,
  getGroupPhotos,
  getMyPhotos,
  getMyPhotosInGroup,
  getPhotoDetails,
  downloadPhoto,
  uploadMultiplePhotos,
  
  // Utilities
  checkAuthentication,
  getCurrentUser,
  changeEnvironment,
  updateApiConfig,
  resetApiFactory,
  
  // Error Handling
  handleApiError,
  
  // Workflows
  completeRegistrationWorkflow,
  completePhotoSharingWorkflow
}; 