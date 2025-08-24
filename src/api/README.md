# SnapVault API Client System

## 📋 Overview

This API client system provides a clean, organized, and maintainable way to handle all API communications in your React Native app. It follows modern JavaScript patterns and provides a comprehensive solution for authentication, error handling, and service management.

## 🏗️ Architecture

### Core Components

```
src/api/
├── config/
│   └── ApiConfig.js          # Centralized configuration and API routes
├── core/
│   ├── ApiClient.js          # Main HTTP client with interceptors
│   └── TokenManager.js       # Token storage and management
├── services/
│   ├── BaseService.js        # Abstract base class for all services
│   ├── AuthService.js        # Authentication operations
│   ├── UserService.js        # User profile management
│   ├── GroupsService.js      # Group operations
│   └── PhotosService.js      # Photo operations
├── ApiFactory.js             # Service factory and entry point
└── README.md                 # This documentation
```

## 🚀 Getting Started

### 1. Initialize the API Factory

```javascript
import apiFactory from '../api/ApiFactory';

// Initialize on app start
const initializeApp = async () => {
  try {
    const result = await apiFactory.initialize('development');
    console.log('User authenticated:', result.isAuthenticated);
    console.log('User data:', result.userData);
  } catch (error) {
    console.error('Initialization failed:', error);
  }
};
```

### 2. Use Services

```javascript
// Get service instances
const authService = apiFactory.getAuthService();
const userService = apiFactory.getUserService();
const groupsService = apiFactory.getGroupsService();
const photosService = apiFactory.getPhotosService();

// Or use convenience methods
import { getAuthService, getUserService } from '../api/ApiFactory';
const authService = getAuthService();
const userService = getUserService();
```

## 🔧 Configuration

### Environment Setup

```javascript
// Change environment
apiFactory.setEnvironment('production'); // or 'development', 'staging'

// Update configuration
apiFactory.updateConfig({
  timeout: 30000,
  retryAttempts: 5,
});
```

### API Routes

All endpoints are centralized in `ApiConfig.js`:

```javascript
import { API_ROUTES } from '../api/config/ApiConfig';

// Use routes
const loginUrl = API_ROUTES.AUTH.LOGIN; // '/auth/login'
const profileUrl = API_ROUTES.USER.PROFILE; // '/user/profile'
const createGroupUrl = API_ROUTES.GROUPS.CREATE; // '/groups/create'
```

## 🔐 Authentication

### Login

```javascript
const authService = apiFactory.getAuthService();

try {
  const response = await authService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  console.log('Login successful:', response);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Registration

```javascript
const authService = apiFactory.getAuthService();

try {
  const response = await authService.register({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123',
    profilePicture: {
      uri: 'file://path/to/avatar.jpg',
      type: 'image/jpeg',
      name: 'avatar.jpg'
    }
  });
  
  console.log('Registration successful:', response);
  // Note: Registration doesn't return a token, user needs to login after registration
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

**Registration Requirements:**
- `name`: User's full name (required)
- `email`: Valid email address (required, will be converted to lowercase)
- `password`: Password (minimum 6 characters)
- `profilePicture`: Image file (JPEG/PNG, max 10MB)

**Response Format:**
```javascript
{
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    bio: null,
    created_at: "2025-07-25T01:35:34.315Z",
    profile_picture: "/uploads/profile_pictures/uuid.jpg"
  },
  access_token: null, // No token returned on registration
  message: "Registration successful. Please login to continue."
}
```

### Check Authentication Status

```javascript
const authService = apiFactory.getAuthService();

// Check if user is authenticated
const isAuthenticated = authService.isAuthenticated();

// Get current user data
const currentUser = authService.getCurrentUser();

// Get access token
const token = authService.getAccessToken();
```

### Logout

```javascript
// Logout using service
const authService = apiFactory.getAuthService();
await authService.logout();

// Or logout using factory (recommended)
await apiFactory.logout();
```

## 📊 Service Examples

### UserService

```javascript
const userService = apiFactory.getUserService();

// Get user profile
const profile = await userService.getProfile();

// Update user bio
const updatedProfile = await userService.updateBio('My new bio');

// Update user name
const updatedProfile = await userService.updateName('John Updated');

// Update user email
const updatedProfile = await userService.updateEmail({
  email: 'john.updated@example.com',
  password: 'currentPassword'
});

// Delete account
await userService.deleteAccount();
```

### GroupsService

```javascript
const groupsService = apiFactory.getGroupsService();

// Get user's groups
const groups = await groupsService.getMyGroups();

// Create group
const newGroup = await groupsService.createGroup({
  name: 'My New Group',
  description: 'A great group for sharing photos'
});

// Join group
await groupsService.joinGroup({
  invite_code: 'ABC123'
});

// Get group details
const group = await groupsService.getGroup(123);

// Get group members
const members = await groupsService.getGroupMembers(123);

// Leave group
await groupsService.leaveGroup(123);

// Delete group (owner only)
await groupsService.deleteGroup(123);

// Update group
const updatedGroup = await groupsService.updateGroup(123, {
  name: 'Updated Group Name',
  description: 'Updated description'
});
```

### PhotosService

```javascript
const photosService = apiFactory.getPhotosService();

// Upload photo
const uploadResponse = await photosService.uploadPhoto(123, {
  file: {
    uri: 'file://path/to/photo.jpg',
    type: 'image/jpeg',
    name: 'photo.jpg'
  }
});

// Get group photos
const photos = await photosService.getGroupPhotos(123);

// Get photos where user appears
const myPhotos = await photosService.getMyPhotos();

// Get photos where user appears in specific group
const myPhotosInGroup = await photosService.getMyPhotosInGroup(123);

// Get specific photo
const photo = await photosService.getPhoto(456);

// Download photo
const photoFile = await photosService.downloadPhoto(456);

// Upload multiple photos
const photos = [
  { uri: 'file://path/to/photo1.jpg', type: 'image/jpeg', name: 'photo1.jpg' },
  { uri: 'file://path/to/photo2.jpg', type: 'image/jpeg', name: 'photo2.jpg' }
];

const results = await photosService.uploadMultiplePhotos(123, photos, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

## 🔄 Error Handling

### Standard Error Format

All services return standardized error objects:

```javascript
{
  type: 'NETWORK_ERROR' | 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 'VALIDATION_ERROR' | 'NOT_FOUND_ERROR' | 'CONFLICT_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR',
  message: 'Human-readable error message',
  status: 400, // HTTP status code
  data: {...}, // Response data if available
  timestamp: '2023-12-01T10:00:00.000Z',
  originalError: {...} // Original error object
}
```

### Handling Errors

```javascript
try {
  const response = await authService.login(credentials);
  console.log('Login successful:', response);
} catch (error) {
  console.error('Login failed:', error.message);
  
  switch (error.type) {
    case 'AUTHENTICATION_ERROR':
      // Handle auth error
      break;
    case 'NETWORK_ERROR':
      // Handle network error
      break;
    case 'VALIDATION_ERROR':
      // Handle validation error
      break;
    default:
      // Handle other errors
      break;
  }
}
```

## 📱 File Upload

### Single File Upload

```javascript
const photosService = apiFactory.getPhotosService();

const result = await photosService.uploadPhoto(groupId, {
  file: {
    uri: 'file://path/to/photo.jpg',
    type: 'image/jpeg',
    name: 'photo.jpg'
  }
});
```

### Multiple Files Upload

```javascript
const photosService = apiFactory.getPhotosService();

const photos = [
  { uri: 'file://path/to/photo1.jpg', type: 'image/jpeg', name: 'photo1.jpg' },
  { uri: 'file://path/to/photo2.jpg', type: 'image/jpeg', name: 'photo2.jpg' }
];

const results = await photosService.uploadMultiplePhotos(groupId, photos, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

## 🔧 Extending the System

### Adding a New Service

1. **Create the service class**:

```javascript
// src/api/services/NotificationsService.js
import BaseService from './BaseService';
import { API_ROUTES } from '../config/ApiConfig';

class NotificationsService extends BaseService {
  async getNotifications() {
    try {
      const url = this.buildUrl(API_ROUTES.NOTIFICATIONS.LIST);
      const response = await this.authenticatedRequest(() =>
        this.client.get(url)
      );
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get notifications failed', error);
      throw error;
    }
  }
}

export default NotificationsService;
```

2. **Add endpoints to ApiConfig.js**:

```javascript
// In API_ROUTES object
NOTIFICATIONS: {
  LIST: '/notifications',
  MARK_READ: '/notifications/:id/read',
  DELETE: '/notifications/:id',
},
```

3. **Update ApiFactory.js**:

```javascript
import NotificationsService from './services/NotificationsService';

class ApiFactory {
  // ... existing code ...

  getNotificationsService() {
    if (!this.isInitialized) {
      throw new Error('API Factory not initialized. Call initialize() first.');
    }

    if (!this.services.notifications) {
      this.services.notifications = new NotificationsService(this.client, this.config, this.tokenManager);
    }
    return this.services.notifications;
  }

  getAllServices() {
    return {
      auth: this.getAuthService(),
      user: this.getUserService(),
      groups: this.getGroupsService(),
      photos: this.getPhotosService(),
      notifications: this.getNotificationsService(), // Add this
    };
  }
}

// Export convenience method
export const getNotificationsService = () => apiFactory.getNotificationsService();
```

## 🧪 Testing

### Unit Testing Services

```javascript
// __tests__/AuthService.test.js
import { AuthService } from '../src/api/services/AuthService';

describe('AuthService', () => {
  let authService;
  let mockClient;
  let mockTokenManager;

  beforeEach(() => {
    mockClient = {
      post: jest.fn(),
      get: jest.fn(),
    };
    mockTokenManager = {
      storeAuthData: jest.fn(),
      clearTokens: jest.fn(),
    };
    authService = new AuthService(mockClient, mockConfig, mockTokenManager);
  });

  it('should login successfully', async () => {
    const mockResponse = {
      access_token: 'token123',
      user: { id: 1, email: 'test@example.com' }
    };
    mockClient.post.mockResolvedValue(mockResponse);

    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(mockClient.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    expect(mockTokenManager.storeAuthData).toHaveBeenCalledWith(mockResponse);
    expect(result).toEqual(mockResponse);
  });
});
```

## 📱 React Native Integration

### App.js Integration

```javascript
// App.js
import apiFactory from './src/api/ApiFactory';

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await apiFactory.initialize();
      } catch (error) {
        console.error('App initialization failed:', error);
      }
    };

    initializeApp();
  }, []);

  // ... rest of your app
};
```

### Component Usage

```javascript
// In your components
import { getAuthService, getGroupsService } from '../api/ApiFactory';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const authService = getAuthService();
      const response = await authService.login(credentials);
      
      console.log('Login successful:', response);
      // Navigate to dashboard
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

### Redux Integration

```javascript
// store/slices/authSlice.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAuthService } from '../../api/ApiFactory';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const authService = getAuthService();
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);
```

## 🔄 Migration Guide

### From Direct Axios to ApiClient

**Before:**
```javascript
import axios from 'axios';

const loginUser = async (credentials) => {
  const response = await axios.post('http://api.example.com/auth/login', credentials);
  return response.data;
};
```

**After:**
```javascript
import { getAuthService } from '../api/ApiFactory';

const loginUser = async (credentials) => {
  const authService = getAuthService();
  const response = await authService.login(credentials);
  return response;
};
```

## 🎯 Best Practices

### 1. Error Handling
- Always handle errors appropriately
- Use standardized error format
- Provide meaningful error messages
- Log errors for debugging

### 2. Performance
- Use pagination for large datasets
- Implement request caching where appropriate
- Use debouncing for search functions
- Optimize image uploads with compression

### 3. Security
- Never store sensitive data in plain text
- Use HTTPS in production
- Implement proper token refresh logic
- Validate all inputs

### 4. Maintainability
- Follow consistent naming conventions
- Write comprehensive tests
- Document all public methods
- Use TypeScript for better type safety

## 📚 API Reference

### ApiFactory Methods

- `initialize(environment)` - Initialize the API factory
- `getAuthService()` - Get authentication service
- `getUserService()` - Get user service
- `getGroupsService()` - Get groups service
- `getPhotosService()` - Get photos service
- `getAllServices()` - Get all services
- `setEnvironment(environment)` - Set environment
- `updateConfig(config)` - Update configuration
- `logout()` - Logout user and clear data
- `reset()` - Reset factory state

### AuthService Methods

- `login(credentials)` - Login user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `updatePassword(passwordData)` - Update password
- `isAuthenticated()` - Check authentication status
- `getCurrentUser()` - Get current user data
- `getAccessToken()` - Get access token

### UserService Methods

- `getProfile()` - Get user profile
- `updateBio(bio)` - Update user bio
- `updateName(name)` - Update user name
- `updateEmail(emailData)` - Update user email
- `deleteAccount()` - Delete user account

### GroupsService Methods

- `getMyGroups()` - Get user's groups
- `createGroup(groupData)` - Create new group
- `joinGroup(joinData)` - Join group
- `getGroup(groupId)` - Get group details
- `getGroupMembers(groupId)` - Get group members
- `leaveGroup(groupId)` - Leave group
- `deleteGroup(groupId)` - Delete group
- `updateGroup(groupId, groupData)` - Update group

### PhotosService Methods

- `uploadPhoto(groupId, photoData)` - Upload photo
- `getGroupPhotos(groupId)` - Get group photos
- `getMyPhotos()` - Get user's photos
- `getMyPhotosInGroup(groupId)` - Get user's photos in group
- `getPhoto(photoId)` - Get photo details
- `downloadPhoto(photoId)` - Download photo
- `uploadMultiplePhotos(groupId, photos, onProgress)` - Upload multiple photos

---

**Happy coding! 🚀**

For questions or contributions, please reach out to the development team. 