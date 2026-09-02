import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';
import { orderAPI, addressAPI } from '../../services/api';
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
  ChevronDown,
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
import { useStoreConfig } from '../../context/StoreConfigContext';

export const Checkout = ({ setCurrentTab, directCheckoutItem, setDirectCheckoutItem }) => {
  const { cart, cartTotal, clearCart, updateQuantity } = useCart();
  const storeConfig = useStoreConfig();
  const checkoutItems = directCheckoutItem
    ? [{ ...directCheckoutItem, quantity: directCheckoutItem.quantity || 1 }]
    : cart;

  const { user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(true);

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
  const [showDetailedPrice, setShowDetailedPrice] = useState(false);

  // Card Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  // Order Confirmation & Submission States
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Order Details Cache for Success Screen
  const [orderCache, setOrderCache] = useState(null);

  useEffect(() => {
    // Generate a random order ID on mount
    const num = Math.floor(100000 + Math.random() * 900000);
    setOrderId(`MV-${num}`);

    // Load saved addresses — from backend if logged in, localStorage fallback
    const loadAddresses = async () => {
      try {
        if (user) {
          const serverAddrs = await addressAPI.getAddresses();
          if (serverAddrs && serverAddrs.length > 0) {
            setSavedAddresses(serverAddrs);
            // Addresses from server use _id
            const defaultAddr = serverAddrs.find(a => a.isDefault);
            const firstAddr = serverAddrs[0];
            const selected = defaultAddr || firstAddr;
            if (selected) {
              setShowAddressForm(false);
              setSelectedAddressId(selected._id || selected.id);
            }
            return;
          }
        }
        // Fallback: localStorage (for guests or no server addresses)
        const addresses = JSON.parse(localStorage.getItem('boutique_addresses') || '[]');
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          setShowAddressForm(false);
          const defaultAddr = addresses.find(a => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
          } else {
            setSelectedAddressId(addresses[0].id);
          }
        }
      } catch (e) {
        console.error('Failed to load addresses:', e);
      }
    };
    loadAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      setEmail(prev => prev || user.email || '');
      setFullName(prev => prev || user.name || (user.firstName ? user.firstName + ' ' + (user.lastName || '') : '') || '');
    }
  }, [user]);

  useEffect(() => {
    if (selectedAddressId && !showAddressForm) {
      const addr = savedAddresses.find(a => (a._id || a.id) === selectedAddressId);
      if (addr) {
        setFullName(addr.fullName || addr.name || user?.name || (user?.firstName ? user.firstName + ' ' + (user.lastName || '') : '') || '');
        setPhone(addr.phone || '');
        setAddressLine(addr.addressLine || '');
        setCity(addr.city || '');
        setStateName(addr.stateName || addr.state || '');
        setPinCode(addr.pinCode || '');
      }
    }
  }, [selectedAddressId, showAddressForm, savedAddresses, user]);

  // Image & Quantity Helpers
  const getImageUrl = (item) => {
    if (!item) return '/Images/placeholder.svg';
    let url = item.image;
    if (!url || typeof url !== 'string' || url.startsWith('blob:')) {
      url = item.images?.[0]?.url || '/Images/placeholder.svg';
    }
    return url || '/Images/placeholder.svg';
  };

  const handleQuantityChange = (item, delta) => {
    const currentQty = item.quantity || 1;
    const newQty = Math.max(1, currentQty + delta);
    if (directCheckoutItem) {
      setDirectCheckoutItem(prev => ({ ...prev, quantity: newQty }));
    } else {
      if (updateQuantity) {
        updateQuantity(item.id || item._id, newQty);
      }
    }
  };

  // Price calculations - Strict balance: MRP - Total Savings + Fees = Final Payable
  const GIFT_WRAP_PRICE = 499;
  const DEFAULT_SAREE_WEIGHT_KG = 0.5;

  // Weight-based shipping rate table (same as backend shipping.js)
  const SHIPPING_RATES = [
    { label: 'Standard', uptoKg: 0.5, price: 60 },
    { label: 'Upto 1kg', uptoKg: 1.0, price: 75 },
    { label: 'Upto 1.5kg', uptoKg: 1.5, price: 90 },
    { label: 'Upto 2kg', uptoKg: 2.0, price: 115 },
    { label: 'Upto 2.5kg', uptoKg: 2.5, price: 130 },
    { label: 'Upto 3kg', uptoKg: 3.0, price: 145 },
    { label: 'Upto 4kg', uptoKg: 4.0, price: 170 },
    { label: 'Upto 5kg', uptoKg: 5.0, price: 190 },
    { label: 'Above 5kg', uptoKg: Infinity, price: 220 },
  ];

  const calcShippingFee = (items, mode) => {
    if (mode === 'pickup' || items.length === 0) return 0;
    const totalWeightKg = items.reduce((sum, item) => {
      const w = Number(item.weightKg) || DEFAULT_SAREE_WEIGHT_KG;
      return sum + w * (item.quantity || 1);
    }, 0);
    const slab = SHIPPING_RATES.find(r => totalWeightKg <= r.uptoKg);
    const base = slab ? slab.price : 220;
    return mode === 'express' ? base + 60 : base;
  };

  const getShippingLabel = (items, mode) => {
    if (mode === 'pickup') return 'Store Pickup (Free)';
    if (items.length === 0) return '';
    const totalWeightKg = items.reduce((sum, item) => {
      const w = Number(item.weightKg) || DEFAULT_SAREE_WEIGHT_KG;
      return sum + w * (item.quantity || 1);
    }, 0);
    const slab = SHIPPING_RATES.find(r => totalWeightKg <= r.uptoKg);
    return `${slab ? slab.label : 'Above 5kg'} (${totalWeightKg.toFixed(2)} kg)${mode === 'express' ? ' + Express' : ''}`;
  };

  const mrpTotal = checkoutItems.reduce((sum, item) => sum + (item.oldPrice || Math.round(item.price * 1.15)) * (item.quantity || 1), 0);
  const subtotal = directCheckoutItem
    ? (directCheckoutItem.price * (directCheckoutItem.quantity || 1))
    : cartTotal;

  const exclusivePricingSavings = Math.max(0, mrpTotal - subtotal);
  const festivalDiscount = 0; // festival discount removed
  const festivalDiscountLabel = '';
  const festivalPct = 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalSavings = exclusivePricingSavings + festivalDiscount + couponDiscount;

  const giftPackAddon = giftPackaging ? GIFT_WRAP_PRICE : 0;
  const convenienceFee = checkoutItems.length > 0 ? 2 : 0;
  const shippingFee = calcShippingFee(checkoutItems, deliveryMode);
  const shippingLabel = getShippingLabel(checkoutItems, deliveryMode);
  const totalFees = giftPackAddon + convenienceFee + shippingFee;

  const finalAmount = Math.max(0, mrpTotal - totalSavings + totalFees);

  const [checkoutStep, setCheckoutStep] = useState('checkout'); // 'checkout' | 'payment'

  const renderProgressIndicator = () => {
    return (
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div className={styles.progressLine}></div>
          <div className={styles.step}>
            <div className={`${styles.dot} ${styles.completed}`}></div>
            <span className={styles.stepLabel}>Bag</span>
          </div>
          <div className={styles.step}>
            <div className={`${styles.dot} ${checkoutStep === 'payment' ? styles.completed : styles.active}`}></div>
            <span className={`${styles.stepLabel} ${checkoutStep === 'checkout' ? styles.activeLabel : ''}`}>Checkout</span>
          </div>
          <div className={styles.step}>
            <div className={`${styles.dot} ${checkoutStep === 'payment' ? styles.active : ''}`}></div>
            <span className={`${styles.stepLabel} ${checkoutStep === 'payment' ? styles.activeLabel : ''}`}>Payment</span>
          </div>
          <div className={styles.step}>
            <div className={styles.dot}></div>
            <span className={styles.stepLabel}>Confirm</span>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailsSummary = () => {
    return (
      <div className={styles.detailsSummaryCard}>
        <div className={styles.detailsSummaryHeader}>
          <h3>Delivery & Contact Information</h3>
          <button
            type="button"
            className={styles.editDetailsBtn}
            onClick={() => setCheckoutStep('checkout')}
          >
            Edit Address
          </button>
        </div>
        <div className={styles.detailsSummaryGrid}>
          <div className={styles.detailsSummaryItem}>
            <strong>Full Name:</strong> <span>{fullName}</span>
          </div>
          <div className={styles.detailsSummaryItem}>
            <strong>Email:</strong> <span>{email}</span>
          </div>
          <div className={styles.detailsSummaryItem}>
            <strong>Phone:</strong> <span>{phone}</span>
          </div>
          <div className={styles.detailsSummaryItem}>
            <strong>Delivery Mode:</strong> <span>{deliveryMode === 'pickup' ? 'Self Pickup' : 'Standard Delivery'}</span>
          </div>
          {deliveryMode === 'standard' && (
            <div className={styles.detailsSummaryItem} style={{ gridColumn: 'span 2' }}>
              <strong>Shipping Address:</strong> <span>{`${addressLine}, ${city}, ${stateName} - ${pinCode}`}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const validateForm = () => {
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

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      const firstError = errorKeys[0];
      const el = document.getElementById(firstError);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return false;
    }
    return true;
  };

  const handleConfirmDetails = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (validateForm()) {
      setCheckoutStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isFormFilled = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      return false;
    }
    if (deliveryMode === 'standard') {
      if (!pinCode.trim() || !addressLine.trim() || !city.trim() || !stateName.trim()) {
        return false;
      }
    }
    return true;
  };

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

  const handleCompleteOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    const localOrderDetails = {
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

    const finalizeSuccessOrder = (finalOrderId) => {
      const finalDetails = { ...localOrderDetails, orderId: finalOrderId || orderId };
      setOrderCache(finalDetails);

      const saved = localStorage.getItem('boutique_orders');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift({ ...finalDetails, status: 'IN TRANSIT' });
      localStorage.setItem('boutique_orders', JSON.stringify(list));

      if (directCheckoutItem) {
        if (setDirectCheckoutItem) setDirectCheckoutItem(null);
      } else {
        clearCart();
      }

      // Save new address to profile if it was entered
      if (showAddressForm && deliveryMode === 'standard') {
        const savedAddrs = JSON.parse(localStorage.getItem('boutique_addresses') || '[]');
        const newAddressObj = {
          id: `addr-${Date.now()}`,
          name: fullName,
          fullName: fullName,
          addressLine: addressLine,
          city: city,
          stateName: stateName,
          state: stateName,
          pinCode: pinCode,
          country: 'India',
          phone: phone,
          isDefault: savedAddrs.length === 0
        };
        savedAddrs.push(newAddressObj);
        localStorage.setItem('boutique_addresses', JSON.stringify(savedAddrs));
      }

      setOrderConfirmed(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const orderPayload = {
      items: checkoutItems.map((item) => ({
        product: item._id || item.id,
        quantity: item.quantity || 1,
      })),
      shippingAddress: {
        fullName,
        addressLine,
        city,
        state: stateName,
        pinCode,
        phone,
      },
      deliveryMode,
      giftPackaging: Boolean(giftPackaging),
      giftMessage: giftMessage || '',
      paymentMethod: paymentMethod === 'card' ? 'card' : paymentMethod === 'upi' ? 'upi' : paymentMethod === 'netbanking' ? 'netbanking' : 'card',
      couponCode: appliedCoupon?.code || '',
    };

    try {
      // Call backend API to create order & Razorpay order
      const res = await orderAPI.createOrder(orderPayload);
      const { razorpayOrderId, razorpayKeyId, amount, orderId: backendOrderId } = res;

      if (!razorpayKeyId || !razorpayOrderId) {
        throw new Error('Razorpay keys or order ID not received from backend server');
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and refresh.');
      }

      const options = {
        key: razorpayKeyId,
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        name: 'MAZHAI VAANAM BOUTIQUE',
        description: `Order #${backendOrderId}`,
        order_id: razorpayOrderId,
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#6B102A',
        },
        handler: async function (response) {
          try {
            await orderAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            finalizeSuccessOrder(backendOrderId);
          } catch (verr) {
            setSubmitError(verr.message || 'Payment verification failed. Please try again.');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            setSubmitError('Payment process was cancelled.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setSubmitError(resp.error?.description || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      console.error('Order/Razorpay Error:', err);
      setSubmitError(err.message || 'Failed to initialize payment');
      setIsSubmitting(false);
    }
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

  // Trust & Guarantee Badges Block for Left Side Empty Space
  const renderTrustAndGuarantee = () => (
    <div className={styles.guaranteeSection}>
      <h4 className={styles.guaranteeTitle}>
        <ShieldCheck size={22} />
        Handloom Heritage & Trust Guarantee
      </h4>
      <div className={styles.guaranteeGrid}>
        <div className={styles.guaranteeCard}>
          <Award size={20} className={styles.guaranteeIcon} />
          <div className={styles.guaranteeText}>
            <h5>Silk Mark Certified</h5>
            <p>100% authentic pure silk woven by master weavers.</p>
          </div>
        </div>
        <div className={styles.guaranteeCard}>
          <Truck size={20} className={styles.guaranteeIcon} />
          <div className={styles.guaranteeText}>
            <h5>Express Insured Delivery</h5>
            <p>Dispatched within 24h with real-time SMS tracking.</p>
          </div>
        </div>
        <div className={styles.guaranteeCard}>
          <RotateCcw size={20} className={styles.guaranteeIcon} />
          <div className={styles.guaranteeText}>
            <h5>7-Day Easy Returns</h5>
            <p>Hassle-free exchange or instant refund policy.</p>
          </div>
        </div>
        <div className={styles.guaranteeCard}>
          <Lock size={20} className={styles.guaranteeIcon} />
          <div className={styles.guaranteeText}>
            <h5>Bank-Grade Security</h5>
            <p>256-bit SSL encrypted transactions powered by Razorpay.</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Reusable Order Summary Card for Right Column
  const renderOrderSummaryCard = (ctaText, ctaAction, ctaIcon) => (
    <div className={styles.summaryCard}>
      <h3 className={styles.summaryTitle}>Order Summary</h3>

      {/* Product Previews with Quantity Selector & Image Fallback */}
      <div className={styles.productPreviewsList}>
        {checkoutItems.map((item) => (
          <div key={item.id || item._id} className={styles.productPreviewItem}>
            <div className={styles.previewThumb}>
              <img
                src={getImageUrl(item)}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/Images/placeholder.svg';
                }}
              />
            </div>
            <div className={styles.previewDetails}>
              <h4 className={styles.previewItemName}>{item.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty:</span>
                <div className={styles.qtyControlGroup}>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => handleQuantityChange(item, -1)}
                    title="Decrease quantity"
                  >
                    -
                  </button>
                  <span className={styles.qtyValue}>{item.quantity || 1}</span>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    onClick={() => handleQuantityChange(item, 1)}
                    title="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className={styles.previewPrice}>{formatCurrency(item.price * (item.quantity || 1))}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Coupon Section */}
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
                padding: '8px 18px',
                borderRadius: 6,
                background: '#2C1820',
                color: '#D4AF37',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                cursor: couponLoading || !couponInput.trim() ? 'not-allowed' : 'pointer',
                opacity: couponLoading || !couponInput.trim() ? 0.6 : 1,
                transition: 'all 0.2s ease'
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

      {/* Simplified Price Breakdown */}
      <div className={styles.priceBreakdown}>
        <div className={styles.priceRow}>
          <span>Subtotal (MRP)</span>
          <span className={styles.mrpValue}>{formatCurrency(mrpTotal)}</span>
        </div>
        <div className={styles.discountRow} style={{ color: 'var(--success)' }}>
          <span>Total Savings</span>
          <span className={styles.discountValue} style={{ color: 'var(--success)', fontWeight: 700 }}>
            -{formatCurrency(totalSavings)}
          </span>
        </div>
        <div className={styles.priceRow}>
          <span>Shipping & Delivery</span>
          <span className={styles.priceValue}>
            {deliveryMode === 'pickup' ? 'FREE' : formatCurrency(shippingFee)}
          </span>
        </div>

        {/* Collapsible toggle */}
        <button
          type="button"
          className={styles.priceBreakdownToggle}
          onClick={() => setShowDetailedPrice(!showDetailedPrice)}
        >
          <span>{showDetailedPrice ? 'Hide Price Breakdown' : 'View Detailed Price Breakdown'}</span>
          <ChevronDown size={16} className={showDetailedPrice ? styles.rotate180 : ''} />
        </button>

        {/* Expanded details */}
        {showDetailedPrice && (
          <div className={styles.collapsibleDetails}>
            <div className={styles.priceRow}>
              <span>Exclusive Member Price</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            {couponDiscount > 0 && (
              <div className={styles.discountRow} style={{ color: 'var(--success)' }}>
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-{formatCurrency(couponDiscount)}</span>
              </div>
            )}
            <div className={styles.priceRow}>
              <span>Platform Convenience Fee</span>
              <span>₹2</span>
            </div>
            {giftPackaging && (
              <div className={styles.priceRow}>
                <span>Luxury Packaging Addon</span>
                <span>{formatCurrency(GIFT_WRAP_PRICE)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Final Payable */}
      <div className={styles.totalsBlock}>
        <div className={styles.payableRow}>
          <span className={styles.payableLabel}>Final Payable</span>
          <span className={styles.payableValue}>{formatCurrency(finalAmount)}</span>
        </div>
      </div>

      {submitError && (
        <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', fontSize: '0.85rem', marginBottom: 12, fontWeight: 500 }}>
          {submitError}
        </div>
      )}

      {/* CTA Action button */}
      <button
        className={styles.shimmerBtn}
        onClick={ctaAction}
        disabled={isSubmitting}
        style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
      >
        {isSubmitting ? 'PROCESSING...' : ctaText}
        {ctaIcon}
      </button>

      <p className={styles.secureText}>
        <ShieldCheck size={14} className={styles.secureIcon} />
        100% SECURE TRANSACTIONS
      </p>
    </div>
  );

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
        /* Standard Checkout Form Flow - Two Column Layout for both step 1 & step 2 */
        <div className={styles.layoutGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {renderProgressIndicator()}

            {checkoutStep === 'checkout' ? (
              <>
                <section className={styles.sectionBlock}>
                  <h2 className={styles.sectionTitle}>{deliveryMode === 'standard' ? 'Shipping Details' : 'Contact Details'}</h2>

                  {deliveryMode === 'standard' && savedAddresses.length > 0 && !showAddressForm ? (
                    <div className={styles.addressGrid}>
                      {savedAddresses.map(addr => (
                        <div
                          key={addr.id}
                          className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.addressCardDefault : ''}`}
                          onClick={() => setSelectedAddressId(addr.id)}
                        >
                          {selectedAddressId === addr.id && <div className={styles.defaultBadge}>SELECTED</div>}
                          <h3 className={styles.addressName}>{addr.name}</h3>
                          <div className={styles.addressDetails}>
                            <p>{addr.addressLine}</p>
                            <p>{addr.city}, {addr.state} - {addr.pinCode}</p>
                            <p>{addr.country || 'India'}</p>
                            <p>Phone: {addr.phone}</p>
                          </div>
                          <div className={styles.addressActions}>
                            <button type="button" className={`${styles.addressLinkBtn} ${selectedAddressId === addr.id ? '' : styles.deleteBtn}`}>
                              {selectedAddressId === addr.id ? 'SELECTED' : 'SELECT'}
                            </button>
                          </div>
                        </div>
                      ))}

                      <div className={styles.addAddressBtn} onClick={() => {
                        setShowAddressForm(true);
                        setFullName(user?.name || (user?.firstName ? user.firstName + ' ' + (user.lastName || '') : '') || '');
                        setPhone('');
                        setAddressLine('');
                        setCity('');
                        setStateName('');
                        setPinCode('');
                      }}>
                        <span style={{ fontSize: '24px', color: '#C8A34D' }}>+</span>
                        <p className={styles.addAddressTitle}>ADD NEW ADDRESS</p>
                      </div>
                    </div>
                  ) : (
                    <form className={styles.formContainer} onSubmit={handleConfirmDetails}>
                      {savedAddresses.length > 0 && deliveryMode === 'standard' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-16px' }}>
                          <button
                            type="button"
                            className={styles.addressLinkBtn}
                            onClick={() => {
                              setShowAddressForm(false);
                              const addr = savedAddresses.find(a => a.id === selectedAddressId);
                              if (addr) {
                                setFullName(addr.name || user?.name || (user?.firstName ? user.firstName + ' ' + (user.lastName || '') : '') || '');
                                setPhone(addr.phone || '');
                                setAddressLine(addr.addressLine || '');
                                setCity(addr.city || '');
                                setStateName(addr.state || '');
                                setPinCode(addr.pinCode || '');
                              }
                            }}
                          >
                            Cancel & Use Saved
                          </button>
                        </div>
                      )}
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
                  )}
                </section>

                <section className={styles.sectionBlock} style={{ marginTop: '16px' }}>
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
              </>
            ) : (
              <>
                {renderDetailsSummary()}

                <div style={{
                  padding: '24px',
                  background: 'rgba(200, 163, 77, 0.05)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '12px',
                  marginTop: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <ShieldCheck size={28} color="var(--primary)" />
                    <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--primary)' }}>
                      Secure Payment Gateway
                    </h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    Your transaction is encrypted using state-of-the-art SSL algorithms.
                    Clicking the payment button on the right will launch the Razorpay interface to choose cards, UPI, or netbanking.
                  </p>
                </div>
              </>
            )}

            {/* Heritage & Trust Badges in Left Column */}
            {renderTrustAndGuarantee()}
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {checkoutStep === 'checkout'
              ? renderOrderSummaryCard('CONFIRM DETAILS', handleConfirmDetails, <ArrowRight size={16} />)
              : renderOrderSummaryCard('COMPLETE ORDER', handleCompleteOrder, <Lock className={styles.checkoutIcon} size={18} />)
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
