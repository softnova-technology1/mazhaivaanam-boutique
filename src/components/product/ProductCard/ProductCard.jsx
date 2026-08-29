import { useState, useEffect } from 'react';
import { Heart, Star, Share2 } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { formatCurrency } from '../../../utils/formatters';
import { getBadgeClass } from '../../../utils/badgeHelper';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product, onClick, setSelectedProduct, setCurrentTab }) => {
  const { addToCart } = useCart();
  const { name, category, price, image, rating = 5.0, oldPrice, tag, isNew, isLimited, description } = product;

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
      setSelectedProduct(product);
      setCurrentTab('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const displayImage = (typeof image === 'string' && !image.startsWith('blob:')) ? image : '/Images/saree1.png';

  return (
    <div className={styles['product-card']} onClick={handleCardClick}>
      <div className={styles['image-container']}>
        <img 
          src={displayImage} 
          alt={name} 
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/Images/saree1.png';
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
          {rating && (
            <div className={styles['rating-badge-inline']}>
              <Star size={10} fill="#B38A4A" stroke="#B38A4A" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Small Description */}
        {description && (
          <p className={styles['product-description']}>
            {description}
          </p>
        )}
        
        <div className={styles['price-row']}>
          <span className={styles['current-price']}>{formatCurrency(price)}</span>
          {oldPrice && (
            <>
              <span className={styles['old-price']}>{formatCurrency(oldPrice)}</span>
              <span className={styles['discount-pill']}>
                {Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>
        <button 
          className={styles['add-cart-btn']}
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, 1);
          }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
