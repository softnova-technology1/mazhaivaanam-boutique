import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('boutique_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('boutique_token');
    if (token) {
      authAPI.getMe()
        .then(res => {
          if (res) {
            setUser(res);
            localStorage.setItem('boutique_user', JSON.stringify(res));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const email = emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername.toLowerCase()}@mazhaivaanam.com`;
      const res = await authAPI.login(email, password);
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem('boutique_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem('boutique_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    localStorage.removeItem('boutique_user');
    localStorage.removeItem('boutique_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
