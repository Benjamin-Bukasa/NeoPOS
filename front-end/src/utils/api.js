import axios from 'axios';
import useAuthStore from '../stores/authStore';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
});

// Add a request interceptor to inject token from Zustand
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
