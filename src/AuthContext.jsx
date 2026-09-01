import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem('idToken')
  );

  const login = (idToken) => {
    setToken(idToken);
    localStorage.setItem('idToken', idToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('idToken');
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};