/**
 * PrivateRoute Component
 * Protects routes that require authentication
 * Prevents infinite redirect loops and handles loading states properly
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  // Don't render anything while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 mb-4">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-emerald-300 rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-sm font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  /**
   * If user is not authenticated (no token or no user), redirect to login
   * Save the attempted location so we can redirect after login if desired
   */
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default PrivateRoute;
