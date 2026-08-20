import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { orderAPI } from '../../services/api';
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Tag, 
  Cpu, 
  Activity, 
  Download, 
  RotateCw, 
  PhoneCall, 
  ArrowRight,
  Award,
  Palette,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import styles from './MyOrders.module.css';

export const MyOrders = ({ setCurrentTab }) => {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrderIds(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const saved = localStorage.getItem('boutique_orders');
    const localOrders = saved ? JSON.parse(saved) : [];

    const token = localStorage.getItem('boutique_token');
    if (token) {
      orderAPI.getMyOrders()
        .then(dbOrders => {
          if (dbOrders && dbOrders.length > 0) {
            const normalized = dbOrders.map(o => ({
              orderId: o.orderId,
              placedOnDate: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
              status: o.status?.toUpperCase() || 'PLACED',
              mrpTotal: o.totalAmount,
              subtotal: o.subtotal || o.totalAmount,
              totalSavings: o.discountAmount || 0,
              finalAmount: o.totalAmount,
              items: (o.items || []).map(i => ({
                id: i.product?._id || i.product,
                name: i.name,
                price: i.price,
                image: i.image || '/Images/saree1.png',
                quantity: i.quantity,
              }))
            }));
            setOrders([...normalized, ...localOrders]);
          } else {
            setOrders(localOrders);
          }
        })
        .catch(() => setOrders(localOrders));
    } else {
      setOrders(localOrders);
    }
  }, []);

  // Invoice Download Helper (Generates text receipt locally)
  const handleInvoiceDownload = (order) => {
    const isCustom = order.items && order.items[0]?.id && !order.items[0].id.startsWith('mock-');
    let txtContent = '';

    if (isCustom) {
      txtContent = `
=========================================
      MAZHAI VAANAM - INVOICE
=========================================
Order ID: ${order.orderId}
Date: ${order.placedOnDate}
Customer Name: ${order.fullName || 'Connoisseur Client'}
Email: ${order.email || ''}
Phone: ${order.phone || ''}
Shipping Address: 
  ${order.addressLine || ''},
  ${order.city || ''}, ${order.stateName || ''} - ${order.pinCode || ''}

-----------------------------------------
ITEMS ORDERED:
${order.items.map(item => `- ${item.name} (Qty: ${item.quantity || 1}) - ${formatCurrency(item.price * (item.quantity || 1))}`).join('\n')}

-----------------------------------------
BILLING DETAILS:
Subtotal (MRP): ${formatCurrency(order.mrpTotal)}
Exclusive Member Price: ${formatCurrency(order.subtotal)}
Festival Discount: -${formatCurrency(order.festivalDiscount || 0)}
Gift Wrap Packaging: +${formatCurrency(order.giftPackAddon || 0)}
White Glove Shipping: FREE
FINAL AMOUNT PAID: ${formatCurrency(order.finalAmount)}
-----------------------------------------
Thank you for choosing handloom heritage.
=========================================
      `;
    } else {
      txtContent = `
=========================================
      MAZHAI VAANAM - INVOICE
=========================================
Order ID: ${order.orderId}
Date: ${order.placedOnDate}
Customer: Walk-in Atelier Connoisseur

-----------------------------------------
ITEMS ORDERED:
${order.items.map(item => `- ${item.name} (Qty: 1) - ${formatCurrency(item.price)}`).join('\n')}

-----------------------------------------
BILLING DETAILS:
Subtotal (MRP): ${formatCurrency(order.mrpTotal)}
Exclusive Member Price: ${formatCurrency(order.subtotal)}
White Glove Shipping: FREE
FINAL AMOUNT PAID: ${formatCurrency(order.finalAmount)}
-----------------------------------------
Thank you for choosing handloom heritage.
=========================================
      `;
    }

    const element = document.createElement("a");
    const file = new Blob([txtContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Invoice-${order.orderId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast(`Invoice for Order #${order.orderId} downloaded!`);
  };

  // Reorder Item: add items of that order back to cart and direct to Cart tab
  const handleReorder = (order) => {
    order.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category || '',
        fabric: item.fabric || '',
        color: item.color || '',
        rating: 4.8
      }, item.quantity || 1);
    });
    triggerToast("Items added back to your bag!");
    setTimeout(() => {
      setCurrentTab('cart');
    }, 800);
  };

  // Tracking navigate details
  const handleTrackOrder = (order) => {
    window.history.pushState(null, '', `/track-order?orderId=${order.orderId}`);
    setCurrentTab('track-order');
  };

  // Dynamic statistics calculations
  const totalOrders = orders.length;
  // Custom orders sums
  const customOrders = orders.filter(o => o.orderId && !o.orderId.startsWith('MV-829') && !o.orderId.startsWith('MV-815'));
  const extraSavings = customOrders.reduce((sum, o) => sum + (o.totalSavings || 0), 0);
  const extraRewards = customOrders.reduce((sum, o) => sum + Math.round((o.finalAmount || 0) * 0.1), 0);

  const finalMoneySaved = 24500 + extraSavings;
  const finalRewardPoints = 4820 + extraRewards;

  return (
    <div className={styles.myOrdersPageContainer}>
      {toastMessage && (
        <div className={styles.toastNotification}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroLayoutGrid}>
          <div>
            <span className={styles.subHeadline}>ACCOUNT OVERVIEW</span>
            <h1 className={styles.displayHeading}>Your Fashion Journey</h1>
          </div>
          <div className={styles.statsPanel}>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>TOTAL ORDERS</p>
              <p className={styles.statValue}>{totalOrders.toString().padStart(2, '0')}</p>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>MONEY SAVED</p>
              <p className={styles.statValue}>{formatCurrency(finalMoneySaved)}</p>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>REWARD POINTS</p>
              <p className={styles.statValue}>{finalRewardPoints.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        <div className={styles.dividerLine}></div>
      </section>

      {/* Main Content Grid */}
      <div className={styles.layoutGrid}>
        
        {/* Left Column: Recent Orders List */}
        <div className={styles.leftColumn}>
          <h2 className={styles.sectionHeaderTitle}>Recent Orders</h2>
          
          <div className={styles.ordersStack}>
            {orders.map((order) => {
              const isDelivered = order.status === 'DELIVERED';
              const isExpanded = expandedOrderIds.includes(order.orderId);
              
              return (
                <article key={order.orderId} className={`${styles.orderCard} ${isExpanded ? styles.expandedCard : ''}`}>
                  {/* Shimmer element */}
                  <div className={styles.shimmerGold}></div>
                  
                  <div 
                    className={styles.orderCardLayout} 
                    onClick={() => {
                      if (window.innerWidth <= 425) {
                        toggleOrderExpansion(order.orderId);
                      }
                    }}
                  >
                    {/* Saree Thumbnail Image */}
                    <div className={styles.productThumbBox}>
                      <img 
                        src={order.items[0]?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'} 
                        alt={order.items[0]?.name || 'Saree thumbnail'} 
                        className={styles.productThumbImage}
                      />
                    </div>

                    {/* Saree Description Details */}
                    <div className={styles.orderCardDetails}>
                      <div>
                        <div className={styles.orderCardHeaderRow}>
                          <h3 className={styles.productNameTitle}>
                            {order.items[0]?.name || 'Luxury Saree'}
                            {order.items.length > 1 && ` & ${order.items.length - 1} other item(s)`}
                          </h3>
                          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                            <span className={`${styles.statusBadge} ${isDelivered ? styles.deliveredBadge : styles.transitBadge}`}>
                              {order.status}
                            </span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="16" height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                              className={`${styles.chevronIcon} ${isExpanded ? styles.chevronOpen : ''}`}
                            >
                              <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                          </div>
                        </div>
                        <p className={styles.orderMetaText}>
                          ORDER #{order.orderId} • PLACED ON {order.placedOnDate.toUpperCase()}
                        </p>
                      </div>

                      {/* Pricing breakdowns */}
                      <div className={styles.priceSummaryBox}>
                        <div className={styles.priceRowItem}>
                          <span className={styles.priceRowLabel}>MRP</span>
                          <span className={styles.priceRowOldVal}>{formatCurrency(order.mrpTotal)}</span>
                        </div>
                        <div className={styles.priceRowItem}>
                          <span className={styles.priceRowLabel}>Exclusive Price</span>
                          <span className={styles.priceRowVal}>{formatCurrency(order.subtotal)}</span>
                        </div>
                        <div className={styles.priceRowItem}>
                          <span className={styles.savingsLabelLabel}>Savings</span>
                          <span className={styles.savingsLabelValue}>- {formatCurrency(order.totalSavings)}</span>
                        </div>
                        <div className={styles.payableRowItem}>
                          <span>Final Paid</span>
                          <span>{formatCurrency(order.finalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Process Timeline (Only render if in transit) */}
                  {!isDelivered && (
                    <div className={styles.timelineWrapper}>
                      <div className={styles.timelineLine}></div>
                      <div className={styles.timelineNodesRow}>
                        
                        <div className={styles.timelineStepBlock}>
                          <div className={`${styles.timelineDot} ${styles.activeDot}`}></div>
                          <span className={styles.timelineNodeLabel}>ORDER PLACED</span>
                        </div>
                        
                        <div className={styles.timelineStepBlock}>
                          <div className={`${styles.timelineDot} ${styles.activeDot}`}></div>
                          <span className={styles.timelineNodeLabel}>QUALITY CHECK</span>
                        </div>
                        
                        <div className={styles.timelineStepBlock}>
                          <div className={`${styles.timelineDot} ${styles.activeDot}`}></div>
                          <span className={styles.timelineNodeLabel}>PACKAGING</span>
                        </div>
                        
                        <div className={styles.timelineStepBlock}>
                          <div className={`${styles.timelineDot} ${styles.activeDot} ${styles.timelineRing}`}></div>
                          <span className={styles.timelineNodeLabel}>SHIPPED</span>
                        </div>
                        
                        <div className={styles.timelineStepBlock}>
                          <div className={styles.timelineDot}></div>
                          <span className={`${styles.timelineNodeLabel} ${styles.timelineMutedLabel}`}>DELIVERED</span>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className={styles.cardActionsFooter}>
                    {isDelivered ? (
                      <>
                        <button 
                          onClick={() => alert(`Review portal for Order ${order.orderId} coming soon!`)}
                          className={styles.reviewTextBtn}
                        >
                          <MessageSquare size={14} style={{ marginRight: '4px' }} />
                          Write Review
                        </button>
                        <button 
                          onClick={() => handleInvoiceDownload(order)}
                          className={styles.reviewTextBtn}
                        >
                          <Download size={14} style={{ marginRight: '4px' }} />
                          Download Invoice
                        </button>
                        <button 
                          onClick={() => handleReorder(order)}
                          className={styles.reorderTextLink}
                        >
                          <RotateCw size={14} style={{ marginRight: '4px' }} />
                          Reorder
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleTrackOrder(order)}
                          className={styles.actionPrimaryBtn}
                        >
                          TRACK ORDER
                        </button>
                        <button 
                          onClick={() => handleInvoiceDownload(order)}
                          className={styles.actionSecondaryBtn}
                        >
                          VIEW DETAILS
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Right Column: Wardrobe Insights & Concierge */}
        <aside className={styles.rightColumn}>
          
          <div className={styles.insightsCard}>
            <h3 className={styles.insightsTitle}>Wardrobe Insights</h3>
            
            <div className={styles.insightsList}>
              {/* Insights Fabric */}
              <div>
                <p className={styles.insightsMetaLabel}>FAVORITE FABRIC</p>
                <div className={styles.insightBoxItem}>
                  <div className={styles.insightIconBox}>
                    <Cpu size={20} />
                  </div>
                  <div>
                    <p className={styles.insightHeadingText}>Kanchipuram Silk</p>
                    <p className={styles.insightSubtitleText}>6 ITEMS PURCHASED</p>
                  </div>
                </div>
              </div>

              {/* Insights Color */}
              <div>
                <p className={styles.insightsMetaLabel}>FAVORITE COLOR</p>
                <div className={styles.insightBoxItem}>
                  <div className={styles.insightIconBox} style={{ color: 'var(--primary)', backgroundColor: 'rgba(73, 0, 23, 0.05)' }}>
                    <Palette size={20} />
                  </div>
                  <div>
                    <p className={styles.insightHeadingText}>Royal Maroon</p>
                    <p className={styles.insightSubtitleText}>40% OF WARDROBE</p>
                  </div>
                </div>
              </div>

              {/* Next tier gold progress box */}
              <div className={styles.progressTierBox}>
                <span className={styles.tierSubheading}>NEXT REWARD TIER</span>
                <h4 className={styles.tierTitleName}>Heritage Gold Member</h4>
                
                <div className={styles.tierBarContainer}>
                  <div className={styles.tierBarProgress} style={{ width: '75%' }}></div>
                </div>
                
                <p className={styles.tierThresholdDesc}>
                  ₹15,000 MORE TO UNLOCK EXCLUSIVE PREVIEWS
                </p>
              </div>

            </div>
          </div>

          {/* Assistance Concierge Card */}
          <div className={styles.supportCard}>
            <PhoneCall className={styles.supportIconSymbol} size={40} />
            <h4 className={styles.supportTitle}>Need Assistance?</h4>
            <p className={styles.supportDesc}>
              Our Concierge is available 24/7 for order inquiries and styling advice.
            </p>
            <button 
              onClick={() => setCurrentTab('contact')}
              className={styles.supportActionBtn}
            >
              CONTACT CONCIERGE
            </button>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default MyOrders;
