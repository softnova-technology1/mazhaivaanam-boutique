import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { getBadgeClass } from '../../utils/badgeHelper';
import { Heart, Star, ChevronDown, Search, ArrowRight, Share2, Filter, X, Loader2 } from 'lucide-react';
import { getProducts, getCategories } from '../../services/api';
import styles from './Catalog.module.css';

// Export empty fallback for backward compatibility
export const ALL_PRODUCTS = [];

const CATEGORY_CONTENT = {
  'All': {
    title: 'The Masterpiece Collection',
    description: 'Explore our curated anthology of premium handloom luxury. From breathless cottons for daily grace to majestic silks for your grandest moments, discover drapes that speak your style.'
  },
  'Everyday Elegance': {
    title: 'Pure Cotton Elegance',
    description: 'Breathe easy in our meticulously handwoven cotton sarees designed for seamless day-to-night transitions. Experience unmatched comfort without ever compromising on your sophisticated everyday style.'
  },
  'Festive Glow': {
    title: 'Heritage Silk Weaves',
    description: 'Illuminate your celebrations with our exquisite collection of pure silk sarees. Woven with rich traditional zari motifs, these radiant drapes are destined to make you the center of attention.'
  },
  'Style Studio': {
    title: 'Fancy Drapes',
    description: 'Step into the spotlight with our trending, fashion-forward saree silhouettes. Featuring modern patterns and unique textures, this collection is crafted for the bold, contemporary woman.'
  },
  'Black Magic': {
    title: 'The Black Magic Edit',
    description: 'Embrace the midnight allure with our exclusive range of stunning black sarees. Dark, sophisticated, and deeply glamorous—these masterpieces are tailored for your most unforgettable evening events.'
  }
};

export const Catalog = ({ activeFilter, setActiveFilter, setCurrentTab, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [masterProducts, setMasterProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbCategories, setDbCategories] = useState([]);

  // States matching filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('boutique_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Initial fetch from MongoDB API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      getProducts({ limit: 100 }),
      getCategories()
    ]).then(([prodRes, catRes]) => {
      if (isMounted) {
        const list = prodRes.products || [];
        setMasterProducts(list);
        setProducts(list);
        setDbCategories(catRes || []);
        setLoading(false);
      }
    }).catch(err => {
      console.error('Failed to load products from API:', err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const checkWishlist = () => {
      const saved = localStorage.getItem('boutique_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    };
    window.addEventListener('storage', checkWishlist);
    return () => window.removeEventListener('storage', checkWishlist);
  }, []);

  useEffect(() => {
    if (!isSortOpen && !isAvailabilityOpen) return;
    const closeDropdown = () => {
      setIsSortOpen(false);
      setIsAvailabilityOpen(false);
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [isSortOpen, isAvailabilityOpen]);

  const handleProductClick = (product) => {
    if (setSelectedProduct && setCurrentTab) {
      setSelectedProduct(product);
      setCurrentTab('product-detail');
    }
  };

  // Sync state with activeFilter props (from Navbar links)
  useEffect(() => {
    if (activeFilter.category) {
      setSelectedCategory(activeFilter.category);
    } else {
      setSelectedCategory('All');
    }
  }, [activeFilter]);

  // Handle product filtering & sorting logic
  useEffect(() => {
    let filtered = [...masterProducts];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name && p.name.toLowerCase().includes(query)) ||
        (p.category && p.category.toLowerCase().includes(query)) ||
        (p.fabric && p.fabric.toLowerCase().includes(query)) ||
        (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Fabric
    if (selectedFabric && selectedFabric !== 'All') {
      filtered = filtered.filter(p => p.fabric && p.fabric.toLowerCase() === selectedFabric.toLowerCase());
    }

    // Filter by Availability
    if (selectedAvailability !== 'All') {
      if (selectedAvailability === 'In Stock') {
        filtered = filtered.filter(p => p.inStock !== false && (p.stock?.available ?? 1) > 0);
      } else if (selectedAvailability === 'Out of Stock') {
        filtered = filtered.filter(p => p.inStock === false || (p.stock?.available ?? 1) <= 0);
      }
    }

    // Filter by Max Price
    filtered = filtered.filter(p => p.price <= maxPrice);

    // Sort Logic
    if (selectedSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'alpha-asc') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (selectedSort === 'alpha-desc') {
      filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (selectedSort === 'best-selling') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (selectedSort === 'date-old') {
      filtered.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    } else if (selectedSort === 'date-new' || selectedSort === 'featured' || selectedSort === 'relevant') {
      filtered.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (dateA !== dateB) return dateB - dateA;
        return masterProducts.indexOf(a) - masterProducts.indexOf(b);
      });
    }

    setProducts(filtered);
    setCurrentPage(1);
  }, [masterProducts, selectedCategory, selectedFabric, selectedAvailability, maxPrice, selectedSort, searchQuery]);

  // Calculate paginated products for rendering
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      document.getElementById('catalog-products-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleShareClick = (e, product) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product.id}`;

    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || `Check out ${product.name} at Mazhai Vaanam!`,
        url: productUrl,
      })
        .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(productUrl)
        .then(() => {
          window.dispatchEvent(new CustomEvent('show-toast', {
            detail: { message: `Link to "${product.name}" copied to clipboard!` }
          }));
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  const handleAddToWishlist = (product) => {
    const saved = localStorage.getItem('boutique_wishlist');
    let wishlistItems = saved ? JSON.parse(saved) : [];
    const isWishlisted = wishlistItems.some(w => w.id === product.id);

    if (isWishlisted) {
      // Toggle off
      wishlistItems = wishlistItems.filter(w => w.id !== product.id);
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Removed "${product.name}" from Wishlist` } }));
    } else {
      // Toggle on
      wishlistItems.push(product);
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Saved "${product.name}" to Wishlist!` } }));
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFabric('All');
    setSelectedAvailability('All');
    setMaxPrice(50000);
    setSelectedSort('featured');
    setSearchQuery('');
    if (setActiveFilter) {
      setActiveFilter({ category: '', occasion: '', label: 'All Collections' });
    }
  };

  const handleWeaveClick = (cat) => {
    setSelectedFabric('All');
    setSelectedAvailability('All');
    setMaxPrice(50000);
    setSelectedSort('featured');
    setSearchQuery('');
    if (setActiveFilter) {
      setActiveFilter({ category: cat, occasion: '', label: cat });
    } else {
      setSelectedCategory(cat);
    }

    setTimeout(() => {
      document.getElementById('catalog-products-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className={styles['catalog-page-container']}>




      {/* Breadcrumb Section */}
      <div style={{ maxWidth: '1440px', margin: '0' }}>
        <div className={styles['breadcrumb-container']}>
          <span 
            onClick={() => setCurrentTab && setCurrentTab('home')} 
            className={styles['breadcrumb-link']}
          >
            Home
          </span>
          <span className={styles['breadcrumb-separator']}>/</span>
          <span className={styles['breadcrumb-current']}>Shop</span>
        </div>
      </div>

      {/* 3. Sidebar Filters + Product Grid Layout */}
      <main id="catalog-products-section" className={styles['main-layout']}>
        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div
            className={styles['mobile-filter-overlay']}
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}

        <aside className={`${styles['filters-sidebar']} ${isMobileFilterOpen ? styles['mobile-filter-open'] : ''}`}>
          <div className={styles['sticky-sidebar-content']}>
            <div className={styles['sidebar-header']}>
              <div className={styles['sidebar-title-group']}>
                <Filter size={18} className={styles['filter-header-icon']} />
                <h2 className={styles['sidebar-title']}>Filters</h2>
              </div>
              <button
                className={styles['close-filter-btn']}
                onClick={() => setIsMobileFilterOpen(false)}
                type="button"
                aria-label="Close Filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles['sidebar-widgets-list']}>

              {/* Collection Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">texture</span>
                    <h4>COLLECTION</h4>
                  </div>
                </div>
                <div className={styles['fabric-tags']}>
                  {['All', 'Everyday Elegance', 'Festive Glow', 'Style Studio', 'Black Magic'].map(cat => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`${styles['tag-btn']} ${isSelected ? styles['active-tag'] : ''}`}
                        type="button"
                      >
                        {cat === 'All' ? 'All' : cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">styler</span>
                    <h4>Fabric</h4>
                  </div>
                </div>
                <div className={styles['fabric-grid']}>
                  {['All', 'Pure Silk', 'Cotton', 'Tussar', 'Organza', 'Linen', 'Georgette', 'Chiffon', 'Chanderi'].map(fab => {
                    const isSelected = selectedFabric === fab;
                    return (
                      <button
                        key={fab}
                        onClick={() => setSelectedFabric(fab)}
                        className={`${styles['fabric-chip']} ${isSelected ? styles['active-chip'] : ''}`}
                        type="button"
                      >
                        {fab}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">inventory_2</span>
                    <h4>Availability</h4>
                  </div>
                </div>
                <div style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', fontFamily: 'Inter, sans-serif', color: 'var(--text-main)', cursor: 'pointer', appearance: 'none', fontWeight: 500 }}
                  >
                    <option value="All">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <ChevronDown size={14} color="var(--text-muted)" style={{ pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Price Range Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">payments</span>
                    <h4>Price Range</h4>
                  </div>
                </div>

                <div className={styles['price-slider-container']}>
                  <div className={styles['price-display-row']}>
                    <div className={styles['price-val-box']}>
                      <span className={styles['price-val-label']}>Min</span>
                      <span className={styles['price-val-amount']}>₹0</span>
                    </div>
                    <span className={styles['price-val-divider']}>—</span>
                    <div className={styles['price-val-box']}>
                      <span className={styles['price-val-label']}>Max</span>
                      <span className={styles['price-val-amount']}>₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className={styles['price-range-input']}
                  />


                </div>
              </div>
            </div>

            <button className={styles['reset-all-btn']} onClick={handleResetFilters} type="button">
              RESET ALL FILTERS
            </button>
          </div>
        </aside>

        {/* Right side: Product Grid */}
        <section className={styles['products-panel']}>
          {/* Dynamic Category Content Banner */}
          <div className={styles['category-content-banner']}>

            <h2 className={styles['category-content-title']}>
              {CATEGORY_CONTENT[selectedCategory]?.title || selectedCategory}
            </h2>
            <div className={styles['category-divider']}></div>
            <p className={styles['category-content-description']}>
              {CATEGORY_CONTENT[selectedCategory]?.description || ''}
            </p>
          </div>

          <div className={styles['products-header']}>
            <div className={styles['products-header-left']}>
              <p className={styles['products-count-text']} style={{ fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}>
                Showing {products.length} of {masterProducts.length} Masterpieces
              </p>
              <button
                className={styles['mobile-filter-toggle']}
                onClick={() => setIsMobileFilterOpen(true)}
                type="button"
              >
                <Filter size={13} /> Filter & Sort
              </button>
            </div>

            <div className={styles['products-header-right']}>
              <div className={styles['header-search-box']}>
                <Search size={15} className={styles['search-icon']} />
                <input
                  type="text"
                  placeholder="Search masterpieces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles['search-input']}
                />
                {searchQuery && (
                  <div
                    onClick={() => setSearchQuery('')}
                    className={styles['search-clear-icon']}
                    role="button"
                    title="Clear search"
                  >
                    ✕
                  </div>
                )}
              </div>

              <div className={styles['sort-selector']}>
                <span className={styles['sort-label']}>SORT:</span>
                <div className={styles['custom-dropdown-container']}>
                  <button
                    className={styles['dropdown-trigger-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSortOpen(!isSortOpen);
                    }}
                    type="button"
                  >
                    <span>
                      {selectedSort === 'featured' && 'Featured'}
                      {selectedSort === 'relevant' && 'Most relevant'}
                      {selectedSort === 'best-selling' && 'Best selling'}
                      {selectedSort === 'alpha-asc' && 'Alphabetically, A-Z'}
                      {selectedSort === 'alpha-desc' && 'Alphabetically, Z-A'}
                      {selectedSort === 'price-low' && 'Price, low to high'}
                      {selectedSort === 'price-high' && 'Price, high to low'}
                      {selectedSort === 'date-old' && 'Date, old to new'}
                      {selectedSort === 'date-new' && 'Date, new to old'}
                    </span>
                    <ChevronDown size={14} className={`${styles['chevron-icon']} ${isSortOpen ? styles['open'] : ''}`} />
                  </button>
                  {isSortOpen && (
                    <div className={styles['dropdown-options-menu']}>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'featured' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('featured');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Featured
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'relevant' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('relevant');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Most relevant
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'best-selling' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('best-selling');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Best selling
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'alpha-asc' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('alpha-asc');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Alphabetically, A-Z
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'alpha-desc' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('alpha-desc');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Alphabetically, Z-A
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'price-low' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('price-low');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Price, low to high
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'price-high' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('price-high');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Price, high to low
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'date-old' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('date-old');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Date, old to new
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedSort === 'date-new' ? styles['active'] : ''}`}
                        onClick={() => {
                          setSelectedSort('date-new');
                          setIsSortOpen(false);
                        }}
                        type="button"
                      >
                        Date, new to old
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--primary)' }}>
              <Loader2 size={36} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: 16, color: '#7D756D', fontSize: '14px' }}>Loading handloom masterpieces from database...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'Inter, sans-serif' }}>
              <h3 style={{ color: 'var(--primary)', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px' }}>No masterpieces match your filters.</h3>
              <p style={{ color: '#7D756D', margin: '10px 0 20px 0' }}>Try adjusting your sidebar criteria or click Reset All.</p>
              <button className={styles['reset-all-btn']} style={{ width: 'auto', padding: '12px 30px' }} onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles['products-grid']}>
                {currentProducts.map((product) => {
                  const isWishlisted = wishlist.some(w => w.id === product.id);
                  return (
                    <div key={product.id} className={styles['product-card']}>
                      {product.oldPrice && (
                        <span className={styles['offer-badge']}>
                          <span className={styles['offer-value']}>{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
                          <span className={styles['offer-text']}>OFF</span>
                        </span>
                      )}
                      <div
                        className={styles['image-container']}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleProductClick(product)}
                      >
                        <img src={product.image} alt={product.name} loading="lazy" />
                        {product.tag && (
                          <span className={`${styles['badge-tag']} ${getBadgeClass(product.tag)}`}>{product.tag}</span>
                        )}
                        <div
                          className={styles['share-btn']}
                          onClick={(e) => handleShareClick(e, product)}
                          role="button"
                          title="Share Product"
                        >
                          <Share2
                            size={16}
                            stroke="var(--primary-dark)"
                          />
                        </div>

                        <div
                          className={styles['wishlist-btn']}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(product);
                          }}
                          role="button"
                          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart
                            size={16}
                            fill={isWishlisted ? "#e63946" : "none"}
                            stroke={isWishlisted ? "#e63946" : "var(--primary-dark)"}
                          />
                        </div>
                      </div>
                      <div className={styles['card-details']}>
                        <div className={styles['title-row']}>
                          <h4
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleProductClick(product)}
                          >
                            {product.name}
                          </h4>
                          {product.rating && (
                            <div className={styles['rating-badge-inline']}>
                              <Star size={10} fill="#B38A4A" stroke="#B38A4A" />
                              <span>{product.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {/* Product Description */}
                        {product.description && (
                          <p className={styles['product-description']}>
                            {product.description}
                          </p>
                        )}

                        <div className={styles['price-row']}>
                          <span className={styles['current-price']}>{formatCurrency(product.price)}</span>
                          {product.oldPrice && (
                            <span className={styles['old-price']}>{formatCurrency(product.oldPrice)}</span>
                          )}
                        </div>
                        <button
                          className={styles['add-cart-btn']}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles['pagination']}>
                  <button
                    className={styles['pagination-arrow']}
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <div className={styles['pagination-pages']}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <span
                        key={idx}
                        className={`${styles['page-num']} ${currentPage === idx + 1 ? styles['active-page'] : ''}`}
                        onClick={() => handlePageChange(idx + 1)}
                        style={{ cursor: 'pointer' }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                  <button
                    className={styles['pagination-arrow']}
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

    </div>
  );
};

export default Catalog;
