import React, { useState } from 'react';
import styles from './PreBooking.module.css';
import { ChevronDown, ArrowRight, Grid, List } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';

export const PREORDER_PRODUCTS = [
  {
    id: 'pre-1',
    name: "Sona Roopa Kanjeevaram",
    category: "Blended South Cotton",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Wedding",
    price: 30600,
    oldPrice: 34000,
    progress: 75,
    weaver: "Master Weaver Ramalingam",
    image: "/Images/saree11.png",
    description: "Exquisite gold and silver zari Kanjeevaram, meticulously hand-woven with traditional wedding temple motifs.",
    isPreorder: true,
    estimatedDays: 12,
    discount: "10%"
  },
  {
    id: 'pre-2',
    name: "Shahi Shikargah Banarasi",
    category: "Handloom Sarees",
    fabric: "Pure Silk",
    color: "#C8A34D",
    occasion: "Wedding",
    price: 41400,
    oldPrice: 46000,
    progress: 50,
    weaver: "Master Weaver Kabir",
    image: "/Images/saree13.png",
    description: "Featuring complex hunting scenes woven in 24k gold zari, this Katan silk Banarasi is an imperial masterwork.",
    isPreorder: true,
    estimatedDays: 22,
    discount: "10%"
  },
  {
    id: 'pre-3',
    name: "Chanderi Indigo Bloom",
    category: "Linen Cotton",
    fabric: "Pure Silk",
    color: "#1A237E",
    occasion: "Party Wear",
    price: 18900,
    oldPrice: 21000,
    progress: 90,
    weaver: "Artisan Meenakshi",
    image: "/Images/saree14.png",
    description: "Delicate Chanderi silk with hand-woven indigo floral butis, golden borders, and tissue pallu.",
    isPreorder: true,
    estimatedDays: 5,
    discount: "10%"
  },
  {
    id: 'pre-4',
    name: "Organic Sage Cotton",
    category: "Chanderi Cotton",
    fabric: "Cotton",
    color: "#004D40",
    occasion: "Festival",
    price: 11250,
    oldPrice: 12500,
    progress: 40,
    weaver: "Weaver Kumar",
    image: "/Images/saree2.png",
    description: "Loom-woven pure organic cotton tinted with natural plant dyes, showcasing structural elegance and breathable weight.",
    isPreorder: true,
    estimatedDays: 28,
    discount: "10%"
  }
];

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


export const PreBooking = ({ setCurrentTab, setSelectedProduct }) => {
  const [selectedSort, setSelectedSort] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [selectedPriceFilters, setSelectedPriceFilters] = useState([]);
  
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState([]);

  const [viewMode, setViewMode] = useState('grid');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleFilterToggle = (setState, filterId) => {
    setState(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId) 
        : [...prev, filterId]
    );
  };

  const handlePreorderClick = (product) => {
    if (setSelectedProduct && setCurrentTab) {
      setSelectedProduct(product);
      setCurrentTab('product-detail');
    }
  };

  const sortedProducts = React.useMemo(() => {
    let filtered = [...PREORDER_PRODUCTS];
    
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
        sorted.sort((a, b) => b.name.localeCompare(a.name));
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
  }, [selectedSort, selectedPriceFilters, selectedTimes]);

  return (
    <div className={styles['prebooking-page-container']}>
      
      {/* Breadcrumb Section */}
      <div className={styles['breadcrumb-container']}>
        <span className={styles['breadcrumb-link']} onClick={() => setCurrentTab && setCurrentTab('home')}>Home</span>
        <span className={styles['breadcrumb-separator']}>&gt;</span>
        <span className={styles['breadcrumb-current']}>Pre Booking Collections</span>
      </div>

      <main className={styles['main-layout']}>
        {/* Left Sidebar */}
        <aside className={styles['filters-sidebar']}>
          <div className={styles['sticky-sidebar-content']}>
            <h2 className={styles['sidebar-title']}>Filters</h2>
            

            <div className={styles['filter-widget']}>
              <div role="button" 
                className={styles['widget-header-btn']} 
                onClick={() => setIsPriceOpen(!isPriceOpen)}
              >
                <span>Price</span>
                <ChevronDown size={14} className={`${styles['chevron-icon']} ${isPriceOpen ? styles['open'] : ''}`} />
              </div>
              {isPriceOpen && (
                <div className={styles['widget-content']}>
                  <label className={styles['checkbox-label']}>
                    <input 
                      type="checkbox" 
                      checked={selectedPriceFilters.includes('under-15k')}
                      onChange={() => handleFilterToggle(setSelectedPriceFilters, 'under-15k')}
                    /> Under ₹15,000
                  </label>
                  <label className={styles['checkbox-label']}>
                    <input 
                      type="checkbox" 
                      checked={selectedPriceFilters.includes('15k-25k')}
                      onChange={() => handleFilterToggle(setSelectedPriceFilters, '15k-25k')}
                    /> ₹15,000 - ₹25,000
                  </label>
                  <label className={styles['checkbox-label']}>
                    <input 
                      type="checkbox" 
                      checked={selectedPriceFilters.includes('over-25k')}
                      onChange={() => handleFilterToggle(setSelectedPriceFilters, 'over-25k')}
                    /> Over ₹25,000
                  </label>
                </div>
              )}
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
                    /> Under 15 Days
                  </label>
                  <label className={styles['checkbox-label']}>
                    <input 
                      type="checkbox" 
                      checked={selectedTimes.includes('15-30')}
                      onChange={() => handleFilterToggle(setSelectedTimes, '15-30')}
                    /> 15 - 30 Days
                  </label>
                  <label className={styles['checkbox-label']}>
                    <input 
                      type="checkbox" 
                      checked={selectedTimes.includes('over-30')}
                      onChange={() => handleFilterToggle(setSelectedTimes, 'over-30')}
                    /> Over 30 Days
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
              <p>✨ <strong>Exclusive Collection</strong> – Handpicked premium sarees woven with timeless elegance and traditional craftsmanship.</p>
              <p>🛍️ <strong>Priority Reservation</strong> – Confirm your booking today and we'll reserve your selected saree exclusively for you.</p>
              <p>🚚 <strong>Delivery Timeline</strong> – Your saree will be carefully prepared and delivered within 35–40 days.</p>
              <p>💝 <strong>Flexible Booking</strong> – Need to make a change? You can modify or exchange your booking before dispatch. (Refunds are not available.)</p>
              <p>🌸 <strong>Own a Piece of Heritage</strong> – Experience authentic craftsmanship with every weave, designed to make every occasion memorable.</p>
            </div>
          </div>

          {/* Toolbar */}
          <div className={styles['toolbar']}>
            <div className={styles['toolbar-left']}>
              <span>Showing 1 - {sortedProducts.length} of {sortedProducts.length} products</span>
            </div>
            <div className={styles['toolbar-right']}>
              <div className={styles['sort-dropdown']}>
                <span className={styles['sort-label']}>Sort by:</span>
                <div role="button" 
                  className={styles['sort-btn']}
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  {SORT_OPTIONS.find(opt => opt.value === selectedSort)?.label || 'Featured'} <ChevronDown size={14} />
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
          <div className={`${styles['product-grid']} ${viewMode === 'list' ? styles['list-view'] : ''}`}>
            {sortedProducts.map((product) => (
              <div key={product.id} className={styles['product-card']}>
                <div className={styles['product-image-container']} onClick={() => handlePreorderClick(product)}>
                  <div className={styles['discount-badge']}>Save {product.discount}</div>
                  <img src={product.image} alt={product.name} className={styles['product-image']} />
                </div>
                <div className={styles['product-info']}>
                  <h3 className={styles['product-name']} onClick={() => handlePreorderClick(product)}>
                    {product.name} | {product.id.toUpperCase()} | PRE BOOKING
                  </h3>
                  <div className={styles['product-price-row']}>
                    <span className={styles['current-price']}>{formatCurrency(product.price)}</span>
                    <span className={styles['old-price']}>{formatCurrency(product.oldPrice)}</span>
                  </div>
                  <div 
                    role="button" 
                    className={styles['prebook-btn']} 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                  >
                    PRE BOOK NOW
                  </div>
                  <div role="button" className={styles['quick-view-btn']} onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); setQuantity(1); }}>
                    Quick view
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                      addToCart(quickViewProduct, quantity);
                      setQuickViewProduct(null);
                      if (setCurrentTab) {
                        setCurrentTab('checkout');
                      }
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
