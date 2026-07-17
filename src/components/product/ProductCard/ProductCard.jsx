import { useState, useEffect } from 'react';
import { Heart, Star } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { formatCurrency } from '../../../utils/formatters';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product, onClick, setSelectedProduct, setCurrentTab }) => {
  const { addToCart } = useCart();
  const { name, category, price, image, rating = 5.0, oldPrice, tag, isNew, isLimited, description } = product;

  const [isWishlisted, setIsWishlisted] = useState(false);

  // Sync wishlist state from localStorage
  useEffect(() => {
    const checkWishlist = () => {
      const saved = localStorage.getItem('boutique_wishlist');
      if (saved) {
        const items = JSON.parse(saved);
        setIsWishlisted(items.some(w => w.id === product.id));
      } else {
        setIsWishlisted(false);
      }
    };
    checkWishlist();
    window.addEventListener('storage', checkWishlist);
    return () => window.removeEventListener('storage', checkWishlist);
  }, [product.id]);

  const handleAddToWishlist = (e) => {
    e.stopPropagation(); // Stop product detail card click navigation
    const saved = localStorage.getItem('boutique_wishlist');
    let wishlistItems = saved ? JSON.parse(saved) : [];

    if (isWishlisted) {
      // Remove from wishlist
      wishlistItems = wishlistItems.filter(w => w.id !== product.id);
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Removed "${product.name}" from Wishlist` } }));
    } else {
      // Add to wishlist
      wishlistItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category || category || ''
      });
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Saved "${product.name}" to Wishlist!` } }));
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

  return (
    <div className={styles['product-card']} onClick={handleCardClick}>
      <div className={styles['image-container']}>
        <img src={image} alt={name} loading="lazy" />

        {/* Status badges */}
        {isNew && <span className={styles['badge-tag']}>NEW ARRIVAL</span>}
        {isLimited && <span className={styles['badge-tag']}>LIMITED EDITION</span>}
        {tag && <span className={styles['badge-tag']}>{tag}</span>}

        {/* Top-right/Bottom-right Wishlist Button */}
        <div 
          className={styles['wishlist-btn']} 
          onClick={handleAddToWishlist}
          role="button"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart 
            size={16} 
            fill={isWishlisted ? "var(--primary-dark)" : "none"} 
            stroke="var(--primary-dark)" 
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
            window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Added "${product.name}" to Cart!` } }));
          }}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
