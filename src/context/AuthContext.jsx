import { createContext, useState, useEffect } from 'react';
import { authAPI, cartAPI, wishlistAPI } from '../services/api';

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

  const syncGuestData = async () => {
    try {
      const savedCart = localStorage.getItem('boutique_cart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        if (cartItems.length > 0) {
          await cartAPI.syncCart(cartItems.map(i => ({ productId: i.id || i._id, quantity: i.quantity })));
        }
      }

      const savedWishlist = localStorage.getItem('boutique_wishlist');
      if (savedWishlist) {
        const wishlistItems = JSON.parse(savedWishlist);
        if (wishlistItems.length > 0) {
          await wishlistAPI.syncWishlist(wishlistItems.map(w => w.id || w._id));
        }
      }

      localStorage.removeItem('boutique_cart');
      localStorage.removeItem('boutique_cart_expiry');
      localStorage.removeItem('boutique_wishlist');
      localStorage.removeItem('boutique_wishlist_expiry');
      
      window.dispatchEvent(new Event('sync-cart-complete'));
      window.dispatchEvent(new Event('sync-wishlist-complete'));
    } catch (err) {
      console.error('Failed to sync guest data:', err);
    }
  };

  const login = async (emailOrUsername, password) => {
    try {
      const email = emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername.toLowerCase()}@mazhaivaanam.com`;
      const res = await authAPI.login(email, password);
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem('boutique_user', JSON.stringify(res.user));
        localStorage.removeItem('boutique_profile');
        localStorage.removeItem('boutique_addresses');
        
        await syncGuestData();
        
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
        localStorage.removeItem('boutique_profile');
        localStorage.removeItem('boutique_addresses');
        
        await syncGuestData();
        
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
    localStorage.removeItem('boutique_profile');
    localStorage.removeItem('boutique_addresses');
    localStorage.removeItem('boutique_cart');
    window.dispatchEvent(new Event('clear-cart'));
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
