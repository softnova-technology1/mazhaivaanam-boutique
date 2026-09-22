import React, { useMemo, useEffect, useState } from 'react';
import { getBestSellers } from '../../services/api';
import { getBadgeClass } from '../../utils/badgeHelper';
import { LayoutGrid, Grid3X3, List, ChevronDown, ChevronUp, Heart, Star, Share2, Loader2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { OfferTimerBadge } from '../../components/common/OfferTimerBadge/OfferTimerBadge';
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
              {liveBestSellers.slice(0, 3).map(prod => {
                const effPrice = (prod.discountActive && prod.discountedPrice) || (prod.discountedPrice && prod.discountedPrice < prod.price)
                  ? prod.discountedPrice
                  : prod.price;
                const origMrp = (prod.mrpPrice && prod.mrpPrice > effPrice) ? prod.mrpPrice : (prod.oldPrice && prod.oldPrice > effPrice) ? prod.oldPrice : (effPrice < prod.price ? prod.price : null);
                const hasDisc = Boolean(origMrp && origMrp > effPrice);

                return (
                  <div key={prod.id || prod._id} className={styles['sidebar-product-card']} onClick={() => handleProductClick({ ...prod, price: effPrice })}>
                    <img src={prod.image} alt={prod.name} loading="lazy" />
                    <div className={styles['sidebar-product-info']}>
                      <h5>{prod.name}</h5>
                      <span className={styles['sidebar-price']}>
                        ₹{effPrice.toLocaleString('en-IN')}
                        {hasDisc && (
                          <span style={{ textDecoration: 'line-through', color: '#94a3b8', marginLeft: 6, fontSize: '11px', fontWeight: 400 }}>
                            ₹{origMrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo banner */}
            <div className={styles['promo-banner']} onClick={() => setCurrentTab && setCurrentTab('catalog')}>
              <img src="https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/bestsellers_page/promo_banner.jpg" alt="Premium Collections" />
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
              const effectivePrice = (product.discountActive && product.discountedPrice) || (product.discountedPrice && product.discountedPrice < product.price)
                ? product.discountedPrice
                : product.price;

              const originalMrp = (product.mrpPrice && product.mrpPrice > effectivePrice) ? product.mrpPrice : (product.oldPrice && product.oldPrice > effectivePrice) ? product.oldPrice : (effectivePrice < product.price ? product.price : null);
              const hasDiscount = Boolean(originalMrp && originalMrp > effectivePrice);
              const discountPct = hasDiscount ? Math.round(((originalMrp - effectivePrice) / originalMrp) * 100) : 0;
              const itemToPass = { ...product, price: effectivePrice, discountedPrice: effectivePrice };
              
              return (
                <div 
                  key={product.id || product._id} 
                  className={`${styles['product-card']} ${gridView === 'list' ? styles['list-card'] : ''}`}
                  onClick={() => handleProductClick(itemToPass)}
                >
                  <div className={styles['product-image-container']}>
                    <img src={product.image} alt={product.name} loading="lazy" className={styles['product-image']} />
                    
                    {product.stock?.isOutOfStock ? (
                      <span className={`${styles['bestseller-badge']}`} style={{ backgroundColor: '#dc2626', color: '#fff' }}>OUT OF STOCK</span>
                    ) : (
                      <OfferTimerBadge
                        endDate={product.discountEndDate || product.discount?.endDate || product.limitedOfferEntry?.endDate}
                        fallbackLabel={product.discountLabel || product.discount?.label || product.tag || 'BESTSELLER'}
                        className={styles['bestseller-badge']}
                      />
                    )}
                    
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
                    </div>

                    <p className={styles['product-desc']}>{product.shortDescription || product.description}</p>

                    <div className={styles['price-row']}>
                      <span className={styles['current-price']}>
                        ₹{effectivePrice.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <>
                          <span className={styles['old-price']}>
                            ₹{originalMrp.toLocaleString('en-IN')}
                          </span>
                          <span className={styles['discount-pill']}>
                            {discountPct}% OFF
                          </span>
                        </>
                      )}
                    </div>

                    <button 
                      className={styles['cart-btn']}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(itemToPass);
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
