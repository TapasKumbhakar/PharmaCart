import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem('isLoggedIn');
    return stored === 'true';
  });

  // User type state ("Admin" or "Customer")
  const [userType, setUserType] = useState(() => {
    return localStorage.getItem('userType') || '';
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sync isLoggedIn to localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  // Sync userType to localStorage
  useEffect(() => {
    if (userType) {
      localStorage.setItem('userType', userType);
    } else {
      localStorage.removeItem('userType');
    }
  }, [userType]);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Accepts an object: { type: 'Admin' | 'Customer', ... }
  const login = (user = {}) => {
    setIsLoggedIn(true);
    if (user.type) setUserType(user.type);
  };
  const logout = () => {
    setIsLoggedIn(false);
    setUserType('');
    localStorage.removeItem('userType');
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
