# SnapVault API Client System

## 📋 Overview

This API client system is built following **SOLID principles** and provides a comprehensive, extensible, and maintainable way to handle all API communications in your React Native app.

## 🏗️ Architecture

### SOLID Principles Applied

1. **Single Responsibility**: Each class has one clear responsibility
2. **Open/Closed**: Easy to extend with new features without modifying existing code
3. **Liskov Substitution**: Services can be swapped with different implementations
4. **Interface Segregation**: Separate interfaces for different concerns
5. **Dependency Inversion**: High-level modules don't depend on low-level modules

### Core Components

```
src/api/
├── config/
│   └── ApiConfig.js          # Centralized configuration
├── core/
│   ├── ApiClient.js          # Main HTTP client with interceptors
│   └── TokenManager.js       # Token storage and management
├── services/
│   ├── BaseService.js        # Abstract base class for all services
│   ├── AuthService.js        # Authentication operations
│   ├── ProfileService.js     # Profile management
│   ├── GroupsService.js      # Group operations
│   └── PhotosService.js      # Photo operations
├── ApiFactory.js             # Service factory and entry point
└── README.md                 # This documentation
```

## 🚀 Getting Started

### Basic Usage

```javascript
import { apiFactory } from '../api/ApiFactory';

// Initialize on app start
const initializeApp = async () => {
  try {
    const { isAuthenticated } = await apiFactory.initialize();
    console.log('User authenticated:', isAuthenticated);
  } catch (error) {
    console.error('Initialization failed:', error);
  }
};

// Use services
const authService = apiFactory.getAuthService();
const profileService = apiFactory.getProfileService();
const groupsService = apiFactory.getGroupsService();
const photosService = apiFactory.getPhotosService();
```

### In Redux Slices

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiFactory } from '../../api/ApiFactory';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const authService = apiFactory.getAuthService();
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);
```

## 🔧 Configuration

### Environment Setup

```javascript
// Change environment
apiFactory.setEnvironment('production'); // or 'development', 'staging'

// Update configuration
apiFactory.configure({
  timeout: 30000,
  retryAttempts: 5,
});
```

### API Endpoints

All endpoints are centralized in `ApiConfig.js`:

```javascript
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  PROFILE: {
    ME: '/profile/me',
    UPDATE: '/profile/update',
    AVATAR: '/profile/avatar',
    // ... more endpoints
  },
  // ... other categories
};
```

## 🔐 Authentication

### Token Management

The system automatically handles:
- Token storage and retrieval
- Token expiration checks
- Automatic token refresh
- Bearer token injection in requests

```javascript
const authService = apiFactory.getAuthService();

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Check authentication
const isAuthenticated = await authService.isAuthenticated();

// Get current user
const currentUser = await authService.getCurrentUser();

// Logout
await authService.logout();
```

## 📊 Service Examples

### AuthService

```javascript
const authService = apiFactory.getAuthService();

// Login
const loginResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const registerResponse = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securePassword123'
});

// Forgot password
await authService.forgotPassword({
  email: 'user@example.com'
});

// Reset password
await authService.resetPassword({
  token: 'reset-token',
  password: 'newPassword123',
  confirmPassword: 'newPassword123'
});
```

### ProfileService

```javascript
const profileService = apiFactory.getProfileService();

// Get profile
const profile = await profileService.getProfile();

// Update profile
const updatedProfile = await profileService.updateProfile({
  name: 'John Updated',
  email: 'john.updated@example.com'
});

// Upload avatar
const avatarResponse = await profileService.uploadAvatar({
  uri: 'file://path/to/image.jpg',
  type: 'image/jpeg',
  name: 'avatar.jpg'
}, (progress) => {
  console.log('Upload progress:', progress);
});
```

### GroupsService

```javascript
const groupsService = apiFactory.getGroupsService();

// Get user's groups
const groups = await groupsService.getMyGroups({
  page: 1,
  limit: 20
});

// Create group
const newGroup = await groupsService.createGroup({
  name: 'My New Group',
  description: 'A great group for sharing photos',
  isPrivate: false
});

// Join group
await groupsService.joinGroup({
  groupId: 'group-123',
  inviteCode: 'ABC123'
});
```

### PhotosService

```javascript
const photosService = apiFactory.getPhotosService();

// Get group photos
const photos = await photosService.getGroupPhotos('group-123', {
  page: 1,
  limit: 20
});

// Upload photo
const uploadResponse = await photosService.uploadPhoto('group-123', {
  uri: 'file://path/to/photo.jpg',
  type: 'image/jpeg',
  name: 'photo.jpg',
  caption: 'Beautiful sunset!'
}, (progress) => {
  console.log('Upload progress:', progress);
});

// Like photo
await photosService.toggleLike('photo-123', true);
```

## 🔄 Error Handling

### Standard Error Format

All services return standardized error objects:

```javascript
{
  type: 'NETWORK_ERROR' | 'AUTHENTICATION_ERROR' | 'VALIDATION_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR',
  message: 'Human-readable error message',
  status: 400, // HTTP status code
  data: {...}, // Response data if available
  timestamp: '2023-12-01T10:00:00.000Z'
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
const profileService = apiFactory.getProfileService();

const result = await profileService.uploadAvatar({
  uri: 'file://path/to/avatar.jpg',
  type: 'image/jpeg',
  name: 'avatar.jpg'
}, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

### Multiple Files Upload

```javascript
const photosService = apiFactory.getPhotosService();

const photos = [
  { uri: 'file://path/to/photo1.jpg', type: 'image/jpeg', name: 'photo1.jpg' },
  { uri: 'file://path/to/photo2.jpg', type: 'image/jpeg', name: 'photo2.jpg' }
];

const result = await photosService.uploadMultiplePhotos('group-123', photos, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

## 🔧 Extending the System

### Adding a New Service

1. **Create the service class**:

```javascript
// src/api/services/NotificationsService.js
import BaseService from './BaseService';

class NotificationsService extends BaseService {
  /**
   * Get user notifications
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Notifications
   */
  async getNotifications(options = {}) {
    try {
      const url = this.buildUrl('NOTIFICATIONS', 'LIST');
      const config = {
        params: {
          page: options.page || 1,
          limit: options.limit || 20,
        }
      };
      
      const response = await this.get(url, config);
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Get notifications failed', error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   * @returns {Promise<Object>} Response
   */
  async markAsRead(notificationId) {
    try {
      this.validateRequired({ notificationId }, ['notificationId']);
      
      const url = this.buildUrl('NOTIFICATIONS', 'MARK_READ', { id: notificationId });
      const response = await this.put(url);
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Mark as read failed', error);
      throw error;
    }
  }
}

export const notificationsService = new NotificationsService();
export { NotificationsService };
```

2. **Add endpoints to ApiConfig.js**:

```javascript
// In API_ENDPOINTS object
NOTIFICATIONS: {
  LIST: '/notifications',
  MARK_READ: '/notifications/:id/read',
  MARK_ALL_READ: '/notifications/read-all',
  DELETE: '/notifications/:id',
},
```

3. **Update ApiFactory.js**:

```javascript
import { NotificationsService } from './services/NotificationsService';

class ApiFactory {
  // ... existing code ...

  /**
   * Get or create NotificationsService instance
   * @returns {NotificationsService} Notifications service instance
   */
  getNotificationsService() {
    if (!this.services.notifications) {
      this.services.notifications = new NotificationsService(this.client, this.config);
    }
    return this.services.notifications;
  }

  getAllServices() {
    return {
      auth: this.getAuthService(),
      profile: this.getProfileService(),
      groups: this.getGroupsService(),
      photos: this.getPhotosService(),
      notifications: this.getNotificationsService(), // Add this
    };
  }
}

// Export convenience method
export const getNotificationsService = apiFactory.getNotificationsService.bind(apiFactory);
```

### Adding Request/Response Interceptors

```javascript
// In ApiClient.js
setupRequestInterceptors() {
  this.instance.interceptors.request.use(
    async (config) => {
      // Add custom headers
      config.headers['X-Client-Version'] = '1.0.0';
      config.headers['X-Platform'] = 'mobile';
      
      // Add authorization header
      const authHeader = await this.tokenManager.getAuthHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}
```

### Custom Error Handling

```javascript
// In BaseService.js or specific service
handleServiceError(error) {
  if (error.status === 429) {
    // Rate limiting
    return this.handleRateLimit(error);
  }
  
  if (error.status === 503) {
    // Service unavailable
    return this.handleServiceUnavailable(error);
  }
  
  throw error;
}
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
      clearAll: jest.fn(),
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

    expect(mockClient.post).toHaveBeenCalledWith('/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    expect(mockTokenManager.storeAuthData).toHaveBeenCalledWith(mockResponse);
    expect(result).toEqual(mockResponse);
  });
});
```

### Integration Testing

```javascript
// __tests__/ApiFactory.test.js
import { apiFactory } from '../src/api/ApiFactory';

describe('ApiFactory', () => {
  it('should initialize successfully', async () => {
    const result = await apiFactory.initialize();
    expect(result).toHaveProperty('isAuthenticated');
  });

  it('should provide all services', () => {
    const services = apiFactory.getAllServices();
    expect(services).toHaveProperty('auth');
    expect(services).toHaveProperty('profile');
    expect(services).toHaveProperty('groups');
    expect(services).toHaveProperty('photos');
  });
});
```

## 🔧 Environment Configuration

### Development

```javascript
// src/api/config/ApiConfig.js
const ENVIRONMENTS = {
  development: {
    baseURL: 'http://localhost:3000/api',
    timeout: 10000,
    retryAttempts: 3,
  },
  // ... other environments
};
```

### Production

```javascript
const ENVIRONMENTS = {
  production: {
    baseURL: 'https://api.yourdomain.com/api',
    timeout: 20000,
    retryAttempts: 5,
  },
  // ... other environments
};
```

## 📱 React Native Integration

### App.js Integration

```javascript
// App.js
import { apiFactory } from './src/api/ApiFactory';

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
import { apiFactory } from '../api/ApiFactory';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const authService = apiFactory.getAuthService();
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

## 🔄 Migration Guide

### From Direct Axios to ApiClient

**Before:**
```javascript
import axios from 'axios';

const loginUser = async (credentials) => {
  const response = await axios.post('http://api.example.com/login', credentials);
  return response.data;
};
```

**After:**
```javascript
import { apiFactory } from '../api/ApiFactory';

const loginUser = async (credentials) => {
  const authService = apiFactory.getAuthService();
  const response = await authService.login(credentials);
  return response;
};
```

## 🚀 Performance Optimization

### Request Caching

```javascript
// In BaseService.js
class BaseService {
  constructor(client, config) {
    super(client, config);
    this.cache = new Map();
  }

  async getCached(key, fetcher, ttl = 300000) { // 5 minutes
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }
}
```

### Request Debouncing

```javascript
// In service methods
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Usage
this.debouncedSearch = debounce(this.searchGroups.bind(this), 300);
```

## 📊 Monitoring and Analytics

### Request Logging

```javascript
// In ApiClient.js
setupRequestInterceptors() {
  this.instance.interceptors.request.use(
    async (config) => {
      // Log request
      if (__DEV__) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          headers: config.headers,
          data: config.data,
        });
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}
```

### Analytics Integration

```javascript
// In BaseService.js
async post(url, data = {}, config = {}) {
  const startTime = Date.now();
  
  try {
    const response = await this.client.post(url, data, config);
    
    // Track successful request
    this.trackApiCall(url, 'POST', Date.now() - startTime, 'success');
    
    return response;
  } catch (error) {
    // Track failed request
    this.trackApiCall(url, 'POST', Date.now() - startTime, 'error', error);
    throw error;
  }
}

trackApiCall(url, method, duration, status, error = null) {
  // Send to analytics service
  analytics.track('api_call', {
    url,
    method,
    duration,
    status,
    error: error?.message,
    timestamp: Date.now(),
  });
}
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
- Follow SOLID principles
- Write comprehensive tests
- Document all public methods
- Use consistent naming conventions

## 📚 Further Reading

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [React Native Networking](https://reactnative.dev/docs/network)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

**Happy coding! 🚀**

For questions or contributions, please reach out to the development team. 