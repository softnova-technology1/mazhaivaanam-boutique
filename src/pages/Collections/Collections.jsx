import React from 'react';
import styles from './Collections.module.css';

const COLLECTIONS = [
  { id: 'silk', label: 'Silk Sarees', image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80' },
  { id: 'kanchipuram', label: 'Kanchipuram Silk', image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=80' },
  { id: 'banarasi', label: 'Banarasi', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80' },
  { id: 'cotton', label: 'Cotton Sarees', image: 'https://images.unsplash.com/photo-1583391733958-d15f0d32b1d5?auto=format&fit=crop&w=600&q=80' },
  { id: 'organza', label: 'Organza', image: 'https://images.unsplash.com/photo-1606293459209-64d84f8d55a9?auto=format&fit=crop&w=600&q=80' },
  { id: 'designer', label: 'Designer Sarees', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' }
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
          <h1>Our Collections</h1>
          <p>Explore our wide range of meticulously crafted sarees, each telling a story of heritage and artistry.</p>
        </div>
      </div>
      
      <div className="container" style={{ padding: '80px 0' }}>
        <div className={styles['collections-grid']}>
          {COLLECTIONS.map(collection => (
            <div 
              key={collection.id} 
              className={styles['collection-card']}
              onClick={() => handleCollectionClick(collection.label)}
            >
              <img src={collection.image} alt={collection.label} />
              <div className={styles['card-overlay']}>
                <h2>{collection.label}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
