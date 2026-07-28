import React, { useMemo, useEffect, useState } from 'react';
import { ALL_PRODUCTS } from '../Catalog/Catalog';
import { LayoutGrid, Grid3X3, List, ChevronDown, ChevronUp, Heart, Star } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import styles from './BestSellers.module.css';

export const BestSellers = ({ setCurrentTab, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Load wishlist
    const saved = localStorage.getItem('boutique_wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const [gridView, setGridView] = useState(3);
  const [sortOption, setSortOption] = useState('best-selling');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isWishlisted = (id) => wishlist.some(item => item.id === id);

  const handleWishlistToggle = (product) => {
    let updated;
    if (isWishlisted(product.id)) {
      updated = wishlist.filter(item => item.id !== product.id);
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Removed "${product.name}" from Wishlist.` } }));
    } else {
      updated = [...wishlist, product];
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Added "${product.name}" to Wishlist!` } }));
    }
    setWishlist(updated);
    localStorage.setItem('boutique_wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage')); // sync navbar
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
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

  const bestSellers = useMemo(() => {
    // Filter only products with BESTSELLER tag
    let products = ALL_PRODUCTS.filter(product => product.tag === "BESTSELLER");
    
    if (sortOption === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'alpha-asc') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'alpha-desc') {
      products.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    return products;
  }, [sortOption]);

  const handleProductClick = (product) => {
    if (setSelectedProduct) setSelectedProduct(product);
    setCurrentTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles['catalog-page']}>
      
      {/* HEADER SECTION */}
      <div className={styles['page-header']}>
        <div className={styles['breadcrumbs']}>
          <span onClick={() => setCurrentTab('home')}>Home</span> &gt; <span>Best Sellers</span>
        </div>
        <h1>Customer Favorites</h1>
        <p style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '16px', color: 'var(--text-muted)' }}>
          Explore the sarees our customers love the most. These best-selling designs are celebrated for their exceptional quality, timeless appeal, and effortless elegance.
        </p>
      </div>

      {/* CATALOG CONTAINER */}
      <div className={`${styles['catalog-container']} container`}>
        
        {/* LEFT SIDEBAR */}
        <aside className={styles['sidebar']}>
          <div className={styles['sidebar-section']}>
            <div className={styles['sidebar-heading']}>
              <h3>Premium Collections</h3>
            </div>
            
            <div className={styles['sidebar-product-list']}>
              {ALL_PRODUCTS.slice(0, 3).map(prod => (
                <div key={prod.id} className={styles['sidebar-product-card']} onClick={() => handleProductClick(prod)}>
                  <img src={prod.image} alt={prod.name} loading="lazy" />
                  <div className={styles['sidebar-product-info']}>
                    <h5>{prod.name}</h5>
                    <span className={styles['sidebar-price']}>Rs. {prod.price.toLocaleString('en-IN')}.00</span>
                  </div>
                </div>
              ))}
              <div className={styles['sidebar-divider']}></div>
            </div>

            {/* The promo image shown in the screenshot */}
            <div className={styles['promo-banner']}>
              <img src="/Images/saree1.png" alt="Premium Collections" />
              <div className={styles['promo-overlay']}>
                <span>PREMIUM<br/>COLLECTIONS</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT AREA */}
        <main className={styles['main-area']}>
          
          {/* TOOLBAR */}
          <div className={styles['toolbar']}>
            <div className={styles['result-count']}>
              There are {ALL_PRODUCTS.length > 5000 ? ALL_PRODUCTS.length : 5612} results in total
            </div>
            
            <div className={styles['toolbar-right']}>
              <div className={styles['view-toggles']}>
                <button className={`${styles['icon-btn']} ${gridView === 3 ? styles.active : ''}`} onClick={() => setGridView(3)}><Grid3X3 size={16} /></button>
                <button className={`${styles['icon-btn']} ${gridView === 4 ? styles.active : ''}`} onClick={() => setGridView(4)}><LayoutGrid size={16} /></button>
                <button className={`${styles['icon-btn']} ${gridView === 'list' ? styles.active : ''}`} onClick={() => setGridView('list')}><List size={16} /></button>
              </div>

              <div className={styles['custom-dropdown-container']}>
                <span>Sort by:</span>
                <div 
                  className={styles['custom-dropdown-toggle']} 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {SORT_OPTIONS.find(o => o.value === sortOption)?.label}
                  {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
            {bestSellers.map((product) => {
              const hasDiscount = product.oldPrice && product.oldPrice > product.price;
              const discountPercentage = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
              
              return (
                <div 
                  key={product.id} 
                  className={styles['product-card']}
                  onClick={() => handleProductClick(product)}
                >
                  <div className={styles['product-image-container']}>
                    <img src={product.image} alt={product.name} loading="lazy" className={styles['product-image']} />
                    
                    <span className={styles['bestseller-badge']}>BESTSELLER</span>
                    
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
                        fill={isWishlisted(product.id) ? "var(--primary-dark, #4F4E22)" : "none"} 
                        stroke="var(--primary-dark, #4F4E22)" 
                      />
                    </div>
                  </div>

                  <div className={styles['product-details']}>
                    <div className={styles['title-row']}>
                      <h3 className={styles['product-title']}>{product.name}</h3>
                      {product.rating && (
                        <div className={styles['rating-badge']}>
                          <Star size={10} fill="var(--secondary)" stroke="var(--secondary)" />
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

        </main>
      </div>
    </div>
  );
};
