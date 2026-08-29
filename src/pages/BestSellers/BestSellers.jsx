import React, { useMemo, useEffect, useState } from 'react';
import { getBestSellers } from '../../services/api';
import { getBadgeClass } from '../../utils/badgeHelper';
import { LayoutGrid, Grid3X3, List, ChevronDown, ChevronUp, Heart, Star, Share2, Loader2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import styles from './BestSellers.module.css';

export const BestSellers = ({ setCurrentTab, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [liveBestSellers, setLiveBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let isMounted = true;
    setLoading(true);
    getBestSellers(50)
      .then(items => {
        if (isMounted) {
          setLiveBestSellers(items || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load best sellers:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const [gridView, setGridView] = useState(4);
  const [sortOption, setSortOption] = useState('best-selling');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = (id) => wishlist.some(item => item.id === id || item._id === id);

  const handleWishlistToggle = (product) => {
    toggleWishlist(product);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
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

  const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'relevant', label: 'Most relevant' },
    { value: 'best-selling', label: 'Best selling' },
    { value: 'alpha-asc', label: 'Alphabetically, A-Z' },
    { value: 'alpha-desc', label: 'Alphabetically, Z-A' },
    { value: 'price-asc', label: 'Price, low to high' },
    { value: 'price-desc', label: 'Price, high to low' },
    { value: 'date-asc', label: 'Date, old to new' },
    { value: 'date-desc', label: 'Date, new to old' },
  ];

  const getInitialRows = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth <= 768) return 4; // rows
    return 3;
  };

  const [visibleRows, setVisibleRows] = useState(getInitialRows);

  useEffect(() => {
    setVisibleRows(getInitialRows());
  }, [sortOption]);

  const bestSellers = useMemo(() => {
    let products = [...liveBestSellers];
    
    if (sortOption === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'alpha-asc') {
      products.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOption === 'alpha-desc') {
      products.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }
    
    return products;
  }, [liveBestSellers, sortOption]);

  const getItemsPerRow = () => {
    if (gridView === 'list') return 1;
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return 2;
    return gridView;
  };
  const itemsPerRow = getItemsPerRow();
  const visibleCount = visibleRows * itemsPerRow;
  const visibleProducts = bestSellers.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleRows(Math.ceil(bestSellers.length / itemsPerRow));
  };

  const handleProductClick = (product) => {
    if (setSelectedProduct) setSelectedProduct(product);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles['catalog-page']}>
      
      {/* HEADER SECTION */}
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>Best Sellers</h1>
        <div className={styles['header-divider']} />
        <p className={styles['page-subtitle']}>
          Our most coveted handloom sarees, chosen and loved by discerning women across the world.
        </p>
      </div>

      <div className={styles['catalog-container']}>
        {/* SIDEBAR */}
        <aside className={styles['sidebar']}>
          <div className={styles['sidebar-card']}>
            <div className={styles['sidebar-heading']}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--primary)' }}>auto_awesome</span>
              <h3>Top Picks</h3>
            </div>
            
            <div className={styles['sidebar-product-list']}>
              {liveBestSellers.slice(0, 3).map(prod => (
                <div key={prod.id} className={styles['sidebar-product-card']} onClick={() => handleProductClick(prod)}>
                  <img src={prod.image} alt={prod.name} loading="lazy" />
                  <div className={styles['sidebar-product-info']}>
                    <h5>{prod.name}</h5>
                    <span className={styles['sidebar-price']}>₹{prod.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo banner */}
            <div className={styles['promo-banner']} onClick={() => setCurrentTab && setCurrentTab('catalog')}>
              <img src="/Images/saree1.png" alt="Premium Collections" />
              <div className={styles['promo-overlay']}>
                <span>PREMIUM WEAVES</span>
                <p>Handloom Masterpieces</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT AREA */}
        <main className={styles['main-area']}>
          
          {/* TOOLBAR */}
          <div className={styles['toolbar']}>
            <div className={styles['result-count']}>
              Showing <strong>{Math.min(visibleCount, liveBestSellers.length)}</strong> of <strong>{liveBestSellers.length}</strong> masterpieces
            </div>
            
            <div className={styles['toolbar-right']}>
              <div className={styles['view-toggles']}>
                <button 
                  className={`${styles['icon-btn']} ${gridView === 2 || gridView === 3 || gridView === 4 ? styles.active : ''}`} 
                  onClick={() => setGridView(4)}
                  title="Grid View"
                  type="button"
                >
                  <LayoutGrid size={15} />
                </button>
                <button 
                  className={`${styles['icon-btn']} ${gridView === 'list' ? styles.active : ''}`} 
                  onClick={() => setGridView('list')}
                  title="List View"
                  type="button"
                >
                  <List size={15} />
                </button>
              </div>

              <div className={styles['custom-dropdown-container']}>
                <span className={styles['sort-label']}>SORT:</span>
                <div 
                  className={styles['custom-dropdown-toggle']} 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span>{SORT_OPTIONS.find(o => o.value === sortOption)?.label}</span>
                  {isDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>

                {isDropdownOpen && (
                  <div className={styles['custom-dropdown-menu']}>
                    {SORT_OPTIONS.map((option) => (
                      <div
                        key={option.value}
                        className={`${styles['dropdown-item']} ${sortOption === option.value ? styles['active-item'] : ''}`}
                        onClick={() => {
                          setSortOption(option.value);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className={`${styles['product-grid']} ${styles[`grid-${gridView}`]}`}>
            {visibleProducts.map((product) => {
              const hasDiscount = product.oldPrice && product.oldPrice > product.price;
              const discountPercentage = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
              
              return (
                <div 
                  key={product.id} 
                  className={`${styles['product-card']} ${gridView === 'list' ? styles['list-card'] : ''}`}
                  onClick={() => handleProductClick(product)}
                >
                  <div className={styles['product-image-container']}>
                    <img src={product.image} alt={product.name} loading="lazy" className={styles['product-image']} />
                    
                    <span className={`${styles['bestseller-badge']} ${getBadgeClass('BESTSELLER')}`}>BESTSELLER</span>
                    
                    <div 
                      className={styles['share-btn']}
                      onClick={(e) => handleShareClick(e, product)}
                      role="button"
                      title="Share Product"
                    >
                      <Share2 
                        size={15} 
                        stroke="var(--primary-dark, #4F4E22)" 
                      />
                    </div>

                    <div 
                      className={styles['wishlist-btn']}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                      role="button"
                      title={isWishlisted(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart 
                        size={16} 
                        fill={isWishlisted(product.id) ? "#e63946" : "none"} 
                        stroke={isWishlisted(product.id) ? "#e63946" : "var(--primary-dark, #4F4E22)"} 
                      />
                    </div>
                  </div>

                  <div className={styles['product-details']}>
                    <div className={styles['title-row']}>
                      <h3 className={styles['product-title']}>{product.name}</h3>
                      {product.rating && (
                        <div className={styles['rating-badge']}>
                          <Star size={10} fill="#B38A4A" stroke="#B38A4A" />
                          <span>{product.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <p className={styles['product-desc']}>{product.description}</p>

                    <div className={styles['price-row']}>
                      <span className={styles['current-price']}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className={styles['old-price']}>
                            ₹{product.oldPrice.toLocaleString('en-IN')}
                          </span>
                          <span className={styles['discount-pill']}>
                            {discountPercentage}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    <button 
                      className={styles['cart-btn']}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* LOAD MORE BUTTON */}
          {bestSellers.length > visibleCount && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', marginBottom: '8px' }}>
              <button 
                onClick={handleLoadMore} 
                style={{ 
                  padding: '12px 40px', 
                  borderRadius: '30px', 
                  fontWeight: '600', 
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  border: '2px solid var(--primary-dark, #4F4E22)', 
                  color: 'var(--primary-dark, #4F4E22)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-dark, #4F4E22)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--primary-dark, #4F4E22)';
                }}
              >
                Load More
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
