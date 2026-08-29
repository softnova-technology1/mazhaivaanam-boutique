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
            ...item.product,
            id: item.product._id || item.product.id,
            image: (item.product.images && item.product.images.length > 0) ? item.product.images[0].url : (item.product.image || '/Images/saree1.png')
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
    }
  }, [isAuthenticated, fetchDbWishlist]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlist));
      if (wishlist.length > 0) {
        localStorage.setItem('boutique_wishlist_expiry', String(Date.now() + 60 * 60 * 1000));
      } else {
        localStorage.removeItem('boutique_wishlist_expiry');
      }
    }
  }, [wishlist, isAuthenticated]);

  useEffect(() => {
    const handleSyncEvent = () => fetchDbWishlist();
    window.addEventListener('sync-wishlist-complete', handleSyncEvent);
    return () => window.removeEventListener('sync-wishlist-complete', handleSyncEvent);
  }, [fetchDbWishlist]);

  const toggleWishlist = async (product) => {
    const prodId = product.id || product._id;
    // Optimistic update
    let wasWishlisted = false;
    setWishlist(prev => {
      const currentlyWishlisted = prev.some(w => (w.id || w._id) === prodId);
      wasWishlisted = currentlyWishlisted;
      
      if (currentlyWishlisted) {
        return prev.filter(w => (w.id || w._id) !== prodId);
      }
      return [...prev, {
        ...product,
        id: prodId,
        _id: prodId
      }];
    });

    if (isAuthenticated) {
      try {
        await wishlistAPI.toggleWishlist(prodId);
      } catch (e) {
        console.error('Failed to toggle DB wishlist', e);
        fetchDbWishlist(); // Rollback
      }
    }

    window.dispatchEvent(new CustomEvent('show-toast', { 
      detail: { message: wasWishlisted ? `Removed "${product.name}" from Wishlist` : `Saved "${product.name}" to Wishlist!` } 
    }));
  };

  const removeFromWishlist = async (productId) => {
    // Optimistic update
    setWishlist((prev) => prev.filter((item) => (item.id || item._id) !== productId));

    if (isAuthenticated) {
      try {
        await wishlistAPI.removeFromWishlist(productId);
      } catch (e) {
        console.error('Failed to remove from DB wishlist', e);
        fetchDbWishlist(); // Rollback
      }
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
