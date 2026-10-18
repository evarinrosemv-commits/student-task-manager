import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on initial mount if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const savedToken = localStorage.getItem('token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.warn('Initial session check failed:', err.response?.data?.message || err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('student_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for 401 unauthorized events
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('student_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  const register = async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    if (response.data.success) {
      const { token: receivedToken, user: receivedUser } = response.data;
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('student_user', JSON.stringify(receivedUser));
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    }
    throw new Error(response.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('student_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
