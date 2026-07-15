import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { name, category, price, image, rating, description } = product;

  return (
    <div className="product-card glass-card">
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" loading="lazy" />
        <span className="product-category">{category}</span>
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{name}</h3>
          <span className="product-rating">★ {rating.toFixed(1)}</span>
        </div>
        <p className="product-description">{description}</p>
        <div className="product-footer">
          <span className="product-price">{formatCurrency(price)}</span>
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
