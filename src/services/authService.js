/**
 * Authentication Service
 * Handles all auth-related API calls with proper error handling
 */

import api from './api';

const authService = {
  /**
   * Send OTP to email
   * @param {string} email - User email
   * @param {string} type - 'register' or 'reset'
   * @returns {Promise<{message: string, devOtp?: string}>}
   */
  async sendOTP(email, type = 'register') {
    try {
      const response = await api.post('/api/auth/send-otp', {
        email: email.trim().toLowerCase(),
        type
      });
      return response.data;
    } catch (error) {
      throw authService._handleError(error, 'Failed to send OTP');
    }
  },

  /**
   * Verify OTP code
   * @param {string} email - User email
   * @param {string} otp - OTP code
   * @returns {Promise<{token: string, message: string}>}
   */
  async verifyOTP(email, otp) {
    try {
      const response = await api.post('/api/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: otp.trim()
      });
      return response.data;
    } catch (error) {
      throw authService._handleError(error, 'Failed to verify OTP');
    }
  },

  /**
   * Register new user after OTP verification
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} full_name - User full name
   * @param {string} token - Temporary token from OTP verification
   * @returns {Promise<{token: string, user: string, message: string}>}
   */
  async register(email, password, full_name, token) {
    try {
      const response = await api.post('/api/auth/register', {
        email: email.trim().toLowerCase(),
        password,
        full_name: full_name.trim(),
        token
      });
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw authService._handleError(error, 'Registration failed');
    }
  },

  /**
   * Login with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{token: string, user: object}>}
   */
  async login(email, password) {
    try {
      const response = await api.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password
      });
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw authService._handleError(error, 'Login failed');
    }
  },

  /**
   * Reset password after OTP verification
   * @param {string} email - User email
   * @param {string} password - New password
   * @param {string} token - Temporary token from OTP verification
   * @returns {Promise<{message: string}>}
   */
  async resetPassword(email, password, token) {
    try {
      const response = await api.post('/api/auth/reset-password', {
        email: email.trim().toLowerCase(),
        password,
        token
      });
      return response.data;
    } catch (error) {
      throw authService._handleError(error, 'Password reset failed');
    }
  },

  /**
   * Google OAuth login
   * @param {string} email - Google email
   * @param {string} name - Google name
   * @param {string} googleId - Google ID
   * @returns {Promise<{token: string}>}
   */
  async loginWithGoogle(email, name, googleId) {
    try {
      const response = await api.post('/api/auth/google', {
        email,
        name,
        googleId
      });
      if (response.data.token) {
        localStorage.setItem('auth-token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw authService._handleError(error, 'Google login failed');
    }
  },

  /**
   * Get current user profile
   * @returns {Promise<object>}
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw authService._handleError(error, 'Failed to fetch user');
    }
  },

  /**
   * Logout (clears token from storage)
   */
  logout() {
    localStorage.removeItem('auth-token');
  },

  /**
   * Check if token is valid and not expired
   * @returns {boolean}
   */
  isTokenValid() {
    const token = localStorage.getItem('auth-token');
    if (!token) return false;

    try {
      const [, payloadEncoded] = token.split('.');
      const payload = JSON.parse(atob(payloadEncoded));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < expiresAt;
    } catch {
      return false;
    }
  },

  /**
   * Get token from storage
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem('auth-token');
  },

  /**
   * Handle API errors and return user-friendly messages
   * @private
   */
  _handleError(error, defaultMessage) {
    let message = defaultMessage;
    let status = null;

    if (error.isNetworkError) {
      message = error.message;
    } else if (error.isTimeout) {
      message = error.message;
    } else if (error.isServerError) {
      message = error.message;
      status = error.status;
    } else if (error.response?.data) {
      // Try to extract error message from server response
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data.error) {
        message = error.response.data.error;
      }
      status = error.response.status;
    }

    const errorObj = new Error(message);
    errorObj.status = status;
    errorObj.originalError = error;
    return errorObj;
  }
};

export default authService;
