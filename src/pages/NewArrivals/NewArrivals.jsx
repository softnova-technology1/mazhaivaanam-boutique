import React, { useState, useMemo, useEffect } from 'react';
import { getNewArrivals } from '../../services/api';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { SORT_OPTIONS } from '../PreBooking/PreBooking';
import styles from './NewArrivals.module.css';

export const NewArrivals = ({ setCurrentTab, setSelectedProduct }) => {
  const getInitialCount = () => {
    if (typeof window === 'undefined') return 12;
    const w = window.innerWidth;
    if (w >= 1440) return 15;
    if (w > 1024) return 12;
    if (w > 768) return 9;
    return 8;
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(getInitialCount);
  const [liveArrivals, setLiveArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getNewArrivals(50)
      .then(items => {
        if (isMounted) {
          setLiveArrivals(items || []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load new arrivals:', err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(getInitialCount());
  }, [selectedCategory, searchQuery, selectedSort]);

  // Click listener to automatically close dropdown on outside clicks
  useEffect(() => {
    if (!isSortOpen) return;
    const closeDropdown = () => setIsSortOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [isSortOpen]);

  const newArrivals = useMemo(() => {
    let items = [...liveArrivals];

    // Filter by Category Selection
    if (selectedCategory !== 'All') {
      items = items.filter(p => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
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
        items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'alpha-desc':
        items.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
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
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'date-asc':
      case 'date-desc':
      case 'best-selling':
      case 'relevance':
      case 'featured':
      default:
        break;
    }

    return items;
  }, [liveArrivals, selectedCategory, searchQuery, selectedSort]);

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



      {/* 3. Filter & Search Controls (Flexed in Single Row) */}
      <section className={styles['controls-section']} id="new-arrivals-explore">
        <div className={styles['controls-toolbar']}>
          {/* Categories Tabs */}
          <div className={styles['category-tabs']}>
            {['All', 'Everyday Elegance', 'Festive Glow', 'Style Studio', 'Black Magic'].map(cat => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  className={`${styles['category-tab-btn']} ${isSelected ? styles['active-tab'] : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  type="button"
                >
                  {cat === 'All' ? 'All Pieces' : cat}
                </button>
              );
            })}
          </div>

          <div className={styles['actions-group']}>
            {/* Search Bar */}
            <div className={styles['search-bar-box']}>
              <Search size={15} className={styles['search-icon']} />
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
                  title="Clear search"
                >
                  ✕
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className={styles['sort-selector']}>
              <span>SORT BY:</span>
              <div className={styles['custom-dropdown-container']}>
                <button 
                  className={styles['dropdown-trigger-btn']}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSortOpen(!isSortOpen);
                  }}
                >
                  <span className={styles['dropdown-text-truncate']}>
                    {SORT_OPTIONS.find(opt => opt.value === selectedSort)?.label || 'Featured'}
                  </span>
                  <ChevronDown size={14} className={`${styles['chevron-icon']} ${isSortOpen ? styles['open'] : ''}`} />
                </button>
                {isSortOpen && (
                  <div className={styles['dropdown-options-menu']}>
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`${styles['dropdown-option-item']} ${selectedSort === option.value ? styles['selected'] : ''}`}
                        onClick={() => {
                          setSelectedSort(option.value);
                          setIsSortOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Grid Section */}
      <section className={styles['products-section']}>
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
                  onClick={() => setVisibleCount(newArrivals.length)}
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
