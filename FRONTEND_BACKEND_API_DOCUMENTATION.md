# SnapVault Frontend-Backend API Integration Documentation
Author: Muhammad Waleed

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Client System](#api-client-system)
4. [Authentication Flow](#authentication-flow)
5. [Service Layer](#service-layer)
6. [State Management](#state-management)
7. [Error Handling](#error-handling)
8. [File Upload System](#file-upload-system)
9. [SOLID Principles Implementation](#solid-principles-implementation)
10. [Extension Guide](#extension-guide)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

## Overview

SnapVault is a React Native application that connects to a FastAPI backend through a sophisticated API client system. The frontend uses a layered architecture with proper separation of concerns, implementing SOLID principles and modern JavaScript patterns.

### Key Features
- **Centralized API Management**: Single entry point for all API communications
- **Automatic Token Management**: Bearer token handling with automatic refresh
- **Service-Oriented Architecture**: Modular services for different API domains
- **Error Standardization**: Consistent error handling across the application
- **File Upload Support**: Multi-file upload with progress tracking
- **Redux Integration**: Centralized state management with async actions

## Architecture

### High-Level Architecture
```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   React Native  │ ◄──────────────► │   FastAPI       │
│   Frontend      │                  │   Backend       │
└─────────────────┘                  └─────────────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────┐                  ┌─────────────────┐
│   Redux Store   │                  │   Local         │
│   (State Mgmt)  │                  │   Database      │
└─────────────────┘                  └─────────────────┘
```

### Frontend Architecture Layers
```
┌─────────────────────────────────────────────────────────┐
│                  UI Components                          │
├─────────────────────────────────────────────────────────┤
│                  Redux Store                            │
├─────────────────────────────────────────────────────────┤
│                  Service Layer                          │
├─────────────────────────────────────────────────────────┤
│                  API Client Layer                       │
├─────────────────────────────────────────────────────────┤
│                  Token Manager                          │
└─────────────────────────────────────────────────────────┘
```

## API Client System

### Core Components

#### 1. ApiFactory (Entry Point)
**Location**: `src/api/ApiFactory.js`

The ApiFactory serves as the main entry point for all API communications. It implements the **Singleton Pattern** and **Factory Pattern**.

```javascript
// Singleton instance
const apiFactory = new ApiFactory();

// Initialize the factory
await apiFactory.initialize('development');

// Get service instances
const authService = apiFactory.getAuthService();
const userService = apiFactory.getUserService();
const groupsService = apiFactory.getGroupsService();
const photosService = apiFactory.getPhotosService();
```

**Key Responsibilities**:
- Initialize API configuration and client
- Manage service instances (lazy loading)
- Handle environment switching
- Provide centralized logout functionality

#### 2. ApiClient (HTTP Client)
**Location**: `src/api/core/ApiClient.js`

The ApiClient is built on top of Axios and provides:
- **Request/Response Interceptors**: Automatic token injection and error handling
- **Retry Logic**: Automatic retry for failed requests
- **Progress Tracking**: File upload progress monitoring
- **Error Standardization**: Consistent error format

```javascript
class ApiClient {
  constructor(config, tokenManager) {
    this.config = config;
    this.tokenManager = tokenManager;
    this.instance = null;
    this.initialize();
  }

  setupRequestInterceptors() {
    this.instance.interceptors.request.use(
      async (config) => {
        // Add authorization header if available
        const authHeader = this.tokenManager.getAuthHeader();
        if (authHeader) {
          config.headers.Authorization = authHeader;
        }
        return config;
      }
    );
  }
}
```

#### 3. TokenManager (Authentication)
**Location**: `src/api/core/TokenManager.js`

Handles all authentication-related operations:
- **Token Storage**: Secure storage using AsyncStorage
- **Token Validation**: Expiry checking and automatic cleanup
- **Header Generation**: Bearer token header creation

```javascript
class TokenManager {
  async storeAuthData(authData) {
    const { access_token, user, refresh_token, expires_in } = authData;
    
    // Calculate token expiry
    const expiryDate = expires_in 
      ? new Date(Date.now() + expires_in * 1000)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store in AsyncStorage
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token),
      AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryDate.toISOString()),
    ]);
  }

  getAuthHeader() {
    if (!this.isAuthenticated()) {
      return null;
    }
    // Return just the token without "Bearer " prefix as per API requirements
    return this.accessToken;
  }
}
```

#### 4. ApiConfig (Configuration)
**Location**: `src/api/config/ApiConfig.js`

Centralized configuration management:
- **Environment Management**: Development, staging, production
- **Route Definitions**: All API endpoints in one place
- **HTTP Constants**: Status codes and error types

```javascript
const ENVIRONMENTS = {
  development: {
    baseURL: 'https://c412c62b09de.ngrok-free.app',
    timeout: 10000,
    retryAttempts: 3,
  },
  production: {
    baseURL: 'https://api.snapvault.com',
    timeout: 20000,
    retryAttempts: 5,
  },
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_BIO: '/user/bio/{bio}',
  },
  // ... more routes
};
```

## Authentication Flow

### 1. App Initialization
```javascript
// App.js or index.js
import apiFactory from './src/api/ApiFactory';

const App = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const result = await apiFactory.initialize('development');
        console.log('User authenticated:', result.isAuthenticated);
        console.log('User data:', result.userData);
      } catch (error) {
        console.error('Initialization failed:', error);
      }
    };

    initializeApp();
  }, []);
};
```

### 2. Login Process
```javascript
// Redux Action (authSlice.js)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const authService = getAuthService();
      const response = await authService.login(credentials);
      
      return {
        token: response.access_token,
        user: response.user,
        isAuthenticated: true,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Component Usage
const handleLogin = async () => {
  try {
    const result = await dispatch(loginUser({
      email: email.trim(),
      password: password
    }));
    
    if (loginUser.fulfilled.match(result)) {
      // Login successful - navigation handled by AppNavigator
    } else {
      // Handle error
      Alert.alert('Login Error', result.payload);
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 3. Token Injection
Every API request automatically includes the bearer token:

```javascript
// ApiClient.js - Request Interceptor
setupRequestInterceptors() {
  this.instance.interceptors.request.use(
    async (config) => {
      // Add authorization header if available
      const authHeader = this.tokenManager.getAuthHeader();
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }
      return config;
    }
  );
}
```

### 4. Authentication State Management
```javascript
// AppNavigator.tsx
const AppNavigator = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

## Service Layer

### BaseService (Abstract Base Class)
**Location**: `src/api/services/BaseService.js`

Provides common functionality for all services:
- **URL Building**: Dynamic URL construction with parameters
- **Validation**: Required field validation
- **Response Transformation**: Standardized response format
- **Authentication Checks**: Ensures user is authenticated
- **Error Logging**: Centralized error logging

```javascript
class BaseService {
  constructor(client, config, tokenManager) {
    this.client = client;
    this.config = config;
    this.tokenManager = tokenManager;
  }

  buildUrl(route, params = {}) {
    return buildUrl(this.config.getBaseURL(), route, params);
  }

  validateRequired(data, requiredFields) {
    const missingFields = requiredFields.filter(field => {
      const value = data[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  async authenticatedRequest(requestFn) {
    if (!this.tokenManager.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    return requestFn();
  }
}
```

### Domain-Specific Services

#### AuthService
**Location**: `src/api/services/AuthService.js`

Handles authentication operations:
- **Login**: User authentication with token storage
- **Registration**: New user registration with profile picture
- **Logout**: Session termination and token cleanup
- **Password Management**: Password updates and validation

```javascript
class AuthService extends BaseService {
  async login(credentials) {
    try {
      this.validateRequired(credentials, ['email', 'password']);

      const url = this.buildUrl(API_ROUTES.AUTH.LOGIN);
      const response = await this.client.post(url, credentials);

      // Store authentication data
      await this.tokenManager.storeAuthData(response);

      // Fetch user profile after successful login
      let userData = null;
      try {
        const UserService = (await import('./UserService')).default;
        const userService = new UserService(this.client, this.config, this.tokenManager);
        userData = await userService.getProfile();
        await this.tokenManager.updateUserData(userData);
      } catch (profileError) {
        console.warn('Failed to fetch user profile after login:', profileError);
      }

      return {
        ...this.transformResponse(response),
        user: userData
      };
    } catch (error) {
      this.logError('Login failed', error);
      throw error;
    }
  }
}
```

#### UserService
**Location**: `src/api/services/UserService.js`

Manages user profile operations:
- **Profile Retrieval**: Get current user profile
- **Profile Updates**: Update bio, name, email
- **Account Management**: Account deletion
- **Data Validation**: Input validation for user data

#### GroupsService
**Location**: `src/api/services/GroupsService.js`

Handles group-related operations:
- **Group Management**: Create, join, leave, delete groups
- **Member Management**: Get group members, update access
- **Ownership Transfer**: Transfer group ownership
- **Validation**: Group name, description, invite code validation

#### PhotosService
**Location**: `src/api/services/PhotosService.js`

Manages photo operations:
- **Photo Upload**: Single and multiple photo uploads
- **Photo Retrieval**: Get photos by group or user
- **File Management**: Download photos, URL generation
- **Progress Tracking**: Upload progress monitoring

## State Management

### Redux Store Structure
```javascript
// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import groupsReducer from './slices/groupsSlice';
import photosReducer from './slices/photosSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    photos: photosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
```

### Auth Slice
**Location**: `src/store/slices/authSlice.js`

Manages authentication state:
- **User Data**: Current user information
- **Authentication Status**: Login/logout state
- **Token Management**: Access token storage
- **Loading States**: Async operation states

```javascript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});
```

### Async Actions
All API calls are handled through Redux Toolkit's `createAsyncThunk`:

```javascript
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const authService = getAuthService();
      const response = await authService.login(credentials);
      
      return {
        token: response.access_token,
        user: response.user,
        isAuthenticated: true,
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);
```

## Error Handling

### Standardized Error Format
All errors follow a consistent format:

```javascript
{
  type: 'NETWORK_ERROR' | 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 
        'VALIDATION_ERROR' | 'NOT_FOUND_ERROR' | 'CONFLICT_ERROR' | 
        'SERVER_ERROR' | 'UNKNOWN_ERROR',
  message: 'Human-readable error message',
  status: 400, // HTTP status code
  data: {...}, // Response data if available
  timestamp: '2023-12-01T10:00:00.000Z',
  originalError: {...} // Original error object
}
```

### Error Handling in Services
```javascript
handleApiError(error) {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return this.createError(error, ERROR_TYPES.AUTHENTICATION_ERROR, {
          message: data?.detail || 'Authentication required',
          status,
          data,
        });
      case HTTP_STATUS.FORBIDDEN:
        return this.createError(error, ERROR_TYPES.AUTHORIZATION_ERROR, {
          message: data?.detail || 'Access denied',
          status,
          data,
        });
      // ... more cases
    }
  } else if (error.request) {
    return this.createError(error, ERROR_TYPES.NETWORK_ERROR, {
      message: 'Network error - please check your connection',
    });
  }
}
```

### Component-Level Error Handling
```javascript
const handleLogin = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const result = await dispatch(loginUser(credentials));
    
    if (loginUser.fulfilled.match(result)) {
      // Success handling
    } else {
      setError(result.payload);
    }
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

## File Upload System

### Single File Upload
```javascript
// PhotosService.js
async uploadPhoto(groupId, photoData) {
  try {
    this.validateRequired(photoData, ['file']);

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
```

### Multiple File Upload with Progress
```javascript
// ApiClient.js
async uploadFile(url, formData, onProgress = null, config = {}) {
  try {
    const uploadConfig = {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      } : undefined,
    };

    const response = await this.instance.post(url, formData, uploadConfig);
    return response.data;
  } catch (error) {
    throw error;
  }
}
```

### File Validation
```javascript
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
  const maxSize = 10 * 1024 * 1024;
  if (file.size && file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## SOLID Principles Implementation

### 1. Single Responsibility Principle (SRP)
Each class has a single, well-defined responsibility:
- **ApiClient**: HTTP communication only
- **TokenManager**: Token management only
- **AuthService**: Authentication operations only
- **UserService**: User profile operations only

### 2. Open/Closed Principle (OCP)
The system is open for extension but closed for modification:
- **BaseService**: Extensible base class for new services
- **ApiConfig**: Easy to add new routes without modifying existing code
- **Error Types**: Extensible error type system

### 3. Liskov Substitution Principle (LSP)
All services can be substituted with their base class:
```javascript
// All services extend BaseService
class AuthService extends BaseService { ... }
class UserService extends BaseService { ... }
class GroupsService extends BaseService { ... }
class PhotosService extends BaseService { ... }
```

### 4. Interface Segregation Principle (ISP)
Services are segregated by domain:
- **AuthService**: Authentication operations
- **UserService**: User profile operations
- **GroupsService**: Group operations
- **PhotosService**: Photo operations

### 5. Dependency Inversion Principle (DIP)
High-level modules don't depend on low-level modules:
```javascript
// ApiFactory depends on abstractions, not concrete implementations
class ApiFactory {
  constructor() {
    this.config = null;        // Abstract configuration
    this.client = null;        // Abstract HTTP client
    this.tokenManager = null;  // Abstract token manager
  }
}
```

## Extension Guide

### Adding a New Service

#### 1. Create the Service Class
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

  async markAsRead(notificationId) {
    try {
      const url = this.buildUrl(API_ROUTES.NOTIFICATIONS.MARK_READ, { id: notificationId });
      const response = await this.authenticatedRequest(() =>
        this.client.put(url)
      );
      
      return this.transformResponse(response);
    } catch (error) {
      this.logError('Mark as read failed', error);
      throw error;
    }
  }
}

export default NotificationsService;
```

#### 2. Add Routes to ApiConfig
```javascript
// src/api/config/ApiConfig.js
export const API_ROUTES = {
  // ... existing routes
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/:id/read',
    DELETE: '/notifications/:id',
  },
};
```

#### 3. Update ApiFactory
```javascript
// src/api/ApiFactory.js
import NotificationsService from './services/NotificationsService';

class ApiFactory {
  // ... existing code ...

  getNotificationsService() {
    if (!this.isInitialized) {
      throw new Error('API Factory not initialized. Call initialize() first.');
    }

    if (!this.services.notifications) {
      this.services.notifications = new NotificationsService(
        this.client, 
        this.config, 
        this.tokenManager
      );
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

#### 4. Create Redux Slice
```javascript
// src/store/slices/notificationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNotificationsService } from '../../api/ApiFactory';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const notificationsService = getNotificationsService();
      const response = await notificationsService.getNotifications();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default notificationsSlice.reducer;
```

#### 5. Update Store Configuration
```javascript
// src/store/store.ts
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    groups: groupsReducer,
    photos: photosReducer,
    notifications: notificationsReducer, // Add this
  },
});
```

### Adding New Environment
```javascript
// src/api/config/ApiConfig.js
const ENVIRONMENTS = {
  development: {
    baseURL: 'https://dev-api.snapvault.com',
    timeout: 10000,
    retryAttempts: 3,
  },
  staging: {
    baseURL: 'https://staging-api.snapvault.com',
    timeout: 15000,
    retryAttempts: 3,
  },
  production: {
    baseURL: 'https://api.snapvault.com',
    timeout: 20000,
    retryAttempts: 5,
  },
  testing: {  // New environment
    baseURL: 'https://test-api.snapvault.com',
    timeout: 5000,
    retryAttempts: 1,
  },
};
```

## Best Practices

### 1. Error Handling
- Always use try-catch blocks in async operations
- Provide meaningful error messages
- Log errors for debugging
- Handle network errors gracefully

### 2. Performance
- Use lazy loading for services
- Implement request caching where appropriate
- Use pagination for large datasets
- Optimize image uploads with compression

### 3. Security
- Never store sensitive data in plain text
- Use HTTPS in production
- Implement proper token refresh logic
- Validate all inputs

### 4. Code Organization
- Follow consistent naming conventions
- Use TypeScript for better type safety
- Write comprehensive tests
- Document all public methods

### 5. State Management
- Use Redux Toolkit for async operations
- Keep state normalized
- Avoid storing derived data
- Use selectors for computed values

## Troubleshooting

### Common Issues

#### 1. Token Not Being Sent
**Problem**: API requests failing with 401 errors
**Solution**: Check if TokenManager is properly initialized and tokens are stored

```javascript
// Debug token manager
const tokenManager = apiFactory.getTokenManager();
console.log('Is authenticated:', tokenManager.isAuthenticated());
console.log('Access token:', tokenManager.getAccessToken());
```

#### 2. Network Errors
**Problem**: Requests failing with network errors
**Solution**: Check network connectivity and API base URL

```javascript
// Check API configuration
const config = apiFactory.getConfig();
console.log('Base URL:', config.getBaseURL());
console.log('Timeout:', config.getTimeout());
```

#### 3. File Upload Failures
**Problem**: File uploads failing
**Solution**: Check file format, size, and FormData construction

```javascript
// Validate file before upload
const validation = photosService.validatePhotoFile(file);
if (!validation.isValid) {
  console.error('File validation errors:', validation.errors);
}
```

#### 4. Redux State Issues
**Problem**: State not updating properly
**Solution**: Check Redux DevTools and action dispatching

```javascript
// Debug Redux state
const state = store.getState();
console.log('Auth state:', state.auth);
console.log('Groups state:', state.groups);
```

### Debug Tools

#### 1. API Logging
Enable detailed API logging in development:
```javascript
// ApiClient.js
if (__DEV__) {
  console.log('API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    headers: config.headers,
    data: config.data,
  });
}
```

#### 2. Redux DevTools
Use Redux DevTools for state debugging:
```javascript
// store/store.ts
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
```

#### 3. Network Inspector
Use React Native Debugger or Flipper for network inspection.

---

## Conclusion

The SnapVault frontend-backend API integration provides a robust, scalable, and maintainable solution for handling all API communications. The architecture follows modern best practices and SOLID principles, making it easy to extend and maintain.

Key strengths:
- **Modular Design**: Easy to add new services and features
- **Error Handling**: Comprehensive error management
- **Type Safety**: Consistent data structures
- **Performance**: Optimized for React Native
- **Security**: Proper authentication and authorization
- **Maintainability**: Clean, well-documented code

This documentation serves as a comprehensive guide for understanding, using, and extending the API client system. 