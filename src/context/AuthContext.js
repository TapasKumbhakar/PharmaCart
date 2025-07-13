import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, isAuthenticated, getCurrentUserId } from '../services/api';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  // Login state - now based on token presence
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return isAuthenticated();
  });

  // User data state
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('userData');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // User type state ("Admin" or "Customer")
  const [userType, setUserType] = useState(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return userData.type || '';
    }
    return localStorage.getItem('userType') || '';
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sync user data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
      localStorage.setItem('userType', user.type);
    } else {
      localStorage.removeItem('userData');
      localStorage.removeItem('userType');
    }
  }, [user]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated() && !user) {
        try {
          const response = await authAPI.getProfile();
          if (response.success) {
            setUser(response.user);
            setUserType(response.user.type);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Failed to get user profile:', error);
          console.log('Token validation failed, logging out...');
          logout();
        }
      } else if (!isAuthenticated() && isLoggedIn) {
        // If no token but marked as logged in, log out
        console.log('No valid token found, logging out...');
        logout();
      }
    };

    checkAuth();
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Login function - now handles API response
  const login = (userData) => {
    setUser(userData);
    setUserType(userData.type);
    setIsLoggedIn(true);
  };

  // Logout function - clears all auth data
  const logout = () => {
    authAPI.logout(); // This removes the token
    setUser(null);
    setUserType('');
    setIsLoggedIn(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn'); // Keep for backward compatibility
  };

  // 🔥 This is the new function you need
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); // optional: also remove from storage
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        userType,
        login,
        logout,
        cart,
        setCart,
        clearCart, // expose it here
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
