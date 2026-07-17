import React, { useMemo } from 'react';
import { ALL_PRODUCTS } from '../Catalog/Catalog';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import styles from './BestSellers.module.css';

export const BestSellers = ({ setCurrentTab, setSelectedProduct }) => {
  const bestSellers = useMemo(() => {
    const items = ALL_PRODUCTS.filter(p => p.tag === 'BESTSELLER' || p.rating >= 4.9);
    return items.length > 0 ? items : ALL_PRODUCTS.slice(0, 8);
  }, []);

  return (
    <div className={styles['best-sellers-page']}>
      <div className={styles.hero}>
        <div className={styles['hero-content']}>
          <h1>Best Sellers</h1>
          <p>Our most loved and sought-after heritage pieces.</p>
        </div>
      </div>
      
      <div className="container" style={{ padding: '80px 0' }}>
        <div className={styles['product-grid']}>
          {bestSellers.map(product => (
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
