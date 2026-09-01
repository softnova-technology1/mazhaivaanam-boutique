import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { orderAPI } from '../../services/api';
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
  HelpCircle
} from 'lucide-react';
import styles from './TrackOrder.module.css';

export const TrackOrder = ({ setCurrentTab }) => {
  const [orderInput, setOrderInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  
  // Tracked Order details state (null = show default fallback order MV-98214-X)
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [isSearched, setIsSearched] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Default mock order details (from user's template)
  const defaultMockOrder = {
    orderId: "MV-98214-X",
    email: "concierge@example.com",
    placedOnDate: "October 12, 2024",
    arrivalRange: "October 24, 2024",
    status: "IN TRANSIT",
    courier: "BlueDart Express",
    trackingNumber: "BD98214589IN",
    lastLocation: "Chennai Central Logistics Hub",
    lastLocationTime: "2 hours ago",
    countdownDays: 2,
    mrpTotal: 72800,
    subtotal: 65000,
    totalSavings: 5500,
    finalAmount: 67300,
    pointsEarned: 2200,
    items: [
      {
        id: 'default-track-item',
        name: "Signature Silk Saree - Ruby Zari",
        price: 65000,
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

    // 2. Check localStorage (Instant local match, prevents unnecessary 404 network noise)
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
        orderId: found.orderId,
        email: found.email,
        placedOnDate: found.placedOnDate,
        arrivalRange: found.arrivalRange || deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        status: found.status || 'IN TRANSIT',
        courier: found.courier || 'BlueDart Express',
        trackingNumber: found.trackingNumber || 'BD890214589',
        lastLocation: found.city ? `${found.city} Distribution Center` : 'Atelier Sorting Hub',
        lastLocationTime: 'Transit Stage: Inbound sorting',
        countdownDays: diffDays > 0 ? diffDays : 0,
        mrpTotal: found.mrpTotal,
        subtotal: found.subtotal,
        totalSavings: found.totalSavings,
        finalAmount: found.finalAmount,
        pointsEarned: Math.round(found.finalAmount * 0.1),
        items: found.items
      };

      setTrackedOrder(dynamicOrder);
      setIsSearched(true);
      return;
    }

    // 3. Try Live MongoDB API if not found locally
    try {
      const liveData = await orderAPI.trackOrder(id);
      if (liveData) {
        const orderPlacedDate = new Date(liveData.createdAt || Date.now());
        const deliveryDate = liveData.estimatedDelivery 
          ? new Date(liveData.estimatedDelivery) 
          : new Date(orderPlacedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const diffDays = Math.ceil((deliveryDate - new Date()) / (1000 * 60 * 60 * 24));

        const dynamicOrder = {
          orderId: liveData.orderId,
          email: liveData.shippingAddress?.email || liveData.user?.email || 'Valued Patron',
          placedOnDate: orderPlacedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          arrivalRange: deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          status: liveData.status || 'PROCESSING',
          courier: liveData.courier || 'BlueDart Premium Express',
          trackingNumber: liveData.trackingNumber || '',
          lastLocation: liveData.statusHistory?.[liveData.statusHistory?.length - 1]?.note || (liveData.status === 'DELIVERED' ? 'Delivered to Customer Doorstep' : 'Dispatched from Central Atelier Hub'),
          lastLocationTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          countdownDays: diffDays > 0 ? diffDays : 0,
          mrpTotal: liveData.items?.reduce((sum, it) => sum + (it.price * 1.15 * it.quantity), 0) || liveData.totalAmount || 0,
          subtotal: liveData.totalAmount || 0,
          totalSavings: Math.round((liveData.totalAmount || 0) * 0.05),
          finalAmount: liveData.totalAmount || 0,
          pointsEarned: Math.round((liveData.totalAmount || 0) * 0.1),
          items: liveData.items || [],
          statusHistory: liveData.statusHistory || []
        };

        setTrackedOrder(dynamicOrder);
        setIsSearched(true);
        return;
      }
    } catch {
      // Gracefully handle not found without throwing red console logs
    }

    setErrorText(`No active shipment found for "${id}". Check your Order ID from your confirmation or try "MV-98214-X".`);
    setIsSearched(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLocateShipment(orderInput);
  };

  const activeOrder = trackedOrder || defaultMockOrder;

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
          {/* Status & Delivery Details */}
          <section className={styles.statusDetailsSection}>
            <div className={styles.detailsLayoutGrid}>
              
              {/* Left Column: Live Status & Luxury Timeline */}
              <div className={styles.detailsLeftCol}>
                
                {/* Live Status Card */}
                <div className={styles.statusLiveCard}>
                  <div className={styles.statusLiveHeader}>
                    <div>
                      <h3 className={styles.statusLiveOrderId}>Order #{activeOrder.orderId}</h3>
                      <p className={styles.arrivalScheduleText}>
                        Estimated Arrival: <span className={styles.arrivalDateHighlight}>{activeOrder.arrivalRange}</span>
                      </p>
                    </div>
                    <span className={styles.transitStatusBadge}>
                      {activeOrder.status}
                    </span>
                  </div>

                  <div className={styles.statusOverviewRow}>
                    <div className={styles.overviewBoxItem}>
                      <div className={styles.iconCircleSymbol}>
                        <Truck size={20} />
                      </div>
                      <div>
                        <p className={styles.metaLabelText}>COURIER SERVICE</p>
                        <p className={styles.headlineDetailsText}>{activeOrder.courier}</p>
                        <button 
                          onClick={() => alert(`Direct link to carrier portal for ${activeOrder.orderId} matches tracking coordinates.`)} 
                          className={styles.courierTrackLink}
                        >
                          Direct Tracking Link
                        </button>
                      </div>
                    </div>

                    <div className={styles.overviewBoxItem}>
                      <div className={styles.iconCircleSymbol}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className={styles.metaLabelText}>LAST UPDATED</p>
                        <p className={styles.headlineDetailsText}>{activeOrder.lastLocation}</p>
                        <p className={styles.updatedAgoText}>{activeOrder.lastLocationTime}</p>
                      </div>
                    </div>
                  </div>
                </div>



              </div>

              {/* Right Column: Delivery Map & Countdown Badge */}
              <div className={styles.detailsRightCol}>
                
                {/* Map visual card */}
                <div className={styles.deliveryMapCard}>
                  <div className={styles.mapGrayscaleBackground}></div>
                  <div className={styles.mapOverlayGlow}></div>
                  
                  {/* SVG Route Line overlay */}
                  <svg className={styles.mapRouteSvg} preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path 
                      d="M20 80 Q 50 20 80 10" 
                      fill="none" 
                      stroke="#6B102A" 
                      strokeDasharray="3,3" 
                      strokeWidth="0.8"
                    />
                  </svg>

                  <div className={styles.mapLocationBadge}>
                    <p className={styles.mapLocationMeta}>CURRENT LOCATION</p>
                    <p className={styles.mapLocationValue}>{activeOrder.lastLocation}</p>
                  </div>

                  <div className={styles.mapCountdownBadge}>
                    <p className={styles.countdownMetaLabel}>ARRIVING IN</p>
                    <div className={styles.countdownValueBlock}>
                      <span className={styles.countdownDaysValue}>{activeOrder.countdownDays.toString().padStart(2, '0')}</span>
                      <span className={styles.countdownDaysUnit}>DAYS</span>
                    </div>
                  </div>
                </div>



              </div>

            </div>
          </section>



          {/* Pricing & Acquisition Savings Table */}
          <section className={styles.pricingAcquisitionSection}>
            <div className={styles.pricingLayoutGrid}>
              
              {/* Table columns */}
              <div>
                <h2 className={styles.pricingSectionTitle}>Order &amp; Savings Summary</h2>
                <p className={styles.pricingSectionDesc}>
                  Detailed breakdown of your acquisition and the exclusive Mazhai Vaanam membership rewards applied to this transaction.
                </p>

                <div className={styles.pricingTableRowsStack}>
                  {activeOrder.items.map((item) => (
                    <div key={item.id} className={styles.tablePricingRow}>
                      <span className={styles.tableRowItemName}>{item.name}</span>
                      <span className={styles.tableRowItemPrice}>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                  <div className={styles.tablePricingRow}>
                    <span className={styles.tableRowItemName}>Luxury Packaging &amp; Shipping</span>
                    <span className={styles.complimentaryBadge}>COMPLIMENTARY</span>
                  </div>
                  <div className={styles.tablePricingRow}>
                    <span className={styles.tableRowItemName}>GST (12% Included)</span>
                    <span className={styles.tableRowItemPrice}>{formatCurrency(Math.round(activeOrder.finalAmount * 0.12))}</span>
                  </div>
                </div>
              </div>

              {/* Burgundy Total Paid Card */}
              <div className={styles.priceExperienceBurgundyCard}>
                <div className={styles.burgundyCardGlow}></div>
                <div className={styles.burgundyCardContent}>
                  <h3 className={styles.burgundyCardHeadline}>The Price Experience</h3>
                  
                  <div className={styles.burgundyCardOverviewRow}>
                    <div>
                      <p className={styles.burgundyMetaText}>TOTAL VALUE ACQUIRED</p>
                      <p className={styles.burgundyTotalPaidAmount}>{formatCurrency(activeOrder.mrpTotal || Math.round(activeOrder.finalAmount * 1.15))}</p>
                    </div>
                    <div className={styles.burgundySavingsTextRight}>
                      <p className={styles.burgundyMetaSavings}>EXCLUSIVE SAVINGS</p>
                      <p className={styles.burgundySavingsValueAmount}>- {formatCurrency(activeOrder.totalSavings)}</p>
                    </div>
                  </div>

                  <div className={styles.burgundyPointsCard}>
                    <div className={styles.burgundyPointsHeaderRow}>
                      <span className={styles.pointsLabelText}>Heritage Points Earned</span>
                      <span className={styles.pointsValueCount}>{activeOrder.pointsEarned.toLocaleString('en-IN')} pts</span>
                    </div>
                    <div className={styles.pointsBarContainer}>
                      <div className={styles.pointsBarProgress} style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div className={styles.burgundyPaidFooter}>
                    <span className={styles.footerPaidLabel}>Total Paid</span>
                    <span className={styles.footerPaidAmount}>{formatCurrency(activeOrder.finalAmount)}</span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </>
      )}

    </div>
  );
};

export default TrackOrder;
