import React, { createContext, useContext, useState } from "react";

// Create the UserContext
const UserContext = createContext();

// UserContext Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(); // You can change the initial value based on actual user data

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user data
export const useUser = () => useContext(UserContext);
