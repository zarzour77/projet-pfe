// AuthContext.jsx
import  { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser.role)
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};