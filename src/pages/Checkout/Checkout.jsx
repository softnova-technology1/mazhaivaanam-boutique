import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { orderAPI } from '../../services/api';
import {
  Lock,
  ShieldCheck,
  Gift,
  Truck,
  Award,
  RotateCcw,
  CreditCard,
  Landmark,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  CheckCircle,
  Smartphone,
  Calendar,
  Download,
  Star,
  Quote,
  Tag,
  Ticket,
  Sparkles,
  X,
  Check
} from 'lucide-react';
import styles from './Checkout.module.css';

export const Checkout = ({ setCurrentTab, directCheckoutItem, setDirectCheckoutItem }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const checkoutItems = directCheckoutItem
    ? [{ ...directCheckoutItem, quantity: directCheckoutItem.quantity || 1 }]
    : cart;

  // Address Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');

  // Form Validation Errors State
  const [errors, setErrors] = useState({});

  // UI Interactive States
  const [deliveryMode, setDeliveryMode] = useState('standard'); // 'pickup' | 'standard'
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'

  // Card Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  // Order Confirmation State
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Order Details Cache for Success Screen
  const [orderCache, setOrderCache] = useState(null);

  useEffect(() => {
    // Generate a random order ID on mount
    const num = Math.floor(100000 + Math.random() * 900000);
    setOrderId(`MV-${num}`);
  }, []);

  // Price calculations
  const GIFT_WRAP_PRICE = 499;
  const mrpTotal = checkoutItems.reduce((sum, item) => sum + (item.oldPrice || Math.round(item.price * 1.15)) * item.quantity, 0);
  const subtotal = directCheckoutItem
    ? (directCheckoutItem.price * (directCheckoutItem.quantity || 1))
    : cartTotal;
  const exclusivePricingSavings = mrpTotal - subtotal;
  const festivalDiscount = Math.round(subtotal * 0.05); // 5% festival discount
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const giftPackAddon = giftPackaging ? GIFT_WRAP_PRICE : 0;
  const convenienceFee = checkoutItems.length > 0 ? 2 : 0;
  const shippingFee = checkoutItems.length > 0 ? (deliveryMode === 'standard' ? 100 : 0) : 0;

  const finalAmount = Math.max(0, subtotal - festivalDiscount - couponDiscount + giftPackAddon + convenienceFee + shippingFee);
  const totalSavings = exclusivePricingSavings + festivalDiscount + couponDiscount;

  // Apply Coupon Handler
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      setCouponMsg({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    setCouponLoading(true);
    setCouponMsg({ type: '', text: '' });
    try {
      const res = await orderAPI.validateCoupon(couponInput.trim(), subtotal);
      setAppliedCoupon(res);
      setCouponMsg({ type: 'success', text: `Coupon "${res.code}" applied! You saved ${formatCurrency(res.discountAmount)}` });
    } catch (err) {
      setAppliedCoupon(null);
      setCouponMsg({ type: 'error', text: err.message || 'Invalid or expired coupon code' });
    }
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponMsg({ type: '', text: '' });
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();

    // Validate fields and record inline error text
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';

    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (deliveryMode === 'standard') {
      if (!pinCode.trim()) newErrors.pinCode = 'Pin Code is required';
      if (!addressLine.trim()) newErrors.addressLine = 'Address is required';
      if (!city.trim()) newErrors.city = 'City / Town is required';
      if (!stateName.trim()) newErrors.stateName = 'State is required';
    }

    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) newErrors.cardNumber = 'Card Number is required';
      if (!expiry.trim()) newErrors.expiry = 'Expiry is required';
      if (!cvv.trim()) newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);

    // If there are errors, stop and scroll to first error field
    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      const firstError = errorKeys[0];
      const el = document.getElementById(firstError);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    // Cache the order information before clearing the cart
    const orderDetails = {
      orderId,
      fullName,
      email,
      phone,
      pinCode,
      addressLine,
      city,
      stateName,
      deliveryMode,
      giftPackaging,
      giftMessage,
      paymentMethod,
      finalAmount,
      totalSavings,
      mrpTotal,
      subtotal,
      festivalDiscount,
      couponCode: appliedCoupon?.code || '',
      couponDiscount,
      giftPackAddon,
      shippingFee,
      items: [...checkoutItems],
      placedOnDate: getFormattedDate(0),
      arrivalRange: `${getFormattedDate(6)} — ${getFormattedDate(9)}`
    };

    setOrderCache(orderDetails);

    // Save to local storage for My Orders page
    const saved = localStorage.getItem('boutique_orders');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift({ ...orderDetails, status: 'IN TRANSIT' });
    localStorage.setItem('boutique_orders', JSON.stringify(list));

    // Clear the cart reactive context or direct checkout item
    if (directCheckoutItem) {
      if (setDirectCheckoutItem) setDirectCheckoutItem(null);
    } else {
      clearCart();
    }

    // Set visual confirmation status
    setOrderConfirmed(true);

    // Scroll page to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper date formatter
  const getFormattedDate = (daysOffset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleInvoiceDownload = () => {
    if (!orderCache) return;
    const txtContent = `
=========================================
      MAZHAI VAANAM - INVOICE
=========================================
Order ID: ${orderCache.orderId}
Date: ${orderCache.placedOnDate}
Customer Name: ${orderCache.fullName}
Email: ${orderCache.email}
Phone: ${orderCache.phone}
Shipping Address: 
  ${orderCache.addressLine},
  ${orderCache.city}, ${orderCache.stateName} - ${orderCache.pinCode}

-----------------------------------------
ITEMS ORDERED:
${orderCache.items.map(item => `- ${item.name} (Qty: ${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`).join('\n')}

-----------------------------------------
BILLING DETAILS:
Subtotal (MRP): ${formatCurrency(orderCache.mrpTotal)}
Exclusive Member Price: ${formatCurrency(orderCache.subtotal)}
Festival Discount: -${formatCurrency(orderCache.festivalDiscount)}
Gift Wrap Packaging: +${formatCurrency(orderCache.giftPackAddon)}
${orderCache.deliveryMode === 'pickup' ? 'Self Pickup' : 'Standard Shipping'}: ${orderCache.deliveryMode === 'pickup' ? 'FREE' : '+' + formatCurrency(orderCache.shippingFee)}
FINAL AMOUNT PAID: ${formatCurrency(orderCache.finalAmount)}
-----------------------------------------
Thank you for choosing handloom heritage.
=========================================
    `;
    const element = document.createElement("a");
    const file = new Blob([txtContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice-${orderCache.orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (checkoutItems.length === 0 && !orderConfirmed) {
    return (
      <div className={styles.checkoutPageContainer}>
        <div className={styles.emptyCheckoutBox}>
          <ShoppingBag size={48} strokeWidth={1} className={styles.emptyIcon} />
          <h2>Your Bag is Empty</h2>
          <p>You cannot proceed to checkout without items in your shopping bag.</p>
          <button
            className={styles.backBtn}
            onClick={() => setCurrentTab('shop')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPageContainer}>
      {orderConfirmed && orderCache ? (
        /* Dynamic High-Fidelity Success Screen */
        <div className={styles.successWrapper}>

          {/* Hero Section */}
          <section className={styles.successHero}>
            <div className={styles.sareePattern}></div>
            <div className={styles.heroLayout}>
              <div className={`${styles.successCheckIconCircle} ${styles.goldGlow}`}>
                <CheckCircle size={44} strokeWidth={1.5} className={styles.checkIconInner} />
              </div>
              <h1 className={styles.successMainTitle}>Thank You for Choosing Mazhai Vaanam</h1>
              <p className={styles.successSubtitle}>
                "Your order has been successfully placed and our artisans are preparing your handcrafted saree with the utmost care."
              </p>
            </div>

            <div className={`${styles.boxImageContainer} ${styles.animateFloat}`}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4sMpwiwx1EbTL9YRHowuTbzYHd4nPLLNWsfQ3yn38V-xsgWDzL4Y8uNWlNhEoD84RoQBCi9C31jEFVAieMc4rjMIKSwmFLg1SqnifPTf7s7Ah7FZF609JKMnrG4rQQU3j_jkEZX1PGkHeOnL6VcPPwIIjsn3f2eM8pcnm1x5mn1ndcT1J5edOwxZErXoZqj8HHwprUE9abOnHTl7aK3sZh_J9rnsQL0EfsEhVzWdXN9dU7ZlW3tsZ"
                alt="Premium Gift Box Wrap"
                className={styles.boxImage}
              />
            </div>
          </section>

          {/* Details & Summaries Columns */}
          <div className={styles.successDetailsGrid}>

            {/* Left Column: Summary and Timeline */}
            <div className={styles.successLeftColumn}>

              <div className={`${styles.invoiceCard} ${styles.luxuryShadow}`}>
                <div className={styles.invoiceHeader}>
                  <div>
                    <span className={styles.invoiceConfirmedTag}>Confirmed</span>
                    <h2 className={styles.invoiceIdHeader}>Order #{orderCache.orderId}</h2>
                  </div>
                  <div className={styles.invoiceDateBlock}>
                    <span className={styles.invoiceDateLabel}>PLACED ON</span>
                    <p className={styles.invoiceDateValue}>{orderCache.placedOnDate}</p>
                  </div>
                </div>

                <div className={styles.invoiceQuickInfo}>
                  <div className={styles.arrivalInfo}>
                    <h3 className={styles.arrivalTitle}>Expected Arrival</h3>
                    <div className={styles.arrivalDetails}>
                      <Calendar size={18} className={styles.arrivalIcon} />
                      <p>{orderCache.arrivalRange}</p>
                    </div>
                  </div>

                  <div className={styles.invoiceActionsRow}>
                    <button onClick={handleInvoiceDownload} className={styles.downloadInvoiceBtn}>
                      <Download size={14} />
                      Invoice
                    </button>
                    <button
                      onClick={() => {
                        window.history.pushState(null, '', `/track-order?orderId=${orderCache.orderId}`);
                        setCurrentTab('track-order');
                      }}
                      className={styles.trackOrderBtn}
                    >
                      <Truck size={14} />
                      Track
                    </button>
                  </div>
                </div>

                {/* Timeline craft process */}
                <div className={styles.timelineWrapper}>
                  <h3 className={styles.timelineHeader}>Craftsmanship to Doorstep</h3>
                  <div className={styles.timelineVisual}>
                    <div className={styles.timelineRowLine}></div>
                    <div className={styles.timelineStepsRow}>

                      {/* Step 1 */}
                      <div className={styles.timelineStepBlock}>
                        <div className={`${styles.timelineStepDot} ${styles.activeStep}`}>
                          <CheckCircle size={16} fill="white" />
                        </div>
                        <span className={`${styles.timelineStepLabel} ${styles.activeLabel}`}>Confirmed</span>
                      </div>



                      {/* Step 4 */}
                      <div className={styles.timelineStepBlock}>
                        <div className={styles.timelineStepDot}>
                          <Truck size={14} />
                        </div>
                        <span className={styles.timelineStepLabel}>Shipped</span>
                      </div>

                      {/* Step 5 */}
                      <div className={styles.timelineStepBlock}>
                        <div className={styles.timelineStepDot}>
                          <RotateCcw size={14} />
                        </div>
                        <span className={styles.timelineStepLabel}>Delivered</span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Points Box & Quote */}
              <div className={styles.rewardsQuoteBlock}>

                {/* Rewards Card */}
                <div className={styles.rewardsCard}>
                  <div className={styles.rewardsHeader}>
                    <Star size={24} className={styles.rewardsStarIcon} />
                    <h3>Silk Points</h3>
                  </div>
                  <p>
                    Congratulations! You've earned <span className={styles.rewardsPointsText}>{Math.round(orderCache.finalAmount * 0.1)} Silk Points</span> from this purchase. Use them on your next heirloom piece.
                  </p>
                  <span
                    onClick={() => alert("Rewards portal: points active!")}
                    className={styles.rewardsPortalLink}
                    role="button"
                    tabIndex={0}
                  >
                    View Rewards Portal
                  </span>
                </div>

                {/* Weaver quote */}
                <div className={styles.weaverQuoteCard}>
                  <Quote size={40} className={styles.quoteIconSymbol} />
                  <p>
                    "Welcome to the Mazhai Vaanam family. Each thread of your {orderCache.items[0]?.name || 'handcrafted'} Saree has been woven with passion and decades of heritage. We hope this piece brings as much joy to your celebrations as it did to our weavers."
                  </p>
                  <p className={styles.quoteSignature}>— The Mazhai Vaanam Atelier</p>
                </div>

              </div>

              {/* Continue Shopping button */}
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button className={styles.finishShoppingBtn} onClick={() => setCurrentTab('shop')}>
                  Return to Homepage
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>

            {/* Right Column: Ordered Items Bag Summary */}
            <aside className={styles.successRightColumn}>
              <div className={styles.bagSummaryBox}>
                <h2 className={styles.bagSummaryTitle}>Bag Summary</h2>

                {/* Items List */}
                <div className={styles.orderedItemsWrapper}>
                  {orderCache.items.map((item) => (
                    <div key={item.id} className={styles.orderedItemRow}>
                      <div className={styles.orderedItemThumb}>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className={styles.orderedItemDetails}>
                        <p className={styles.orderedItemColName}>
                          {item.category === 'Banarasi' ? 'Royal Heritage Collection' : 'Prakriti Series'}
                        </p>
                        <h4>{item.name}</h4>
                        <p className={styles.orderedItemQty}>Qty: {item.quantity.toString().padStart(2, '0')} | Size: Standard</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price list */}
                <div className={styles.successPriceBreakdown}>
                  <div className={styles.successPriceRow}>
                    <span>Maximum Retail Price (MRP)</span>
                    <span className={styles.mrpText}>{formatCurrency(orderCache.mrpTotal)}</span>
                  </div>
                  <div className={styles.successPriceRow} style={{ color: 'var(--primary)', fontWeight: '500' }}>
                    <span>Exclusive Atelier Price</span>
                    <span>{formatCurrency(orderCache.subtotal)}</span>
                  </div>
                  <div className={styles.successDiscountRow}>
                    <span>Festival Privilege Discount</span>
                    <span>-{formatCurrency(orderCache.festivalDiscount)}</span>
                  </div>
                  <div className={styles.successPriceRow}>
                    <span>Convenient Fees</span>
                    <span>₹2</span>
                  </div>
                  {orderCache.giftPackaging && (
                    <div className={styles.successPriceRow}>
                      <span>Luxury Packaging Addon</span>
                      <span>{formatCurrency(GIFT_WRAP_PRICE)}</span>
                    </div>
                  )}
                  <div className={styles.successPriceRow}>
                    <span>{orderCache.deliveryMode === 'pickup' ? 'Self Pickup' : 'Standard Shipping'}</span>
                    <span>{orderCache.deliveryMode === 'pickup' ? 'FREE' : formatCurrency(orderCache.shippingFee)}</span>
                  </div>
                </div>

                {/* Total box */}
                <div className={styles.successTotalPaidCard}>
                  <div className={styles.totalPaidInfo}>
                    <span className={styles.totalPaidLabel}>Total Paid</span>
                    <span className={styles.totalPaidAmount}>{formatCurrency(orderCache.finalAmount)}</span>
                  </div>
                </div>

                {/* Savings Badge */}
                <div className={styles.successSavingsHighlight}>
                  <Award size={18} className={styles.savingsIconSymbol} />
                  <p>You Saved {formatCurrency(orderCache.totalSavings)}</p>
                </div>

                {/* Secure Badge */}
                <div className={styles.successSecureVerification}>
                  <ShieldCheck size={18} className={styles.secureVerificationIcon} />
                  <p>Secure payment verified by Mazhai Vaanam Boutique Partners</p>
                </div>
              </div>
            </aside>

          </div>
        </div>
      ) : (
        /* Standard Checkout Form Flow */
        <>
          <div className={styles.layoutGrid}>
            {/* Left Column: Form Flow */}
            <div className={styles.leftColumn}>

              {/* Progress Indicator */}
              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div className={styles.progressLine}></div>
                  <div className={styles.step}>
                    <div className={`${styles.dot} ${styles.completed}`}></div>
                    <span className={styles.stepLabel}>Bag</span>
                  </div>
                  <div className={styles.step}>
                    <div className={`${styles.dot} ${styles.active}`}></div>
                    <span className={`${styles.stepLabel} ${styles.activeLabel}`}>Checkout</span>
                  </div>
                  <div className={styles.step}>
                    <div className={styles.dot}></div>
                    <span className={styles.stepLabel}>Payment</span>
                  </div>
                  <div className={styles.step}>
                    <div className={styles.dot}></div>
                    <span className={styles.stepLabel}>Confirm</span>
                  </div>
                </div>
              </div>

              {/* Shipping / Contact Details */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>{deliveryMode === 'standard' ? 'Shipping Details' : 'Contact Details'}</h2>
                <form className={styles.formContainer} onSubmit={handleCompleteOrder}>
                  <div className={styles.gridRow}>
                    <div className={`${styles.floatingLabelContainer} ${errors.fullName ? styles.inputErrorBorder : ''}`}>
                      <input
                        type="text"
                        required
                        placeholder=" "
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                        }}
                        className={styles.formInput}
                        id="fullName"
                      />
                      <label className={styles.formLabel}>Full Name *</label>
                      {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                    </div>

                    <div className={`${styles.floatingLabelContainer} ${errors.email ? styles.inputErrorBorder : ''}`}>
                      <input
                        type="email"
                        required
                        placeholder=" "
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className={styles.formInput}
                        id="email"
                      />
                      <label className={styles.formLabel}>Email Address *</label>
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                  </div>

                  <div className={styles.gridRow}>
                    <div className={`${styles.floatingLabelContainer} ${errors.phone ? styles.inputErrorBorder : ''}`}>
                      <input
                        type="tel"
                        required
                        placeholder=" "
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                        }}
                        className={styles.formInput}
                        id="phone"
                      />
                      <label className={styles.formLabel}>Phone Number *</label>
                      {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>

                    {deliveryMode === 'standard' && (
                      <div className={`${styles.floatingLabelContainer} ${errors.pinCode ? styles.inputErrorBorder : ''}`}>
                        <input
                          type="text"
                          required={deliveryMode === 'standard'}
                          placeholder=" "
                          value={pinCode}
                          onChange={(e) => {
                            setPinCode(e.target.value);
                            if (errors.pinCode) setErrors(prev => ({ ...prev, pinCode: '' }));
                          }}
                          className={styles.formInput}
                          id="pinCode"
                        />
                        <label className={styles.formLabel}>Pin Code *</label>
                        {errors.pinCode && <span className={styles.errorText}>{errors.pinCode}</span>}
                      </div>
                    )}
                  </div>

                  {deliveryMode === 'standard' && (
                    <>
                      <div className={`${styles.floatingLabelContainer} ${errors.addressLine ? styles.inputErrorBorder : ''}`} style={{ width: '100%' }}>
                        <input
                          type="text"
                          required={deliveryMode === 'standard'}
                          placeholder=" "
                          value={addressLine}
                          onChange={(e) => {
                            setAddressLine(e.target.value);
                            if (errors.addressLine) setErrors(prev => ({ ...prev, addressLine: '' }));
                          }}
                          className={styles.formInput}
                          id="addressLine"
                        />
                        <label className={styles.formLabel}>Flat, House no., Apartment *</label>
                        {errors.addressLine && <span className={styles.errorText}>{errors.addressLine}</span>}
                      </div>

                      <div className={styles.gridRow}>
                        <div className={`${styles.floatingLabelContainer} ${errors.city ? styles.inputErrorBorder : ''}`}>
                          <input
                            type="text"
                            required={deliveryMode === 'standard'}
                            placeholder=" "
                            value={city}
                            onChange={(e) => {
                              setCity(e.target.value);
                              if (errors.city) setErrors(prev => ({ ...prev, city: '' }));
                            }}
                            className={styles.formInput}
                            id="city"
                          />
                          <label className={styles.formLabel}>City / Town *</label>
                          {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                        </div>

                        <div className={`${styles.floatingLabelContainer} ${errors.stateName ? styles.inputErrorBorder : ''}`}>
                          <input
                            type="text"
                            required={deliveryMode === 'standard'}
                            placeholder=" "
                            value={stateName}
                            onChange={(e) => {
                              setStateName(e.target.value);
                              if (errors.stateName) setErrors(prev => ({ ...prev, stateName: '' }));
                            }}
                            className={styles.formInput}
                            id="stateName"
                          />
                          <label className={styles.formLabel}>State *</label>
                          {errors.stateName && <span className={styles.errorText}>{errors.stateName}</span>}
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </section>

              {/* Delivery Mode */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Delivery Mode</h2>
                <div className={styles.deliveryModeGrid}>
                  <label
                    className={`${styles.deliveryLabelCard} ${deliveryMode === 'standard' ? styles.selectedDelivery : ''}`}
                    onClick={() => setDeliveryMode('standard')}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMode === 'standard'}
                      onChange={() => setDeliveryMode('standard')}
                      className={styles.hiddenRadio}
                    />
                    <div className={styles.deliveryInfo}>
                      <span className={styles.deliveryOptionTitle}>Standard Delivery</span>
                      <p className={styles.deliveryOptionSubtitle}>Delivery in 5-7 business days</p>
                    </div>
                    <span className={styles.deliveryCost}>{formatCurrency(100)}</span>
                  </label>

                  <label
                    className={`${styles.deliveryLabelCard} ${deliveryMode === 'pickup' ? styles.selectedDelivery : ''}`}
                    onClick={() => setDeliveryMode('pickup')}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMode === 'pickup'}
                      onChange={() => setDeliveryMode('pickup')}
                      className={styles.hiddenRadio}
                    />
                    <div className={styles.deliveryInfo}>
                      <span className={styles.deliveryOptionTitle}>Self Pickup</span>
                      <p className={styles.deliveryOptionSubtitle}>ANA Complex- 1st Floor, Sethu Road, Peravurani, Thanjavur, Tamil Nadu, India 614804</p>
                    </div>
                    <span className={styles.deliveryCost}>FREE</span>
                  </label>
                </div>
              </section>

              {/* Payment Methods */}
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>Payment Method</h2>
                <div className={styles.paymentMethodsStack}>
                  {/* Card Expanded */}
                  <div
                    className={`${styles.paymentMethodCard} ${paymentMethod === 'card' ? styles.activePaymentCard : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className={styles.paymentHeader}>
                      <div className={styles.paymentTitleBlock}>
                        <CreditCard className={styles.paymentIcon} size={20} />
                        <span className={styles.paymentLabelName}>Credit / Debit Card</span>
                      </div>
                      <ChevronRight size={16} className={`${styles.expandChevron} ${paymentMethod === 'card' ? styles.chevronRotated : ''}`} />
                    </div>

                    {paymentMethod === 'card' && (
                      <div className={styles.cardInputWrapper} onClick={(e) => e.stopPropagation()}>
                        <div className={`${styles.floatingLabelContainer} ${errors.cardNumber ? styles.inputErrorBorder : ''}`} style={{ width: '100%', marginBottom: '16px' }}>
                          <input
                            type="text"
                            placeholder=" "
                            value={cardNumber}
                            onChange={(e) => {
                              setCardNumber(e.target.value);
                              if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: '' }));
                            }}
                            className={styles.formInput}
                            id="cardNumber"
                          />
                          <label className={styles.formLabel}>Card Number *</label>
                          {errors.cardNumber && <span className={styles.errorText}>{errors.cardNumber}</span>}
                        </div>
                        <div className={styles.gridRow}>
                          <div className={`${styles.floatingLabelContainer} ${errors.expiry ? styles.inputErrorBorder : ''}`}>
                            <input
                              type="text"
                              placeholder=" "
                              value={expiry}
                              onChange={(e) => {
                                setExpiry(e.target.value);
                                if (errors.expiry) setErrors(prev => ({ ...prev, expiry: '' }));
                              }}
                              className={styles.formInput}
                              id="expiry"
                            />
                            <label className={styles.formLabel}>Expiry (MM/YY) *</label>
                            {errors.expiry && <span className={styles.errorText}>{errors.expiry}</span>}
                          </div>
                          <div className={`${styles.floatingLabelContainer} ${errors.cvv ? styles.inputErrorBorder : ''}`}>
                            <input
                              type="password"
                              placeholder=" "
                              value={cvv}
                              onChange={(e) => {
                                setCvv(e.target.value);
                                if (errors.cvv) setErrors(prev => ({ ...prev, cvv: '' }));
                              }}
                              className={styles.formInput}
                              id="cvv"
                            />
                            <label className={styles.formLabel}>CVV *</label>
                            {errors.cvv && <span className={styles.errorText}>{errors.cvv}</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* UPI */}
                  <div
                    className={`${styles.paymentMethodCard} ${paymentMethod === 'upi' ? styles.activePaymentCard : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className={styles.paymentHeader}>
                      <div className={styles.paymentTitleBlock}>
                        <Smartphone className={styles.paymentIcon} size={20} />
                        <span className={styles.paymentLabelName}>UPI (PhonePe, GPay, Paytm)</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Banking */}
                  <div
                    className={`${styles.paymentMethodCard} ${paymentMethod === 'netbanking' ? styles.activePaymentCard : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <div className={styles.paymentHeader}>
                      <div className={styles.paymentTitleBlock}>
                        <Landmark className={styles.paymentIcon} size={20} />
                        <span className={styles.paymentLabelName}>Net Banking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Sticky Summary */}
            <div className={styles.rightColumn}>
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>

                {/* Product Previews */}
                <div className={styles.productPreviewsList}>
                  {checkoutItems.map((item) => (
                    <div key={item.id} className={styles.productPreviewItem}>
                      <div className={styles.previewThumb}>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className={styles.previewDetails}>
                        <h4 className={styles.previewItemName}>{item.name}</h4>
                        <p className={styles.previewQtyText}>Qty: {item.quantity} | Size: Free Size</p>
                        <p className={styles.previewPrice}>{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div style={{ margin: '16px 0', padding: '14px 16px', background: 'rgba(200, 163, 77, 0.08)', borderRadius: 8, border: '1px dashed var(--primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: 8 }}>
                    <Ticket size={16} /> Have a Promo / Coupon Code?
                  </div>

                  {appliedCoupon ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(34, 197, 94, 0.15)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--success)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Check size={16} color="var(--success)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)' }}>
                          {appliedCoupon.code}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          (-{formatCurrency(appliedCoupon.discountAmount)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 2 }}
                        title="Remove Coupon"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="text"
                        placeholder="e.g. MAZHAI10"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          if (couponMsg.text) setCouponMsg({ type: '', text: '' });
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-surface)',
                          color: 'var(--text-main)',
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      />
                      <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 6,
                          background: 'var(--primary)',
                          color: '#000',
                          border: 'none',
                          fontWeight: 600,
                          fontSize: '0.82rem',
                          cursor: couponLoading || !couponInput.trim() ? 'not-allowed' : 'pointer',
                          opacity: couponLoading || !couponInput.trim() ? 0.6 : 1
                        }}
                      >
                        {couponLoading ? 'Checking...' : 'Apply'}
                      </button>
                    </form>
                  )}

                  {couponMsg.text && (
                    <div style={{
                      marginTop: 8,
                      fontSize: '0.78rem',
                      color: couponMsg.type === 'error' ? 'var(--danger)' : 'var(--success)',
                      fontWeight: 500
                    }}>
                      {couponMsg.text}
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className={styles.priceBreakdown}>
                  <div className={styles.priceRow}>
                    <span>Subtotal (MRP)</span>
                    <span className={styles.mrpValue}>{formatCurrency(mrpTotal)}</span>
                  </div>
                  <div className={styles.priceRow}>
                    <span>Exclusive Price</span>
                    <span className={styles.priceValue}>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className={styles.discountRow}>
                    <span>Festival Discount</span>
                    <span className={styles.discountValue}>-{formatCurrency(festivalDiscount)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className={styles.discountRow} style={{ color: 'var(--success)' }}>
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span className={styles.discountValue} style={{ color: 'var(--success)' }}>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <div className={styles.priceRow}>
                    <span>Convenient Fees</span>
                    <span className={styles.priceValue}>₹2</span>
                  </div>
                  {giftPackaging && (
                    <div className={styles.priceRow} style={{ color: 'var(--text-main)' }}>
                      <span>Luxury Packaging Addon</span>
                      <span className={styles.priceValue}>{formatCurrency(GIFT_WRAP_PRICE)}</span>
                    </div>
                  )}
                  <div className={styles.priceRow}>
                    <span>{deliveryMode === 'pickup' ? 'Self Pickup' : 'Shipping'}</span>
                    <span className={styles.priceValue}>{deliveryMode === 'pickup' ? 'FREE' : formatCurrency(shippingFee)}</span>
                  </div>
                </div>

                {/* Total Savings & Final Payable */}
                <div className={styles.totalsBlock}>
                  <div className={styles.savingsRow}>
                    <span className={styles.savingsLabel}>TOTAL SAVINGS</span>
                    <span className={styles.savingsValue}>{formatCurrency(totalSavings)}</span>
                  </div>
                  <div className={styles.payableRow}>
                    <span className={styles.payableLabel}>Final Payable</span>
                    <span className={styles.payableValue}>{formatCurrency(finalAmount)}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  className={styles.shimmerBtn}
                  onClick={handleCompleteOrder}
                >
                  COMPLETE ORDER
                  <Lock className={styles.checkoutIcon} size={18} />
                </button>

                <p className={styles.secureText}>
                  <ShieldCheck size={14} className={styles.secureIcon} />
                  100% SECURE TRANSACTIONS
                </p>
              </div>

              {/* Trust Badges */}
              <div className={styles.trustBadges}>
                <div className={styles.trustBadgeItem}>
                  <ShieldCheck className={styles.trustBadgeIcon} size={24} />
                  <p className={styles.trustBadgeText}>SECURE CHECKOUT</p>
                </div>
                <div className={styles.trustBadgeItem}>
                  <Lock className={styles.trustBadgeIcon} size={24} />
                  <p className={styles.trustBadgeText}>SSL ENCRYPTED</p>
                </div>
                <div className={styles.trustBadgeItem}>
                  <Award className={styles.trustBadgeIcon} size={24} />
                  <p className={styles.trustBadgeText}>100% TRUSTED</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
