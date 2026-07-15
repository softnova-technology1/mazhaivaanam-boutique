import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import { Button } from '../components/common/Button';
import './Pages.css';

export const Cart = ({ setCurrentTab }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();

  const gst = cartTotal * 0.05; // 5% GST for garments/sarees
  const shipping = cartTotal >= 10000 || cartTotal === 0 ? 0 : 150;
  const grandTotal = cartTotal + gst + shipping;

  if (cart.length === 0) {
    return (
      <div className="page cart-page empty-cart container">
        <div className="empty-cart-card glass-card">
          <span className="empty-cart-icon">🛒</span>
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
    <div className="page cart-page container">
      <h2 className="page-title">Your Shopping Bag</h2>
      
      <div className="cart-content-layout">
        {/* Cart Items List */}
        <div className="cart-items-section">
          {cart.map((item) => (
            <div key={item.id} className="cart-item glass-card">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <span className="cart-item-category">{item.category}</span>
                <h3 className="cart-item-name">{item.name}</h3>
                <span className="cart-item-price">{formatCurrency(item.price)}</span>
              </div>
              <div className="cart-item-actions">
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-item-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div className="cart-extra-actions">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="cart-summary-section">
          <div className="summary-card glass-card">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span>GST (5%)</span>
              <span>{formatCurrency(gst)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Delivery</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total Price</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
            
            <Button 
              variant="primary" 
              className="checkout-btn" 
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
