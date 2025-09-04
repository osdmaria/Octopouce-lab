import axios from 'axios';

// Configure axios base URL based on environment
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

axios.defaults.baseURL = baseURL;

// Add request interceptor for debugging in development
if (import.meta.env.DEV) {
  axios.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('API Response Error:', error.response?.status, error.config?.url);
      return Promise.reject(error);
    }
  );
}

export default axios;