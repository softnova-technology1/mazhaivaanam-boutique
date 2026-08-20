import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS } from '../Catalog/Catalog';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { Search, ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '../PreBooking/PreBooking';
import styles from './NewArrivals.module.css';

export const NewArrivals = ({ setCurrentTab, setSelectedProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Reset visibleCount when filters change
  React.useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, searchQuery, selectedSort]);

  // Click listener to automatically close dropdown on outside clicks
  React.useEffect(() => {
    if (!isSortOpen) return;
    const closeDropdown = () => setIsSortOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [isSortOpen]);

  const newArrivals = useMemo(() => {
    // Filter only products marked as NEW ARRIVAL
    let items = ALL_PRODUCTS.filter(p => p.tag === 'NEW ARRIVAL');
    
    // Fallback just in case
    if (items.length === 0) {
      items = ALL_PRODUCTS.slice(0, 4);
    }

    // Filter by Category Selection
    if (selectedCategory !== 'All') {
      items = items.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Search Text Input
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(p => 
        p.name?.toLowerCase().includes(query) || 
        p.fabric?.toLowerCase().includes(query) || 
        p.description?.toLowerCase().includes(query)
      );
    }

    // Sort Logic
    switch (selectedSort) {
      case 'alpha-asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha-desc':
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
      case 'price-low':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
      case 'price-high':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'date-asc':
      case 'date-desc':
      case 'best-selling':
      case 'relevance':
      case 'featured':
      default:
        // Default order
        break;
    }

    return items;
  }, [selectedCategory, searchQuery, selectedSort]);

  const displayedProducts = useMemo(() => {
    return newArrivals.slice(0, visibleCount);
  }, [newArrivals, visibleCount]);

  return (
    <div className={styles['new-arrivals-page']}>
      
      {/* 1. Hero Section */}
      <header className={styles['hero-section']}>
        <div className={styles['hero-bg']} />
        <div className={styles['hero-overlay']} />
        <div className={styles['hero-content']}>
          <span className={styles['hero-slide-tag']}>Fresh From The Looms</span>
          <h1>Fresh Styles, <span className={`italic serif font-light ${styles['text-shimmer']}`}>Timeless Elegance</span></h1>
          <p>Explore our latest arrivals featuring contemporary designs blended with traditional craftsmanship. Stay ahead with fresh collections that celebrate beauty, comfort, and elegance.</p>
          <div className={styles['hero-actions']}>
            <button 
              className={`${styles['btn-explore']} btn-cloud`}
              onClick={() => {
                const element = document.getElementById('new-arrivals-explore');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              EXPLORE NEW PIECES
            </button>
            <button 
              className={`${styles['btn-custom']} pill`}
              onClick={() => setCurrentTab && setCurrentTab('about')}
            >
              OUR ARTISAN STORIES
            </button>
          </div>
        </div>
      </header>



      {/* 3. Filter & Search Controls */}
      <section className="container" id="new-arrivals-explore" style={{ padding: '40px 0 20px 0' }}>
        <div className="flex flex-col gap-6 mb-4 sm:mb-10">
          
          {/* Top row: Search and Mobile Categories */}
          <div className="flex flex-row justify-between items-center gap-3 border-b border-[#E9DDC7] pb-4">
            {/* Search Bar */}
            <div className={`${styles['search-bar-box']} flex-1`}>
              <Search size={16} className={styles['search-icon']} />
              <input
                type="text"
                placeholder="Search new arrivals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles['search-input']}
              />
              {searchQuery && (
                <div
                  className={styles['search-clear-icon']}
                  onClick={() => setSearchQuery('')}
                  role="button"
                >
                  ✕
                </div>
              )}
            </div>

            {/* Mobile View: Dropdown */}
            <div className="sm:hidden w-[40%] relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles['category-dropdown']}
              >
                {['All', 'Everyday Elegance', 'Festive Glow', 'Style Studio', 'Black Magic'].map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bottom row: Desktop Categories */}
          <div className="hidden sm:block w-full">
            {/* Desktop View: Horizontal Links */}
            <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2">
              {['All', 'Everyday Elegance', 'Festive Glow', 'Style Studio', 'Black Magic'].map(cat => (
                <button
                  key={cat}
                  className={`filter-link whitespace-nowrap font-inter text-[11px] font-semibold tracking-[1.5px] uppercase pb-1 transition-all duration-300 border-b-2 ${
                    selectedCategory === cat 
                      ? 'text-primary border-primary' 
                      : 'text-text-muted border-transparent hover:text-primary hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Grid Section */}
      <section className="container" style={{ paddingBottom: '100px' }}>
        {newArrivals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'Inter, sans-serif' }}>
            <h3 style={{ color: 'var(--primary)', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px' }}>No new arrivals match your filters.</h3>
            <p style={{ color: '#7D756D', margin: '10px 0 20px 0' }}>Try adjusting your search criteria or resetting filters.</p>
            <button 
              className={styles['reset-btn']}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedSort('featured');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className={styles['product-grid']}>
              {displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => {
                    if (setSelectedProduct) setSelectedProduct(product);
                    setCurrentTab('product-detail');
                  }}
                />
              ))}
            </div>

            {visibleCount < newArrivals.length && (
              <div className={styles['load-more-container']}>
                <button 
                  className={styles['load-more-btn']}
                  onClick={() => setVisibleCount(prev => prev + 8)}
                >
                  LOAD MORE
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 5. Behind the Loom Section */}
      <section className={styles['behind-loom-section']}>
        <div className="container">
          <div className={styles['section-header']}>
            <span className={styles['behind-loom-tag']}>ATELIER JOURNAL</span>
            <h2>Behind the Loom: The Art of Creation</h2>
            <div className={styles['divider']} />
            <p className={styles['section-desc']}>
              Every masterpiece in our New Arrivals collection is hand-woven by master weavers in Southern India. 
              Discover the meticulous steps that go into crafting a single heritage saree.
            </p>
          </div>

          <div className={styles['loom-grid']}>
            {/* Step 1 */}
            <div className={styles['loom-card']}>
              <div className={styles['loom-image-box']}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJfof75b7FWLZovQ32H3vMOrYEqmduqr3NDY0fMx0lXWYg7IucF6PspwjR6G9P-FDiO8q2kUiP48BgWgyLH9mXYo5ruiGqqj7QRLbmG7cD2JLZFvna_06BTftBZVi3m1jObQ64e0Y5KG_Tet40HwoOABnF9opZlKSFXyjoKRQ5x3teFeSZVFL-_6tRM8xb_W0b-cQ7q7QEja5Q0-ToGjtHuasitZeRsAdb-MhuIbdmE2anF5_KMc8c" 
                  alt="Organic Silk Dyeing" 
                />
                <span className={styles['step-badge']}>01</span>
              </div>
              <div className={styles['loom-info']}>
                <h4>Organic Dyeing &amp; Prep</h4>
                <p>
                  Mulberry silk threads are steeped in organic vat dyes made from turmeric, madder root, and wild indigo. 
                  This creates deep, heritage shades that stay lustrous for generations.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={styles['loom-card']}>
              <div className={styles['loom-image-box']}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWUOv1rAI9-jZz8TOtAz62JmLOLpUA0_tvOImElbfSLA59yQbHk1Gwh_2FW_bVQspBFP8S3wDatOH0rkSCHxHCgcXroL_0rCw1b0R-yWE6EuzjOKg_qG5C1aZsgBOxI_btusUSsZebAH8_j4_YvDQgMQ7QJlggqdo780jkvMtUlf7hqe8GBACrwPq8jP2goM5nIuJsmm8z5fLqaECZZo4Y7epkKxMUbsrL_MSArJcxpNnGTQ_1GNmb" 
                  alt="Fine Zari Work Drawing" 
                />
                <span className={styles['step-badge']}>02</span>
              </div>
              <div className={styles['loom-info']}>
                <h4>Pure Zari Crafting</h4>
                <p>
                  We use certified 24k gold-plated silver zari thread. 
                  Every motif—from traditional temple borders to delicate paisley bootis—is hand-drawn and verified for purity.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={styles['loom-card']}>
              <div className={styles['loom-image-box']}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-GlLDCXS6jcUfqmy5LK5Pk-Um-NqR5htyyvz2gOxO0IpV5NytJsB5ajbyjI1jt6Ql9d8VicfjBbYAX1Mu6wqNvK9g6QgdLbnC0-DAN4GhxZF2LrMoLjqeei6PKQCOABQEFfFQ6GOgLnXyt1BdthiBpLD3PBmaxZSZjTvaELbKmmP4tCNN46_8Lp2IxL-_UFKgLm363a0hBXB20hr4SgPaKwDRjU0yrYDYgHe7YtzKukfNeZA5_GC0" 
                  alt="Wooden Handloom Weft Warp Coordination" 
                />
                <span className={styles['step-badge']}>03</span>
              </div>
              <div className={styles['loom-info']}>
                <h4>Loom Interweaving</h4>
                <p>
                  Master weavers work in perfect synchronicity on wooden throw-shuttle handlooms. 
                  Warping, denting, and drafting take weeks before weaving the actual 6-yard saree.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
