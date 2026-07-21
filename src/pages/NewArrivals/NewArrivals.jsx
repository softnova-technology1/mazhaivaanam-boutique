import React, { useState, useMemo } from 'react';
import { ALL_PRODUCTS } from '../Catalog/Catalog';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { Search, ChevronDown } from 'lucide-react';
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
        p.name.toLowerCase().includes(query) || 
        p.fabric.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      );
    }

    // Sort Logic
    if (selectedSort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      items.sort((a, b) => b.rating - a.rating);
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
          <h1>New Arrivals</h1>
          <p>Discover our newest handwoven additions curated for seasonal celebrations and timeless beauty.</p>
          <div className={styles['hero-actions']}>
            <button 
              className={styles['btn-explore']}
              onClick={() => {
                const element = document.getElementById('new-arrivals-explore');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              EXPLORE NEW PIECES
            </button>
            <button 
              className={styles['btn-custom']}
              onClick={() => setCurrentTab && setCurrentTab('about')}
            >
              OUR ARTISAN STORIES
            </button>
          </div>
        </div>
      </header>

      {/* 2. Artisan Spotlight Section */}
      <section className={styles['spotlight-section']}>
        <div className="container">
          <div className={styles['spotlight-box']}>
            <span className={styles['spotlight-tag']}>CRAFT SPOTLIGHT</span>
            <h3>The Heritage of Kanchipuram</h3>
            <p className={styles['spotlight-quote']}>
              “Every thread we weave holds the breath of our ancestors, and every motif tells a story of devotion and timeless beauty.”
            </p>
            <span className={styles['spotlight-author']}>— Master Weaver, Kanchipuram Weavers Association</span>
          </div>
        </div>
      </section>

      {/* 3. Filter & Search Controls */}
      <section className="container" id="new-arrivals-explore" style={{ padding: '40px 0 20px 0' }}>
        <div className={styles['filter-search-container']}>
          <div className={styles['filter-pills']}>
            {['All', 'Silk', 'Cotton', 'Banarasi', 'Organza'].map(cat => (
              <button
                key={cat}
                className={`${styles['filter-pill']} ${selectedCategory === cat ? styles['active-pill'] : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className={styles['search-bar-box']}>
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

          {/* Sort Selector */}
          <div className={styles['sort-selector']}>
            <span>SORT BY:</span>
            <div className={styles['custom-dropdown-container']}>
              <button 
                className={styles['dropdown-trigger-btn']} 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSortOpen(!isSortOpen);
                }}
                type="button"
              >
                {selectedSort === 'featured' && 'RELEVANCE'}
                {selectedSort === 'price-low' && 'PRICE: LOW TO HIGH'}
                {selectedSort === 'price-high' && 'PRICE: HIGH TO LOW'}
                {selectedSort === 'rating' && 'PATRON RATING'}
                <ChevronDown size={14} className={`${styles['chevron-icon']} ${isSortOpen ? styles['open'] : ''}`} />
              </button>
              {isSortOpen && (
                <div className={styles['dropdown-options-menu']}>
                  <button
                    className={`${styles['dropdown-option-item']} ${selectedSort === 'featured' ? styles['active'] : ''}`}
                    onClick={() => setSelectedSort('featured')}
                    type="button"
                  >
                    RELEVANCE
                  </button>
                  <button
                    className={`${styles['dropdown-option-item']} ${selectedSort === 'price-low' ? styles['active'] : ''}`}
                    onClick={() => setSelectedSort('price-low')}
                    type="button"
                  >
                    PRICE: LOW TO HIGH
                  </button>
                  <button
                    className={`${styles['dropdown-option-item']} ${selectedSort === 'price-high' ? styles['active'] : ''}`}
                    onClick={() => setSelectedSort('price-high')}
                    type="button"
                  >
                    PRICE: HIGH TO LOW
                  </button>
                  <button
                    className={`${styles['dropdown-option-item']} ${selectedSort === 'rating' ? styles['active'] : ''}`}
                    onClick={() => setSelectedSort('rating')}
                    type="button"
                  >
                    PATRON RATING
                  </button>
                </div>
              )}
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

    </div>
  );
};
