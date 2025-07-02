// src/api/axiosClient.js
import axios from 'axios';
import Config from 'react-native-config'; // For environment variables
// import AsyncStorage from '@react-native-async-storage/async-storage'; // If you're using AsyncStorage for tokens

const axiosClient = axios.create({
  baseURL: Config.API_BASE_URL, // Get base URL from environment variables
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Add authorization token to outgoing requests
axiosClient.interceptors.request.use(
  async (config) => {
    // Example: If you have a token stored in AsyncStorage
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log('Sending request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global response errors
axiosClient.interceptors.response.use(
  (response) => {
    console.log('Received response from:', response.config.url);
    return response;
  },
  async (error) => {
    if (axios.isCancel(error)) {
      console.log('Request cancelled:', error.message);
      return Promise.reject(error);
    }

    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error('API Error Response Data:', error.response.data);
      console.error('API Error Status:', error.response.status);

      // Example: Handle 401 Unauthorized globally
      // if (error.response.status === 401) {
      //   // Redirect to login screen or attempt token refresh
      //   // This logic would involve your navigation library and auth context
      //   console.warn('Unauthorized: Redirecting to login or refreshing token...');
      // }
    } else if (error.request) {
      // Request made but no response received (e.g., network error)
      console.error('Network Error: No response received.', error.request);
      // You might want to show a global "No Internet" message here
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error); // Re-throw the error for component-level handling
  }
);

export default axiosClient;