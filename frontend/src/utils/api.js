import axios from 'axios';
import { API_BASE_URL } from './constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      // You could redirect to login here if needed
    }
    return Promise.reject(error);
  }
);

// API Functions
export const loginUser = async (email, password) => {
  return api.post('/login', { email, password });
};

export const signupUser = async (userData) => {
  return api.post('/signup', userData);
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Utility function to get user role
export const getUserRole = () => {
  return localStorage.getItem('role');
};

// Utility function to logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

export default api;
