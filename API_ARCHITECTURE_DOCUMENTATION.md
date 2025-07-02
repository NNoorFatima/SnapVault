# API Architecture Documentation

## Overview

This document provides comprehensive documentation for the new API architecture implemented in the SnapVault project. The architecture follows SOLID principles and professional practices to ensure maintainable, scalable, and robust API communication.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [SOLID Principles Implementation](#solid-principles-implementation)
3. [File Structure](#file-structure)
4. [Configuration](#configuration)
5. [API Client](#api-client)
6. [Interceptors](#interceptors)
7. [Services](#services)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Usage Examples](#usage-examples)
11. [Best Practices](#best-practices)
12. [Migration Guide](#migration-guide)

## Architecture Overview

The new API architecture is built with the following key components:

- **Configuration Layer**: Centralized configuration management
- **Client Layer**: HTTP client with interceptors
- **Service Layer**: Business logic services following SOLID principles
- **Type Layer**: Type definitions and data structures
- **Interceptor Layer**: Request/response transformation and error handling

### Key Features

- ✅ **SOLID Principles**: All components follow SOLID design principles
- ✅ **Error Handling**: Comprehensive error handling with retry logic
- ✅ **Request Queue**: Prevents duplicate requests and manages concurrency
- ✅ **Logging**: Detailed logging for debugging and monitoring
- ✅ **Type Safety**: Strong typing with JSDoc documentation
- ✅ **Modular Design**: Easy to extend and maintain
- ✅ **Mock API Integration**: Uses DummyJSON for testing

## SOLID Principles Implementation

### 1. Single Responsibility Principle (SRP)

Each class and module has a single, well-defined responsibility:

- `BaseService`: Handles common service functionality
- `UserService`: Manages user-related API operations
- `ProductService`: Manages product-related API operations
- `AuthService`: Manages authentication operations
- `ItemService`: Manages item-related operations

### 2. Open/Closed Principle (OCP)

The architecture is open for extension but closed for modification:

- New services can be added by extending `BaseService`
- New endpoints can be added to `API_ENDPOINTS` without modifying existing code
- New interceptors can be added without changing existing ones

### 3. Liskov Substitution Principle (LSP)

All service classes can be substituted for their base class:

```javascript
// All services can be used interchangeably
const services = [userService, productService, authService, itemService];
services.forEach(service => {
  // All services have the same interface
  service.executeRequest(() => service.client.get('/test'));
});
```

### 4. Interface Segregation Principle (ISP)

Interfaces are specific to client needs:

- `RequestConfig`: Only includes necessary request configuration
- `ApiResponse`: Standardized response format
- `ApiError`: Comprehensive error information

### 5. Dependency Inversion Principle (DIP)

High-level modules don't depend on low-level modules:

- Services depend on abstractions (HTTP client interface)
- Configuration is injected rather than hardcoded
- Dependencies are managed through the service factory

## File Structure

```
src/
├── api/
│   ├── config.js          # API configuration and endpoints
│   ├── types.js           # Type definitions and data structures
│   ├── interceptors.js    # Request/response interceptors
│   ├── client.js          # HTTP client implementation
│   └── index.js           # Main API exports
├── services/
│   ├── baseService.js     # Base service class
│   ├── userService.js     # User-specific service
│   ├── productService.js  # Product-specific service
│   ├── authService.js     # Authentication service
│   ├── itemService.js     # Item-specific service
│   └── index.js           # Service factory and exports
└── screens/
    └── ApiTest/
        └── ApiTestScreen.js # API testing interface
```

## Configuration

### API Configuration (`src/api/config.js`)

The configuration layer provides environment-based settings:

```javascript
const ENV = {
  development: {
    API_BASE_URL: 'https://dummyjson.com',
    API_TIMEOUT: 10000,
    API_RETRY_ATTEMPTS: 3,
    API_RETRY_DELAY: 1000,
  },
  production: {
    API_BASE_URL: 'https://your-production-api.com',
    API_TIMEOUT: 15000,
    API_RETRY_ATTEMPTS: 2,
    API_RETRY_DELAY: 2000,
  },
};
```

### API Endpoints

Centralized endpoint management:

```javascript
export const API_ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
  // ... more endpoints
};
```

## API Client

### HTTP Client (`src/api/client.js`)

The HTTP client provides a clean interface for API operations:

```javascript
class HttpClient {
  async get(url, config = {}) { /* ... */ }
  async post(url, data = {}, config = {}) { /* ... */ }
  async put(url, data = {}, config = {}) { /* ... */ }
  async delete(url, config = {}) { /* ... */ }
  async upload(url, formData, config = {}) { /* ... */ }
  async download(url, config = {}) { /* ... */ }
}
```

### Client Factory

Multiple client instances can be created for different purposes:

```javascript
const apiClientFactory = new ApiClientFactory();
const userClient = apiClientFactory.getClient('user');
const productClient = apiClientFactory.getClient('product');
```

## Interceptors

### Request Interceptor

Handles request transformation, authentication, and logging:

```javascript
// Adds authentication tokens
// Adds request IDs for tracking
// Adds default headers
// Logs requests in development
```

### Response Interceptor

Handles response transformation, error handling, and retry logic:

```javascript
// Transforms responses to standard format
// Handles retry logic for failed requests
// Logs responses and errors
// Manages request queue
```

### Retry Configuration

Configurable retry logic with exponential backoff:

```javascript
class RetryConfig {
  shouldRetry(error, attempt) {
    // Retry on server errors (5xx) and network errors
    // Don't retry on client errors (4xx) except 408, 429
  }
  
  getDelay(attempt) {
    return this.delay * Math.pow(this.backoffMultiplier, attempt - 1);
  }
}
```

## Services

### Base Service (`src/services/baseService.js`)

Provides common functionality for all services:

```javascript
export class BaseService {
  async executeRequest(requestFn, options = {}) {
    // Network status check
    // Request queue management
    // Response transformation
    // Error handling
  }
  
  validateRequiredParams(params, required) { /* ... */ }
  handlePaginationParams(params = {}) { /* ... */ }
  buildUrl(endpoint, params = {}) { /* ... */ }
}
```

### User Service (`src/services/userService.js`)

Example of a specific service implementation:

```javascript
export class UserService extends BaseService {
  async getUsers(params = {}, options = {}) {
    this.logOperation('getUsers', { params, options });
    
    const paginationParams = this.handlePaginationParams(params);
    const url = this.buildUrl(this.baseEndpoint, paginationParams);
    
    return this.executeRequest(
      () => this.client.get(url, this.createRequestConfig(options)),
      options
    );
  }
  
  async getUserById(userId, options = {}) {
    this.validateRequiredParams({ userId }, ['userId']);
    // ... implementation
  }
}
```

### Service Factory (`src/services/index.js`)

Manages service instances and provides dependency injection:

```javascript
class ServiceFactory {
  getService(serviceName) {
    if (!this.services.has(serviceName)) {
      // Create new service instance
    }
    return this.services.get(serviceName);
  }
}
```

## Error Handling

### Standardized Error Format

All errors follow a consistent format:

```javascript
export class ApiError extends Error {
  constructor(message, statusCode = 500, data = null, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
    this.isNetworkError = isNetworkError;
    this.timestamp = new Date().toISOString();
  }
}
```

### Error Categories

- **Network Errors**: No internet connection, timeout
- **Client Errors**: 4xx status codes (validation, authentication)
- **Server Errors**: 5xx status codes (server issues)
- **Business Logic Errors**: Application-specific errors

### Error Handling Flow

1. **Interceptor Level**: Global error handling and retry logic
2. **Service Level**: Service-specific error transformation
3. **Component Level**: UI error display and user feedback

## Testing

### API Test Screen

A comprehensive testing interface is provided at `src/screens/ApiTest/ApiTestScreen.js`:

- **User API Tests**: Get users, search users, create users
- **Product API Tests**: Get products, search products, get categories
- **Auth API Tests**: Login, register (mock implementations)
- **Item API Tests**: Get items, create items (mock implementations)

### Testing Features

- ✅ Real-time API testing
- ✅ Input parameter configuration
- ✅ Response visualization
- ✅ Error handling demonstration
- ✅ Loading state management

## Usage Examples

### Basic Usage

```javascript
import { userService, productService } from '../services';

// Get users with pagination
const usersResponse = await userService.getUsers({ limit: 10, skip: 0 });

// Get specific user
const userResponse = await userService.getUserById(1);

// Search products
const productsResponse = await productService.searchProducts('phone');
```

### Advanced Usage

```javascript
// Custom request options
const options = {
  timeout: 15000,
  retryAttempts: 2,
  showLoading: false,
  showError: true,
};

// Get products with custom options
const response = await productService.getProducts(
  { limit: 20, category: 'electronics' },
  options
);
```

### Error Handling

```javascript
try {
  const response = await userService.getUserById(999);
  console.log('User:', response.data);
} catch (error) {
  if (error.statusCode === 404) {
    console.log('User not found');
  } else if (error.isNetworkError) {
    console.log('Network error:', error.message);
  } else {
    console.log('API error:', error.message);
  }
}
```

## Best Practices

### 1. Service Usage

- Always use the service layer instead of direct HTTP calls
- Use the service factory for dependency injection
- Handle errors appropriately at the component level

### 2. Configuration

- Use environment-based configuration
- Keep sensitive data in environment variables
- Use centralized endpoint management

### 3. Error Handling

- Always wrap API calls in try-catch blocks
- Provide meaningful error messages to users
- Log errors for debugging purposes

### 4. Performance

- Use request queuing to prevent duplicate requests
- Implement appropriate caching strategies
- Use pagination for large datasets

### 5. Security

- Validate all input parameters
- Use HTTPS for all API communications
- Implement proper authentication and authorization

## Migration Guide

### From Old API Structure

1. **Replace direct axios calls**:
   ```javascript
   // Old
   const response = await axios.get('/users');
   
   // New
   const response = await userService.getUsers();
   ```

2. **Update error handling**:
   ```javascript
   // Old
   try {
     const response = await axios.get('/users');
   } catch (error) {
     console.error(error);
   }
   
   // New
   try {
     const response = await userService.getUsers();
   } catch (error) {
     if (error instanceof ApiError) {
       console.error('API Error:', error.message);
     }
   }
   ```

3. **Update service imports**:
   ```javascript
   // Old
   import itemService from '../services/itemService';
   
   // New
   import { itemService } from '../services';
   ```

### Configuration Updates

1. **Update API base URL**:
   ```javascript
   // In src/api/config.js
   API_BASE_URL: 'https://your-api-url.com'
   ```

2. **Add new endpoints**:
   ```javascript
   // In src/api/config.js
   export const API_ENDPOINTS = {
     // ... existing endpoints
     NEW_ENDPOINT: '/new-endpoint',
   };
   ```

## Conclusion

The new API architecture provides a robust, maintainable, and scalable foundation for API communication in the SnapVault project. By following SOLID principles and professional practices, the codebase is now more organized, testable, and easier to extend.

Key benefits:
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Scalability**: Easy to add new services and endpoints
- ✅ **Reliability**: Comprehensive error handling and retry logic
- ✅ **Testability**: Modular design with dependency injection
- ✅ **Performance**: Request queuing and optimization features

For questions or issues, please refer to the testing interface or contact the development team. 