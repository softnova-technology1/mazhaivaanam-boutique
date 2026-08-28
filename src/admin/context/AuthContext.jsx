import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mv_admin_token');
    if (token) {
      authAPI.getMe()
        .then((res) => {
          if (res.data.user.role === 'admin') {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('mv_admin_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('mv_admin_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.user.role !== 'admin') {
      throw new Error('Access denied — admin privileges required');
    }
    localStorage.setItem('mv_admin_token', res.data.accessToken);
    localStorage.setItem('mv_admin_refresh', res.data.refreshToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('mv_admin_token');
    localStorage.removeItem('mv_admin_refresh');
    localStorage.removeItem('boutique_token');
    localStorage.removeItem('boutique_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
