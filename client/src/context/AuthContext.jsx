import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // Verify token is still valid
          const response = await authAPI.getMe();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          // Check if pending admin
          if (error.response?.data?.status === 'pending') {
            const parsed = JSON.parse(savedUser);
            setUser({ ...parsed, status: 'pending' });
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Register new user (student)
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Register admin (pending approval)
  const registerAdmin = async (userData) => {
    try {
      const response = await authAPI.registerAdmin(userData);
      toast.success('Admin registration submitted! Awaiting approval.');
      return { success: true, status: 'pending', note: response.data.note };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${user.name}!`);
      return { success: true, user };
    } catch (error) {
      // Check for pending admin
      if (error.response?.data?.status === 'pending') {
        return { success: false, error: 'Admin account pending approval', status: 'pending' };
      }
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login owner
  const loginOwner = async (credentials) => {
    try {
      const response = await authAPI.loginOwner(credentials);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      toast.success('Owner login successful!');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      const updatedUser = { ...user, ...response.data };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin: user?.role === 'admin' || user?.role === 'owner',
    isOwner: user?.role === 'owner',
    isPending: user?.status === 'pending',
    register,
    registerAdmin,
    login,
    loginOwner,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
