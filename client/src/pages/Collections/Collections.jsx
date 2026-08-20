import React from 'react';
import styles from './Collections.module.css';

const COLLECTIONS = [
  { id: 'everyday-elegance', label: 'Everyday Elegance', image: '/Images/saree1.png', gridClass: 'card-wide', subtitle: 'CASUAL & CHIC' },
  { id: 'festive-glow', label: 'Festive Glow', image: '/Images/silk1.png', gridClass: 'card-tall', subtitle: 'CELEBRATION READY' },
  { id: 'style-studio', label: 'Style Studio', image: '/Images/fancy1.png', gridClass: 'card-half', subtitle: 'MODERN TRENDS' },
  { id: 'black-magic', label: 'Black Magic', image: '/Images/black1.png', gridClass: 'card-half', subtitle: 'BOLD & BEAUTIFUL' }
];

export const Collections = ({ setCurrentTab, setCatalogFilter }) => {
  const handleCollectionClick = (label) => {
    if (setCatalogFilter) {
      setCatalogFilter({ category: label, occasion: '', label: label });
    }
    setCurrentTab('catalog');
    
    // Wait for Catalog to render, then scroll specifically to the product grid section
    setTimeout(() => {
      document.getElementById('catalog-products-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={styles['collections-page']}>
      <div className="container" style={{ padding: '20px 0 0 0' }}>
        <div className={styles['guide-header']} style={{ marginBottom: '60px' }}>
          <span className={styles['guide-tag']}>OUR COLLECTIONS</span>
          <h1 className={styles['collection-page-main-title']}>
            A Collection for Every Occasion
          </h1>
          <p style={{ maxWidth: '800px', textAlign: 'center', margin: '0 auto 24px auto', color: 'var(--text-muted)' }}>
            Discover thoughtfully curated collections, from casual chic and modern trends to bold statements and festive wear. Find the perfect ensemble for every celebration and every moment.
          </p>
          <div className={styles['divider']} />
        </div>
        <div className={styles['collections-grid']}>
          {COLLECTIONS.map(collection => (
            <div 
              key={collection.id} 
              className={`${styles['collection-card']} ${styles[collection.gridClass]}`}
              onClick={() => handleCollectionClick(collection.label)}
            >
              <img src={collection.image} alt={collection.label} />
              <div className={styles['card-overlay']}>
                <div className={styles['glass-plate']}>
                  <div className={styles['glass-text']}>
                    <span>{collection.subtitle}</span>
                    <h2>{collection.label}</h2>
                  </div>
                  <div className={styles['glass-arrow']}>→</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atelier Guide Section */}
      <section className={styles['guide-section']}>
        <div className="container">
          <div className={styles['guide-header']}>
            <span className={styles['guide-tag']}>ATELIER JOURNAL</span>
            <h2>Atelier Guide: Understanding Our Weaves</h2>
            <div className={styles['divider']} />
            <p className={styles['guide-intro']}>
              A curation of traditional craftsmanship, characterized by regional heritage, fine fibers, and time-honored weaving techniques.
            </p>
          </div>

          <div className={styles['guide-timeline']}>
            {/* Collection 1: Everyday Elegance */}
            <div className={styles['guide-row']}>
              <div className={styles['guide-image-box']}>
                <img 
                  src="/Images/everyday.png" 
                  alt="Everyday Elegance" 
                />
              </div>
              <div className={styles['guide-text-box']}>
                <span className={styles['weave-badge']}>CASUAL & CHIC</span>
                <h3>Everyday Elegance</h3>
                <p>
                  Discover the perfect blend of comfort and style for your daily wear. These sarees are handpicked to provide effortless grace and breathable comfort, keeping you elegantly draped throughout your busy day without compromising on tradition.
                </p>
                <div className={styles['weave-specs']}>
                  <p><strong>Focus:</strong> Comfort & Easy Drape</p>
                  <p><strong>Vibe:</strong> Subtle Elegance</p>
                  <p><strong>Ideal For:</strong> Daily Wear, Office, Casual Outings</p>
                </div>
                <button 
                  className={styles['guide-cta-btn']}
                  onClick={() => handleCollectionClick('Everyday Elegance')}
                >
                  EXPLORE EVERYDAY ELEGANCE →
                </button>
              </div>
            </div>

            {/* Collection 2: Festive Glow */}
            <div className={`${styles['guide-row']} ${styles['row-reverse']}`}>
              <div className={styles['guide-image-box']}>
                <img 
                  src="/Images/festival1.png" 
                  alt="Festive Glow" 
                />
              </div>
              <div className={styles['guide-text-box']}>
                <span className={styles['weave-badge']}>CELEBRATION READY</span>
                <h3>Festive Glow</h3>
                <p>
                  Illuminate every celebration with our Festive Glow collection. Rich fabrics, intricate zari work, and vibrant festive colors come together beautifully to make you the center of attention at every auspicious occasion and celebration.
                </p>
                <div className={styles['weave-specs']}>
                  <p><strong>Focus:</strong> Rich Embellishments</p>
                  <p><strong>Vibe:</strong> Vibrant & Celebratory</p>
                  <p><strong>Ideal For:</strong> Weddings, Festivals, Grand Functions</p>
                </div>
                <button 
                  className={styles['guide-cta-btn']}
                  onClick={() => handleCollectionClick('Festive Glow')}
                >
                  EXPLORE FESTIVE GLOW →
                </button>
              </div>
            </div>

            {/* Collection 3: Style Studio */}
            <div className={styles['guide-row']}>
              <div className={styles['guide-image-box']}>
                <img 
                  src="/Images/style1.png" 
                  alt="Style Studio" 
                />
              </div>
              <div className={styles['guide-text-box']}>
                <span className={styles['weave-badge']}>MODERN TRENDS</span>
                <h3>Style Studio</h3>
                <p>
                  Step into the modern era of saree draping. The Style Studio collection features contemporary designs, unique geometric patterns, and trendy motifs specially designed for the modern, fashion-forward woman who loves to experiment.
                </p>
                <div className={styles['weave-specs']}>
                  <p><strong>Focus:</strong> Contemporary Designs</p>
                  <p><strong>Vibe:</strong> Trendy & Fashion-forward</p>
                  <p><strong>Ideal For:</strong> Parties, Social Events, Fashion Shows</p>
                </div>
                <button 
                  className={styles['guide-cta-btn']}
                  onClick={() => handleCollectionClick('Style Studio')}
                >
                  EXPLORE STYLE STUDIO →
                </button>
              </div>
            </div>

            {/* Collection 4: Black Magic */}
            <div className={`${styles['guide-row']} ${styles['row-reverse']}`}>
              <div className={styles['guide-image-box']}>
                <img 
                  src="/Images/black-shop.png" 
                  alt="Black Magic" 
                />
              </div>
              <div className={styles['guide-text-box']}>
                <span className={styles['weave-badge']}>BOLD & BEAUTIFUL</span>
                <h3>Black Magic</h3>
                <p>
                  Embrace the bold and mysterious allure of black. A carefully curated selection of stunning dark-hued masterpieces that offer an unmatched statement of sophistication, power, and unapologetic glamour for your special evening events.
                </p>
                <div className={styles['weave-specs']}>
                  <p><strong>Focus:</strong> Dark Hues & Contrast Accents</p>
                  <p><strong>Vibe:</strong> Sophisticated & Powerful</p>
                  <p><strong>Ideal For:</strong> Cocktail Parties, Evening Galas, Receptions</p>
                </div>
                <button 
                  className={styles['guide-cta-btn']}
                  onClick={() => handleCollectionClick('Black Magic')}
                >
                  EXPLORE BLACK MAGIC →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
