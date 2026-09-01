import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { formatCurrency } from '../../utils/formatters';
import { getBadgeClass } from '../../utils/badgeHelper';
import { Heart, Star, ChevronDown, Search, ArrowRight, Share2, Filter, X, Loader2 } from 'lucide-react';
import { getProducts, getFabrics } from '../../services/api';
import styles from './Catalog.module.css';

// Export empty fallback for backward compatibility
export const ALL_PRODUCTS = [];

// Permanent categories (hardcoded)
const PERMANENT_CATEGORIES = ['Everyday Elegance', 'Black Magic', 'Festive Glow', 'Style Studio'];

export const Catalog = ({ activeFilter, setActiveFilter, setCurrentTab, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [masterProducts, setMasterProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fabrics, setFabrics] = useState([]);

  // States matching filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedSort, setSelectedSort] = useState('featured');
  const { wishlist, toggleWishlist } = useWishlist();
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFilterOpen) {
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
  }, [isMobileFilterOpen]);

  // Initial fetch from MongoDB API and fabrics
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      getProducts({ limit: 100 }),
      getFabrics()
    ]).then(([prodRes, fabList]) => {
      if (isMounted) {
        const now = new Date();
        const list = (prodRes.products || []).filter(p => {
          // Hide products where limited offer has expired
          const lo = p.limitedOfferEntry;
          if (lo && lo.isActive && lo.endDate && new Date(lo.endDate) < now) return false;
          return true;
        });
        setMasterProducts(list);
        setProducts(list);
        setFabrics(fabList || []);
        setLoading(false);
      }
    }).catch(err => {
      console.error('Failed to load data from API:', err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
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
    toggleWishlist(product);
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

              {/* Sort By Filter Widget (Mobile Only) */}
              <div className={`${styles['filter-widget']} ${styles['mobile-only-widget']}`}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">sort</span>
                    <h4>Sort By</h4>
                  </div>
                </div>
                <div style={{ padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', alignItems: 'center', backgroundColor: 'transparent' }}>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '11px', fontFamily: 'Inter, sans-serif', color: 'var(--text-main)', cursor: 'pointer', appearance: 'none', fontWeight: 500 }}
                  >
                    <option value="featured">Featured</option>
                    <option value="relevant">Most relevant</option>
                    <option value="best-selling">Best selling</option>
                    <option value="alpha-asc">Alphabetically, A-Z</option>
                    <option value="alpha-desc">Alphabetically, Z-A</option>
                    <option value="price-low">Price, low to high</option>
                    <option value="price-high">Price, high to low</option>
                    <option value="date-old">Date, old to new</option>
                    <option value="date-new">Date, new to old</option>
                  </select>
                  <ChevronDown size={14} color="var(--text-muted)" style={{ pointerEvents: 'none', marginLeft: '-20px' }} />
                </div>
              </div>

               {/* Category Filter Widget — uses permanent categories */}
               <div className={styles['filter-widget']}>
                 <div className={styles['filter-widget-header']}>
                   <div className={styles['widget-title-box']}>
                     <span className="material-symbols-outlined">texture</span>
                     <h4>CATEGORY</h4>
                   </div>
                 </div>
                 <div className={styles['fabric-grid']}>
                   {/* All button */}
                   <button
                     onClick={() => setSelectedCategory('All')}
                     className={`${styles['fabric-chip']} ${selectedCategory === 'All' ? styles['active-chip'] : ''}`}
                     type="button"
                   >
                     All
                   </button>
                   {/* Permanent categories */}
                   {PERMANENT_CATEGORIES.map(catName => {
                     const isSelected = selectedCategory === catName;
                     return (
                       <button
                         key={catName}
                         onClick={() => setSelectedCategory(catName)}
                         className={`${styles['fabric-chip']} ${isSelected ? styles['active-chip'] : ''}`}
                         type="button"
                       >
                         {catName}
                       </button>
                     );
                   })}
                 </div>
               </div>

              {/* Fabric Filter Widget — uses dynamic fabrics */}
               <div className={styles['filter-widget']}>
                 <div className={styles['filter-widget-header']}>
                   <div className={styles['widget-title-box']}>
                     <span className="material-symbols-outlined">styler</span>
                     <h4>Fabric</h4>
                   </div>
                 </div>
                 <div className={styles['fabric-grid']}>
                   {/* All button */}
                   <button
                     onClick={() => setSelectedFabric('All')}
                     className={`${styles['fabric-chip']} ${selectedFabric === 'All' ? styles['active-chip'] : ''}`}
                     type="button"
                   >
                     All
                   </button>
                   {/* Dynamic fabrics */}
                   {fabrics.map(fab => {
                     const fabName = fab.name || fab;
                     const isSelected = selectedFabric === fabName;
                     return (
                       <button
                         key={fab._id || fabName}
                         onClick={() => setSelectedFabric(fabName)}
                         className={`${styles['fabric-chip']} ${isSelected ? styles['active-chip'] : ''}`}
                         type="button"
                       >
                         {fabName}
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
          {/* Static Category Content Banner */}
               <div className={styles['category-content-banner']}>
                 <h2 className={styles['category-content-title']}>Explore Our Collections</h2>
                 <div className={styles['category-divider']}></div>
                 <p className={styles['category-content-description']}>Discover premium handloom luxury across our four timeless categories.</p>
               </div>

          <div className={styles['products-header']}>
            <div className={styles['products-header-left']}>
              <p className={styles['products-count-text']} style={{ fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}>
                Showing {products.length} of {masterProducts.length} Masterpieces
              </p>
              <button
                className={`${styles['mobile-filter-toggle']} ${styles['desktop-filter-btn-hidden']}`}
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

              <button
                className={`${styles['mobile-filter-toggle']} ${styles['mobile-only-filter-btn']}`}
                onClick={() => setIsMobileFilterOpen(true)}
                type="button"
              >
                <Filter size={13} /> Filter & Sort
              </button>

              <div className={styles['sort-selector']}>
                <span className={styles['sort-label']}>SORT BY:</span>
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
                  const isWishlisted = wishlist.some(w => (w.id || w._id) === (product.id || product._id));
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
