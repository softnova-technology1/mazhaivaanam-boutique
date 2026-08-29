import { createContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('boutique_wishlist');
    const expiry = localStorage.getItem('boutique_wishlist_expiry');
    
    // Check 1-hour expiry
    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem('boutique_wishlist');
      localStorage.removeItem('boutique_wishlist_expiry');
      return [];
    }
    
    return saved ? JSON.parse(saved) : [];
  });

  const fetchDbWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const data = await wishlistAPI.getWishlist();
        if (data && data.items) {
          const formatted = data.items.map(item => ({
            ...item.product
          }));
          setWishlist(formatted);
        }
      } catch (e) {
        console.error('Failed to fetch DB wishlist', e);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDbWishlist();
    } else {
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlist));
      if (wishlist.length > 0) {
        localStorage.setItem('boutique_wishlist_expiry', String(Date.now() + 60 * 60 * 1000));
      } else {
        localStorage.removeItem('boutique_wishlist_expiry');
      }
    }
  }, [wishlist, isAuthenticated, fetchDbWishlist]);

  useEffect(() => {
    const handleSyncEvent = () => fetchDbWishlist();
    window.addEventListener('sync-wishlist-complete', handleSyncEvent);
    return () => window.removeEventListener('sync-wishlist-complete', handleSyncEvent);
  }, [fetchDbWishlist]);

  const toggleWishlist = async (product) => {
    const isWishlisted = wishlist.some(w => w.id === product.id || w._id === product.id);
    
    if (isAuthenticated) {
      try {
        await wishlistAPI.toggleWishlist(product.id || product._id);
        fetchDbWishlist();
      } catch (e) {
        console.error('Failed to toggle DB wishlist', e);
      }
    } else {
      setWishlist(prev => {
        if (isWishlisted) {
          return prev.filter(w => w.id !== product.id && w._id !== product.id);
        }
        return [...prev, {
          id: product.id || product._id,
          _id: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category
        }];
      });
    }

    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: isWishlisted ? `Removed "${product.name}" from Wishlist` : `Saved "${product.name}" to Wishlist!` } 
    }));
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        await wishlistAPI.removeFromWishlist(productId);
        fetchDbWishlist();
      } catch (e) {
        console.error('Failed to remove from DB wishlist', e);
      }
    } else {
      setWishlist(prev => prev.filter(w => w.id !== productId && w._id !== productId));
    }
  };

  const moveToCart = async (productId, productObj, addToCartFn) => {
    if (isAuthenticated) {
      try {
        await wishlistAPI.moveToCart(productId);
        fetchDbWishlist();
        // The backend moved it to DB cart, so we must trigger a cart sync
        window.dispatchEvent(new Event('sync-cart-complete'));
      } catch (e) {
        console.error('Failed to move to DB cart', e);
      }
    } else {
      removeFromWishlist(productId);
      if (addToCartFn && productObj) {
        addToCartFn(productObj, 1);
      }
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
