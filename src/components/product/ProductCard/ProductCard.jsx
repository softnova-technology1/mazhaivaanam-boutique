import { useState, useEffect } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { formatCurrency } from '../../../utils/formatters';
import { getBadgeClass } from '../../../utils/badgeHelper';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product, onClick, setSelectedProduct, setCurrentTab }) => {
  const { addToCart } = useCart();
  const { name, category, price, image, oldPrice, mrpPrice, discountedPrice, discountActive, tag, isNew, isLimited, description } = product;

  const effectivePrice = (discountActive && discountedPrice) || (discountedPrice && discountedPrice < price)
    ? discountedPrice
    : price;

  const effectiveOldPrice = mrpPrice || oldPrice || (effectivePrice < price ? price : Math.round(price * 1.15));
  const hasDiscount = effectiveOldPrice > effectivePrice;
  const discountPct = hasDiscount ? Math.round(((effectiveOldPrice - effectivePrice) / effectiveOldPrice) * 100) : 0;

  const itemToPass = { ...product, price: effectivePrice, discountedPrice: effectivePrice };

  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = wishlist.some(w => (w.id || w._id) === (product.id || product._id));

  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || `Check out ${product.name} at Mazhai Vaanam!`,
        url: productUrl,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(productUrl)
        .then(() => {
          window.dispatchEvent(new CustomEvent('show-toast', { 
            detail: { message: `Link to "${product.name}" copied to clipboard!` } 
          }));
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (setSelectedProduct && setCurrentTab) {
      setSelectedProduct(itemToPass);
      setCurrentTab('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  
  const displayImage = (typeof image === 'string' && !image.startsWith('blob:') && image.trim() !== '') ? image : '/Images/placeholder.svg';

  return (
    <div className={styles['product-card']} onClick={handleCardClick}>
      <div className={styles['image-container']}>
        <img 
          src={displayImage} 
          alt={name} 
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/Images/placeholder.svg';
          }}
        />

        {/* Status badges */}
        {isNew && <span className={`${styles['badge-tag']} ${getBadgeClass('NEW ARRIVAL')}`}>NEW ARRIVAL</span>}
        {isLimited && <span className={`${styles['badge-tag']} ${getBadgeClass('LIMITED EDITION')}`}>LIMITED EDITION</span>}
        {tag && <span className={`${styles['badge-tag']} ${getBadgeClass(tag)}`}>{tag}</span>}

        {/* Share Button */}
        <div 
          className={styles['share-btn']} 
          onClick={handleShareClick}
          role="button"
          title="Share Product"
        >
          <Share2 
            size={16} 
            stroke="var(--primary-dark)" 
          />
        </div>

        {/* Top-right/Bottom-right Wishlist Button */}
        <div 
          className={styles['wishlist-btn']} 
          onClick={handleAddToWishlist}
          role="button"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart 
            size={16} 
            fill={isWishlisted ? "#e63946" : "none"} 
            stroke={isWishlisted ? "#e63946" : "var(--primary-dark)"} 
          />
        </div>
      </div>
      <div className={styles['card-details']}>
        <div className={styles['title-row']}>
          <h4>{name}</h4>
        </div>
        
        {/* Small Description */}
        {description && (
          <p className={styles['product-description']}>
            {description}
          </p>
        )}
        
        <div className={styles['price-row']}>
          <span className={styles['current-price']}>{formatCurrency(effectivePrice)}</span>
          {hasDiscount && (
            <>
              <span className={styles['old-price']}>{formatCurrency(effectiveOldPrice)}</span>
              <span className={styles['discount-pill']}>
                {discountPct}% OFF
              </span>
            </>
          )}
        </div>
        <button 
          className={styles['add-cart-btn']}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(itemToPass, 1);
          }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
