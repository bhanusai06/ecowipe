import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth-token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = async () => {
            if (token) {
                try {
                    const res = await fetch('http://localhost:5001/api/auth/me', {
                        headers: { 'auth-token': token }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        logout();
                    }
                } catch (err) {
                    console.error("Auth check failed:", err);
                    logout();
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, [token]);

    const login = (token, userData) => {
        localStorage.setItem('auth-token', token);
        setToken(token);
        setUser(userData);
        navigate('/');
    };

    const logout = () => {
        localStorage.removeItem('auth-token');
        setToken(null);
        setUser(null);
        navigate('/login');
    };

    // Register convenience method (just returns the fetch promise)
    const register = async (email, password) => {
        // Implementation handled in AuthPage usually, but could be centralized here
    };

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
