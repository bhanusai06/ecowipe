/**
 * useAuth Hook
 * Custom hook for managing authentication state and providing auth methods
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const checkTokenIntervalRef = useRef(null);
  const isInitializedRef = useRef(false);

  /**
   * Initialize auth state from storage and validate token
   */
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('auth-token');
        
        if (storedToken && authService.isTokenValid()) {
          setToken(storedToken);
          
          // Fetch user profile
          try {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } catch (err) {
            console.error('Failed to fetch user:', err);
            // Token might be invalid even if isTokenValid returned true
            logout();
          }
        } else if (storedToken) {
          // Token is expired
          logout();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Listen for token expiration across tabs
   */
  useEffect(() => {
    const handleTokenExpired = () => {
      logout();
    };

    window.addEventListener('token-expired', handleTokenExpired);
    return () => window.removeEventListener('token-expired', handleTokenExpired);
  }, []);

  /**
   * Periodically check token validity (every 5 minutes)
   */
  useEffect(() => {
    if (!token) return;

    const checkToken = () => {
      if (!authService.isTokenValid()) {
        logout();
      }
    };

    checkTokenIntervalRef.current = setInterval(checkToken, 5 * 60 * 1000);

    return () => {
      if (checkTokenIntervalRef.current) {
        clearInterval(checkTokenIntervalRef.current);
      }
    };
  }, [token]);

  /**
   * Login user with email and password
   */
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      setToken(response.token);
      
      // Fetch user profile after login
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      navigate('/dashboard');
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Register new user
   */
  const register = useCallback(async (email, password, fullName, tempToken) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(email, password, fullName, tempToken);
      setToken(response.token);
      
      // Fetch user profile after registration
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      navigate('/dashboard');
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Send OTP for login/signup/password reset
   */
  const sendOTP = useCallback(async (email, type = 'register') => {
    setError(null);
    try {
      return await authService.sendOTP(email, type);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Verify OTP code
   */
  const verifyOTP = useCallback(async (email, otp) => {
    setError(null);
    try {
      return await authService.verifyOTP(email, otp);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Login with Google OAuth
   */
  const loginWithGoogle = useCallback(async (email, name, googleId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.loginWithGoogle(email, name, googleId);
      setToken(response.token);
      
      // Fetch user profile
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      navigate('/dashboard');
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Reset password
   */
  const resetPassword = useCallback(async (email, password, tempToken) => {
    setError(null);
    try {
      return await authService.resetPassword(email, password, tempToken);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    setError(null);
    navigate('/login');
  }, [navigate]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    sendOTP,
    verifyOTP,
    loginWithGoogle,
    resetPassword,
    clearError,
    isAuthenticated: !!token && !!user
  };

  return value;
};

export default useAuth;
