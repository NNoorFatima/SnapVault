import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://your-api-base-url.com', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token from AsyncStorage before every request
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.log('Error fetching token', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
