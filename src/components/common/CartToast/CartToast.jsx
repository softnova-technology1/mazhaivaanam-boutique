import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import { useCart } from '../../../hooks/useCart';
import styles from './CartToast.module.css';

export const CartToast = ({ setCurrentTab }) => {
  const [toastData, setToastData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { cart, updateQuantity, removeFromCart } = useCart();
  const timerRef = React.useRef(null);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    startTimer();
  };

  useEffect(() => {
    const handleShowCartToast = (e) => {
      const { product, quantity } = e.detail;
      setToastData({ product, quantity });
      setIsVisible(true);
      startTimer();
    };

    window.addEventListener('show-cart-toast', handleShowCartToast);
    return () => {
      window.removeEventListener('show-cart-toast', handleShowCartToast);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!toastData) return null;

  const { product } = toastData;
  const cartItem = cart.find(item => item.id === product.id);
  const displayQuantity = cartItem ? cartItem.quantity : toastData.quantity;

  return (
    <div 
      className={`${styles.cartToastContainer} ${isVisible ? styles.visible : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.toastHeader}>
        <div className={styles.headerTitle}>
          <ShoppingBag size={14} />
          <span>Added to your Cart</span>
        </div>
        <button className={styles.closeBtn} onClick={() => setIsVisible(false)}>
          <X size={16} />
        </button>
      </div>
      <div className={styles.toastBody}>
        <div className={styles.imageContainer}>
          <img src={product.image} alt={product.name} className={styles.productImage} />
        </div>
        <div className={styles.productInfo}>
          <h4 className={styles.productName}>{product.name}</h4>
          <div className={styles.priceRow}>
            <span className={styles.currentPrice}>{formatCurrency(product.price)}</span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{formatCurrency(product.oldPrice)}</span>
            )}
          </div>
          
          {cartItem ? (
            <div className={styles.actionRow}>
              <div className={styles.quantityControls}>
                <button 
                  className={styles.qtyBtn} 
                  onClick={() => updateQuantity(product.id, displayQuantity - 1)}
                >
                  <Minus size={12} />
                </button>
                <span className={styles.quantityValue}>{displayQuantity}</span>
                <button 
                  className={styles.qtyBtn} 
                  onClick={() => updateQuantity(product.id, displayQuantity + 1)}
                >
                  <Plus size={12} />
                </button>
              </div>
              <button 
                className={styles.removeBtn} 
                onClick={() => {
                  removeFromCart(product.id);
                  setIsVisible(false);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <div className={styles.removedMessage}>Item removed from cart</div>
          )}
        </div>
      </div>
      
      {/* View Cart Button */}
      {cartItem && (
        <button 
          className={styles.viewCartBtn}
          onClick={() => {
            setIsVisible(false);
            if (setCurrentTab) {
              window.history.pushState(null, '', '/cart');
              setCurrentTab('cart');
            }
          }}
        >
          View Cart
        </button>
      )}
    </div>
  );
};
