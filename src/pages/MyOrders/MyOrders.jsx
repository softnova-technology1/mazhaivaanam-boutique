import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { orderAPI } from '../../services/api';
import InvoiceModal from '../../components/common/InvoiceModal/InvoiceModal';
import OrderDetailsModal from '../../components/orders/OrderDetailsModal';
import { 
  ShoppingBag, 
  Cpu, 
  Download, 
  RotateCw, 
  PhoneCall, 
  Palette,
  MessageSquare,
  FileText
} from 'lucide-react';
import styles from './MyOrders.module.css';

const DUMMY_ORDERS = [];

const getStatusStepIndex = (status) => {
  switch (status?.toUpperCase()) {
    case 'PLACED':
    case 'PROCESSING': return 1;
    case 'QUALITY CHECK': return 2;
    case 'PACKAGING': return 3;
    case 'SHIPPED':
    case 'IN TRANSIT': return 4;
    case 'DELIVERED': return 5;
    case 'CANCELLED': return 0;
    default: return 1;
  }
};

export const MyOrders = ({ setCurrentTab }) => {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  
  // Modals state
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);

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
    setLoading(true);
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
              createdAt: o.createdAt,
              status: o.status?.toUpperCase() || 'PROCESSING',
              paymentStatus: o.paymentStatus || 'paid',
              paymentMethod: o.paymentMethod || 'online',
              shippingAddress: o.shippingAddress,
              courier: o.courier || '',
              trackingNumber: o.trackingNumber || '',
              mrpTotal: o.mrpTotal || o.totalAmount,
              subtotal: o.subtotal || o.totalAmount,
              totalSavings: o.totalSavings || o.discountAmount || 0,
              finalAmount: o.totalAmount,
              shippingFee: o.shippingFee || 0,
              convenienceFee: o.convenienceFee || 0,
              giftPackCharge: o.giftPackCharge || 0,
              discount: o.discount || 0,
              couponDiscount: o.couponDiscount || 0,
              couponCode: o.couponCode || '',
              deliveryMode: o.deliveryMode || 'standard',
              items: (o.items || []).map(i => ({
                id: i.product?._id || i.product,
                name: i.name,
                price: i.price,
                fabric: i.fabric || 'Pure Silk',
                image: i.image || '/Images/placeholder.svg',
                quantity: i.quantity || 1,
              }))
            }));
            setOrders([...normalized, ...localOrders]);
          } else {
            setOrders([...localOrders]);
          }
        })
        .catch(() => setOrders([...localOrders]))
        .finally(() => setLoading(false));
    } else {
      setOrders([...localOrders]);
      setLoading(false);
    }
  }, []);

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
      if (setCurrentTab) setCurrentTab('cart');
    }, 800);
  };

  // Tracking navigate details
  const handleTrackOrder = (order) => {
    window.history.pushState(null, '', `/track-order?orderId=${order.orderId}`);
    if (setCurrentTab) setCurrentTab('track-order');
  };

  // Dynamic statistics calculations
  const totalOrders = orders.length;
  const totalSavingsSum = orders.reduce((sum, o) => sum + (o.totalSavings || 0), 0);
  const rewardPointsSum = orders.reduce((sum, o) => sum + Math.round((o.finalAmount || 0) * 0.05), 0);

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
              <p className={styles.statValue}>{formatCurrency(totalSavingsSum)}</p>
            </div>
            <div className={styles.statBox}>
              <p className={styles.statLabel}>REWARD POINTS</p>
              <p className={styles.statValue}>{rewardPointsSum.toLocaleString('en-IN')}</p>
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
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <div className="spinner" style={{ margin: '0 auto 12px auto' }} />
              <p>Loading your atelier orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <ShoppingBag size={48} color="#C8A34D" style={{ marginBottom: 16 }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: '#490017', margin: '0 0 8px 0' }}>
                No Orders Yet
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px auto' }}>
                You haven't placed any orders yet. Explore our handcrafted luxury saree collections!
              </p>
              <button 
                onClick={() => setCurrentTab && setCurrentTab('shop')} 
                className={styles.actionPrimaryBtn} 
                style={{ padding: '12px 28px', fontSize: '0.85rem' }}
              >
                EXPLORE ATELIER COLLECTION
              </button>
            </div>
          ) : (
            <div className={styles.ordersStack}>
              {orders.map((order) => {
                const isDelivered = order.status === 'DELIVERED';
                const isCancelled = order.status === 'CANCELLED';
                const isExpanded = expandedOrderIds.includes(order.orderId);
                const currentStepIndex = getStatusStepIndex(order.status);

                return (
                  <article key={order.orderId} className={`${styles.orderCard} ${isExpanded ? styles.expandedCard : ''}`}>
                    {/* Shimmer element */}
                    <div className={styles.shimmerGold}></div>
                    
                    <div 
                      className={styles.orderCardLayout} 
                      onClick={() => toggleOrderExpansion(order.orderId)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Saree Thumbnail Image */}
                      <div className={styles.productThumbBox}>
                        <img 
                          src={order.items[0]?.image || '/Images/placeholder.svg'} 
                          alt={order.items[0]?.name || 'Saree thumbnail'} 
                          className={styles.productThumbImage}
                        />
                      </div>

                      {/* Saree Description Details */}
                      <div className={styles.orderCardDetails}>
                        <div>
                          <div className={styles.orderCardHeaderRow}>
                            <h3 className={styles.productNameTitle}>
                              {order.items[0]?.name || 'Luxury Handloom Saree'}
                              {order.items.length > 1 && ` & ${order.items.length - 1} other item(s)`}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={`${styles.statusBadge} ${isDelivered ? styles.deliveredBadge : isCancelled ? styles.cancelledBadge : styles.transitBadge}`}>
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
                            ORDER #{order.orderId} • PLACED ON {order.placedOnDate ? order.placedOnDate.toUpperCase() : 'RECENTLY'}
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

                    {/* Dynamic Process Stepper Timeline (Only render if not delivered & not cancelled) */}
                    {!isDelivered && !isCancelled && (
                      <div className={styles.timelineWrapper}>
                        <div className={styles.timelineLine}></div>
                        <div className={styles.timelineNodesRow}>
                          {[
                            { label: 'ORDER PLACED', step: 1 },
                            { label: 'QUALITY CHECK', step: 2 },
                            { label: 'PACKAGING', step: 3 },
                            { label: 'SHIPPED', step: 4 },
                            { label: 'DELIVERED', step: 5 }
                          ].map((stepObj) => {
                            const isActive = stepObj.step <= currentStepIndex;
                            const isCurrent = stepObj.step === currentStepIndex;

                            return (
                              <div key={stepObj.label} className={styles.timelineStepBlock}>
                                <div className={`${styles.timelineDot} ${isActive ? styles.activeDot : ''} ${isCurrent ? styles.timelineRing : ''}`}></div>
                                <span className={`${styles.timelineNodeLabel} ${!isActive ? styles.timelineMutedLabel : ''}`}>
                                  {stepObj.label}
                                </span>
                              </div>
                            );
                          })}
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
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className={styles.reviewTextBtn}
                          >
                            <FileText size={14} style={{ marginRight: '4px' }} />
                            Tax Invoice
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
                          {(order.paymentStatus === 'pending' || order.paymentStatus === 'failed') && (
                            <button 
                              onClick={() => {
                                localStorage.setItem('post_login_redirect', 'checkout');
                                window.location.href = `/checkout?orderId=${order.orderId}`;
                              }}
                              className={styles.actionPrimaryBtn}
                              style={{ background: '#b45309', borderColor: '#b45309' }}
                            >
                              ⚡ RETRY PAYMENT
                            </button>
                          )}
                          <button 
                            onClick={() => handleTrackOrder(order)}
                            className={styles.actionPrimaryBtn}
                          >
                            TRACK ORDER
                          </button>
                          <button 
                            onClick={() => setSelectedDetailOrder(order)}
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
          )}
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
              onClick={() => setCurrentTab && setCurrentTab('contact')}
              className={styles.supportActionBtn}
            >
              CONTACT CONCIERGE
            </button>
          </div>

        </aside>

      </div>

      {/* Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal 
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* Order Details Modal */}
      {selectedDetailOrder && (
        <OrderDetailsModal
          order={selectedDetailOrder}
          onClose={() => setSelectedDetailOrder(null)}
          onOpenInvoice={(ord) => {
            setSelectedDetailOrder(null);
            setSelectedInvoiceOrder(ord);
          }}
          onTrackOrder={handleTrackOrder}
        />
      )}
    </div>
  );
};

export default MyOrders;
