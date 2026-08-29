import { createContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('boutique_cart');
    const expiry = localStorage.getItem('boutique_cart_expiry');
    
    // Check 1-hour expiry
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem('boutique_cart');
      localStorage.removeItem('boutique_cart_expiry');
      return [];
    }
    
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const fetchDbCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const data = await cartAPI.getCart();
        if (data && data.items) {
          // Normalize to frontend expected format
          const formatted = data.items.map(item => ({
            ...item.product,
            quantity: item.quantity
          }));
          setCart(formatted);
        }
      } catch (e) {
        console.error('Failed to fetch DB cart', e);
      }
    }
  }, [isAuthenticated]);

  // Sync logic depending on auth state
  useEffect(() => {
    if (isAuthenticated) {
      // Don't sync to local storage if authed, fetch from DB
      fetchDbCart();
    } else {
      // Save to local storage for guests with 1 hr expiry
      localStorage.setItem('boutique_cart', JSON.stringify(cart));
      if (cart.length > 0) {
        localStorage.setItem('boutique_cart_expiry', String(Date.now() + 60 * 60 * 1000));
      } else {
        localStorage.removeItem('boutique_cart_expiry');
      }
    }
  }, [cart, isAuthenticated, fetchDbCart]);

  useEffect(() => {
    const handleClearCart = () => setCart([]);
    const handleSyncCartEvent = () => fetchDbCart();
    
    window.addEventListener('clear-cart', handleClearCart);
    window.addEventListener('sync-cart-complete', handleSyncCartEvent);
    
    return () => {
      window.removeEventListener('clear-cart', handleClearCart);
      window.removeEventListener('sync-cart-complete', handleSyncCartEvent);
    };
  }, [fetchDbCart]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        await cartAPI.addToCart(product.id || product._id, quantity);
        fetchDbCart(); // Refresh from DB
      } catch (e) {
        console.error('Failed to add to DB cart', e);
      }
    } else {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, { ...product, quantity }];
      });
    }
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-cart-toast', { detail: { product, quantity } }));
    }, 0);
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        await cartAPI.removeFromCart(productId);
        fetchDbCart();
      } catch (e) {
        console.error('Failed to remove from DB cart', e);
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (isAuthenticated) {
      try {
        await cartAPI.updateCartItem(productId, quantity);
        fetchDbCart();
      } catch (e) {
        console.error('Failed to update DB cart', e);
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
        fetchDbCart();
      } catch (e) {
        console.error('Failed to clear DB cart', e);
      }
    } else {
      setCart([]);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal: getCartTotal(),
        cartItemCount: getCartItemCount(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
