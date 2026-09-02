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
          const formatted = data.items.map(item => {
            const prod = item.product;
            // Use discountedPrice from backend if discount is active
            const finalPrice = prod.discountedPrice && prod.discountActive
              ? prod.discountedPrice
              : prod.price;
            return {
              ...prod,
              id: prod._id || prod.id,
              price: finalPrice,          // effective checkout price
              mrpPrice: prod.mrpPrice,    // original MRP for strikethrough
              image: (prod.images && prod.images.length > 0)
                ? prod.images[0].url
                : (prod.image || '/Images/placeholder.svg'),
              quantity: item.quantity,
            };
          });
          setCart(formatted);
        }
      } catch (e) {
        console.error('Failed to fetch DB cart', e);
      }
    }
  }, [isAuthenticated]);

  // Fetch DB cart on mount and auth changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchDbCart();
    }
  }, [isAuthenticated, fetchDbCart]);

  // Sync to local storage ONLY for unauthenticated guests
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('boutique_cart', JSON.stringify(cart));
      if (cart.length > 0) {
        localStorage.setItem('boutique_cart_expiry', String(Date.now() + 60 * 60 * 1000));
      } else {
        localStorage.removeItem('boutique_cart_expiry');
      }
    }
  }, [cart, isAuthenticated]);

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
    const prodId = product.id || product._id;
    
    // Optimistic update for UI responsiveness
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => (item.id || item._id) === prodId);
      // Use discountedPrice if discount is active
      const effectivePrice = (product.discountedPrice && product.discountActive)
        ? product.discountedPrice
        : product.price;
      if (existingItem) {
        return prevCart.map((item) =>
          (item.id || item._id) === prodId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, id: prodId, price: effectivePrice, quantity }];
    });

    if (isAuthenticated) {
      try {
        await cartAPI.addToCart(prodId, quantity);
        // Optionally fetch DbCart to ensure sync, but optimistic is enough for instant UI
      } catch (e) {
        console.error('Failed to add to DB cart', e);
        fetchDbCart(); // Rollback on error
      }
    }
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('show-cart-toast', { detail: { product, quantity } }));
    }, 0);
  };

  const removeFromCart = async (productId) => {
    // Optimistic update
    setCart((prevCart) => prevCart.filter((item) => (item.id || item._id) !== productId));

    if (isAuthenticated) {
      try {
        await cartAPI.removeFromCart(productId);
      } catch (e) {
        console.error('Failed to remove from DB cart', e);
        fetchDbCart(); // Rollback on error
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    // Optimistic update
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id || item._id) === productId ? { ...item, quantity } : item
      )
    );

    if (isAuthenticated) {
      try {
        await cartAPI.updateCartItem(productId, quantity);
      } catch (e) {
        console.error('Failed to update DB cart', e);
        fetchDbCart(); // Rollback on error
      }
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
