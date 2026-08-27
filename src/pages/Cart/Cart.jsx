import { useState, useRef } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { 
  Heart, 
  Plus, 
  Minus, 
  Gift, 
  Shield, 
  Lock, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag 
} from 'lucide-react';
import styles from './Cart.module.css';

export const Cart = ({ setCurrentTab }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, addToCart, clearCart } = useCart();
  const carouselRef = useRef(null);

  // Local interactive states
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Move item to wishlist & remove from cart
  const handleMoveToWishlist = (item) => {
    const saved = localStorage.getItem('boutique_wishlist');
    const wishlistItems = saved ? JSON.parse(saved) : [];
    
    if (!wishlistItems.find(w => w.id === item.id)) {
      const wishItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        fabric: item.fabric || '',
        color: item.color || '',
        oldPrice: item.oldPrice || 0,
        tag: item.tag || ''
      };
      wishlistItems.push(wishItem);
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
    }
    
    // Notify Navbar and wishlist listener
    window.dispatchEvent(new Event('storage'));
    
    removeFromCart(item.id);
    triggerToast(`"${item.name}" moved to your Wishlist.`);
  };

  // Handlers for Coupon Code
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase().trim() === 'FESTIVAL1000') {
      setCouponApplied(true);
      setCouponError('');
      triggerToast('Coupon FESTIVAL1000 applied! Saved ₹1,000.');
    } else if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
    } else {
      setCouponError('Invalid code. Try FESTIVAL1000');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode('');
    setCouponError('');
    triggerToast('Coupon removed.');
  };

  // Carousel Scrolling
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Convert Hex Colors to descriptive text
  const getColorName = (colorVal) => {
    if (!colorVal) return 'Heritage Gold';
    const c = colorVal.toUpperCase();
    if (c === '#6B102A') return 'Deep Ruby Maroon';
    if (c === '#C8A34D') return 'Sunset Amber Gold';
    if (c === '#004D40') return 'Forest Emerald Green';
    if (c === '#1A237E') return 'Twilight Indigo Blue';
    if (c === '#FFF9E3') return 'Royal Ivory Cream';
    return 'Heritage Gold';
  };

  // Suggested styling accessories
  const suggestedLookItems = [
    {
      id: 'suggest-1',
      name: "Mughal Ruby Haar",
      category: "Jewelry",
      fabric: "Kundan Work",
      color: "#C8A34D",
      price: 124000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAg4PFsYcv_lO-Qc9DEtZZXPZEtOGGlueO_c5WoXqbfqfnj9I7P5U1Dm9e66q0Or07aG_jK72KFmizTqsOgOzZ7ogRSdieccRcLnizoVDlkuKb-YiMz3lR_5j83VM9PkjEXSXWaWGUaoLbw7oRoLXxjeHGqw5Pr78xR9hOADB0UAQkkFGH9nGgRdmedQlTGaT2cjp5jAgfbaELUDVY2S2_ujnubWNaF42_U8TxfAESYHWGqmE26A5T",
      description: "Exquisite antique gold necklace with deep red rubies and emeralds, designed in a traditional temple jewelry style."
    },
    {
      id: 'suggest-2',
      name: "Zardosi Brocade Blouse",
      category: "Blouse",
      fabric: "Brocade Silk",
      color: "#C8A34D",
      price: 12500,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfWGH2lJwshDqddKYN2O01gQRP5132vEP2GVQP08gz7ANRawBTK8oby21Kaq7UICEdFmjGaWeDFblLuYAog4AlFJ6SAocK-_TTBcJVJIptsuburm-IDlPop7AcEFGeegPdSuY93k1bnR785faLZXMW1ZAQChu6dRf2kgSTJUBioEMPiEg8PBhmTFaVh4N8l12e1cLppUdMfG1ns7QtlkEND44M_b9kA7mJZGD0ta8nvymT2ezbzHeF",
      description: "A custom-stitched brocade silk blouse in antique gold with intricate dori work and pearl embellishments on the sleeves."
    },
    {
      id: 'suggest-3',
      name: "Filigree Jhumkas",
      category: "Jewelry",
      fabric: "Gold Filigree",
      color: "#C8A34D",
      price: 45200,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBLC5HZcXBUI5Qg7RdF0ENdxRnsPuRPg-gwJqzVE0k3O2Mqidh4bhGokrfNTokReob82IPn7GdKBRCvwwzl-x7oWWfKIncW6AI2Uzfq-YOAemckufVqTcvW7gTBzio0YMvbUtI2x1OXsR9j2hLaC5IoYcRuzxzXk-7LyGEWer25tQ-9XHMIQw6PgvSG81_HGEnMoPuxp_tX6C2OGPfPc_4QZUG513mVWnS0I43LfEgd11RtbQRgLfMe",
      description: "Solid gold jhumka earrings featuring delicate gold filigree and tiny pearl drops."
    },
    {
      id: 'suggest-4',
      name: "Bridal Silk Potli",
      category: "Accessory",
      fabric: "Silk",
      color: "#6B102A",
      price: 8900,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCogy0F1ECkHJnGhA9_TTMTAAmRUINfmG0KH-pCPgFbjS5n0-dbBvEo5F5e3aNIgcmD7BPlfsNff5UJF06Jqrbh8hKwTCnUxw4bnzXOF2SKgdryolD__qS9w_wP21aaUmpgS1Ja4IUwnV3-BobWqgx97iNt-FYIreGZoZKPMAECBvnJTWEvfEr65qSxClMrZfk1cxPMwZvy9ghrn_9BqqRqTDiZo4DFiR9KPMUqbpqPZkaF53_KZRDA",
      description: "A luxurious silk potli bag in deep maroon, matching the ruby saree, with gold embroidery and heavy bead tassels."
    }
  ];

  // Dynamic calculations
  const mrpTotal = cart.reduce((sum, item) => sum + (item.oldPrice || Math.round(item.price * 1.15)) * item.quantity, 0);
  const subtotal = cartTotal;
  const exclusivePricingSavings = mrpTotal - subtotal;
  const festivalDiscount = Math.round(subtotal * 0.05); // 5% discount
  const couponDiscount = couponApplied ? 1000 : 0;
  const totalSavings = exclusivePricingSavings + festivalDiscount + couponDiscount;
  const shippingFee = cart.length > 0 ? 100 : 0;
  const finalAmount = Math.max(0, mrpTotal - totalSavings) + (cart.length > 0 ? 2 : 0) + shippingFee;

  const handleCheckout = () => {
    setCurrentTab('checkout');
  };

  return (
    <div className={styles.cartPageContainer}>
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumbs & Header */}
      <nav className={styles.breadcrumbs}>
        <span onClick={() => setCurrentTab('shop')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span className={styles.activeBreadcrumb}>Shopping Bag</span>
      </nav>
      
      <header>
        <h1 className={styles.pageTitle}>Your Shopping Bag</h1>
        <p className={styles.pageTagline}>Refining elegance, one selection at a time.</p>
      </header>

      {/* Layout Grid */}
      <div className={styles.layoutGrid}>
        {cart.length === 0 ? (
          /* Empty State Fallback */
          <div className={styles.emptyCartBox}>
            <ShoppingBag className={styles.emptyCartIcon} size={48} strokeWidth={1} />
            <h2 className={styles.emptyCartTitle}>Your Bag is Empty</h2>
            <p className={styles.emptyCartDesc}>
              Explore our masterfully woven collections to add handcrafted drapes that tell your heritage story.
            </p>
            <button 
              className={styles.shimmerBtn} 
              onClick={() => setCurrentTab('catalog')}
              style={{ width: 'fit-content', minWidth: '280px', padding: '15px 30px', marginTop: '12px' }}
            >
              Explore Collections
              <ArrowRight className={styles.checkoutIcon} size={18} />
            </button>
          </div>
        ) : (
          /* Main columns with items */
          <>
            {/* Left Column: Cart Items */}
            <div className={styles.leftColumn}>
              <div className={styles.cartItemsList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.imageContainer}>
                      <img src={item.image} alt={item.name} className={styles.itemImage} />
                    </div>
                    <div className={styles.itemDetails}>
                      <div>
                        <div className={styles.itemHeader}>
                          <h3 className={styles.itemName}>{item.name}</h3>
                          <p className={styles.itemPrice}>{formatCurrency(item.price)}</p>
                        </div>
                        <p className={styles.itemCollection}>
                          Collection: {item.category === 'Banarasi' ? 'Royal Heirlooms' : 'Prakriti Series'}
                        </p>
                        <div className={styles.specsGrid}>
                          <span className={styles.specLabel}>Fabric:</span>
                          <span className={styles.specValue}>{item.fabric || 'Pure Mulberry Silk'}</span>
                          
                          <span className={styles.specLabel}>Border:</span>
                          <span className={styles.specValue}>
                            {item.category === 'Banarasi' ? 'Zari Brocade' : 'Gold Temple Border'}
                          </span>
                          
                          <span className={styles.specLabel}>Color:</span>
                          <span className={styles.specValue}>{getColorName(item.color)}</span>
                          
                          <span className={styles.specLabel}>Craft:</span>
                          <span className={styles.specValue}>
                            {item.category === 'Cotton' ? 'Handloom Weave' : 'Master Artisan Loom'}
                          </span>
                        </div>
                      </div>

                      <div className={styles.itemFooter}>
                        {/* Quantity controls */}
                        <div className={styles.quantityControls}>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className={styles.quantityBtn}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className={styles.quantityValue}>
                            {item.quantity.toString().padStart(2, '0')}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className={styles.quantityBtn}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.wishlistBtn}
                            onClick={() => handleMoveToWishlist(item)}
                          >
                            Move to Wishlist
                          </button>
                          <button 
                            className={styles.removeBtn}
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className={styles.rightColumn}>
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>

                {/* Coupon Code Block */}
                <div className={styles.couponBlock}>
                  <label className={styles.couponLabel}>Apply Coupon Code</label>
                  {couponApplied ? (
                    <div className={styles.couponAppliedBadge}>
                      <span>FESTIVAL1000 (-₹1,000)</span>
                      <button onClick={handleRemoveCoupon} className={styles.removeCouponLink}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className={styles.couponInputWrapper}>
                      <input 
                        type="text" 
                        placeholder="FESTIVAL1000" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className={styles.couponInput}
                      />
                      <button onClick={handleApplyCoupon} className={styles.couponBtn}>
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className={styles.couponError}>{couponError}</p>}
                </div>

                {/* Price Breakdown */}
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceRow}>
                    <span>Subtotal (MRP)</span>
                    <span className={styles.priceValue}>{formatCurrency(mrpTotal)}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Exclusive Pricing</span>
                    <span className={styles.priceValue}>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className={styles.discountRow}>
                    <span> Discount</span>
                    <span className={styles.discountValue}>-{formatCurrency(festivalDiscount)}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Convenient Fees</span>
                    <span className={styles.priceValue}>₹2</span>
                  </div>
                  {couponApplied && (
                    <div className={styles.discountRow}>
                      <span>Coupon Discount</span>
                      <span className={styles.discountValue}>-₹1,000</span>
                    </div>
                  )}
                  <div className={styles.priceRow}>
                    <span>Shipping</span>
                    <span className={styles.priceValue}>
                      {formatCurrency(shippingFee)}
                    </span>
                  </div>
                </div>

                {/* Savings Badge */}
                <div className={styles.savingsBadge}>
                  <p className={styles.savingsText}>Total Savings: {formatCurrency(totalSavings)}</p>
                </div>

                {/* Total block */}
                <div className={styles.totalBlock}>
                  <div>
                    <p className={styles.totalLabel}>Final Amount</p>
                    <p className={styles.totalAmount}>{formatCurrency(finalAmount)}</p>
                  </div>
                  <span className={styles.taxIncluded}>Incl. of all taxes</span>
                </div>

                {/* CTA Shimmer button */}
                <button className={styles.shimmerBtn} onClick={handleCheckout}>
                  Proceed to Checkout
                  <ArrowRight className={styles.checkoutIcon} size={18} />
                </button>

                {/* Trust Badges */}
                <div className={styles.trustBadges}>
                  <div className={styles.trustBadgeItem}>
                    <Shield className={styles.trustBadgeIcon} size={18} />
                    <span className={styles.trustBadgeText}>100% ORIGINAL</span>
                  </div>
                  <div className={styles.trustBadgeItem}>
                    <Lock className={styles.trustBadgeIcon} size={18} />
                    <span className={styles.trustBadgeText}>SECURE PAY</span>
                  </div>
                  <div className={styles.trustBadgeItem}>
                    <Sparkles className={styles.trustBadgeIcon} size={18} />
                    <span className={styles.trustBadgeText}>HANDCRAFTED</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Cart;
