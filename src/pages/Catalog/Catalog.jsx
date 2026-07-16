import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { Heart, Star } from 'lucide-react';
import styles from './Catalog.module.css';

// Premium Master Saree Collection (as defined in user's design)
export const ALL_PRODUCTS = [
  {
    id: 'prod-catalog-1',
    name: "Ruby Petal",
    category: "Silk",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Wedding",
    price: 13000,
    oldPrice: 15000,
    rating: 4.9,
    tag: "BESTSELLER",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-hN0onELnDgdOswyfAzJdw98YnefT7Zi-Dt0g7IxzqYuKK0TaBE4ZTit86sthNhhHWaETP5U6EPkJdQ2TF8NiA7csqXaXCMDhY3VfyoT7yodibzxkenJWfVDdPFIj9YQwTe_B2qlA3e4Sg8KUXPv4QX9GkevPmAgmVVpnY1xGSJkIONEBGz60tPRpNkxygpulKi7xC5gVJ_NCnFJG5nHKVTU98HQAfzC7nM8QYjmgbIyBBYSsnJFz",
    description: "Elegant ruby red handwoven pure silk saree adorned with heritage gold zari borders and temple motifs."
  },
  {
    id: 'prod-catalog-2',
    name: "Sunset Glow",
    category: "Cotton",
    fabric: "Cotton",
    color: "#C8A34D",
    occasion: "Festival",
    price: 28599,
    oldPrice: 32000,
    rating: 4.8,
    tag: "NEW ARRIVAL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1gzWEB9tKWsjoudWNb3uApBhCDiPTe9M1N6lnbt5UlryqNZaDDCJ8tb4LpOZS3_Q_f3ai28aCck4TTiRvoW6rCLqG9z1MjEjojxWwCDsU5oehBjjZEL6UZBCOtrTrsrJT3cZGJ3rrgRrbu1lbSKpbMJ5GHQ2uffEq5JqZ_7clzRy6vknPvSSzVkFqaC08HUPLxpQbswti0TkQQCUl6LopJnDFIkxphZNhU5XYWEa2AjlwakWy0rtm",
    description: "Warm yellow and gold handloom cotton saree woven with traditional patterns, ideal for festive elegance."
  },
  {
    id: 'prod-catalog-3',
    name: "Snow Elegance",
    category: "Banarasi",
    fabric: "Pure Silk",
    color: "#C8A34D",
    occasion: "Wedding",
    price: 23799,
    oldPrice: 27500,
    rating: 5.0,
    tag: "BESTSELLER",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF4Gjm9ZQy_Uo8x8iFNdXcHWVbQYj7RFZy8iHoTa9vqETSoS0ARIitWgDX2BAgU5h9s6Fim9rxkLSx0iOmVfYMDI3x_TllHFpCL_M2VHJn9-nWBsoGA4QyzxeXqQGHq6nTPl0ixsA7yhWUAxcbIYEfUwsz0KYDdPC07CdWJcQVB2-pRVeVC-YZWYz0m7-wRD-IdZdnILIfySa0mOQTk9RmzUgbCvZfHUbUrrdPXzADP522ac3h7lO_",
    description: "Glistening white-gold Banarasi brocade saree featuring intricate gold jaal patterns."
  },
  {
    id: 'prod-catalog-4',
    name: "Night Veil",
    category: "Organza",
    fabric: "Tussar",
    color: "#1A237E",
    occasion: "Party Wear",
    price: 6149,
    oldPrice: 7500,
    rating: 4.5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99n9r4dbP7WA7__f11wrB_Ipn6Q7GJSe8zMy54tocsgng5Z1Lpt40VzWbYoU1eR2drwe6bdmrWtZUkRPdbQGsUCWo1IBvdJJwiiQ4Sv9ncSwDIKofKTG8qx4YEiYlvuIv_XgQ6B2Z4xVVVvquVHEiV4BznQPCbp8fgL9DgvHqKdq45bT_Yy_gbfOWsdfybCeY0bzHqWfgyJH519MupLNrDTaOzaeGV9f5ckgTYE_FLmrqEByj3pLr",
    description: "Deep, mysterious indigo designer drape featuring delicate silver borders."
  },
  {
    id: 'prod-catalog-5',
    name: "Azure Dream",
    category: "Bridal",
    fabric: "Pure Silk",
    color: "#1A237E",
    occasion: "Wedding",
    price: 11769,
    oldPrice: 14000,
    rating: 4.7,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4EfBPaPdPDqLR-Rynn0CdBpWEu5GnScNJ0P7TcAJMUlneT5ULxMjW7no9g7oggZiGPQ_3RDBuC6F4hB30FN4kRf8Ixqc9AcAwCWKHDSAiow5UiSsA23QSTL1nh_7CTPoHcZfJS1Fs-mg4CnhazB4V0JNBiMxr9oWd4za5pzvZpMWiQfGSJcLGgPTOGhCh0zcpjE_-fuCyNYUOU9a8sTqqdjJVFqG_TVvJInGjJ0cNzraqo3w3JOGR",
    description: "Vibrant royal blue silk masterwork with gold border details, curated for bridal elegance."
  },
  {
    id: 'prod-catalog-6',
    name: "Royal Orchid",
    category: "Silk",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Reception",
    price: 9000,
    oldPrice: 11000,
    rating: 4.6,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-hN0onELnDgdOswyfAzJdw98YnefT7Zi-Dt0g7IxzqYuKK0TaBE4ZTit86sthNhhHWaETP5U6EPkJdQ2TF8NiA7csqXaXCMDhY3VfyoT7yodibzxkenJWfVDdPFIj9YQwTe_B2qlA3e4Sg8KUXPv4QX9GkevPmAgmVVpnY1xGSJkIONEBGz60tPRpNkxygpulKi7xC5gVJ_NCnFJG5nHKVTU98HQAfzC7nM8QYjmgbIyBBYSsnJFz",
    description: "Deep orchid purple silk saree with intricate floral vines woven in heavy gold thread work."
  },
  {
    id: 'prod-catalog-7',
    name: "Golden Harvest",
    category: "Cotton",
    fabric: "Cotton",
    color: "#C8A34D",
    occasion: "Traditional",
    price: 30849,
    oldPrice: 35000,
    rating: 4.8,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1gzWEB9tKWsjoudWNb3uApBhCDiPTe9M1N6lnbt5UlryqNZaDDCJ8tb4LpOZS3_Q_f3ai28aCck4TTiRvoW6rCLqG9z1MjEjojxWwCDsU5oehBjjZEL6UZBCOtrTrsrJT3cZGJ3rrgRrbu1lbSKpbMJ5GHQ2uffEq5JqZ_7clzRy6vknPvSSzVkFqaC08HUPLxpQbswti0TkQQCUl6LopJnDFIkxphZNhU5XYWEa2AjlwakWy0rtm",
    description: "Rich handloom cotton-silk blend in warm golden sand with delicate temple-motif borders."
  },
  {
    id: 'prod-catalog-8',
    name: "Mystic Forest",
    category: "Banarasi",
    fabric: "Pure Silk",
    color: "#004D40",
    occasion: "Festival",
    price: 13769,
    oldPrice: 16500,
    rating: 4.9,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF4Gjm9ZQy_Uo8x8iFNdXcHWVbQYj7RFZy8iHoTa9vqETSoS0ARIitWgDX2BAgU5h9s6Fim9rxkLSx0iOmVfYMDI3x_TllHFpCL_M2VHJn9-nWBsoGA4QyzxeXqQGHq6nTPl0ixsA7yhWUAxcbIYEfUwsz0KYDdPC07CdWJcQVB2-pRVeVC-YZWYz0m7-wRD-IdZdnILIfySa0mOQTk9RmzUgbCvZfHUbUrrdPXzADP522ac3h7lO_",
    description: "Deep emerald green silk brocade woven with intricate floral creepers and gold zari."
  },
  {
    id: 'prod-catalog-9',
    name: "Ebony Scarlet",
    category: "Organza",
    fabric: "Tussar",
    color: "#6B102A",
    occasion: "Reception",
    price: 43769,
    oldPrice: 49999,
    rating: 5.0,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99n9r4dbP7WA7__f11wrB_Ipn6Q7GJSe8zMy54tocsgng5Z1Lpt40VzWbYoU1eR2drwe6bdmrWtZUkRPdbQGsUCWo1IBvdJJwiiQ4Sv9ncSwDIKofKTG8qx4YEiYlvuIv_XgQ6B2Z4xVVVvquVHEiV4BznQPCbp8fgL9DgvHqKdq45bT_Yy_gbfOWsdfybCeY0bzHqWfgyJH519MupLNrDTaOzaeGV9f5ckgTYE_FLmrqEByj3pLr",
    description: "Modern designer drape featuring rich scarlet highlights on an ebony dark background."
  }
];

export const Catalog = ({ activeFilter, setActiveFilter, setCurrentTab, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(ALL_PRODUCTS);
  
  // States matching filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [wishlistMessage, setWishlistMessage] = useState('');

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
    
    if (activeFilter.occasion) {
      setSelectedOccasion(activeFilter.occasion);
    } else {
      setSelectedOccasion('All');
    }
  }, [activeFilter]);

  // Handle product filtering & sorting logic
  useEffect(() => {
    let filtered = [...ALL_PRODUCTS];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Fabric
    if (selectedFabric && selectedFabric !== 'All') {
      filtered = filtered.filter(p => p.fabric.toLowerCase() === selectedFabric.toLowerCase());
    }

    // Filter by Color
    if (selectedColor && selectedColor !== 'All') {
      filtered = filtered.filter(p => p.color.toLowerCase() === selectedColor.toLowerCase());
    }

    // Filter by Occasion
    if (selectedOccasion && selectedOccasion !== 'All') {
      filtered = filtered.filter(p => p.occasion.toLowerCase() === selectedOccasion.toLowerCase());
    }

    // Sort Logic
    if (selectedSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setProducts(filtered);
  }, [selectedCategory, selectedFabric, selectedColor, selectedOccasion, selectedSort]);

  const handleAddToWishlist = (product) => {
    const saved = localStorage.getItem('boutique_wishlist');
    let wishlistItems = saved ? JSON.parse(saved) : [];
    
    if (!wishlistItems.find(w => w.id === product.id)) {
      wishlistItems.push(product);
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('storage'));
      
      setWishlistMessage(`"${product.name}" added to Wishlist!`);
      setTimeout(() => setWishlistMessage(''), 3000);
    } else {
      setWishlistMessage(`"${product.name}" is already in Wishlist.`);
      setTimeout(() => setWishlistMessage(''), 3000);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFabric('All');
    setSelectedColor('All');
    setSelectedOccasion('All');
    setSelectedSort('featured');
    if (setActiveFilter) {
      setActiveFilter({ category: '', occasion: '', label: 'All Collections' });
    }
  };

  return (
    <div className={styles['catalog-page-container']}>
      {/* Toast Feedback */}
      {wishlistMessage && (
        <div className="wishlist-toast-banner" style={{
          position: 'fixed', top: '130px', right: '30px',
          backgroundColor: '#490017', color: '#ffffff',
          padding: '12px 24px', zIndex: 10000,
          fontFamily: 'Inter, sans-serif', fontSize: '12px',
          letterSpacing: '1px', borderLeft: '3px solid #C8A34D'
        }}>
          <span>{wishlistMessage}</span>
        </div>
      )}

      {/* 1. Hero Section */}
      <header className={styles['hero-section']}>
        <div className={styles['hero-bg']} />
        <div className={styles['hero-overlay']} />
        <div className={styles['hero-content']}>
          <div className={styles['hero-text-box']}>
            <h1>Discover Every Weave, <br />Crafted with Elegance</h1>
            <p>Explore our complete collection of handcrafted sarees designed for weddings, festivals, and timeless everyday beauty.</p>
            <button 
              className={styles['gold-shimmer-btn']}
              onClick={() => {
                const element = document.getElementById('catalog-explore-anchor');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              EXPLORE NOW
            </button>
          </div>
        </div>
      </header>

      {/* 2. Signature Weaves Section */}
      <section className={styles['signature-weaves-section']} id="catalog-explore-anchor">
        <div className={styles['section-header']}>
          <h2>Our Signature Weaves</h2>
          <div className={styles['divider']} />
        </div>
        <div className={styles['weave-cards-container']}>
          <div className={styles['weave-card']} onClick={() => setSelectedCategory('Silk')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-silk']}`}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-hN0onELnDgdOswyfAzJdw98YnefT7Zi-Dt0g7IxzqYuKK0TaBE4ZTit86sthNhhHWaETP5U6EPkJdQ2TF8NiA7csqXaXCMDhY3VfyoT7yodibzxkenJWfVDdPFIj9YQwTe_B2qlA3e4Sg8KUXPv4QX9GkevPmAgmVVpnY1xGSJkIONEBGz60tPRpNkxygpulKi7xC5gVJ_NCnFJG5nHKVTU98HQAfzC7nM8QYjmgbIyBBYSsnJFz" 
                alt="Silk sarees curation" 
              />
            </div>
            <p>SILK</p>
          </div>

          <div className={styles['weave-card']} onClick={() => setSelectedCategory('Cotton')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-cotton']}`}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1gzWEB9tKWsjoudWNb3uApBhCDiPTe9M1N6lnbt5UlryqNZaDDCJ8tb4LpOZS3_Q_f3ai28aCck4TTiRvoW6rCLqG9z1MjEjojxWwCDsU5oehBjjZEL6UZBCOtrTrsrJT3cZGJ3rrgRrbu1lbSKpbMJ5GHQ2uffEq5JqZ_7clzRy6vknPvSSzVkFqaC08HUPLxpQbswti0TkQQCUl6LopJnDFIkxphZNhU5XYWEa2AjlwakWy0rtm" 
                alt="Cotton weaves curation" 
              />
            </div>
            <p>COTTON</p>
          </div>

          <div className={styles['weave-card']} onClick={() => setSelectedCategory('Banarasi')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-banarasi']}`}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF4Gjm9ZQy_Uo8x8iFNdXcHWVbQYj7RFZy8iHoTa9vqETSoS0ARIitWgDX2BAgU5h9s6Fim9rxkLSx0iOmVfYMDI3x_TllHFpCL_M2VHJn9-nWBsoGA4QyzxeXqQGHq6nTPl0ixsA7yhWUAxcbIYEfUwsz0KYDdPC07CdWJcQVB2-pRVeVC-YZWYz0m7-wRD-IdZdnILIfySa0mOQTk9RmzUgbCvZfHUbUrrdPXzADP522ac3h7lO_" 
                alt="Banarasi looms curation" 
              />
            </div>
            <p>BANARASI</p>
          </div>

          <div className={styles['weave-card']} onClick={() => setSelectedCategory('Organza')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-organza']}`}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB99n9r4dbP7WA7__f11wrB_Ipn6Q7GJSe8zMy54tocsgng5Z1Lpt40VzWbYoU1eR2drwe6bdmrWtZUkRPdbQGsUCWo1IBvdJJwiiQ4Sv9ncSwDIKofKTG8qx4YEiYlvuIv_XgQ6B2Z4xVVVvquVHEiV4BznQPCbp8fgL9DgvHqKdq45bT_Yy_gbfOWsdfybCeY0bzHqWfgyJH519MupLNrDTaOzaeGV9f5ckgTYE_FLmrqEByj3pLr" 
                alt="Organza sarees curation" 
              />
            </div>
            <p>ORGANZA</p>
          </div>

          <div className={styles['weave-card']} onClick={() => setSelectedCategory('Bridal')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-bridal']}`}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4EfBPaPdPDqLR-Rynn0CdBpWEu5GnScNJ0P7TcAJMUlneT5ULxMjW7no9g7oggZiGPQ_3RDBuC6F4hB30FN4kRf8Ixqc9AcAwCWKHDSAiow5UiSsA23QSTL1nh_7CTPoHcZfJS1Fs-mg4CnhazB4V0JNBiMxr9oWd4za5pzvZpMWiQfGSJcLGgPTOGhCh0zcpjE_-fuCyNYUOU9a8sTqqdjJVFqG_TVvJInGjJ0cNzraqo3w3JOGR" 
                alt="Bridal trousseau curation" 
              />
            </div>
            <p>BRIDAL</p>
          </div>
        </div>
      </section>

      {/* 3. Sidebar Filters + Product Grid Layout */}
      <main className={styles['main-layout']}>
        <aside className={styles['filters-sidebar']}>
          <div className={styles['sticky-sidebar-content']}>
            <h2 className={styles['sidebar-title']}>Refine Selection</h2>
            <p className={styles['sidebar-subtitle']}>Curated for elegance</p>

            <div className={styles['space-y-6']}>
              {/* Fabric Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">texture</span>
                    <h4>Fabric</h4>
                  </div>
                </div>
                <div className={styles['fabric-tags']}>
                  {['All', 'Pure Silk', 'Cotton', 'Tussar'].map(fab => (
                    <button 
                      key={fab} 
                      onClick={() => setSelectedFabric(fab)}
                      className={`${styles['tag-btn']} ${selectedFabric === fab ? styles['active-tag'] : ''}`}
                    >
                      {fab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">palette</span>
                    <h4>Color</h4>
                  </div>
                </div>
                <div className={styles['color-circles']}>
                  <div 
                    onClick={() => setSelectedColor('All')} 
                    className={`${styles['color-dot']} ${selectedColor === 'All' ? styles['active-color'] : ''}`}
                    style={{ backgroundColor: '#ccc' }}
                    title="All Colors"
                  />
                  <div 
                    onClick={() => setSelectedColor('#6B102A')} 
                    className={`${styles['color-dot']} ${selectedColor === '#6B102A' ? styles['active-color'] : ''}`}
                    style={{ backgroundColor: '#6B102A' }}
                    title="Burgundy"
                  />
                  <div 
                    onClick={() => setSelectedColor('#004D40')} 
                    className={`${styles['color-dot']} ${selectedColor === '#004D40' ? styles['active-color'] : ''}`}
                    style={{ backgroundColor: '#004D40' }}
                    title="Green"
                  />
                  <div 
                    onClick={() => setSelectedColor('#1A237E')} 
                    className={`${styles['color-dot']} ${selectedColor === '#1A237E' ? styles['active-color'] : ''}`}
                    style={{ backgroundColor: '#1A237E' }}
                    title="Blue"
                  />
                  <div 
                    onClick={() => setSelectedColor('#C8A34D')} 
                    className={`${styles['color-dot']} ${selectedColor === '#C8A34D' ? styles['active-color'] : ''}`}
                    style={{ backgroundColor: '#C8A34D' }}
                    title="Gold"
                  />
                </div>
              </div>

              {/* Occasions Checkbox List */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <h4>Occasion</h4>
                  </div>
                </div>
                <div className={styles['occasion-list']}>
                  {['All', 'Wedding', 'Festival', 'Reception', 'Party Wear', 'Traditional'].map(occ => (
                    <label key={occ} className={styles['checkbox-label']}>
                      <input 
                        type="radio" 
                        name="occasion-filter" 
                        checked={selectedOccasion === occ}
                        onChange={() => setSelectedOccasion(occ)}
                      />
                      <span>{occ}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button className={styles['reset-all-btn']} onClick={handleResetFilters}>
              RESET ALL
            </button>
          </div>
        </aside>

        {/* Right side: Product Grid */}
        <section className={styles['products-panel']}>
          <div className={styles['products-header']}>
            <div className={styles['products-header-left']}>
              <h3>SHOP THE FULL CATALOGUE</h3>
              <p>Showing {products.length} of {ALL_PRODUCTS.length} Masterpieces</p>
            </div>
            <div className={styles['sort-selector']}>
              <span>SORT BY:</span>
              <select 
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
              >
                <option value="featured">RELEVANCE</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="rating">PATRON RATING</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'Inter, sans-serif' }}>
              <h3 style={{ color: '#490017', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px' }}>No masterpieces match your filters.</h3>
              <p style={{ color: '#7D756D', margin: '10px 0 20px 0' }}>Try adjusting your sidebar criteria or click Reset All.</p>
              <button className={styles['reset-all-btn']} style={{ width: 'auto', padding: '12px 30px' }} onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles['products-grid']}>
                {products.map((product) => (
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
                        <span className={styles['badge-tag']}>{product.tag}</span>
                      )}
                      <button 
                        className={styles['wishlist-btn']} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist(product);
                        }}
                        title="Add to Wishlist"
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                    <div className={styles['card-details']}>
                      <h4 
                        style={{ cursor: 'pointer' }} 
                        onClick={() => handleProductClick(product)}
                      >
                        {product.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                        <Star size={12} fill="#C8A34D" stroke="#C8A34D" />
                        <span style={{ fontSize: '12px', fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#490017' }}>
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className={styles['price-row']}>
                        <span className={styles['current-price']}>{formatCurrency(product.price)}</span>
                        {product.oldPrice && (
                          <>
                            <span className={styles['old-price']}>{formatCurrency(product.oldPrice)}</span>
                            <span className={styles['discount-pill']}>
                              {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                            </span>
                          </>
                        )}
                      </div>
                      <button 
                        className={styles['add-cart-btn']}
                        onClick={() => addToCart(product, 1)}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className={styles['pagination']}>
                <button className={styles['pagination-arrow']} disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className={styles['pagination-pages']}>
                  <span className={`${styles['page-num']} ${styles['active-page']}`}>01</span>
                  <span className={styles['page-num']}>02</span>
                  <span className={styles['page-num']}>03</span>
                  <span className={styles['page-num']}>...</span>
                  <span className={styles['page-num']}>12</span>
                </div>
                <button className={styles['pagination-arrow']}>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      {/* 4. Curated Edit Section */}
      <section className={styles['curated-edit-section']}>
        <div className={styles['curated-container']}>
          <div className={styles['curated-image-box']}>
            <div className={styles['curated-image-frame']}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4EfBPaPdPDqLR-Rynn0CdBpWEu5GnScNJ0P7TcAJMUlneT5ULxMjW7no9g7oggZiGPQ_3RDBuC6F4hB30FN4kRf8Ixqc9AcAwCWKHDSAiow5UiSsA23QSTL1nh_7CTPoHcZfJS1Fs-mg4CnhazB4V0JNBiMxr9oWd4za5pzvZpMWiQfGSJcLGgPTOGhCh0zcpjE_-fuCyNYUOU9a8sTqqdjJVFqG_TVvJInGjJ0cNzraqo3w3JOGR" 
                alt="Editorial Craftsmanship weaver loom closeup" 
              />
            </div>
          </div>
          <div className={styles['curated-info-box']}>
            <h2 className={styles['curated-label']}>THE CURATED EDIT</h2>
            <h3 className={styles['curated-heading']}>Masterpieces of the Monsoon Season</h3>
            <p className={styles['curated-desc']}>
              Each piece in our Curated Edit represents the pinnacle of artisanal skill. From the selection of the finest mulberry silk to the weeks of meticulous hand-weaving, these are more than sarees—they are heritage heirlooms crafted to last generations.
            </p>
            <div className={styles['curated-bullets']}>
              <p className={styles['bullet-item']}>✓ 100% AUTHENTIC HANDLOOM</p>
              <p className={styles['bullet-item']}>✓ SUSTAINABLY SOURCED FIBERS</p>
              <p className={styles['bullet-item']}>✓ CERTIFIED SILK MARK</p>
            </div>
            <button className={styles['story-btn']}>DISCOVER THE STORY →</button>
          </div>
        </div>
      </section>

      {/* 5. Newsletter Section */}
      <section className={styles['newsletter-section']}>
        <div className={styles['newsletter-box']}>
          <h3>Join the Family</h3>
          <p>Subscribe to receive updates on new collections, private events, and the stories behind our weaves.</p>
          <form className={styles['newsletter-form']} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="YOUR EMAIL ADDRESS" required />
            <button type="submit" className={styles['newsletter-submit-btn']}>SUBSCRIBE</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Catalog;
