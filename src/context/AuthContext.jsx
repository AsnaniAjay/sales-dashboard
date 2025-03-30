// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin'
    };
  });

  // Update localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Function to update user profile
  const updateUserProfile = (updatedProfile) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedProfile
    }));
  };

  // Auth context value with all functions and state
  const value = {
    user,
    updateUserProfile,
    // Add other auth functions like login, logout, etc.
    isAuthenticated: !!user,
    login: (userData) => setUser(userData),
    logout: () => setUser(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;