import React, { useState } from 'react';
import styles from './PreBooking.module.css';
import { ChevronDown, ArrowRight, Grid, List, Filter, X, Star } from 'lucide-react';
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

const getProductDetails = (productId) => {
  const detailsMap = {
    'pre-1': {
      headline: "Exquisite Pure Silk Saree with Traditional Motifs",
      p1: "Elevate your ethnic wardrobe with the timeless elegance of Pure Silk. Known for its rich texture and natural sheen, this collection combines heritage with traditional temple borders to create a look that is both grounded and sophisticated.",
      p2: "Each saree features a luxurious drape and a subtle hand-feel that is characteristic of authentic Kanjeevaram handloom. Finished with a refined gold and silver Zari border, these sarees are designed for the woman who appreciates understated luxury.",
      fabric: "100% Pure Silk - breathable, lightweight, and durable.",
      design: "Exquisite ruby red handwoven Kanjeevaram adorned with heritage gold & silver zari and wedding temple motifs.",
      border: "Elegant metallic Zari border that adds a touch of festive shimmer.",
      texture: "Naturally rich, uneven silk texture that lends an organic, high-end feel.",
      occasion: "Perfect for weddings, traditional ceremonies, and festive celebrations."
    },
    'pre-2': {
      headline: "Imperial Katan Silk Banarasi Saree",
      p1: "Elevate your ethnic wardrobe with the timeless elegance of Pure Silk. Known for its rich texture and natural sheen, this collection combines heritage with imperial hunting motifs to create a look that is both grounded and sophisticated.",
      p2: "Each saree features a luxurious drape and a subtle hand-feel that is characteristic of authentic Banarasi handloom. Finished with a refined 24k gold Zari border, these sarees are designed for the woman who appreciates understated luxury.",
      fabric: "100% Katan Pure Silk - breathable, lightweight, and durable.",
      design: "Complex hunting scenes (Shikargah) woven in 24k gold zari, representing imperial masterwork.",
      border: "Elaborate 24k gold zari border.",
      texture: "Rich, heavy silk texture that drapes beautifully.",
      occasion: "Perfect for grand weddings, receptions, and premium festive gatherings."
    },
    'pre-3': {
      headline: "Delicate Chanderi Silk Saree with Indigo Floral Butis",
      p1: "Elevate your ethnic wardrobe with the timeless elegance of Chanderi Silk. Known for its sheer texture and lightweight drape, this collection combines indigo floral dyes with golden zari border to create a look that is both grounded and sophisticated.",
      p2: "Each saree features a luxurious drape and a subtle hand-feel that is characteristic of authentic Chanderi handloom. Finished with a golden border and tissue pallu, these sarees are designed for the woman who appreciates understated luxury.",
      fabric: "Pure Chanderi Silk-Cotton blend - breathable, lightweight, and sheer.",
      design: "Delicate hand-woven indigo floral butis with rich tissue pallu.",
      border: "Golden zari border adding subtle elegance.",
      texture: "Lightweight, translucent, and fine texture.",
      occasion: "Perfect for semi-formal gatherings, day events, and festive celebrations."
    },
    'pre-4': {
      headline: "Organic Sage Cotton Saree with Natural Dyes",
      p1: "Elevate your ethnic wardrobe with the timeless elegance of Organic Cotton. Known for its soft texture and breathable weight, this collection combines natural plant dyes with artisan weaving to create a look that is both grounded and sophisticated.",
      p2: "Each saree features a luxurious drape and a subtle hand-feel that is characteristic of authentic organic handloom. Finished with structural borders, these sarees are designed for the woman who appreciates eco-friendly luxury.",
      fabric: "100% Organic Cotton - breathable, eco-friendly, and soft.",
      design: "Loom-woven pure cotton tinted with natural plant dyes for a sustainable, elegant look.",
      border: "Minimalist structural borders.",
      texture: "Highly breathable, lightweight, and soft hand-feel.",
      occasion: "Perfect for summer events, office wear, and casual festive celebrations."
    }
  };
  return detailsMap[productId] || detailsMap['pre-1'];
};

export const PreBooking = ({ setCurrentTab, setSelectedProduct, setDirectCheckoutItem }) => {
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

  const details = quickViewProduct ? getProductDetails(quickViewProduct.id) : null;

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
          <div className={`${styles['product-grid']} ${viewMode === 'list' ? styles['list-view'] : ''}`}>
            {sortedProducts.map((product) => (
              <div key={product.id} className={styles['product-card']}>
                <div className={styles['product-image-container']} onClick={() => handlePreorderClick(product)}>
                  <div className={styles['discount-badge']}>{product.discount} OFF</div>
                  <img src={product.image} alt={product.name} className={styles['product-image']} />
                </div>
                <div className={styles['product-info']}>
                  <h3 className={styles['product-name']} onClick={() => handlePreorderClick(product)}>
                    {product.name} | {product.id.toUpperCase()} | PRE BOOKING
                  </h3>
                  <p className={styles['product-desc']}>{product.description}</p>
                  
                  <div className={styles['product-rating']}>
                    <Star size={12} fill="#d32f2f" stroke="#d32f2f" />
                    <span>{product.rating || '4.8'}</span>
                    <span className={styles['review-count']}>({product.reviews || '24'})</span>
                  </div>

                  <div className={styles['product-price-row']}>
                    <span className={styles['current-price']}>{formatCurrency(product.price)}</span>
                    <span className={styles['old-price']}>{formatCurrency(product.oldPrice)}</span>
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
                <div className={styles['qv-scrollable-content']}>
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

                  {details && (
                    <div className={styles['qv-description-section']}>
                      <h4 className={styles['qv-desc-title']}>{details.headline}</h4>
                      <p className={styles['qv-desc-p']}>{details.p1}</p>
                      <p className={styles['qv-desc-p']}>{details.p2}</p>
                      
                      <h5 className={styles['qv-highlights-title']}>Product Highlights:</h5>
                      <ul className={styles['qv-highlights-list']}>
                        <li><strong>Fabric:</strong> {details.fabric}</li>
                        <li><strong>Design:</strong> {details.design}</li>
                        <li><strong>Border:</strong> {details.border}</li>
                        <li><strong>Texture:</strong> {details.texture}</li>
                        <li><strong>Occasion:</strong> {details.occasion}</li>
                      </ul>
                      <p className={styles['qv-desc-note']}>
                        <strong>Note:</strong> Digital images may vary slightly from the actual product colour due to screen settings and photography lighting.
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
