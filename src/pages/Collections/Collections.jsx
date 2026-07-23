import React from 'react';
import styles from './Collections.module.css';

const COLLECTIONS = [
  { id: 'silk', label: 'Silk Sarees', image: '/Images/saree1.png', gridClass: 'card-wide', subtitle: 'HERITAGE SILKS' },
  { id: 'kanchipuram', label: 'Kanchipuram Silk', image: '/Images/saree11.png', gridClass: 'card-tall', subtitle: 'ROYAL WEAVES' },
  { id: 'banarasi', label: 'Banarasi', image: '/Images/saree12.png', gridClass: 'card-half', subtitle: 'VARANASI BROCADES' },
  { id: 'cotton', label: 'Cotton Sarees', image: '/Images/saree2.png', gridClass: 'card-half', subtitle: 'FINE HANDLOOM' },
  { id: 'organza', label: 'Organza', image: '/Images/saree6.png', gridClass: 'card-equal', subtitle: 'SHEER GRACE' },
  { id: 'designer', label: 'Designer Sarees', image: '/Images/saree7.png', gridClass: 'card-equal', subtitle: 'MODERN EDITS' }
];

export const Collections = ({ setCurrentTab, setCatalogFilter }) => {
  const handleCollectionClick = (label) => {
    if (setCatalogFilter) {
      setCatalogFilter({ category: label, occasion: '', label: label });
    }
    setCurrentTab('catalog');
  };

  return (
    <div className={styles['collections-page']}>
      <div className={styles.hero}>
        <div className={styles['hero-content']}>
          <h1>A Collection for Every Occasion</h1>
          <p>Discover thoughtfully curated saree collections, from breathable cottons and graceful linens to luxurious silks and festive weaves. Find the perfect saree for every celebration and every moment.</p>
        </div>
      </div>
      
      <div className="container" style={{ padding: '80px 0 0 0' }}>
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
            {/* Weave 1: Kanchipuram */}
            <div className={styles['guide-row']}>
              <div className={styles['guide-image-box']}>
                <img 
                  src="/Images/saree12.png" 
                  alt="Kanchipuram Silk Saree" 
                />
              </div>
              <div className={styles['guide-text-box']}>
                <span className={styles['weave-badge']}>THE QUEEN OF SILKS</span>
                <h3>Kanchipuram Silk</h3>
                <p>
                  Handwoven in the temple towns of Tamil Nadu, Kanchipuram sarees are renowned for their heavy double-warp mulberry silk threads and contrasting solid borders. 
                  The body and border are woven separately and then joined with a zig-zag interlocking weave (known as *korvai*), guaranteeing unmatched durability.
                </p>
                <div className={styles['weave-specs']}>
                  <p><strong>Fabric:</strong> Double-warp Pure Mulberry Silk</p>
                  <p><strong>Accent:</strong> Certified 24k Gold &amp; Silver Zari</p>
                  <p><strong>Ideal For:</strong> Weddings, Bridal Trousseau</p>
                </div>
                <button 
                  className={styles['guide-cta-btn']}
                  onClick={() => handleCollectionClick('Kanchipuram Silk')}
                >
                  EXPLORE KANCHIPURAM →
                </button>
              </div>
            </div>

            {/* Weave 2: Banarasi */}
            <div className={`${styles['guide-row']} ${styles['row-reverse']}`}>
              <div className={styles['guide-image-box']}>
                <img 
                  src="/Images/saree13.png" 
                  alt="Banarasi Silk Saree" 
                />
              </div>
              <div className={styles['guide-text-box']}>
                <span className={styles['weave-badge']}>IMPERIAL BROCADES</span>
                <h3>Banarasi Silk</h3>
                <p>
                  Originating from the holy city of Varanasi, Banarasi sarees are famous for their gold and silver brocade work. 
                  Master artisans weave intricate floral lattices (*jaal*) and foliage motifs into heavy silk, creating a metallic, regal weight that drapes beautifully.
                </p>
                <div className={styles['weave-specs']}>
                  <p><strong>Fabric:</strong> Pure Mulberry Katan Silk</p>
                  <p><strong>Accent:</strong> Heavy Metallic Zari Brocade</p>
                  <p><strong>Ideal For:</strong> Receptions, Galas, Festivities</p>
                </div>
                <button 
                  className={styles['guide-cta-btn']}
                  onClick={() => handleCollectionClick('Banarasi')}
                >
                  EXPLORE BANARASI →
                </button>
              </div>
            </div>

            {/* Weave 3: Organza & Tussar */}
            <div className={styles['guide-row']}>
              <div className={styles['guide-image-box']}>
                <img 
                  src="/Images/saree6.png" 
                  alt="Organza Saree" 
                />
              </div>
              <div className={styles['guide-text-box']}>
                <span className={styles['weave-badge']}>SHEER ELEGANCE</span>
                <h3>Organza &amp; Tussar</h3>
                <p>
                  For the modern patron, our Organza and Tussar collection blends sheer transparency with structured drape. 
                  Lightweight and airy, these sarees feature delicate silver thread borders, natural textured weaves, and hand-painted pastel details.
                </p>
                <div className={styles['weave-specs']}>
                  <p><strong>Fabric:</strong> Sheer Fine Silk &amp; Tussar Blend</p>
                  <p><strong>Accent:</strong> Subtle Zari Borders, Handpaint</p>
                  <p><strong>Ideal For:</strong> Evening Parties, Receptions</p>
                </div>
                <button 
                  className={styles['guide-cta-btn']}
                  onClick={() => handleCollectionClick('Organza')}
                >
                  EXPLORE ORGANZA →
                </button>
              </div>
            </div>

            {/* Weave 4: Fine Cotton */}
            <div className={`${styles['guide-row']} ${styles['row-reverse']}`}>
              <div className={styles['guide-image-box']}>
                <img 
                  src="/Images/saree2.png" 
                  alt="Cotton Saree" 
                />
              </div>
              <div className={styles['guide-text-box']}>
                <span className={styles['weave-badge']}>BREATHABLE HERITAGE</span>
                <h3>Fine Cotton Looms</h3>
                <p>
                  Handcrafted from premium organic cotton fibers, our cotton collection celebrates comfortable luxury. 
                  Woven on traditional frame looms, these sarees feature subtle textures, minimal borders, and natural dyes that breathe easily in the warmest climates.
                </p>
                <div className={styles['weave-specs']}>
                  <p><strong>Fabric:</strong> Fine Organic Handloom Cotton</p>
                  <p><strong>Accent:</strong> Thread-work borders, Minimal Zari</p>
                  <p><strong>Ideal For:</strong> Daily Wear, Daytime Festivals</p>
                </div>
                <button 
                  className={styles['guide-cta-btn']}
                  onClick={() => handleCollectionClick('Cotton')}
                >
                  EXPLORE COTTON →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
