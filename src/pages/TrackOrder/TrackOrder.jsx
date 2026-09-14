import { useState, useEffect } from 'react';
import { orderAPI } from '../../services/api';
import InvoiceModal from '../../admin/components/InvoiceModal';
import { 
  Search, 
  MapPin, 
  Truck, 
  Calendar, 
  FileText, 
  ExternalLink, 
  Clock, 
  Award, 
  Box, 
  Sparkles,
  CheckCircle,
  HelpCircle,
  Store,
  Gift,
  Printer,
  MessageCircle,
  Package,
  ChevronRight
} from 'lucide-react';
import styles from './TrackOrder.module.css';

export const TrackOrder = ({ setCurrentTab }) => {
  const [orderInput, setOrderInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  
  // Tracked Order details state (null = show default fallback order MV-98214-X)
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Default mock order details (from user's template)
  const defaultMockOrder = {
    orderId: "MV-98214-X",
    email: "concierge@example.com",
    placedOnDate: "October 12, 2024",
    arrivalRange: "October 24, 2024",
    status: "SHIPPING",
    deliveryMode: "standard",
    courier: "BlueDart Express",
    trackingNumber: "BD98214589IN",
    lastLocation: "Chennai Central Logistics Hub",
    lastLocationTime: "Transit Stage: Inbound sorting",
    countdownDays: 2,
    mrpTotal: 72800,
    subtotal: 65000,
    totalSavings: 5500,
    finalAmount: 67300,
    pointsEarned: 2200,
    giftPackaging: true,
    giftMessage: "Happy Festival of Lights! Wishing you elegance and joy.",
    items: [
      {
        id: 'default-track-item',
        name: "Signature Kanchipuram Pure Silk Saree - Ruby Zari",
        price: 65000,
        mrpPrice: 72800,
        quantity: 1,
        image: "/Images/placeholder.svg"
      }
    ]
  };

  useEffect(() => {
    // Read query parameter from window location search
    const params = new URLSearchParams(window.location.search);
    const qOrderId = params.get('orderId') || '';
    
    if (qOrderId) {
      setOrderInput(qOrderId);
      handleLocateShipment(qOrderId);
    }
  }, []);

  const handleLocateShipment = async (searchId) => {
    setErrorText('');
    const id = searchId.trim().toUpperCase();

    if (!id) {
      setErrorText('Please enter a valid Order Number (e.g. MV-100234).');
      return;
    }

    // 1. Check default mock order
    if (id === 'MV-98214-X') {
      setTrackedOrder(defaultMockOrder);
      setIsSearched(true);
      return;
    }

    // 1. Try Live MongoDB API first for authoritative live status
    try {
      const liveData = await orderAPI.trackOrder(id);
      if (liveData) {
        const orderPlacedDate = new Date(liveData.createdAt || Date.now());
        const deliveryDate = liveData.estimatedDelivery 
          ? new Date(liveData.estimatedDelivery) 
          : new Date(orderPlacedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const diffDays = Math.ceil((deliveryDate - new Date()) / (1000 * 60 * 60 * 24));

        const dynamicOrder = {
          ...liveData,
          orderId: liveData.orderId,
          email: liveData.shippingAddress?.email || liveData.user?.email || 'Valued Patron',
          deliveryMode: liveData.deliveryMode || 'standard',
          giftPackaging: Boolean(liveData.giftPackaging || liveData.giftPackCharge > 0),
          giftPackCharge: liveData.giftPackCharge !== undefined ? liveData.giftPackCharge : (liveData.giftPackaging ? 60 : 0),
          giftMessage: liveData.giftMessage || '',
          placedOnDate: orderPlacedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          arrivalRange: deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: (liveData.status || 'CONFIRMED').toUpperCase(),
          paymentStatus: liveData.paymentStatus || 'paid',
          paymentMethod: liveData.paymentMethod || 'card',
          courier: liveData.courier || '',
          trackingNumber: liveData.trackingNumber || '',
          countdownDays: diffDays > 0 ? diffDays : 0,
          mrpTotal: liveData.mrpTotal || liveData.items?.reduce((sum, it) => sum + ((it.mrpPrice || it.oldPrice || it.price) * (it.quantity || 1)), 0) || liveData.totalAmount || 0,
          subtotal: liveData.subtotal || liveData.items?.reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 1)), 0) || liveData.totalAmount || 0,
          shippingFee: liveData.shippingFee !== undefined ? liveData.shippingFee : 0,
          convenienceFee: liveData.convenienceFee !== undefined ? liveData.convenienceFee : 2,
          couponDiscount: liveData.couponDiscount || 0,
          totalSavings: liveData.totalSavings || 0,
          finalAmount: liveData.finalAmount || liveData.totalAmount || 0,
          totalAmount: liveData.totalAmount || liveData.finalAmount || 0,
          pointsEarned: Math.round((liveData.totalAmount || liveData.finalAmount || 0) * 0.1),
          items: liveData.items || [],
          shippingAddress: liveData.shippingAddress || {},
          statusHistory: liveData.statusHistory || []
        };

        setTrackedOrder(dynamicOrder);
        setIsSearched(true);
        return;
      }
    } catch {
      // Gracefully continue to local storage check
    }

    // 2. Check localStorage (Instant local match)
    const saved = localStorage.getItem('boutique_orders');
    const list = saved ? JSON.parse(saved) : [];
    const found = list.find(o => o.orderId && o.orderId.toUpperCase() === id);

    if (found) {
      const orderPlacedDate = new Date(found.placedOnDate || Date.now());
      const deliveryDate = new Date(orderPlacedDate);
      deliveryDate.setDate(deliveryDate.getDate() + 7);
      
      const diffTime = deliveryDate - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const dynamicOrder = {
        ...found,
        orderId: found.orderId,
        email: found.email,
        deliveryMode: found.deliveryMode || 'standard',
        giftPackaging: Boolean(found.giftPackaging || found.giftPackCharge > 0),
        giftPackCharge: found.giftPackCharge !== undefined ? found.giftPackCharge : (found.giftPackaging ? 60 : 0),
        giftMessage: found.giftMessage || '',
        placedOnDate: found.placedOnDate || orderPlacedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        arrivalRange: found.arrivalRange || deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: (found.status || 'CONFIRMED').toUpperCase(),
        paymentStatus: found.paymentStatus || 'paid',
        paymentMethod: found.paymentMethod || 'card',
        courier: found.courier || '',
        trackingNumber: found.trackingNumber || '',
        countdownDays: diffDays > 0 ? diffDays : 0,
        mrpTotal: found.mrpTotal,
        subtotal: found.subtotal || found.items?.reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 1)), 0) || found.totalAmount || 0,
        shippingFee: found.shippingFee !== undefined ? found.shippingFee : 0,
        convenienceFee: found.convenienceFee !== undefined ? found.convenienceFee : 2,
        couponDiscount: found.couponDiscount || 0,
        totalSavings: found.totalSavings,
        finalAmount: found.finalAmount || found.totalAmount,
        totalAmount: found.totalAmount || found.finalAmount,
        pointsEarned: Math.round((found.finalAmount || found.totalAmount || 0) * 0.1),
        items: found.items || [],
        shippingAddress: found.shippingAddress || {}
      };

      setTrackedOrder(dynamicOrder);
      setIsSearched(true);
      return;
    }

    setErrorText(`No active shipment found for "${id}". Check your Order ID from your confirmation or try "MV-98214-X".`);
    setIsSearched(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLocateShipment(orderInput);
  };

  const activeOrder = trackedOrder || defaultMockOrder;
  const isPickup = activeOrder.deliveryMode === 'pickup';
  const statusUpper = String(activeOrder.status || '').toUpperCase();

  // Progress Stepper configuration
  let currentStepIdx = 0;
  if (statusUpper === 'PACKING' || statusUpper === 'PROCESSING') {
    currentStepIdx = 1;
  } else if (statusUpper === 'SHIPPING' || statusUpper === 'IN TRANSIT' || statusUpper === 'DISPATCHED') {
    currentStepIdx = 2;
  } else if (statusUpper === 'READY_FOR_PICKUP' || statusUpper === 'READY') {
    currentStepIdx = 2;
  } else if (statusUpper === 'DELIVERED' || statusUpper === 'COMPLETED' || statusUpper === 'PICKED_UP') {
    currentStepIdx = 3;
  }

  const stepsList = isPickup ? [
    { title: 'ORDER PLACED', sub: 'Order confirmed & paid' },
    { title: 'PACKING SAREE', sub: 'Preparing in luxury box' },
    { title: 'READY AT STORE', sub: 'Peravurani Boutique' },
    { title: 'PICKED UP', sub: 'Completed by customer' },
  ] : [
    { title: 'ORDER PLACED', sub: 'Order confirmed & paid' },
    { title: 'PACKED & QC', sub: 'Inspected & packaged' },
    { title: 'IN TRANSIT', sub: 'Handed to courier' },
    { title: 'DELIVERED', sub: 'Delivered to doorstep' },
  ];

  const whatsappMessage = encodeURIComponent(`Hello Mazhai Vaanam Boutique, I need support regarding my Order #${activeOrder.orderId}.`);

  return (
    <div className={styles.trackOrderPageContainer}>
      
      {/* Search Hero Header */}
      <section className={styles.heroSection}>
        <div className={styles.silkTexture}></div>
        <div className={styles.heroContentWrapper}>
          <span className={styles.badgeLabel}>ESTEEMED TRADITION</span>
          <h1 className={styles.mainDisplayTitle}>Track Your Luxury Order</h1>
          <p className={styles.heroSubText}>
            Follow every step of your handcrafted Mazhai Vaanam saree as it journeys from our artisans to your doorstep.
          </p>

          {/* Locate Search Box */}
          <div className={`${styles.searchCardBox} ${styles.glassCard}`}>
            <form onSubmit={handleFormSubmit} className={styles.searchForm}>
              <div className={styles.formRow}>
                <div className={styles.inputWrapper}>
                  <label className={styles.inputLabel}>ORDER NUMBER</label>
                  <input 
                    type="text" 
                    placeholder="MV-98214-X"
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    className={styles.searchField}
                  />
                </div>
                <div className={styles.inputWrapper}>
                  <label className={styles.inputLabel}>EMAIL ADDRESS (OPTIONAL)</label>
                  <input 
                    type="email" 
                    placeholder="concierge@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className={styles.searchField}
                  />
                </div>
              </div>

              {errorText && <p className={styles.errorAlertText}>{errorText}</p>}

              <button type="submit" className={styles.locateBtn}>
                LOCATE SHIPMENT
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Tracking results section (Only visible when searched) */}
      {isSearched && (
        <>
          <section className={styles.statusDetailsSection}>
            <div className={styles.detailsLayoutGrid}>
              
              <div className={styles.detailsLeftCol}>
                
                {/* Live Status Header Card */}
                <div className={styles.statusLiveCard}>
                  <div className={styles.statusLiveHeader}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                        <h3 className={styles.statusLiveOrderId}>Order #{activeOrder.orderId}</h3>
                        {activeOrder.trackingNumber && (
                          <span style={{
                            background: 'rgba(200, 163, 77, 0.15)',
                            border: '1px solid #C8A34D',
                            color: '#490017',
                            padding: '3px 10px',
                            borderRadius: 20,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5
                          }}>
                            📦 Tracking ID: {activeOrder.trackingNumber}
                          </span>
                        )}
                        {isPickup && (
                          <span style={{
                            background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857',
                            padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                            display: 'inline-flex', alignItems: 'center', gap: 5
                          }}>
                            <Store size={13} /> Self Store Pickup
                          </span>
                        )}
                      </div>

                      <p className={styles.arrivalScheduleText}>
                        {isPickup ? 'Estimated Store Pickup Date: ' : 'Estimated Arrival: '}
                        <span className={styles.arrivalDateHighlight}>{activeOrder.arrivalRange}</span>
                      </p>
                    </div>

                    <span className={styles.transitStatusBadge} style={{
                      backgroundColor: isPickup ? 'rgba(4, 120, 87, 0.1)' : 'rgba(233, 193, 104, 0.15)',
                      color: isPickup ? '#047857' : 'var(--secondary)',
                      borderColor: isPickup ? '#a7f3d0' : 'rgba(119, 90, 4, 0.2)'
                    }}>
                      {isPickup 
                        ? (statusUpper === 'SHIPPING' ? 'READY AT STORE' : statusUpper === 'DELIVERED' ? 'PICKED UP' : statusUpper === 'PACKING' ? 'PACKING SAREE' : activeOrder.status)
                        : (statusUpper === 'SHIPPING' ? 'IN TRANSIT' : statusUpper === 'PACKING' ? 'PACKED & QC' : activeOrder.status)
                      }
                    </span>
                  </div>

                  {/* Stepper Progress Timeline Bar */}
                  <div style={{
                    margin: '24px 0 32px 0',
                    padding: '24px 20px',
                    background: '#FAF9F6',
                    borderRadius: 12,
                    border: '1px solid var(--border-gold)'
                  }}>
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {/* Background Bar */}
                      <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: '#E2E8F0', zIndex: 1 }} />
                      
                      {/* Active Progress Line */}
                      <div style={{
                        position: 'absolute', top: 20, left: '10%',
                        width: `${(currentStepIdx / (stepsList.length - 1)) * 80}%`,
                        height: 3, background: '#C8A34D', zIndex: 2,
                        transition: 'width 0.5s ease-in-out'
                      }} />

                      {stepsList.map((step, idx) => {
                        const isDone = idx < currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div key={idx} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: '50%',
                              background: isDone ? '#C8A34D' : (isCurrent ? '#4F4E22' : '#ffffff'),
                              border: `2px solid ${isDone || isCurrent ? '#C8A34D' : '#cbd5e1'}`,
                              color: isDone || isCurrent ? '#ffffff' : '#94a3b8',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: '0.85rem',
                              boxShadow: isCurrent ? '0 0 0 4px rgba(200, 163, 77, 0.25)' : 'none',
                              transition: 'all 0.3s'
                            }}>
                              {isDone ? <CheckCircle size={18} /> : (idx + 1)}
                            </div>
                            <span style={{
                              fontSize: '0.75rem', fontWeight: 700,
                              color: isDone || isCurrent ? 'var(--primary)' : '#94a3b8',
                              marginTop: 10, letterSpacing: '0.05em'
                            }}>
                              {step.title}
                            </span>
                            <span style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 2, maxWidth: 120 }}>
                              {step.sub}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Delivery Info Boxes */}
                  <div className={styles.statusOverviewRow}>
                    {isPickup ? (
                      <>
                        <div className={styles.overviewBoxItem}>
                          <div className={styles.iconCircleSymbol} style={{ background: '#ecfdf5', color: '#047857' }}>
                            <Store size={22} />
                          </div>
                          <div>
                            <p className={styles.metaLabelText}>DELIVERY MODE</p>
                            <p className={styles.headlineDetailsText} style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                              Self Store Pickup (In-Store)
                            </p>
                            <p style={{ fontSize: '0.78rem', color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                              📍 <strong>Store Address:</strong> ANA Complex, Sethu Road, Peravurani, Thanjavur, Tamil Nadu - 614804
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                              📞 <strong>Contact:</strong> +91 8807959179 <br /> 🕒 <strong>Hours:</strong> Mon-Sat (10:00 AM - 8:30 PM)
                            </p>
                          </div>
                        </div>

                        <div className={styles.overviewBoxItem}>
                          <div className={styles.iconCircleSymbol}>
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className={styles.metaLabelText}>PICKUP INSTRUCTIONS</p>
                            <p className={styles.headlineDetailsText} style={{ fontSize: '1rem' }}>
                              {currentStepIdx >= 2 ? 'Ready for Pickup at Store Counter' : 'Saree Being Prepared for Pickup'}
                            </p>
                            <p className={styles.updatedAgoText} style={{ fontSize: '0.78rem', marginTop: 4 }}>
                              Present your Order ID <strong>#{activeOrder.orderId}</strong> at the store counter upon arrival.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.overviewBoxItem}>
                          <div className={styles.iconCircleSymbol}>
                            <Truck size={20} />
                          </div>
                          <div>
                            <p className={styles.metaLabelText}>COURIER SERVICE</p>
                            <p className={styles.headlineDetailsText} style={{ fontSize: '1rem', fontWeight: 700 }}>
                              {activeOrder.courier || 'ST Courier'}
                            </p>
                            {activeOrder.trackingNumber ? (
                              <div style={{ fontSize: '0.82rem', color: '#490017', fontWeight: 700, marginTop: 2 }}>
                                Tracking ID: {activeOrder.trackingNumber}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginTop: 2 }}>
                                Tracking ID Assigned Upon Dispatch
                              </span>
                            )}
                            <div style={{ marginTop: 6 }}>
                              <a 
                                href="https://stcourier.com/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontSize: '0.78rem',
                                  color: '#2563eb',
                                  fontWeight: 600,
                                  textDecoration: 'underline'
                                }}
                              >
                                Track Shipment ↗ (https://stcourier.com/)
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className={styles.overviewBoxItem}>
                          <div className={styles.iconCircleSymbol}>
                            <MapPin size={20} />
                          </div>
                          <div>
                            <p className={styles.metaLabelText}>DELIVERY ADDRESS</p>
                            <p className={styles.headlineDetailsText} style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                              {activeOrder.shippingAddress?.fullName || activeOrder.customerName || 'Valued Patron'}
                            </p>
                            <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: 4, lineHeight: 1.5 }}>
                              {activeOrder.shippingAddress?.addressLine1 || activeOrder.shippingAddress?.addressLine || activeOrder.shippingAddress?.landmark || activeOrder.shippingAddress?.city ? (
                                <>
                                  {activeOrder.shippingAddress.addressLine1 || activeOrder.shippingAddress.addressLine}<br />
                                  {activeOrder.shippingAddress.landmark && <>{activeOrder.shippingAddress.landmark}<br /></>}
                                  {activeOrder.shippingAddress.city && `${activeOrder.shippingAddress.city}, `}
                                  {activeOrder.shippingAddress.state && `${activeOrder.shippingAddress.state} `}
                                  {(activeOrder.shippingAddress.pinCode || activeOrder.shippingAddress.postalCode) && `- ${activeOrder.shippingAddress.pinCode || activeOrder.shippingAddress.postalCode}`}
                                </>
                              ) : (
                                <span>Customer Address Preserved</span>
                              )}
                            </div>
                            {activeOrder.shippingAddress?.phone && (
                              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4, fontWeight: 600 }}>
                                📞 Contact: {activeOrder.shippingAddress.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Ordered Items & Gift Summary Card */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-gold)',
                  borderRadius: 12,
                  padding: '24px 28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Package size={18} color="var(--primary)" /> Items in Order ({activeOrder.items?.length || 1})
                    </h4>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                      Total Paid: ₹{(activeOrder.finalAmount || activeOrder.totalAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {(activeOrder.items && activeOrder.items.length > 0 ? activeOrder.items : [activeOrder]).map((item, idx) => {
                      const itemImg = item.image || item.images?.[0]?.url || (typeof item.images?.[0] === 'string' ? item.images[0] : null) || '/Images/saree12.png';
                      const itemPrice = Number(item.price || 0);
                      const qty = item.quantity || 1;

                      return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 0', borderBottom: idx < (activeOrder.items?.length || 1) - 1 ? '1px dashed #e2e8f0' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <img 
                              src={itemImg} 
                              alt={item.name || 'Saree'} 
                              style={{ width: 52, height: 68, objectFit: 'cover', borderRadius: 8, border: '1px solid #e2e8f0', flexShrink: 0 }} 
                            />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1e293b' }}>
                                {item.name || item.title || 'Signature Mazhai Vaanam Silk Saree'}
                              </div>
                              {item.sku && (
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                                  SKU: {item.sku}
                                </div>
                              )}
                              <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 2 }}>
                                Qty: <strong>{qty}</strong> × ₹{itemPrice.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>

                          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                            ₹{(itemPrice * qty).toLocaleString('en-IN')}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price Summary Breakdown Box */}
                  {(() => {
                    const itemsSubtotal = (activeOrder.items && activeOrder.items.length > 0)
                      ? activeOrder.items.reduce((sum, it) => sum + (Number(it.price || 0) * (it.quantity || 1)), 0)
                      : Number(activeOrder.subtotal || activeOrder.finalAmount || 0);
                    let giftFee = activeOrder.giftPackCharge || (activeOrder.giftPackaging ? 60 : 0);
                    const totalPaid = Number(activeOrder.finalAmount || activeOrder.totalAmount || 0);
                    const convenienceFee = activeOrder.convenienceFee !== undefined ? activeOrder.convenienceFee : 2;
                    let shippingFee = activeOrder.shippingFee || 0;

                    const baseSum = itemsSubtotal + giftFee + convenienceFee;
                    if (totalPaid > baseSum && activeOrder.deliveryMode !== 'pickup') {
                      const diff = totalPaid - baseSum;
                      if (giftFee === 0 && diff >= 120) {
                        giftFee = 60;
                        shippingFee = diff - 60;
                      } else if (shippingFee === 0) {
                        shippingFee = diff;
                      }
                    }

                    return (
                      <div style={{
                        marginTop: 18,
                        padding: '14px 18px',
                        background: '#faf9f6',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        fontSize: '0.85rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#64748b' }}>
                          <span>Item Total (Subtotal):</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{itemsSubtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#64748b' }}>
                          <span>Shipping & Handling:</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{shippingFee.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#64748b' }}>
                          <span>Convenience Fee:</span>
                          <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{convenienceFee.toLocaleString('en-IN')}</span>
                        </div>
                        {giftFee > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: '#b45309' }}>
                            <span>🎁 Gift Packaging:</span>
                            <span style={{ fontWeight: 600 }}>₹{giftFee.toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div style={{
                          display: 'flex', justifyContent: 'space-between',
                          paddingTop: 8, marginTop: 6,
                          borderTop: '1px dashed #cbd5e1',
                          fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)'
                        }}>
                          <span>Grand Total:</span>
                          <span>₹{totalPaid.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Gift Packaging Message Box (If Requested) */}
                  {activeOrder.giftPackaging && (
                    <div style={{
                      marginTop: 14,
                      padding: '14px 18px',
                      background: 'rgba(212, 175, 55, 0.08)',
                      border: '1.5px solid #D4AF37',
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FAF5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B38A4A', flexShrink: 0 }}>
                        <Gift size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          🎁 GIFT PACKAGING REQUESTED (+₹60)
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#451a03', fontStyle: 'italic', lineHeight: 1.4 }}>
                          "{activeOrder.giftMessage || 'Premium silk box wrap + handwritten message card included.'}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions: Invoice & Support Buttons */}
                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                    <button
                      type="button"
                      onClick={() => setShowInvoiceModal(true)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 8,
                        background: '#faf9f6',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer'
                      }}
                    >
                      <Printer size={16} /> Print Tax Invoice
                    </button>

                    <a
                      href={`https://wa.me/911236547896?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '10px 20px',
                        borderRadius: 8,
                        background: '#16a34a',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textDecoration: 'none'
                      }}
                    >
                      <MessageCircle size={16} /> WhatsApp Store Support
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </>
      )}

      {/* Tax Invoice Modal popup */}
      {showInvoiceModal && activeOrder && (
        <InvoiceModal
          order={activeOrder}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
};

export default TrackOrder;
