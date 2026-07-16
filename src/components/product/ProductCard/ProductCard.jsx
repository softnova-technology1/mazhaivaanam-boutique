import { useCart } from '../../../hooks/useCart';
import { formatCurrency } from '../../../utils/formatters';
import { Button } from '../../common/Button/Button';
import styles from './ProductCard.module.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { name, category, price, image, rating = 5.0, description } = product;

  return (
    <div className={`${styles['product-card']} glass-card`}>
      <div className={styles['product-image-container']}>
        <img src={image} alt={name} className={styles['product-image']} loading="lazy" />
        <span className={styles['product-category']}>{category}</span>
      </div>
      <div className={styles['product-info']}>
        <div className={styles['product-header']}>
          <h3 className={styles['product-name']}>{name}</h3>
          <span className={styles['product-rating']}>★ {rating.toFixed(1)}</span>
        </div>
        <p className={styles['product-description']}>{description}</p>
        <div className={styles['product-footer']}>
          <span className={styles['product-price']}>{formatCurrency(price)}</span>
          <Button 
            variant="primary" 
            onClick={() => addToCart(product, 1)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
