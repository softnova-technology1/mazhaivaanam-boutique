import React from 'react';
import styles from './Occasions.module.css';

const OCCASIONS = [
  { id: 'wedding', label: 'Wedding', image: 'https://images.unsplash.com/photo-1583391733958-d15f0d32b1d5?auto=format&fit=crop&w=600&q=80' },
  { id: 'reception', label: 'Reception', image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80' },
  { id: 'engagement', label: 'Engagement', image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=80' },
  { id: 'festival', label: 'Festival', image: 'https://images.unsplash.com/photo-1606293459209-64d84f8d55a9?auto=format&fit=crop&w=600&q=80' },
  { id: 'party', label: 'Party Wear', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80' },
  { id: 'casual', label: 'Casual Wear', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' }
];

export const Occasions = ({ setCurrentTab, setCatalogFilter }) => {
  const handleOccasionClick = (label) => {
    if (setCatalogFilter) {
      setCatalogFilter({ category: '', occasion: label, label: label });
    }
    setCurrentTab('catalog');
  };

  return (
    <div className={styles['occasions-page']}>
      <div className={styles.hero}>
        <div className={styles['hero-content']}>
          <h1>Shop by Occasion</h1>
          <p>Find the perfect attire for every milestone and celebration.</p>
        </div>
      </div>
      
      <div className="container" style={{ padding: '80px 0' }}>
        <div className={styles['occasions-grid']}>
          {OCCASIONS.map(occasion => (
            <div 
              key={occasion.id} 
              className={styles['occasion-card']}
              onClick={() => handleOccasionClick(occasion.label)}
            >
              <img src={occasion.image} alt={occasion.label} />
              <div className={styles['card-overlay']}>
                <h2>{occasion.label}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
