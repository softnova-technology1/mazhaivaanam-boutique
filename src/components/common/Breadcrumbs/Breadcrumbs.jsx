import React from 'react';
import styles from './Breadcrumbs.module.css';

const BREADCRUMB_MAP = {
  'about': 'Our Story',
  'contact': 'Contact Us',
  'cart': 'Shopping Bag',
  'login': 'Account',
  'wishlist': 'Wishlist',
  'checkout': 'Checkout',
  'my-orders': 'My Orders',
  'track-order': 'Track Order',
  'support': 'Customer Support',
  'privacy': 'Privacy Policy',
  'returns': 'Return & Refund Policy',
  'terms': 'Terms & Conditions',
  'limited-offer': 'Limited Offer',
  'new-arrivals': 'New Arrivals',
  'best-sellers': 'Best Sellers',
  'collections': 'Collections',
  'pre-booking': 'Pre Booking Collections',
  'shipping-policy': 'Shipping Charges',
  'my-profile': 'My Profile',
  'saved-address': 'Saved Address',
  'gift-cards': 'Gift Cards',
  'catalog': 'Shop',
};

const OVERLAY_TABS = [
  'about',
  'contact',
  'catalog',
  'new-arrivals',
  'track-order',
  'limited-offer',
  'privacy',
  'terms',
  'shipping-policy',
  'returns',
  'support'
];

export const Breadcrumbs = ({ 
  currentTab, 
  setCurrentTab, 
  catalogFilter, 
  setCatalogFilter, 
  selectedProduct 
}) => {
  if (currentTab === 'shop' || currentTab === 'product-detail') return null;

  const handleHomeClick = () => {
    if (setCurrentTab) {
      setCurrentTab('shop');
    }
  };

  const handleShopClick = () => {
    if (setCatalogFilter) {
      setCatalogFilter({ category: '', occasion: '', label: 'All Collections' });
    }
    if (setCurrentTab) {
      setCurrentTab('catalog');
    }
  };

  const renderBreadcrumbs = () => {
    const separator = <span className={styles['breadcrumb-separator']}>/</span>;

    // Home link is always first
    const homeLink = (
      <span key="home" className={styles['breadcrumb-link']} onClick={handleHomeClick}>
        Home
      </span>
    );

    if (currentTab === 'catalog') {
      const category = catalogFilter?.category;
      if (category && category !== 'All') {
        return (
          <>
            {homeLink}
            {separator}
            <span className={styles['breadcrumb-link']} onClick={handleShopClick}>
              Shop
            </span>
            {separator}
            <span className={styles['breadcrumb-current']}>{category}</span>
          </>
        );
      }
      return (
        <>
          {homeLink}
          {separator}
          <span className={styles['breadcrumb-current']}>Shop</span>
        </>
      );
    }

    if (currentTab === 'product-detail') {
      return (
        <>
          {homeLink}
          {separator}
          <span className={styles['breadcrumb-link']} onClick={handleShopClick}>
            Shop
          </span>
          {separator}
          <span className={styles['breadcrumb-current']}>
            {selectedProduct?.name || 'Product Details'}
          </span>
        </>
      );
    }

    const label = BREADCRUMB_MAP[currentTab];
    if (label) {
      return (
        <>
          {homeLink}
          {separator}
          <span className={styles['breadcrumb-current']}>{label}</span>
        </>
      );
    }

    // Fallback if tab is not in map
    const fallbackLabel = currentTab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return (
      <>
        {homeLink}
        {separator}
        <span className={styles['breadcrumb-current']}>{fallbackLabel}</span>
      </>
    );
  };

  const isOverlay = OVERLAY_TABS.includes(currentTab);
  const isGreenTheme = [
    'catalog', 
    'pre-booking', 
    'best-sellers', 
    'collections', 
    'product-detail',
    'cart',
    'wishlist',
    'checkout',
    'login',
    'my-orders',
    'my-profile',
    'saved-address',
    'support',
    'privacy',
    'returns',
    'terms',
    'shipping-policy'
  ].includes(currentTab);

  return (
    <div className={`${styles['breadcrumb-outer']} ${isOverlay ? styles.overlay : ''} ${isGreenTheme ? styles['shop-breadcrumb'] : ''}`}>
      <div className={`container ${styles['breadcrumb-container']}`}>
        {renderBreadcrumbs()}
      </div>
    </div>
  );
};

export default Breadcrumbs;
