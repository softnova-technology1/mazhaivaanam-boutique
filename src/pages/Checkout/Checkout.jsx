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
  X,
  Check,
  Ticket,
  Quote
} from 'lucide-react';
import styles from './Checkout.module.css';
import { useStoreConfig } from '../../context/StoreConfigContext';
import InvoiceModal from '../../components/common/InvoiceModal/InvoiceModal';

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
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');

  // Form Validation Errors State
  const [errors, setErrors] = useState({});

  // UI Interactive States
  const [deliveryMode, setDeliveryMode] = useState('standard'); // 'pickup' | 'standard'
  const [giftPackaging, setGiftPackaging] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Coupon States
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

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
  }, []);

  useEffect(() => {
    // Load saved addresses — from backend if logged in, localStorage fallback
    const loadAddresses = async () => {
      try {
        if (user) {
          const serverAddrs = await addressAPI.getAddresses();
          if (serverAddrs && serverAddrs.length > 0) {
            setSavedAddresses(serverAddrs);
            const defaultAddr = serverAddrs.find(a => a.isDefault) || serverAddrs[0];
            if (defaultAddr) {
              const targetId = defaultAddr._id || defaultAddr.id;
              setSelectedAddressId(targetId);
              setShowAddressForm(false);
              setFullName(defaultAddr.fullName || defaultAddr.name || '');
              setPhone(defaultAddr.phone || '');
              setAddressLine(defaultAddr.addressLine || '');
              setLandmark(defaultAddr.landmark || '');
              setCity(defaultAddr.city || '');
              setStateName(defaultAddr.state || defaultAddr.stateName || '');
              setPinCode(defaultAddr.pinCode || '');
            }
            if (user.email) setEmail(prev => prev || user.email);
            return;
          }
        }
        // Fallback: localStorage (for guests or users with no server addresses)
        const addresses = JSON.parse(localStorage.getItem('boutique_addresses') || '[]');
        setSavedAddresses(addresses);
        if (addresses.length > 0) {
          setShowAddressForm(false);
          const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
          const targetId = defaultAddr.id || defaultAddr._id;
          setSelectedAddressId(targetId);
          setFullName(defaultAddr.fullName || defaultAddr.name || '');
          setPhone(defaultAddr.phone || '');
          setAddressLine(defaultAddr.addressLine || '');
          setLandmark(defaultAddr.landmark || '');
          setCity(defaultAddr.city || '');
          setStateName(defaultAddr.state || defaultAddr.stateName || '');
          setPinCode(defaultAddr.pinCode || '');
        } else if (user) {
          // No addresses found, prefill profile info
          setFullName(prev => prev || user.name || (user.firstName ? user.firstName + ' ' + (user.lastName || '') : '') || '');
          setEmail(prev => prev || user.email || '');
          if (user.phone) setPhone(prev => prev || user.phone);
        }
      } catch (e) {
        console.error('Failed to load addresses:', e);
      }
    };
    loadAddresses();
  }, [user]);

  useEffect(() => {
    if (selectedAddressId && !showAddressForm && savedAddresses.length > 0) {
      const addr = savedAddresses.find(a => (a._id || a.id) === selectedAddressId);
      if (addr) {
        setFullName(addr.fullName || addr.name || user?.name || '');
        setPhone(addr.phone || '');
        setAddressLine(addr.addressLine || '');
        setLandmark(addr.landmark || '');
        setCity(addr.city || '');
        setStateName(addr.state || addr.stateName || '');
        setPinCode(addr.pinCode || '');
      }
    }
  }, [selectedAddressId, showAddressForm, savedAddresses, user]);

  // Image & Quantity Helpers
  const getImageUrl = (item) => {
    if (!item) return 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/placeholder.svg';
    let url = item.image;
    if (!url || typeof url !== 'string' || url.startsWith('blob:')) {
      url = item.images?.[0]?.url || 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/placeholder.svg';
    }
    return url || 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/placeholder.svg';
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
  const GIFT_WRAP_PRICE = Number(storeConfig?.giftWrapPrice) || 499;
  const DEFAULT_SAREE_WEIGHT_KG = 0.5;

  // Weight & Zone based shipping rate tables (same as backend shipping.js)
  const SHIPPING_ZONES = {
    'Tamil Nadu': [
      { label: 'Standard', uptoKg: 0.5, price: 40 },
      { label: 'Upto 1kg', uptoKg: 1.0, price: 60 },
      { label: 'Upto 1.5kg', uptoKg: 1.5, price: 80 },
      { label: 'Upto 2kg', uptoKg: 2.0, price: 100 },
      { label: 'Upto 2.5kg', uptoKg: 2.5, price: 120 },
      { label: 'Upto 3kg', uptoKg: 3.0, price: 140 },
      { label: 'Upto 4kg', uptoKg: 4.0, price: 160 },
      { label: 'Upto 5kg', uptoKg: 5.0, price: 180 },
      { label: 'Above 5kg', uptoKg: Infinity, price: 200 },
    ],
    'Other States': [
      { label: 'Standard', uptoKg: 0.5, price: 60 },
      { label: 'Upto 1kg', uptoKg: 1.0, price: 75 },
      { label: 'Upto 1.5kg', uptoKg: 1.5, price: 90 },
      { label: 'Upto 2kg', uptoKg: 2.0, price: 115 },
      { label: 'Upto 2.5kg', uptoKg: 2.5, price: 130 },
      { label: 'Upto 3kg', uptoKg: 3.0, price: 145 },
      { label: 'Upto 4kg', uptoKg: 4.0, price: 170 },
      { label: 'Upto 5kg', uptoKg: 5.0, price: 190 },
      { label: 'Above 5kg', uptoKg: Infinity, price: 220 },
    ]
  };

  const resolveShippingZone = () => {
    const pin = String(pinCode).replace(/\D/g, '');
    if (pin.length === 6) {
      const pinNum = Number(pin);
      return pinNum >= 600000 && pinNum <= 643999 ? 'Tamil Nadu' : 'Other States';
    }
    const stateKey = String(stateName).toLowerCase().replace(/[^a-z]/g, '');
    if (['tamilnadu', 'tn', 'tamilnad'].includes(stateKey)) {
      return 'Tamil Nadu';
    }
    return 'Tamil Nadu';
  };

  const getShippingSlab = (items) => {
    const totalWeightKg = items.reduce((sum, item) => {
      const w = Number(item.weightKg) || DEFAULT_SAREE_WEIGHT_KG;
      return sum + w * (item.quantity || 1);
    }, 0);
    const zone = resolveShippingZone();
    const rates = SHIPPING_ZONES[zone] || SHIPPING_ZONES['Tamil Nadu'];
    const slab = rates.find(r => totalWeightKg <= r.uptoKg) || rates[0];
    return { slab, totalWeightKg, zone };
  };

  const calcShippingFee = (items, mode) => {
    if (mode === 'pickup' || items.length === 0) return 0;
    const { slab } = getShippingSlab(items);
    const base = slab ? slab.price : 40;
    return mode === 'express' ? base + 60 : base;
  };

  const getShippingLabel = (items, mode) => {
    if (mode === 'pickup') return 'Store Pickup (Free)';
    if (items.length === 0) return '';
    const { slab, totalWeightKg, zone } = getShippingSlab(items);
    return `${slab ? slab.label : 'Standard'} (${totalWeightKg.toFixed(2)} kg) · ${zone}${mode === 'express' ? ' + Express' : ''}`;
  };

  // mrpPrice from DB = original MRP; item.price = effective (post-discount) price
  const mrpTotal = checkoutItems.reduce((sum, item) => sum + (item.mrpPrice || item.oldPrice || item.price) * (item.quantity || 1), 0);
  const subtotal = directCheckoutItem
    ? (directCheckoutItem.price * (directCheckoutItem.quantity || 1))
    : cartTotal;

  const exclusivePricingSavings = Math.max(0, mrpTotal - subtotal);
  const festivalDiscount = 0; // festival discount removed
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const totalSavings = exclusivePricingSavings + festivalDiscount + couponDiscount;

  const giftPackAddon = giftPackaging ? GIFT_WRAP_PRICE : 0;
  const convenienceFee = checkoutItems.length > 0 ? (storeConfig?.convenienceFee !== undefined && storeConfig?.convenienceFee !== null ? Number(storeConfig?.convenienceFee) : 2) : 0;

  // Only calculate shipping once a valid 6-digit PIN code is entered (or pickup is selected)
  const cleanedPin = String(pinCode).replace(/\D/g, '');
  const hasValidPin = cleanedPin.length === 6;
  const addressKnown = deliveryMode === 'pickup' || hasValidPin;
  const shippingFee = addressKnown ? calcShippingFee(checkoutItems, deliveryMode) : 0;

  const totalFees = giftPackAddon + convenienceFee + shippingFee;

  const finalAmount = Math.max(0, mrpTotal - totalSavings + totalFees);

  const renderProgressIndicator = () => {
    const steps = [
      { key: 'bag', label: 'Bag', num: 1, done: true },
      { key: 'checkout', label: 'Shipping & Payment', num: 2, active: true },
      { key: 'confirm', label: 'Confirmation', num: 3, done: false },
    ];
    return (
      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          {/* Background track */}
          <div className={styles.progressLine}></div>
          {/* Animated fill: 50% between Bag and Confirmation */}
          <div className={styles.progressLineFill} style={{ width: '50%' }}></div>
          {steps.map((s) => (
            <div key={s.key} className={styles.step}>
              <div className={`${styles.dot} ${s.done ? styles.completed : s.active ? styles.active : ''}`}>
                {s.done ? <Check size={8} strokeWidth={3} /> : <span className={styles.dotNumber}>{s.num}</span>}
              </div>
              <span className={`${styles.stepLabel} ${s.active ? styles.activeLabel : s.done ? styles.completedLabel : ''}`}>
                {s.label}
              </span>
            </div>
          ))}
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
      const pinDigits = String(pinCode).replace(/\D/g, '');
      if (!pinCode.trim()) {
        newErrors.pinCode = 'Pin Code is required';
      } else if (pinDigits.length !== 6) {
        newErrors.pinCode = 'Enter a valid 6-digit Pin Code';
      }
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

  const loadRazorpaySDK = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.onload = () => resolve(true);
        existing.onerror = () => resolve(false);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
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
      landmark,
      city,
      stateName,
      deliveryMode,
      giftPackaging,
      giftMessage,
      paymentMethod: 'card',
      finalAmount,
      totalSavings,
      mrpTotal,
      subtotal,
      festivalDiscount,
      couponCode: appliedCoupon?.code || '',
      couponDiscount,
      giftPackAddon,
      shippingFee,
      items: checkoutItems.map(item => {
        let img = item.image;
        if (!img || typeof img !== 'string' || img.startsWith('blob:') || img.includes('placeholder')) {
          img = item.images?.[0]?.url || (typeof item.images?.[0] === 'string' ? item.images[0] : null);
        }
        if (!img || typeof img !== 'string' || img.startsWith('blob:') || img.includes('placeholder')) {
          img = 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/saree12.png';
        }
        return { ...item, image: img };
      }),
      placedOnDate: getFormattedDate(0),
      arrivalRange: `${getFormattedDate(5)} — ${getFormattedDate(7)}`
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
        const addressPayload = {
          fullName: fullName,
          addressLine: addressLine,
          landmark: landmark || '',
          city: city,
          state: stateName,
          pinCode: pinCode,
          country: 'India',
          phone: phone,
          isDefault: savedAddresses.length === 0
        };

        if (user) {
          addressAPI.createAddress(addressPayload).then(serverAddr => {
            if (serverAddr) {
              setSavedAddresses(prev => [serverAddr, ...prev]);
            }
          }).catch(err => {
            console.error('Failed to save address to backend:', err);
          });
        }

        const savedAddrs = JSON.parse(localStorage.getItem('boutique_addresses') || '[]');
        const newAddressObj = {
          id: `addr-${Date.now()}`,
          name: fullName,
          ...addressPayload,
          stateName: stateName
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
      email: email.trim(),
      shippingAddress: {
        fullName: fullName.trim(),
        email: email.trim(),
        addressLine: addressLine.trim(),
        landmark: landmark ? landmark.trim() : '',
        city: city.trim(),
        state: stateName.trim(),
        pinCode: pinCode.trim(),
        phone: phone.trim(),
      },
      deliveryMode,
      giftPackaging: Boolean(giftPackaging),
      giftMessage: giftMessage || '',
      paymentMethod: 'card',
      couponCode: appliedCoupon?.code || '',
    };

    try {
      // Ensure Razorpay SDK is loaded
      const rzpLoaded = await loadRazorpaySDK();
      if (!rzpLoaded || !window.Razorpay) {
        throw new Error('Razorpay SDK could not be loaded. Please check your internet connection.');
      }

      // Call backend API to create order & Razorpay order
      const res = await orderAPI.createOrder(orderPayload);
      const { razorpayOrderId, razorpayKeyId, amount, orderId: backendOrderId } = res;

      if (!razorpayKeyId || !razorpayOrderId) {
        throw new Error('Razorpay keys or order ID not received from backend server');
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
    setShowInvoiceModal(true);
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
                  e.currentTarget.src = 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/placeholder.svg';
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}>
                {((item.mrpPrice || item.oldPrice) && (item.mrpPrice || item.oldPrice) > item.price) && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {formatCurrency((item.mrpPrice || item.oldPrice) * (item.quantity || 1))}
                  </span>
                )}
                <span className={styles.previewPrice}>{formatCurrency(item.price * (item.quantity || 1))}</span>
              </div>
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

      {/* Clean Price Breakdown — no dropdown, no savings row */}
      <div className={styles.priceBreakdown}>

        {/* Subtotal row: MRP crossed (only if discount exists) + subtotal price */}
        <div className={styles.priceRow}>
          <span>Subtotal</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {mrpTotal > subtotal && (
              <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                {formatCurrency(mrpTotal)}
              </span>
            )}
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {formatCurrency(subtotal)}
            </span>
          </div>
        </div>

        {/* Coupon row — only when applied */}
        {couponDiscount > 0 && (
          <div className={styles.priceRow} style={{ color: 'var(--success)' }}>
            <span>Coupon ({appliedCoupon?.code})</span>
            <span style={{ fontWeight: 700 }}>-{formatCurrency(couponDiscount)}</span>
          </div>
        )}

        {/* Shipping */}
        <div className={styles.priceRow}>
          <span>Shipping & Delivery</span>
          <span className={styles.priceValue} style={!addressKnown && deliveryMode !== 'pickup' ? { color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.78rem' } : {}}>
            {deliveryMode === 'pickup'
              ? 'FREE'
              : addressKnown
                ? formatCurrency(shippingFee)
                : 'Enter address to calculate'
            }
          </span>
        </div>

        {/* Convenience Fee */}
        <div className={styles.priceRow}>
          <span>Convenience Fee</span>
          <span>{formatCurrency(convenienceFee)}</span>
        </div>

        {/* Gift packaging — only when selected */}
        {giftPackaging && (
          <div className={styles.priceRow}>
            <span>Gift Packaging</span>
            <span>{formatCurrency(GIFT_WRAP_PRICE)}</span>
          </div>
        )}

      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-color)', margin: '4px 0 12px' }} />

      {/* Final Payable */}
      <div className={styles.totalsBlock}>
        <div className={styles.payableRow}>
          <span className={styles.payableLabel}>Final Payable</span>
          <span className={styles.payableValue}>
            {formatCurrency(finalAmount)}
            {!addressKnown && deliveryMode !== 'pickup' && (
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500, fontStyle: 'italic', marginTop: 2 }}>
                + shipping (after address)
              </span>
            )}
          </span>
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
                    <div className={styles.arrivalDetails} style={{ alignItems: 'flex-start' }}>
                      <Calendar size={18} className={styles.arrivalIcon} style={{ marginTop: 2 }} />
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem', margin: 0, lineHeight: 1.2 }}>
                          {orderCache.deliveryMode === 'pickup' ? '5 To 7 Days Delivery' : '5 – 7 Days Delivery'}
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0', fontWeight: 500 }}>
                          ({orderCache.arrivalRange})
                        </p>
                      </div>
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
                <button className={styles.finishShoppingBtn} onClick={() => setCurrentTab('home')}>
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
                          {item.category ? item.category : 'Handcrafted Atelier Series'}
                        </p>
                        <h4>{item.name}</h4>
                        <p className={styles.orderedItemQty}>Qty: {item.quantity.toString().padStart(2, '0')} | Size: Standard</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price list */}
                <div className={styles.successPriceBreakdown}>
                  {orderCache.mrpTotal > orderCache.subtotal ? (
                    <>
                      <div className={styles.successPriceRow}>
                        <span>Maximum Retail Price (MRP)</span>
                        <span className={styles.mrpText}>{formatCurrency(orderCache.mrpTotal)}</span>
                      </div>
                      <div className={styles.successPriceRow} style={{ color: 'var(--primary)', fontWeight: '500' }}>
                        <span>Exclusive Atelier Price</span>
                        <span>{formatCurrency(orderCache.subtotal)}</span>
                      </div>
                    </>
                  ) : (
                    <div className={styles.successPriceRow}>
                      <span>Subtotal</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(orderCache.subtotal)}</span>
                    </div>
                  )}

                  {orderCache.festivalDiscount > 0 && (
                    <div className={styles.successDiscountRow}>
                      <span>Festival Privilege Discount</span>
                      <span>-{formatCurrency(orderCache.festivalDiscount)}</span>
                    </div>
                  )}

                  {orderCache.couponDiscount > 0 && (
                    <div className={styles.successDiscountRow}>
                      <span>Coupon Discount {orderCache.couponCode ? `(${orderCache.couponCode})` : ''}</span>
                      <span>-{formatCurrency(orderCache.couponDiscount)}</span>
                    </div>
                  )}

                  <div className={styles.successPriceRow}>
                    <span>Convenient Fees</span>
                    <span>{formatCurrency(orderCache.convenienceFee !== undefined ? orderCache.convenienceFee : 2)}</span>
                  </div>

                  {orderCache.giftPackaging && (
                    <div className={styles.successPriceRow}>
                      <span>Gift Packaging</span>
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

                {/* Savings Badge — only shown if there are actual savings */}
                {orderCache.totalSavings > 0 && (
                  <div className={styles.successSavingsHighlight}>
                    <Award size={18} className={styles.savingsIconSymbol} />
                    <p>You Saved {formatCurrency(orderCache.totalSavings)}</p>
                  </div>
                )}

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
        <div className={styles.checkoutFlowWrapper}>
          {/* Progress bar spans FULL WIDTH above both columns */}
          {renderProgressIndicator()}

          <div className={styles.layoutGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              <section className={styles.sectionBlock}>
                <h2 className={styles.sectionTitle}>{deliveryMode === 'standard' ? 'Shipping Details' : 'Contact Details'}</h2>

                {deliveryMode === 'standard' && savedAddresses.length > 0 && !showAddressForm ? (
                  <div className={styles.addressGrid}>
                    {savedAddresses.map(addr => {
                      const addrId = addr._id || addr.id;
                      const isSelected = selectedAddressId === addrId;
                      return (
                        <div
                          key={addrId}
                          className={`${styles.addressCard} ${isSelected ? styles.addressCardDefault : ''}`}
                          onClick={() => {
                            setSelectedAddressId(addrId);
                            setFullName(addr.fullName || addr.name || '');
                            setPhone(addr.phone || '');
                            setAddressLine(addr.addressLine || '');
                            setLandmark(addr.landmark || '');
                            setCity(addr.city || '');
                            setStateName(addr.state || addr.stateName || '');
                            setPinCode(addr.pinCode || '');
                          }}
                        >
                          {isSelected && <div className={styles.defaultBadge}>SELECTED</div>}
                          <h3 className={styles.addressName}>{addr.fullName || addr.name}</h3>
                          <div className={styles.addressDetails}>
                            <p>{addr.addressLine}</p>
                            {addr.landmark && <p>Landmark: {addr.landmark}</p>}
                            <p>{addr.city}, {addr.stateName || addr.state} - {addr.pinCode}</p>
                            <p>{addr.country || 'India'}</p>
                            <p>Phone: {addr.phone}</p>
                          </div>
                          <div className={styles.addressActions}>
                            <button type="button" className={`${styles.addressLinkBtn} ${isSelected ? '' : styles.deleteBtn}`}>
                              {isSelected ? 'SELECTED' : 'SELECT'}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    <div className={styles.addAddressBtn} onClick={() => {
                      setShowAddressForm(true);
                      setFullName(user?.name || (user?.firstName ? user.firstName + ' ' + (user.lastName || '') : '') || '');
                      setPhone(user?.phone || '');
                      setAddressLine('');
                      setLandmark('');
                      setCity('');
                      setStateName('');
                      setPinCode('');
                    }}>
                      <span style={{ fontSize: '24px', color: '#C8A34D' }}>+</span>
                      <p className={styles.addAddressTitle}>ADD NEW ADDRESS</p>
                    </div>
                  </div>
                ) : (
                  <form className={styles.formContainer} onSubmit={handleCompleteOrder} noValidate>
                    {savedAddresses.length > 0 && deliveryMode === 'standard' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-16px' }}>
                        <button
                          type="button"
                          className={styles.addressLinkBtn}
                          onClick={() => {
                            setShowAddressForm(false);
                            const addr = savedAddresses.find(a => (a._id || a.id) === selectedAddressId) || savedAddresses[0];
                            if (addr) {
                              setSelectedAddressId(addr._id || addr.id);
                              setFullName(addr.fullName || addr.name || '');
                              setPhone(addr.phone || '');
                              setAddressLine(addr.addressLine || '');
                              setLandmark(addr.landmark || '');
                              setCity(addr.city || '');
                              setStateName(addr.state || addr.stateName || '');
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
                            inputMode="numeric"
                            maxLength={6}
                            placeholder=" "
                            value={pinCode}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setPinCode(val);
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

                        <div className={styles.floatingLabelContainer} style={{ width: '100%', marginTop: '16px' }}>
                          <input
                            type="text"
                            placeholder=" "
                            value={landmark}
                            onChange={(e) => setLandmark(e.target.value)}
                            className={styles.formInput}
                            id="landmark"
                          />
                          <label className={styles.formLabel}>Landmark (Optional)</label>
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
                    <span className={styles.deliveryCost}>
                      {addressKnown
                        ? formatCurrency(calcShippingFee(checkoutItems, 'standard'))
                        : 'From ₹40'
                      }
                    </span>
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
                      <p className={styles.deliveryOptionSubtitle}>ANA Complex, Sethu Road, Peravurani, Thanjavur, Tamil Nadu, India 614804</p>
                    </div>
                    <span className={styles.deliveryCost}>FREE</span>
                  </label>
                </div>
              </section>

              {/* Gift Packaging Section */}
              <section className={styles.sectionBlock} style={{ marginTop: '16px' }}>
                <h2 className={styles.sectionTitle}>
                  <Gift size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                  Gift Options
                </h2>

                {/* Toggle card — full-row click */}
                <div
                  onClick={() => setGiftPackaging(prev => !prev)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    border: `2px solid ${giftPackaging ? 'var(--primary)' : 'var(--border-color)'}`,
                    borderRadius: 10,
                    background: giftPackaging ? 'rgba(200,163,77,0.08)' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 8,
                      background: giftPackaging ? 'var(--primary)' : 'rgba(200,163,77,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.2s ease'
                    }}>
                      <Gift size={22} color={giftPackaging ? '#fff' : 'var(--primary)'} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        Luxury Gift Packaging
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Premium silk box wrap + handwritten message card
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
                      +{formatCurrency(GIFT_WRAP_PRICE)}
                    </span>
                    {/* Toggle switch */}
                    <div style={{
                      width: 44, height: 24, borderRadius: 12,
                      background: giftPackaging ? 'var(--primary)' : 'var(--border-color)',
                      position: 'relative', transition: 'background 0.25s ease'
                    }}>
                      <div style={{
                        position: 'absolute', top: 3,
                        left: giftPackaging ? 23 : 3,
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#fff',
                        transition: 'left 0.25s ease',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Gift message input — slides in when toggled on */}
                {giftPackaging && (
                  <div style={{ marginTop: 12 }}>
                    <div className={styles.floatingLabelContainer} style={{ width: '100%' }}>
                      <input
                        type="text"
                        placeholder=" "
                        value={giftMessage}
                        onChange={e => setGiftMessage(e.target.value)}
                        className={styles.formInput}
                        maxLength={250}
                      />
                      <label className={styles.formLabel}>Gift Message (optional, max 250 chars)</label>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: 4 }}>
                      {giftMessage.length}/250
                    </div>
                  </div>
                )}
              </section>

              {/* Payment Method Banner */}
              <section className={styles.sectionBlock} style={{ marginTop: '16px' }}>
                <h2 className={styles.sectionTitle}>
                  <Lock size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
                  Payment Method
                </h2>

                {/* Single Unified Razorpay Payment Card */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #FFFDFB 0%, #FAF6F0 100%)',
                    border: '2px solid #C8A34D',
                    borderRadius: 14,
                    padding: '20px',
                    boxShadow: '0 8px 24px rgba(79, 78, 34, 0.06)',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'rgba(200, 163, 77, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #C8A34D'
                      }}>
                        <ShieldCheck size={24} color="#4F4E22" />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#4F4E22' }}>
                          Razorpay Secure Checkout
                        </h4>
                        <span style={{ fontSize: '0.78rem', color: '#696738', fontWeight: 500 }}>
                          100% Encrypted &amp; Instant Verification
                        </span>
                      </div>
                    </div>
                    <span style={{
                      padding: '4px 10px',
                      background: 'rgba(34, 197, 94, 0.12)',
                      color: '#16a34a',
                      border: '1px solid #16a34a',
                      borderRadius: 20,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase'
                    }}>
                      ⚡ All Payment Modes Enabled
                    </span>
                  </div>

                  <p style={{ margin: '0 0 14px 0', fontSize: '0.86rem', color: '#3B3B36', lineHeight: 1.6 }}>
                    Pay via <strong>UPI (GPay, PhonePe, Paytm, BHIM)</strong>, <strong>Credit / Debit Cards (Visa, Mastercard, RuPay)</strong>, <strong>Net Banking (All Indian Banks)</strong>, or <strong>Wallets</strong>.
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 14px',
                    background: '#FFFFFF',
                    borderRadius: 8,
                    border: '1px dashed rgba(200, 163, 77, 0.45)',
                    fontSize: '0.78rem',
                    color: '#696738'
                  }}>
                    <Lock size={14} color="#C8A34D" style={{ flexShrink: 0 }} />
                    <span>Protected by 256-bit SSL encryption. Razorpay gateway opens instantly on clicking <strong>Proceed to Pay</strong>.</span>
                  </div>
                </div>
              </section>

              {/* Heritage & Trust Badges in Left Column */}
              {renderTrustAndGuarantee()}
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {renderOrderSummaryCard(
                isSubmitting ? 'PROCESSING PAYMENT...' : `PROCEED TO PAY ${formatCurrency(finalAmount)}`,
                handleCompleteOrder,
                <Lock className={styles.checkoutIcon} size={18} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal popup on Invoice button click */}
      {showInvoiceModal && orderCache && (
        <InvoiceModal
          order={orderCache}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
};

export default Checkout;
