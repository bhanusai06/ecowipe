import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth-token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch user profile from token
    const fetchUser = useCallback(async (tkn) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
                headers: { 'auth-token': tkn }
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
                return userData;
            } else if (res.status === 401 || res.status === 403) {
                // Token is invalid - clear it
                localStorage.removeItem('auth-token');
                setToken(null);
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            // Don't logout on network errors (server might be starting up)
        }
        return null;
    }, []);

    // On mount: validate stored token
    useEffect(() => {
        const checkLoggedIn = async () => {
            const storedToken = localStorage.getItem('auth-token');
            if (storedToken) {
                await fetchUser(storedToken);
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, [fetchUser]);

    const login = useCallback(async (tkn, userData) => {
        localStorage.setItem('auth-token', tkn);
        setToken(tkn);
        // Set user optimistically first so ProtectedRoute doesn't redirect
        setUser(userData);
        // Then fetch the real/complete profile from server
        const realUser = await fetchUser(tkn);
        if (realUser) {
            setUser(realUser);
        }
        navigate('/dashboard');
    }, [navigate, fetchUser]);

    const logout = useCallback(() => {
        localStorage.removeItem('auth-token');
        setToken(null);
        setUser(null);
        navigate('/login');
    }, [navigate]);

    const value = {
        user,
        token,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
