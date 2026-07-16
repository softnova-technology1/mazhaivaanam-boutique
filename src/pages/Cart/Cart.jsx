import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button/Button';
import styles from './Cart.module.css';

export const Cart = ({ setCurrentTab }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  const gst = cartTotal * 0.05; // 5% GST for garments/sarees
  const shipping = cartTotal >= 10000 || cartTotal === 0 ? 0 : 150;
  const grandTotal = cartTotal + gst + shipping;

  if (cart.length === 0) {
    return (
      <div className={`${styles['cart-page']} container`}>
        <div className={`${styles['empty-cart-card']} glass-card`}>
          <span className={styles['empty-cart-icon']}>🛒</span>
          <h2>Your Cart is Empty</h2>
          <p>Explore our exclusive collection and add products to your cart.</p>
          <Button variant="primary" onClick={() => setCurrentTab('shop')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles['cart-page']} container`}>
      <h2 className="page-title">Your Shopping Bag</h2>
      
      <div className={styles['cart-content-layout']}>
        {/* Cart Items List */}
        <div className={styles['cart-items-section']}>
          {cart.map((item) => (
            <div key={item.id} className={`${styles['cart-item']} glass-card`}>
              <img src={item.image} alt={item.name} className={styles['cart-item-image']} />
              <div className={styles['cart-item-details']}>
                <span className={styles['cart-item-category']}>{item.category}</span>
                <h3 className={styles['cart-item-name']}>{item.name}</h3>
                <span className={styles['cart-item-price']}>{formatCurrency(item.price)}</span>
              </div>
              <div className={styles['cart-item-actions']}>
                <div className={styles['quantity-controls']}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className={styles['quantity-btn']}
                  >
                    -
                  </button>
                  <span className={styles['quantity-value']}>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className={styles['quantity-btn']}
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className={styles['remove-item-btn']}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className={styles['cart-extra-actions']}>
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className={styles['cart-summary-section']}>
          <div className={`${styles['summary-card']} glass-card`}>
            <h3>Order Summary</h3>
            <div className={styles['summary-row']}>
              <span>Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className={styles['summary-row']}>
              <span>GST (5%)</span>
              <span>{formatCurrency(gst)}</span>
            </div>
            <div className={styles['summary-row']}>
              <span>Estimated Delivery</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <hr className={styles['summary-divider']} />
            <div className={`${styles['summary-row']} ${styles['total-row']}`}>
              <span>Total Price</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
            
            <Button 
              variant="primary" 
              className={styles['checkout-btn']} 
              onClick={() => alert('Order Placed Successfully! Thank you for shopping with Shanmathi Boutique.')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
