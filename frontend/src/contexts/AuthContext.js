import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = ({ communicationUserId, username }) => {
    setIsLoggedIn(true);
    console.log("loggedin state", isLoggedIn);
    setUser({ communicationUserId, username });
  };

  const logout = () => {
    console.log("officially logging out,");
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