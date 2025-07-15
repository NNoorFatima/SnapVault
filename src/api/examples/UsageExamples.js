/**
 * Usage Examples for SnapVault API Client System
 * 
 * This file demonstrates how to use the new API client system
 * in various scenarios within your React Native app.
 */

import { apiFactory } from '../ApiFactory';
import { useDispatch } from 'react-redux';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  initializeAuth 
} from '../../store/slices/authSlice';
import { fetchUserProfile } from '../../store/slices/profileSlice';
import { fetchGroups } from '../../store/slices/groupsSlice';

// =============================================================================
// 1. APP INITIALIZATION
// =============================================================================

/**
 * Initialize the app with API client
 * Call this in your App.js or main entry point
 */
export const initializeApp = async () => {
  try {
    console.log('🚀 Initializing SnapVault API Client...');
    
    // Initialize API factory
    const { isAuthenticated } = await apiFactory.initialize();
    
    if (isAuthenticated) {
      console.log('✅ User is authenticated');
      
      // Optionally pre-load user data
      const authService = apiFactory.getAuthService();
      const currentUser = await authService.getCurrentUser();
      console.log('Current user:', currentUser);
      
      return { isAuthenticated: true, user: currentUser };
    } else {
      console.log('❌ User not authenticated');
      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    throw error;
  }
};

// =============================================================================
// 2. AUTHENTICATION EXAMPLES
// =============================================================================

/**
 * Login Example - Direct API usage
 */
export const loginExample = async (credentials) => {
  try {
    const authService = apiFactory.getAuthService();
    
    // Validate credentials before sending
    if (!authService.validateEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    
    const response = await authService.login(credentials);
    
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Registration Example with validation
 */
export const registerExample = async (userData) => {
  try {
    const authService = apiFactory.getAuthService();
    
    // Validate email
    if (!authService.validateEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    // Validate password
    const passwordValidation = authService.validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }
    
    const response = await authService.register(userData);
    
    console.log('Registration successful:', response);
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

/**
 * Logout Example
 */
export const logoutExample = async () => {
  try {
    const authService = apiFactory.getAuthService();
    await authService.logout();
    
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
    // Note: Logout should still clear local data even if server call fails
  }
};

// =============================================================================
// 3. PROFILE MANAGEMENT EXAMPLES
// =============================================================================

/**
 * Profile Management Example
 */
export const profileExample = async () => {
  try {
    const profileService = apiFactory.getProfileService();
    
    // Get current profile
    const profile = await profileService.getProfile();
    console.log('Current profile:', profile);
    
    // Update profile
    const updatedProfile = await profileService.updateProfile({
      name: 'John Updated',
      bio: 'Updated bio text'
    });
    console.log('Updated profile:', updatedProfile);
    
    // Upload avatar with progress tracking
    const avatarData = {
      uri: 'file://path/to/avatar.jpg',
      type: 'image/jpeg',
      name: 'avatar.jpg'
    };
    
    const avatarResponse = await profileService.uploadAvatar(
      avatarData,
      (progress) => {
        console.log(`Avatar upload progress: ${progress}%`);
      }
    );
    console.log('Avatar uploaded:', avatarResponse);
    
    return { profile, updatedProfile, avatarResponse };
  } catch (error) {
    console.error('Profile operations failed:', error);
    throw error;
  }
};

// =============================================================================
// 4. GROUP MANAGEMENT EXAMPLES
// =============================================================================

/**
 * Group Management Example
 */
export const groupsExample = async () => {
  try {
    const groupsService = apiFactory.getGroupsService();
    
    // Get user's groups with pagination
    const groups = await groupsService.getMyGroups({
      page: 1,
      limit: 10
    });
    console.log('User groups:', groups);
    
    // Create new group
    const newGroup = await groupsService.createGroup({
      name: 'My Photography Group',
      description: 'A group for sharing amazing photos',
      isPrivate: false
    });
    console.log('New group created:', newGroup);
    
    // Get group details
    const groupDetails = await groupsService.getGroupDetails(newGroup.id);
    console.log('Group details:', groupDetails);
    
    // Search for groups
    const searchResults = await groupsService.searchGroups({
      query: 'photography',
      page: 1,
      limit: 5
    });
    console.log('Search results:', searchResults);
    
    return { groups, newGroup, groupDetails, searchResults };
  } catch (error) {
    console.error('Group operations failed:', error);
    throw error;
  }
};

// =============================================================================
// 5. PHOTO MANAGEMENT EXAMPLES
// =============================================================================

/**
 * Photo Management Example
 */
export const photosExample = async (groupId) => {
  try {
    const photosService = apiFactory.getPhotosService();
    
    // Get group photos
    const photos = await photosService.getGroupPhotos(groupId, {
      page: 1,
      limit: 20
    });
    console.log('Group photos:', photos);
    
    // Upload single photo
    const photoData = {
      uri: 'file://path/to/photo.jpg',
      type: 'image/jpeg',
      name: 'beautiful-sunset.jpg',
      caption: 'Amazing sunset at the beach!'
    };
    
    const uploadResponse = await photosService.uploadPhoto(
      groupId,
      photoData,
      (progress) => {
        console.log(`Photo upload progress: ${progress}%`);
      }
    );
    console.log('Photo uploaded:', uploadResponse);
    
    // Upload multiple photos
    const multiplePhotos = [
      {
        uri: 'file://path/to/photo1.jpg',
        type: 'image/jpeg',
        name: 'photo1.jpg',
        caption: 'First photo'
      },
      {
        uri: 'file://path/to/photo2.jpg',
        type: 'image/jpeg',
        name: 'photo2.jpg',
        caption: 'Second photo'
      }
    ];
    
    const multipleUploadResponse = await photosService.uploadMultiplePhotos(
      groupId,
      multiplePhotos,
      (progress) => {
        console.log(`Multiple photos upload progress: ${progress}%`);
      }
    );
    console.log('Multiple photos uploaded:', multipleUploadResponse);
    
    // Like a photo
    await photosService.toggleLike(uploadResponse.id, true);
    console.log('Photo liked successfully');
    
    // Add comment
    await photosService.addComment(uploadResponse.id, 'Great photo!');
    console.log('Comment added successfully');
    
    return { photos, uploadResponse, multipleUploadResponse };
  } catch (error) {
    console.error('Photo operations failed:', error);
    throw error;
  }
};

// =============================================================================
// 6. REDUX INTEGRATION EXAMPLES
// =============================================================================

/**
 * Redux Integration Example
 * This shows how to use the API client with Redux slices
 */
export const useReduxWithApiClient = () => {
  const dispatch = useDispatch();
  
  const handleLogin = async (credentials) => {
    try {
      // Using Redux action that internally uses API client
      const result = await dispatch(loginUser(credentials)).unwrap();
      console.log('Redux login successful:', result);
      return result;
    } catch (error) {
      console.error('Redux login failed:', error);
      throw error;
    }
  };
  
  const handleRegister = async (userData) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap();
      console.log('Redux registration successful:', result);
      return result;
    } catch (error) {
      console.error('Redux registration failed:', error);
      throw error;
    }
  };
  
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      console.log('Redux logout successful');
    } catch (error) {
      console.error('Redux logout failed:', error);
    }
  };
  
  const loadUserData = async () => {
    try {
      // Initialize auth from storage
      await dispatch(initializeAuth());
      
      // Load user profile
      await dispatch(fetchUserProfile());
      
      // Load user groups
      await dispatch(fetchGroups());
      
      console.log('User data loaded successfully');
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };
  
  return {
    handleLogin,
    handleRegister,
    handleLogout,
    loadUserData
  };
};

// =============================================================================
// 7. ERROR HANDLING EXAMPLES
// =============================================================================

/**
 * Comprehensive Error Handling Example
 */
export const errorHandlingExample = async () => {
  try {
    const authService = apiFactory.getAuthService();
    
    // This will fail with invalid credentials
    await authService.login({
      email: 'invalid@email.com',
      password: 'wrongpassword'
    });
    
  } catch (error) {
    console.error('Caught error:', error);
    
    // Handle different types of errors
    switch (error.type) {
      case 'AUTHENTICATION_ERROR':
        console.log('Authentication failed - check credentials');
        // Show login form with error message
        break;
        
      case 'NETWORK_ERROR':
        console.log('Network error - check connection');
        // Show retry button
        break;
        
      case 'VALIDATION_ERROR':
        console.log('Validation error - check input data');
        // Highlight invalid fields
        break;
        
      case 'SERVER_ERROR':
        console.log('Server error - try again later');
        // Show generic error message
        break;
        
      default:
        console.log('Unknown error occurred');
        break;
    }
    
    // Access error details
    console.log('Error message:', error.message);
    console.log('HTTP status:', error.status);
    console.log('Response data:', error.data);
    console.log('Timestamp:', error.timestamp);
  }
};

// =============================================================================
// 8. CONFIGURATION EXAMPLES
// =============================================================================

/**
 * Configuration Example
 */
export const configurationExample = () => {
  // Change environment
  apiFactory.setEnvironment('production');
  
  // Update configuration
  apiFactory.configure({
    timeout: 30000,
    retryAttempts: 5,
    baseURL: 'https://api.myapp.com/v1'
  });
  
  // Get current configuration
  const config = apiFactory.getConfig();
  console.log('Current config:', config.getConfig());
  
  // Health check
  const performHealthCheck = async () => {
    try {
      const health = await apiFactory.healthCheck();
      console.log('Health check:', health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };
  
  performHealthCheck();
};

// =============================================================================
// 9. REACT NATIVE COMPONENT EXAMPLES
// =============================================================================

/**
 * React Native Component Example
 */
export const LoginScreenExample = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authService = apiFactory.getAuthService();
      const response = await authService.login(credentials);
      
      console.log('Login successful:', response);
      // Navigate to dashboard
      
    } catch (error) {
      setError(error.message);
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    credentials,
    setCredentials,
    loading,
    error,
    handleLogin
  };
};

// =============================================================================
// 10. TESTING EXAMPLES
// =============================================================================

/**
 * Testing Example
 */
export const testingExample = () => {
  // Mock API factory for testing
  const mockApiFactory = {
    getAuthService: jest.fn(() => ({
      login: jest.fn().mockResolvedValue({
        access_token: 'mock-token',
        user: { id: 1, email: 'test@example.com' }
      }),
      logout: jest.fn().mockResolvedValue({ success: true })
    }))
  };
  
  // Test function
  const testLogin = async () => {
    const authService = mockApiFactory.getAuthService();
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(result).toEqual({
      access_token: 'mock-token',
      user: { id: 1, email: 'test@example.com' }
    });
  };
  
  return { mockApiFactory, testLogin };
};

// =============================================================================
// 11. PERFORMANCE OPTIMIZATION EXAMPLES
// =============================================================================

/**
 * Performance Optimization Example
 */
export const performanceExample = () => {
  const profileService = apiFactory.getProfileService();
  
  // Debounced search
  const debouncedSearch = debounce(async (query) => {
    try {
      const groupsService = apiFactory.getGroupsService();
      const results = await groupsService.searchGroups({ query });
      console.log('Search results:', results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, 300);
  
  // Cached profile fetch
  let profileCache = null;
  let profileCacheTime = 0;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  const getCachedProfile = async () => {
    const now = Date.now();
    
    if (profileCache && (now - profileCacheTime) < CACHE_DURATION) {
      console.log('Returning cached profile');
      return profileCache;
    }
    
    console.log('Fetching fresh profile');
    profileCache = await profileService.getProfile();
    profileCacheTime = now;
    
    return profileCache;
  };
  
  return { debouncedSearch, getCachedProfile };
};

// Helper function for debouncing
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// =============================================================================
// 12. COMPLETE WORKFLOW EXAMPLE
// =============================================================================

/**
 * Complete Workflow Example
 * This demonstrates a complete user workflow using the API client
 */
export const completeWorkflowExample = async () => {
  try {
    console.log('🚀 Starting complete workflow example...');
    
    // 1. Initialize app
    const initResult = await initializeApp();
    console.log('✅ App initialized:', initResult);
    
    // 2. If not authenticated, register/login
    if (!initResult.isAuthenticated) {
      // Register new user
      await registerExample({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecurePassword123!'
      });
      
      // Login
      await loginExample({
        email: 'john.doe@example.com',
        password: 'SecurePassword123!'
      });
    }
    
    // 3. Load user profile
    const profileResult = await profileExample();
    console.log('✅ Profile loaded:', profileResult);
    
    // 4. Create and manage groups
    const groupsResult = await groupsExample();
    console.log('✅ Groups managed:', groupsResult);
    
    // 5. Upload and manage photos
    const photosResult = await photosExample(groupsResult.newGroup.id);
    console.log('✅ Photos managed:', photosResult);
    
    // 6. Perform health check
    const health = await apiFactory.healthCheck();
    console.log('✅ Health check:', health);
    
    console.log('🎉 Complete workflow finished successfully!');
    
  } catch (error) {
    console.error('❌ Workflow failed:', error);
    throw error;
  }
};

// Export all examples
export default {
  initializeApp,
  loginExample,
  registerExample,
  logoutExample,
  profileExample,
  groupsExample,
  photosExample,
  useReduxWithApiClient,
  errorHandlingExample,
  configurationExample,
  LoginScreenExample,
  testingExample,
  performanceExample,
  completeWorkflowExample
}; 