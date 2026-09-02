import React, { useState } from 'react';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { ProductDetail } from '../../pages/ProductDetail/ProductDetail';
import { CartProvider } from '../../context/CartContext';
import { WishlistProvider } from '../../context/WishlistContext';
import { AuthProvider } from '../../context/AuthContext';
import { StoreConfigProvider } from '../../context/StoreConfigContext';
import { ShoppingBag, LayoutGrid, Eye, Share2, Heart } from 'lucide-react';
import catalogStyles from '../../pages/Catalog/Catalog.module.css';
import { getBadgeClass } from '../../utils/badgeHelper';
import { formatCurrency } from '../../utils/formatters';

export const ProductPreview = ({ form }) => {
  const [previewMode, setPreviewMode] = useState('shop'); // 'shop', 'normal', 'detail'

  // Map the admin form to a valid frontend product object
  const dummyProduct = {
    id: 'preview-1',
    _id: 'preview-1',
    name: form.name || 'Product Name',
    description: form.description || 'Product description will appear here.',
    price: Number(form.price) || 0,
    mrpPrice: Number(form.mrpPrice) || 0,
    oldPrice: Number(form.mrpPrice) || 0, // Frontend uses oldPrice
    image: form.imagePreview || form.imageUrl || '/Images/placeholder.svg',
    images: [
      { url: form.imagePreview || form.imageUrl || '/Images/placeholder.svg' },
      { url: form.sec1Preview || '' },
      { url: form.sec2Preview || '' }
    ].filter(img => img.url),
    category: form.category || 'Silk',
    fabric: form.fabric || 'Pure Silk',
    tag: form.tag || null,
    isFeatured: Boolean(form.isFeatured),
    isPreorder: Boolean(form.isPreorder),
    preorderDeposit: Number(form.preorderDeposit) || 0,
    preorderProgress: Number(form.preorderProgress) || 0,
    preorderWeaver: form.preorderWeaver || '',
    preorderEstimatedDays: Number(form.preorderEstimatedDays) || 0,
    preorderDiscount: form.preorderDiscount || '',
    weight: form.weight || '',
    pattern: form.pattern || '',
    pallu: form.pallu || '',
    sareeLength: form.sareeLength || '',
    blouseLength: form.blouseLength || '',
    blouse: form.blouse || '',
    height: form.height || '',
    washCare: form.washCare || '',
    returnPolicy: form.returnPolicy || '',
    note: form.note || ''
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      
      {/* Preview Header / Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
        <button
          type="button"
          onClick={() => setPreviewMode('shop')}
          style={{
            flex: 1, padding: '12px', border: 'none', background: previewMode === 'shop' ? '#fff' : 'transparent',
            borderBottom: previewMode === 'shop' ? '2px solid var(--primary)' : '2px solid transparent',
            color: previewMode === 'shop' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
        >
          <LayoutGrid size={16} /> Shop Grid
        </button>
        <button
          type="button"
          onClick={() => setPreviewMode('normal')}
          style={{
            flex: 1, padding: '12px', border: 'none', background: previewMode === 'normal' ? '#fff' : 'transparent',
            borderBottom: previewMode === 'normal' ? '2px solid var(--primary)' : '2px solid transparent',
            color: previewMode === 'normal' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
        >
          <ShoppingBag size={16} /> Single Card
        </button>
        <button
          type="button"
          onClick={() => setPreviewMode('detail')}
          style={{
            flex: 1, padding: '12px', border: 'none', background: previewMode === 'detail' ? '#fff' : 'transparent',
            borderBottom: previewMode === 'detail' ? '2px solid var(--primary)' : '2px solid transparent',
            color: previewMode === 'detail' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
        >
          <Eye size={16} /> Detail Page
        </button>
      </div>

      {/* Preview Content Area wrapped in Context Providers so frontend components work */}
      <AuthProvider>
        <StoreConfigProvider>
          <CartProvider>
            <WishlistProvider>
              <div style={{ 
                padding: previewMode === 'detail' ? 0 : 24, 
                background: previewMode === 'shop' ? '#fcfaf8' : '#fff', // match shop bg
                minHeight: 400,
                maxHeight: 600,
                overflowY: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
              }}>
                
                {previewMode === 'shop' && (
                  <div style={{ width: '100%', maxWidth: 320, padding: 20 }}>
                    <div className={catalogStyles['products-grid']} style={{ display: 'block' }}>
                      <div className={catalogStyles['product-card']} style={{ margin: '0 auto' }}>
                        {dummyProduct.oldPrice > dummyProduct.price && (
                          <span className={catalogStyles['offer-badge']}>
                            <span className={catalogStyles['offer-value']}>{Math.round(((dummyProduct.oldPrice - dummyProduct.price) / dummyProduct.oldPrice) * 100)}%</span>
                            <span className={catalogStyles['offer-text']}>OFF</span>
                          </span>
                        )}
                        <div className={catalogStyles['image-container']} style={{ cursor: 'pointer' }}>
                          <img src={dummyProduct.image} alt={dummyProduct.name} loading="lazy" />
                          {dummyProduct.tag && (
                            <span className={`${catalogStyles['badge-tag']} ${getBadgeClass(dummyProduct.tag)}`}>{dummyProduct.tag}</span>
                          )}
                          <div className={catalogStyles['share-btn']}>
                            <Share2 size={16} stroke="var(--primary-dark)" />
                          </div>
                          <div className={catalogStyles['wishlist-btn']}>
                            <Heart size={16} fill="none" stroke="var(--primary-dark)" />
                          </div>
                        </div>
                        <div className={catalogStyles['card-details']}>
                          <div className={catalogStyles['title-row']}>
                            <h4>{dummyProduct.name}</h4>
                          </div>
                          {dummyProduct.description && (
                            <p className={catalogStyles['product-description']}>
                              {dummyProduct.description}
                            </p>
                          )}
                          <div className={catalogStyles['price-row']}>
                            <span className={catalogStyles['current-price']}>{formatCurrency(dummyProduct.price)}</span>
                            {dummyProduct.oldPrice > dummyProduct.price && (
                              <span className={catalogStyles['old-price']}>{formatCurrency(dummyProduct.oldPrice)}</span>
                            )}
                          </div>
                          <button className={catalogStyles['add-cart-btn']}>
                            ADD TO CART
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewMode === 'normal' && (
                  <div style={{ width: 350, margin: '20px 0' }}>
                    <ProductCard product={dummyProduct} onClick={() => {}} />
                  </div>
                )}

                {previewMode === 'detail' && (
                  <div style={{ width: '100%', pointerEvents: 'none' /* Disable clicks in preview */ }}>
                    <ProductDetail 
                      product={dummyProduct} 
                      setCurrentTab={() => {}} 
                      setDirectCheckoutItem={() => {}} 
                      setSelectedProduct={() => {}} 
                      isPreview={true}
                    />
                  </div>
                )}

              </div>
            </WishlistProvider>
          </CartProvider>
        </StoreConfigProvider>
      </AuthProvider>
    </div>
  );
};
