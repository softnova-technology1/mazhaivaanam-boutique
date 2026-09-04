import React, { useState, useEffect } from 'react';
import styles from './PreBooking.module.css';
import { ChevronDown, ArrowRight, Grid, List, Filter, X, Star, Heart, Share2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { getPreorderProducts } from '../../services/api';

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'relevance', label: 'Most relevant' },
  { value: 'best-selling', label: 'Best selling' },
  { value: 'alpha-asc', label: 'Alphabetically, A-Z' },
  { value: 'alpha-desc', label: 'Alphabetically, Z-A' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'date-asc', label: 'Date, old to new' },
  { value: 'date-desc', label: 'Date, new to old' },
];

const getProductDetails = (product) => {
  if (!product) return null;

  return {
    headline: product.name,
    shortDescription: product.shortDescription,
    p1: product.description || 'Welcome to the heritage of handloom. Experience premium comfort, authentic design, and exquisite weave tailored for special occasions.',
    p2: '',
    fabric: product.fabric,
    pattern: product.pattern,
    pallu: product.pallu,
    blouse: product.blouse,
    sareeLength: product.sareeLength,
    height: product.height,
    blouseLength: product.blouseLength,
    weight: product.weight,
    washCare: product.washCare,
    returnPolicy: product.returnPolicy,
    note: product.note
  };
};

export const PreBooking = ({ setCurrentTab, setSelectedProduct, setDirectCheckoutItem }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [selectedPriceFilters, setSelectedPriceFilters] = useState([]);
  
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeQuickViewImage, setActiveQuickViewImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const handleShareClick = (e, product) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || `Check out ${product.name} at Mazhai Vaanam!`,
        url: productUrl,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(productUrl).then(() => {
        window.dispatchEvent(new CustomEvent('show-toast', { 
          detail: { message: `Link to "${product.name}" copied to clipboard!` } 
        }));
      }).catch((err) => console.error('Could not copy text: ', err));
    }
  };

  const details = quickViewProduct ? getProductDetails(quickViewProduct) : null;

  const getProductDisplayId = (product) => {
    if (!product) return '';
    const pid = product.id || product._id;
    if (pid && typeof pid === 'string' && pid.startsWith('pre-')) {
      return pid.toUpperCase();
    }
    const index = products.findIndex(p => (p.id || p._id) === pid);
    return index !== -1 ? `PRE-${index + 1}` : 'PRE';
  };

  useEffect(() => {
    let active = true;
    const fetchPreorders = async () => {
      setLoading(true);
      try {
        const fetched = await getPreorderProducts();
        if (active) {
          setProducts(fetched || []);
        }
      } catch (err) {
        console.error('Error fetching preorder products:', err);
        if (active) {
          setProducts([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchPreorders();
    return () => {
      active = false;
    };
  }, []);

  React.useEffect(() => {
    if (quickViewProduct || isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [quickViewProduct, isMobileFilterOpen]);

  const handleFilterToggle = (setState, filterId) => {
    setState(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId) 
        : [...prev, filterId]
    );
  };

  const handlePreorderClick = (product) => {
    if (setDirectCheckoutItem) {
      setDirectCheckoutItem(product);
    }
    if (setSelectedProduct && setCurrentTab) {
      setSelectedProduct(product);
      setCurrentTab('checkout');
    }
  };

  const sortedProducts = React.useMemo(() => {
    let filtered = [...products];
    
    // Apply Price Filters
    if (selectedPriceFilters.length > 0) {
      filtered = filtered.filter(product => {
        return selectedPriceFilters.some(filter => {
          if (filter === 'under-15k') return product.price < 15000;
          if (filter === '15k-25k') return product.price >= 15000 && product.price <= 25000;
          if (filter === 'over-25k') return product.price > 25000;
          return false;
        });
      });
    }

    // Apply Time Filters
    if (selectedTimes.length > 0) {
      filtered = filtered.filter(product => {
        return selectedTimes.some(filter => {
          if (filter === 'under-15') return product.estimatedDays < 15;
          if (filter === '15-30') return product.estimatedDays >= 15 && product.estimatedDays <= 30;
          if (filter === 'over-30') return product.estimatedDays > 30;
          return false;
        });
      });
    }

    switch (selectedSort) {
      case 'alpha-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'date-asc':
      case 'date-desc':
      case 'best-selling':
      case 'relevance':
      case 'featured':
      default:
        // Use default order for these as we don't have real data fields for them yet
        break;
    }
    return filtered;
  }, [products, selectedSort, selectedPriceFilters, selectedTimes]);

  return (
    <div className={styles['prebooking-page-container']}>
      


      <main className={styles['main-layout']}>
        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div className={styles['mobile-filter-overlay']} onClick={() => setIsMobileFilterOpen(false)} />
        )}

        {/* Left Sidebar */}
        <aside className={`${styles['filters-sidebar']} ${isMobileFilterOpen ? styles['open'] : ''}`}>
          <div className={styles['sticky-sidebar-content']}>
            <div className={styles['mobile-sidebar-header']}>
              <h2 className={styles['sidebar-title']}>Filters</h2>
              <button className={styles['close-filter-btn']} onClick={() => setIsMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Estimated Delivery Widget */}
            <div className={styles['filter-widget']}>
              <div role="button" 
                className={styles['widget-header-btn']} 
                onClick={() => setIsTimeOpen(!isTimeOpen)}
              >
                <span>Delivery Time</span>
                <ChevronDown size={14} className={`${styles['chevron-icon']} ${isTimeOpen ? styles['open'] : ''}`} />
              </div>
              {isTimeOpen && (
                <div className={styles['widget-content']}>
                  <label className={styles['checkbox-label']}>
                    <input 
                      type="checkbox" 
                      checked={selectedTimes.includes('under-15')}
                      onChange={() => handleFilterToggle(setSelectedTimes, 'under-15')}
                    /> Under 20 Days
                  </label>
                  <label className={styles['checkbox-label']}>
                    <input 
                      type="checkbox" 
                      checked={selectedTimes.includes('15-30')}
                      onChange={() => handleFilterToggle(setSelectedTimes, '15-30')}
                    /> 25 - 30 Days
                  </label>
                  
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <section className={styles['products-panel']}>
          {/* Header Description */}
          <div className={styles['collection-header']}>
            <h1 className={styles['collection-title']}>Pre Booking Collections</h1>
            <div className={styles['collection-description']}>
              <p><strong>Reserve Your Favourite Saree Before It's Gone!</strong></p>
              <p>Our exclusive handloom sarees are crafted in limited quantities. Pre-book now to secure your preferred design before it sells out.</p>
              <p>💫 <strong>Exclusive Collection</strong> – Handpicked premium sarees woven with timeless elegance and traditional craftsmanship.</p>
              <p>🛍️ <strong>Priority Reservation</strong> – Confirm your booking today and we'll reserve your selected saree exclusively for you.</p>
              <p>🚚 <strong>Delivery Timeline</strong> – Your saree will be carefully prepared and delivered within 35–40 days.</p>
              <p>❤️ <strong>Flexible Booking</strong> – Need to make a change? You can modify or exchange your booking before dispatch. (Refunds are not available.)</p>
              <p>🌸 <strong>Own a Piece of Heritage</strong> – Experience authentic craftsmanship with every weave, designed to make every occasion memorable.</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className={styles['toolbar']}>
            <div className={styles['toolbar-left']}>
              <span>Showing 1 - {sortedProducts.length} of {sortedProducts.length} products</span>
            </div>
            <div className={styles['toolbar-right']}>
              <button 
                className={styles['mobile-filter-btn']}
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <Filter size={14} /> Filters
              </button>
              <div className={styles['sort-dropdown']}>
                <span className={styles['sort-label']}>Sort by:</span>
                <div role="button" 
                  className={styles['sort-btn']}
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  <span className={styles['sort-btn-text']}>
                    {SORT_OPTIONS.find(opt => opt.value === selectedSort)?.label || 'Featured'}
                  </span>
                  <ChevronDown size={14} />
                </div>
                {isSortOpen && (
                  <div className={styles['sort-menu']}>
                    {SORT_OPTIONS.map((option) => (
                      <div 
                        key={option.value}
                        role="button"
                        onClick={() => {
                          setSelectedSort(option.value);
                          setIsSortOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles['view-toggles']}>
                <span className={styles['sort-label']}>View</span>
                <div 
                  role="button" 
                  className={`${styles['view-icon-btn']} ${viewMode === 'grid' ? styles['active-view'] : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={16} />
                </div>
                <div 
                  role="button" 
                  className={`${styles['view-icon-btn']} ${viewMode === 'list' ? styles['active-view'] : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem 0', width: '100%' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(200, 163, 77, 0.1)',
                borderTopColor: '#C8A34D',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <h3>No Pre-Booking products available at the moment.</h3>
              <p style={{ marginTop: '1rem' }}>Please check back later.</p>
            </div>
          ) : (
            <div className={`${styles['product-grid']} ${viewMode === 'list' ? styles['list-view'] : ''}`}>
              {sortedProducts.map((product) => (
                <div key={product.id} className={styles['product-card']}>
                  <div className={styles['product-image-container']} onClick={() => handlePreorderClick(product)}>
                    {product.discount && <div className={styles['discount-badge']}>{product.discount}</div>}
                    {product.estimatedDays && (
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(255, 255, 255, 0.95)', color: 'var(--primary-dark)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, zIndex: 2, border: '1px solid rgba(200, 163, 77, 0.3)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        ⏳ {product.estimatedDays}
                      </div>
                    )}
                    
                    <div 
                      className={styles['wishlist-btn']} 
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                      role="button"
                    >
                      <Heart 
                        size={16} 
                        fill={wishlist.some(w => (w.id || w._id) === (product.id || product._id)) ? "#e63946" : "none"} 
                        stroke={wishlist.some(w => (w.id || w._id) === (product.id || product._id)) ? "#e63946" : "var(--primary-dark)"} 
                      />
                    </div>
                    <div 
                      className={styles['share-btn']} 
                      onClick={(e) => handleShareClick(e, product)}
                      role="button"
                    >
                      <Share2 size={16} stroke="var(--primary-dark)" />
                    </div>

                    <img src={product.image} alt={product.name} className={styles['product-image']} />
                  </div>
                  <div className={styles['product-info']}>
                    <h3 className={styles['product-name']} onClick={() => handlePreorderClick(product)}>
                      {product.name} | {product.sku}
                    </h3>
                    <p className={styles['product-desc']}>{product.description}</p>
                    
                    

                    <div className={styles['product-price-row']}>
                      <span className={styles['current-price']}>{formatCurrency(product.price)}</span>
                      {product.oldPrice > product.price && <span className={styles['old-price']}>{formatCurrency(product.oldPrice)}</span>}
                    </div>
                    <div 
                      role="button" 
                      className={styles['prebook-btn']} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreorderClick(product);
                      }}
                    >
                      PRE BOOK NOW
                    </div>
                    <div role="button" className={styles['quick-view-btn']} onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); setQuantity(1); setActiveQuickViewImage(0); }}>
                      Quick view
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className={styles['quick-view-overlay']} onClick={() => setQuickViewProduct(null)}>
          <div className={styles['quick-view-modal']} onClick={(e) => e.stopPropagation()}>
            <div role="button" className={styles['close-modal-btn']} onClick={() => setQuickViewProduct(null)}>✕</div>
            
            <div className={styles['quick-view-content']}>
              <div className={styles['quick-view-images']}>
                {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                  <div className={styles['thumbnails']}>
                    {quickViewProduct.images.map((imgObj, idx) => (
                      <img 
                        key={idx} 
                        src={imgObj.url || imgObj} 
                        className={idx === activeQuickViewImage ? styles['thumbnail-active'] : styles['thumbnail']} 
                        alt={`thumb ${idx + 1}`} 
                        onClick={() => setActiveQuickViewImage(idx)}
                      />
                    ))}
                  </div>
                )}
                <div className={styles['main-image-container']} style={{ position: 'relative' }}>
                  <img 
                    src={quickViewProduct.images && quickViewProduct.images.length > 0 ? (quickViewProduct.images[activeQuickViewImage]?.url || quickViewProduct.images[activeQuickViewImage]) : quickViewProduct.image} 
                    alt={quickViewProduct.name} 
                    className={styles['main-image']} 
                  />
                  <div 
                    className={styles['wishlist-btn']} 
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(quickViewProduct); }}
                    role="button"
                    style={{ top: '20px', right: '20px', width: '42px', height: '42px' }}
                  >
                    <Heart 
                      size={20} 
                      fill={wishlist.some(w => (w.id || w._id) === (quickViewProduct.id || quickViewProduct._id)) ? "#e63946" : "none"} 
                      stroke={wishlist.some(w => (w.id || w._id) === (quickViewProduct.id || quickViewProduct._id)) ? "#e63946" : "var(--primary-dark)"} 
                    />
                  </div>
                  <div 
                    className={styles['share-btn']} 
                    onClick={(e) => handleShareClick(e, quickViewProduct)}
                    role="button"
                    style={{ top: '72px', right: '20px', width: '42px', height: '42px' }}
                  >
                    <Share2 size={20} stroke="var(--primary-dark)" />
                  </div>
                </div>
              </div>
              
              <div className={styles['quick-view-details']}>
                <div className={styles['qv-scrollable-content']}>
                  <div className={styles['qv-collection-title']}>MAZHAI VAANAM PRE BOOKING COLLECTIONS</div>
                  <h2 className={styles['qv-title']}>{quickViewProduct.name} | {quickViewProduct.sku}</h2>
                  {details.shortDescription && <p className={styles['qv-desc-p']} style={{ fontWeight: 500, color: 'var(--text-main)', marginBottom: '15px' }}>{details.shortDescription}</p>}
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                    {quickViewProduct.discount && <div className={styles['qv-badge']} style={{ margin: 0 }}>Save {quickViewProduct.discount}</div>}
                    {quickViewProduct.estimatedDays && (
                      <div className={styles['qv-badge']} style={{ margin: 0, background: '#f5f5f5', color: 'var(--text-main)', border: '1px solid #ddd' }}>
                        ⏳ Est. Dispatch: {quickViewProduct.estimatedDays}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles['qv-price-row']} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <span className={styles['qv-label']}>Price:</span>
                    <span className={styles['qv-current-price']}>{formatCurrency(quickViewProduct.price)}</span>
                    {quickViewProduct.oldPrice && quickViewProduct.oldPrice > quickViewProduct.price && (
                      <span className={styles['qv-old-price']}>{formatCurrency(quickViewProduct.oldPrice)}</span>
                    )}
                  </div>
                  
                  <div className={styles['qv-quantity-row']}>
                    <span className={styles['qv-label']}>Quantity:</span>
                    <div className={styles['quantity-selector']}>
                      <div role="button" className={styles['qty-btn']} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</div>
                      <span>{quantity}</span>
                      <div role="button" className={styles['qty-btn']} onClick={() => setQuantity(quantity + 1)}>+</div>
                    </div>
                  </div>

                  {details && (
                    <div className={styles['qv-description-section']}>
                      <p className={styles['qv-desc-p']}>{details.p1}</p>
                      <p className={styles['qv-desc-p']}>{details.p2}</p>
                      
                      <h5 className={styles['qv-highlights-title']}>Product Highlights:</h5>
                      <ul className={styles['qv-highlights-list']}>
                        {details.fabric && <li><strong>Fabric:</strong> {details.fabric}</li>}
                        {details.pattern && <li><strong>Pattern / Design:</strong> {details.pattern}</li>}
                        {details.pallu && <li><strong>Pallu:</strong> {details.pallu}</li>}
                        {details.blouse && <li><strong>Blouse:</strong> {details.blouse}</li>}
                        {details.sareeLength && <li><strong>Saree Length:</strong> {details.sareeLength}</li>}
                        {details.height && <li><strong>Height:</strong> {details.height}</li>}
                        {details.blouseLength && <li><strong>Blouse Length:</strong> {details.blouseLength}</li>}
                        {details.weight && <li><strong>Weight:</strong> {details.weight}</li>}
                        {details.washCare && <li><strong>Wash Care:</strong> {details.washCare}</li>}
                        {details.returnPolicy && <li><strong>Return/Exchange:</strong> {details.returnPolicy}</li>}
                      </ul>
                      <p className={styles['qv-desc-note']}>
                        <strong>Note:</strong> {details.note || 'Digital images may vary slightly from the actual product colour due to screen settings and photography lighting.'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className={styles['qv-actions']}>
                  <div 
                    role="button"
                    className={styles['qv-prebook-btn']}
                    onClick={() => {
                      addToCart(quickViewProduct, quantity);
                      setQuickViewProduct(null);
                    }}
                  >
                    ADD TO CART
                  </div>
                  <div 
                    role="button"
                    className={styles['qv-view-details-btn']}
                    onClick={() => {
                      if (setDirectCheckoutItem) {
                        setDirectCheckoutItem({ ...quickViewProduct, quantity });
                      }
                      if (setSelectedProduct && setCurrentTab) {
                        setSelectedProduct(quickViewProduct);
                        setCurrentTab('checkout');
                      }
                      setQuickViewProduct(null);
                    }}
                  >
                    Buy it now
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreBooking;
