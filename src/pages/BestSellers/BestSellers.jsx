import React, { useMemo, useEffect, useState } from 'react';
import { ALL_PRODUCTS } from '../Catalog/Catalog';
import { LayoutGrid, Grid3X3, List, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './BestSellers.module.css';

export const BestSellers = ({ setCurrentTab, setSelectedProduct }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [gridView, setGridView] = useState(3);
  const [sortOption, setSortOption] = useState('best-selling');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(true);

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
    // For this mockup, we'll use top 20
    let products = [...ALL_PRODUCTS.slice(0, 20)];
    
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
            <div 
              className={styles['sidebar-heading']}
              onClick={() => setIsPremiumOpen(!isPremiumOpen)}
            >
              <h3>Premium Collections</h3>
              {isPremiumOpen ? <Minus size={16} /> : <Plus size={16} />}
            </div>
            
            {isPremiumOpen && (
              <div className={styles['sidebar-product-list']}>
                {ALL_PRODUCTS.slice(0, 3).map(prod => (
                  <div key={prod.id} className={styles['sidebar-product-card']} onClick={() => handleProductClick(prod)}>
                    <img src={prod.image} alt={prod.name} loading="lazy" />
                    <div className={styles['sidebar-product-info']}>
                      <h5>{prod.name} | {prod.id}</h5>
                      <span className={styles['sidebar-price']}>Rs. {prod.price.toLocaleString('en-IN')}.00</span>
                    </div>
                  </div>
                ))}
                <div className={styles['sidebar-divider']}></div>
              </div>
            )}

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
            {bestSellers.map((product) => (
              <div 
                key={product.id} 
                className={styles['product-card']}
                onClick={() => handleProductClick(product)}
              >
                <div className={styles['product-image']}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                <div className={styles['product-info']}>
                  <h4>{product.name} | {product.id}</h4>
                  <p className={styles['product-price']}>Rs. {product.price.toLocaleString('en-IN')}.00</p>
                  <button 
                    className={styles['add-to-cart-btn']}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Added "${product.name}" to cart!` } }));
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};
