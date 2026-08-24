import React, { useState, useEffect } from 'react';
import styles from './PreBooking.module.css';
import { ChevronDown, ArrowRight, Grid, List, Filter, X, Loader2, Heart, Share2, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { getPreorderProducts } from '../../services/api';

export const PREORDER_PRODUCTS = [];

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

export const PreBooking = ({ setCurrentTab, setSelectedProduct, setDirectCheckoutItem }) => {
  const [preorderList, setPreorderList] = useState([]);
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
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getPreorderProducts()
      .then(items => {
        if (isMounted) {
          setPreorderList(items || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load preorder products:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

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
    let filtered = [...preorderList];
    
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
          if (filter === 'under-15') return (product.estimatedDays || 14) < 15;
          if (filter === '15-30') return (product.estimatedDays || 14) >= 15 && (product.estimatedDays || 14) <= 30;
          if (filter === 'over-30') return (product.estimatedDays || 14) > 30;
          return false;
        });
      });
    }

    switch (selectedSort) {
      case 'alpha-asc':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'alpha-desc':
        filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
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
        break;
    }
    return filtered;
  }, [preorderList, selectedSort, selectedPriceFilters, selectedTimes]);

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
            <div className={styles['sidebar-header']}>
              <div className={styles['sidebar-title-group']}>
                <Filter size={18} className={styles['filter-header-icon']} />
                <h2 className={styles['sidebar-title']}>Filters</h2>
              </div>
              <button className={styles['close-filter-btn']} onClick={() => setIsMobileFilterOpen(false)} type="button">
                <X size={20} />
              </button>
            </div>

            <div className={styles['sidebar-widgets-list']}>
              {/* Estimated Delivery Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['widget-title-box']}>
                  <span className="material-symbols-outlined">schedule</span>
                  <h4>Delivery Timeline</h4>
                </div>
                <div className={styles['filter-chips-list']}>
                  {[
                    { id: 'under-15', label: 'Under 20 Days' },
                    { id: '15-30', label: '25 - 30 Days' },
                    { id: 'over-30', label: '35 - 40 Days' }
                  ].map((time) => {
                    const isSelected = selectedTimes.includes(time.id);
                    return (
                      <button
                        key={time.id}
                        type="button"
                        className={`${styles['filter-chip']} ${isSelected ? styles['active-chip'] : ''}`}
                        onClick={() => handleFilterToggle(setSelectedTimes, time.id)}
                      >
                        <span>{time.label}</span>
                        {isSelected && <span className={styles['chip-check']}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['widget-title-box']}>
                  <span className="material-symbols-outlined">payments</span>
                  <h4>Price Range</h4>
                </div>
                <div className={styles['filter-chips-list']}>
                  {[
                    { id: 'under-15k', label: 'Under ₹15,000' },
                    { id: '15k-25k', label: '₹15,000 - ₹25,000' },
                    { id: 'over-25k', label: 'Over ₹25,000' }
                  ].map((price) => {
                    const isSelected = selectedPriceFilters.includes(price.id);
                    return (
                      <button
                        key={price.id}
                        type="button"
                        className={`${styles['filter-chip']} ${isSelected ? styles['active-chip'] : ''}`}
                        onClick={() => handleFilterToggle(setSelectedPriceFilters, price.id)}
                      >
                        <span>{price.label}</span>
                        {isSelected && <span className={styles['chip-check']}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={styles['sidebar-footer-actions']}>
              {(selectedTimes.length > 0 || selectedPriceFilters.length > 0) && (
                <button 
                  className={styles['reset-all-btn']} 
                  onClick={() => {
                    setSelectedTimes([]);
                    setSelectedPriceFilters([]);
                  }} 
                  type="button"
                >
                  RESET ALL FILTERS
                </button>
              )}
              <button 
                className={styles['mobile-apply-btn']} 
                onClick={() => setIsMobileFilterOpen(false)} 
                type="button"
              >
                APPLY FILTERS ({sortedProducts.length})
              </button>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <section className={styles['products-panel']}>
          {/* Header Description */}
          <div className={styles['collection-header']}>
            <h1 className={styles['collection-title']}>Pre Booking Collections</h1>
            <div className={styles['collection-divider']} />
            <p className={styles['collection-subtitle']}>
              Reserve Your Favourite Saree Before It's Gone! Our exclusive handloom sarees are crafted in limited quantities.
            </p>

            {/* Pre-Booking Guarantees / Highlights */}
            <div className={styles['prebooking-highlights-grid']}>
              <div className={styles['highlight-card']}>
                <span className="material-symbols-outlined">auto_awesome</span>
                <div>
                  <h5>Exclusive Weaves</h5>
                  <p>Handpicked limited-batch sarees</p>
                </div>
              </div>
              <div className={styles['highlight-card']}>
                <span className="material-symbols-outlined">event_available</span>
                <div>
                  <h5>Priority Reservation</h5>
                  <p>Guaranteed loom allotment</p>
                </div>
              </div>
              <div className={styles['highlight-card']}>
                <span className="material-symbols-outlined">local_shipping</span>
                <div>
                  <h5>35–40 Days Delivery</h5>
                  <p>Carefully woven and finished</p>
                </div>
              </div>
              <div className={styles['highlight-card']}>
                <span className="material-symbols-outlined">sync_saved_locally</span>
                <div>
                  <h5>Flexible Exchange</h5>
                  <p>Modify booking prior to dispatch</p>
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className={styles['toolbar']}>
            <div className={styles['toolbar-left']}>
              <span>Showing <strong>{sortedProducts.length}</strong> of <strong>{preorderList.length}</strong> Masterpieces</span>
            </div>
            <div className={styles['toolbar-right']}>
              <button 
                className={styles['mobile-filter-btn']}
                onClick={() => setIsMobileFilterOpen(true)}
                type="button"
              >
                <Filter size={14} /> Filters
              </button>

              <div className={styles['custom-dropdown-container']}>
                <span className={styles['sort-label']}>SORT:</span>
                <div 
                  className={styles['custom-dropdown-toggle']} 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  <span>{SORT_OPTIONS.find(opt => opt.value === selectedSort)?.label || 'Featured'}</span>
                  <ChevronDown size={14} className={isSortOpen ? styles['open'] : ''} />
                </div>
                {isSortOpen && (
                  <div className={styles['custom-dropdown-menu']}>
                    {SORT_OPTIONS.map((option) => (
                      <div 
                        key={option.value}
                        className={`${styles['dropdown-item']} ${selectedSort === option.value ? styles['active-item'] : ''}`}
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
                <button 
                  className={`${styles['icon-btn']} ${viewMode === 'grid' ? styles['active'] : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  type="button"
                >
                  <Grid size={15} />
                </button>
                <button 
                  className={`${styles['icon-btn']} ${viewMode === 'list' ? styles['active'] : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                  type="button"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--primary)' }}>
              <Loader2 size={36} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: 16, color: '#7D756D', fontSize: '14px' }}>Loading pre-order sarees from database...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3 style={{ color: 'var(--primary)', fontSize: '20px' }}>No pre-order sarees available at the moment.</h3>
            </div>
          ) : (
            <div className={`${styles['product-grid']} ${viewMode === 'list' ? styles['list-view'] : ''}`}>
              {sortedProducts.map((product) => (
                <div key={product.id} className={styles['product-card']}>
                  <div className={styles['product-image-container']} onClick={() => handlePreorderClick(product)}>
                    <div className={styles['discount-badge']}>Save {product.discount || '10%'}</div>
                    <img src={product.image} alt={product.name} className={styles['product-image']} />
                    
                    <button 
                      className={styles['card-wishlist-btn']} 
                      onClick={(e) => { e.stopPropagation(); }}
                      title="Save to Wishlist"
                      type="button"
                    >
                      <Heart size={14} />
                    </button>
                    <button 
                      className={styles['card-share-btn']} 
                      onClick={(e) => { e.stopPropagation(); }}
                      title="Share"
                      type="button"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>

                  <div className={styles['product-info']}>
                    <div className={styles['title-row']}>
                      <h3 className={styles['product-name']} onClick={() => handlePreorderClick(product)} title={product.name}>
                        {product.name}
                      </h3>
                      <div className={styles['rating-badge']}>
                        <Star size={10} fill="#B38A4A" stroke="#B38A4A" />
                        <span>4.8</span>
                      </div>
                    </div>

                    <p className={styles['product-desc']}>
                      {product.description || "Midnight charcoal black handwoven pure silk saree with rich heritage zari."}
                    </p>

                    <div className={styles['product-price-row']}>
                      <span className={styles['current-price']}>{formatCurrency(product.price)}</span>
                      {product.oldPrice && (
                        <span className={styles['old-price']}>{formatCurrency(product.oldPrice)}</span>
                      )}
                      <span className={styles['discount-tag']}>{product.discount || '10% OFF'}</span>
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
                <div className={styles['thumbnails']}>
                  <img src={quickViewProduct.image} className={styles['thumbnail-active']} alt="thumb 1" />
                  <img src={quickViewProduct.image} className={styles['thumbnail']} alt="thumb 2" />
                  <img src={quickViewProduct.image} className={styles['thumbnail']} alt="thumb 3" />
                </div>
                <div className={styles['main-image-container']}>
                  <img src={quickViewProduct.image} alt={quickViewProduct.name} className={styles['main-image']} />
                </div>
              </div>
              
              <div className={styles['quick-view-details']}>
                <h2 className={styles['qv-title']}>{quickViewProduct.name} | {quickViewProduct.id.toUpperCase()} | PRE BOOKING</h2>
                <div className={styles['qv-badge']}>Save {quickViewProduct.discount}</div>
                
                <div className={styles['qv-vendor']}>MAZHAI VAANAM</div>
                
                <div className={styles['qv-price-row']}>
                  <span className={styles['qv-label']}>Price:</span>
                  <span className={styles['qv-current-price']}>{formatCurrency(quickViewProduct.price)}</span>
                  <span className={styles['qv-old-price']}>{formatCurrency(quickViewProduct.oldPrice)}</span>
                </div>
                
                <div className={styles['qv-quantity-row']}>
                  <span className={styles['qv-label']}>Quantity:</span>
                  <div className={styles['quantity-selector']}>
                    <div role="button" className={styles['qty-btn']} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</div>
                    <span>{quantity}</span>
                    <div role="button" className={styles['qty-btn']} onClick={() => setQuantity(quantity + 1)}>+</div>
                  </div>
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
