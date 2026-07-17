import { Heart, Star } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { formatCurrency } from '../../../utils/formatters';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { name, category, price, image, rating = 5.0, oldPrice, tag } = product;

  return (
    <div className={styles['product-card']}>
      <div className={styles['image-container']}>
        <img src={image} alt={name} loading="lazy" />
        <button 
          className={styles['wishlist-btn']} 
          title="Add to Wishlist"
        >
          <Heart size={16} />
        </button>
      </div>
      <div className={styles['card-details']}>
        <h4>{name}</h4>
        <div className={styles['rating-row']}>
          <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
          <span className={styles['rating-text']}>{rating.toFixed(1)}</span>
        </div>
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
          onClick={() => addToCart(product, 1)}
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
