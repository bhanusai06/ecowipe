/**
 * Centralized API Service
 * Handles all HTTP requests with proper error handling, timeout, and request/response interceptors
 */

import axios from 'axios';

// Get API base URL from environment or default
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches JWT token to all requests
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers['auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors globally and checks for expired tokens
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle expired token
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      // Dispatch logout event that can be listened to across tabs
      window.dispatchEvent(new Event('token-expired'));
      console.warn('Token expired, user has been logged out');
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Request timeout. Please check your connection.',
        isTimeout: true,
        originalError: error
      });
    }

    // Handle network error
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        isNetworkError: true,
        originalError: error
      });
    }

    // Handle server error
    if (error.response?.status >= 500) {
      return Promise.reject({
        message: 'Server error. Please try again later.',
        isServerError: true,
        status: error.response.status,
        originalError: error
      });
    }

    // Return the error as is for handling in components
    return Promise.reject(error);
  }
);

export default api;
