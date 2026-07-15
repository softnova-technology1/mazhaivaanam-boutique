import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('boutique_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password) => {
    // Simple mock auth check
    if (username.trim() && password.length >= 4) {
      const mockUser = {
        username: username,
        email: `${username.toLowerCase()}@example.com`,
        fullName: username.charAt(0).toUpperCase() + username.slice(1),
        role: 'customer',
      };
      setUser(mockUser);
      localStorage.setItem('boutique_user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, message: 'Invalid username or password (min 4 chars).' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('boutique_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
