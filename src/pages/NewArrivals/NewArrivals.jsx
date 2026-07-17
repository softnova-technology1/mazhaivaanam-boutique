import React, { useMemo } from 'react';
import { ALL_PRODUCTS } from '../Catalog/Catalog';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import styles from './NewArrivals.module.css';

export const NewArrivals = ({ setCurrentTab, setSelectedProduct }) => {
  const newArrivals = useMemo(() => {
    // Try to get explicit new arrivals, otherwise just take the first 8 items for demo
    const newItems = ALL_PRODUCTS.filter(p => p.tag === 'NEW ARRIVAL');
    return newItems.length > 0 ? newItems : ALL_PRODUCTS.slice(0, 8);
  }, []);

  return (
    <div className={styles['new-arrivals-page']}>
      <div className={styles.hero}>
        <div className={styles['hero-content']}>
          <h1>New Arrivals</h1>
          <p>Discover the latest additions to our heirloom collection.</p>
        </div>
      </div>
      
      <div className="container" style={{ padding: '80px 0' }}>
        <div className={styles['product-grid']}>
          {newArrivals.map(product => (
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
      </div>
    </div>
  );
};
