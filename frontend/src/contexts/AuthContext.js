import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = ({ communicationUserId, username }) => {
    setIsLoggedIn(true);
    setUser({ communicationUserId, username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('communicationUserId');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};