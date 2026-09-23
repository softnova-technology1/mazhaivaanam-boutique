import { useState, useEffect } from 'react';
import { Heart, Share2 } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useWishlist } from '../../../hooks/useWishlist';
import { formatCurrency } from '../../../utils/formatters';
import { getBadgeClass } from '../../../utils/badgeHelper';
import { OfferTimerBadge } from '../../common/OfferTimerBadge/OfferTimerBadge';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product, onClick, setSelectedProduct, setCurrentTab }) => {
  const { addToCart } = useCart();
  const { name, category, price, image, oldPrice, mrpPrice, discountedPrice, discountActive, tag, isNew, isLimited, shortDescription } = product;

  const effectivePrice = (discountActive && discountedPrice) || (discountedPrice && discountedPrice < price)
    ? discountedPrice
    : price;

  const effectiveOldPrice = (mrpPrice && mrpPrice > effectivePrice) ? mrpPrice : (oldPrice && oldPrice > effectivePrice) ? oldPrice : (effectivePrice < price ? price : null);
  const hasDiscount = Boolean(effectiveOldPrice && effectiveOldPrice > effectivePrice);
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

  
  const displayImage = (typeof image === 'string' && image.trim() !== '') ? image : 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/placeholder.svg';

  const fallbackTag = product.discountLabel || product.discount?.label || (isNew ? 'Fresh Pick' : (isLimited ? 'LIMITED EDITION' : tag));
  const isDiscActive = Boolean(discountActive || product.discount?.isActive);
  const isLoActive = Boolean(product.limitedOfferEntry?.isActive);
  const endDate = (isDiscActive && (product.discountEndDate || product.discount?.endDate)) ||
                  (isLoActive && product.limitedOfferEntry?.endDate) || null;

  return (
    <div className={styles['product-card']} onClick={handleCardClick}>
      <div className={styles['image-container']}>
        <img 
          src={displayImage} 
          alt={name} 
          loading="lazy" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/placeholder.svg';
          }}
        />

        {/* Status badges */}
        {product.stock?.isOutOfStock ? (
          <span className={`${styles['badge-tag']}`} style={{ backgroundColor: '#dc2626', color: '#fff' }}>OUT OF STOCK</span>
        ) : (
          <OfferTimerBadge
            endDate={endDate}
            fallbackLabel={fallbackTag}
            className={styles['badge-tag']}
          />
        )}

        {/* Share Button */}
        <div 
          className={styles['share-btn']} 
          onClick={handleShareClick}
          role="button"
          title="Share Product"
          aria-label="Share Product"
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
          aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
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

        {/* Simple Description from DB - truncated to 2 lines */}
        {shortDescription && (
          <p className={styles['product-description']}>
            {shortDescription}
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
        {product.stock?.isOutOfStock ? (
          <button 
            className={styles['add-cart-btn']}
            disabled
            style={{ backgroundColor: '#9ca3af', borderColor: '#9ca3af', color: '#fff', cursor: 'not-allowed' }}
            onClick={(e) => e.stopPropagation()}
          >
            OUT OF STOCK
          </button>
        ) : (
          <button 
            className={styles['add-cart-btn']}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(itemToPass, 1);
            }}
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};
export default ProductCard;
