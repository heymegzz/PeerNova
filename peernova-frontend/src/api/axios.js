import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://peernova.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      console.error('❌ Network Error:', error.message);
      console.error('🔗 Backend URL:', backendUrl);
      console.error('📋 Full error:', error);
      return Promise.reject({
        ...error,
        message: `Unable to connect to server at ${backendUrl}. Please check if the backend is running.`,
      });
    }
    
    // Log API errors for debugging
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message,
      path: error.config?.url,
    });
    
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
