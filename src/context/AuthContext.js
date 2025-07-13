import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, isAuthenticated, getCurrentUserId } from '../services/api';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  // Login state - check both token and localStorage auth
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check both token-based auth and localStorage auth
    const hasToken = isAuthenticated();
    const hasStoredUser = localStorage.getItem('userData');
    console.log('Initial auth check - hasToken:', hasToken, 'hasStoredUser:', !!hasStoredUser);
    return hasToken || !!hasStoredUser;
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
      // Check if user data exists in localStorage (fallback auth)
      const storedUser = localStorage.getItem('userData');

      if (storedUser && !user) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Loading user from localStorage:', userData);
          setUser(userData);
          setUserType(userData.type);
          setIsLoggedIn(true);
          return;
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          localStorage.removeItem('userData');
        }
      }

      // Try API authentication if available
      if (isAuthenticated() && !user) {
        try {
          const response = await authAPI.getProfile();
          if (response && response.success) {
            setUser(response.user);
            setUserType(response.user.type);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Failed to get user profile:', error);
          console.log('API authentication failed, checking localStorage...');

          // If API fails, check localStorage as fallback
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              setUserType(userData.type);
              setIsLoggedIn(true);
            } catch (parseError) {
              console.error('Error parsing stored user data:', parseError);
              logout();
            }
          } else {
            logout();
          }
        }
      } else if (!isAuthenticated() && !storedUser && isLoggedIn) {
        // If no token and no stored user but marked as logged in, log out
        console.log('No authentication found, logging out...');
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
    try {
      authAPI.logout(); // This removes the token (if API is available)
    } catch (error) {
      console.log('API logout failed, continuing with local logout...');
    }

    setUser(null);
    setUserType('');
    setIsLoggedIn(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn'); // Keep for backward compatibility
    console.log('User logged out successfully');
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
