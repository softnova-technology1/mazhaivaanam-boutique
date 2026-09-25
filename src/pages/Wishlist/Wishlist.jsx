import { getOptimizedImageUrl } from '../../utils/imageUtils';
import { useState, useEffect } from 'react';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { getProducts } from '../../services/api';
import { Heart, TrendingDown, ArrowRight, Sparkles, X, Award, Truck, Video, RotateCcw } from 'lucide-react';
import styles from './Wishlist.module.css';

export const Wishlist = ({ setCurrentTab, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const { wishlist: wishlistItems, removeFromWishlist } = useWishlist();
  const [toastMessage, setToastMessage] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    getProducts({ limit: 12 })
      .then(res => {
        if (res && res.products && res.products.length > 0) {
          setRecommendedProducts(res.products);
        }
      })
      .catch(err => console.error('Error fetching recommended products:', err));
  }, []);

  const handleRemoveFromWishlist = (productId, productName) => {
    removeFromWishlist(productId);
    setToastMessage(`Removed "${productName}" from Wishlist.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setToastMessage(`"${product.name}" added to Trousseau!`);
    if (setCurrentTab) {
      window.history.pushState(null, '', '/cart');
      setCurrentTab('cart');
    }
  };

  const handleProductClick = (product) => {
    if (setSelectedProduct && setCurrentTab) {
      setSelectedProduct(product);
      setCurrentTab('product-detail');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Calculations for stats
  const totalItems = wishlistItems.length;
  const wishlistValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const priceDropsCount = wishlistItems.filter(item => item.oldPrice && item.oldPrice > item.price).length;

  // Star positions for background decoration
  const starPositions = [
    { left: '11.66%', top: '89.5%', size: 16 }, { left: '41.66%', top: '44.5%', size: 16 },
    { left: '75.0%', top: '54.5%', size: 16 }, { left: '21.66%', top: '86%', size: 12 },
    { left: '53.33%', top: '91%', size: 12 }, { left: '86.66%', top: '81%', size: 12 },
    { left: '15.0%', top: '66%', size: 12 }, { left: '61.66%', top: '66%', size: 12 },
    { left: '30.0%', top: '7.5%', size: 8 }, { left: '80.0%', top: '92.5%', size: 8 },
    { left: '5.0%', top: '40%', size: 3, isDot: true }, { left: '31.66%', top: '30%', size: 3, isDot: true },
    { left: '55.0%', top: '90%', size: 3, isDot: true }, { left: '88.33%', top: '90%', size: 3, isDot: true }
  ];

  return (
    <div className={styles['wishlist-page-container']}>
      {/* Toast notifications */}
      {toastMessage && (
        <div className={styles['wishlist-toast']}>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main padded content container */}
      <div className={styles['wishlist-content-wrapper']}>

        {/* Statistics section */}
        <section className={styles['stats-section']}>
          <div className={styles['stats-card']}>
            <div className={styles['stats-fill-wave']}></div>
            <div className={styles['stats-icon-badge']}>
              <Heart size={18} className={styles['stats-icon']} />
            </div>
            <span className={styles['stats-lbl']}>TOTAL ITEMS</span>
            <span className={styles['stats-val']}>{totalItems.toString().padStart(2, '0')}</span>
          </div>
          <div className={styles['stats-card']}>
            <div className={styles['stats-fill-wave']}></div>
            <div className={styles['stats-icon-badge']}>
              <Sparkles size={18} className={styles['stats-icon']} />
            </div>
            <span className={styles['stats-lbl']}>WISHLIST VALUE</span>
            <span className={styles['stats-val']}>{formatCurrency(wishlistValue)}</span>
          </div>
          <div className={styles['stats-card']}>
            <div className={styles['stats-fill-wave']}></div>
            <div className={styles['stats-icon-badge']}>
              <TrendingDown size={18} className={styles['stats-icon']} />
            </div>
            <span className={styles['stats-lbl']}>PRICE DROPS</span>
            <span className={styles['stats-val']}>{priceDropsCount.toString().padStart(2, '0')}</span>
          </div>

          {/* Interactive Stars Layer */}
          <div className={styles['sparkle-stars-layer']}>
            {starPositions.map((pos, i) => (
              <div 
                key={i} 
                className={`${styles['interactive-star']} ${pos.isDot ? styles['is-dot'] : ''}`}
                style={{ left: pos.left, top: pos.top, width: pos.size, height: pos.size }}
              >
                {!pos.isDot && (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z" fill="#b5893d"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Main Wishlist Grid */}
        <section className={styles['main-grid-section']}>
          <div className={styles['section-heading-bar']}>
            <h3>Handpicked Favorites</h3>
          </div>

          {wishlistItems.length === 0 ? (
            <div className={styles['empty-fallback-box']}>
              <Heart size={48} strokeWidth={1} className={styles['empty-heart']} />
              <h4>Your Collection is Empty</h4>
              <p>Begin curating your dream trousseau by adding your favorite handwoven sarees from our catalog.</p>
              <button 
                className={styles['explore-weaves-btn']}
                onClick={() => setCurrentTab('shop')}
              >
                EXPLORE OUR WEAVES
              </button>
            </div>
          ) : (
            <div className={styles['wishlist-grid']}>
              {wishlistItems.map((item) => {
                const hasDrop = item.oldPrice && item.oldPrice > item.price;
                
                return (
                  <div key={item.id || item._id} className={styles['product-card']}>
                    {/* Remove Close Button - Top Right */}
                    <button 
                      className={styles['remove-card-btn']} 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromWishlist(item.id || item._id, item.name);
                      }}
                      title="Remove from Wishlist"
                    >
                      <X size={15} />
                    </button>

                    <div className={styles['product-image-container']} onClick={() => handleProductClick(item)}>
                      {hasDrop && <div className={styles['discount-badge']}>{Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF</div>}
                      <img src={getOptimizedImageUrl(item.image || item.images?.[0]?.url || 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/saree1.png')} alt={item.name} className={styles['product-image']} />
                    </div>
                    <div className={styles['product-info']}>
                      <h3 className={styles['product-name']} onClick={() => handleProductClick(item)}>
                        {item.name}
                      </h3>
                      <p className={styles['product-desc']}>{item.description || item.shortDescription || 'Elegant handcrafted saree perfect for special occasions.'}</p>
                      
                      <div className={styles['product-price-row']}>
                        <span className={styles['current-price']}>{formatCurrency(item.price)}</span>
                        {hasDrop && <span className={styles['old-price']}>{formatCurrency(item.oldPrice)}</span>}
                      </div>
                      <div 
                        role="button" 
                        className={styles['prebook-btn']} 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                      >
                        ADD TO BAG
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recommended Carousel */}
        {recommendedProducts.length > 0 && (
          <section className={styles['recommended-section']}>
            <div className={styles['recommended-header']}>
              <h3>Recommended For You</h3>
            </div>

            <div className={styles['marquee-wrapper']}>
              <div className={styles['recommended-grid']}>
                {[...recommendedProducts, ...recommendedProducts].map((rec, index) => (
                  <div key={`${rec.id || rec._id}-${index}`} className={styles['rec-card']}>
                    <div className={styles['rec-image-box']}>
                      <img src={getOptimizedImageUrl(rec.image || rec.images?.[0]?.url || 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/saree1.png')} 
                        alt={rec.name} 
                        className={styles['rec-img']}
                        onClick={() => handleProductClick(rec)}
                      />
                    </div>
                    <h5 onClick={() => handleProductClick(rec)}>{rec.name}</h5>
                    <p className={styles['rec-price']}>{formatCurrency(rec.price)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div> {/* Closing wishlist-content-wrapper */}

      {/* Full-Width Edge-to-Edge Parallax Wardrobe Banner */}
      <section className={styles['wardrobe-banner-section']}>
        <div className={styles['wardrobe-banner-overlay']} />
        <div className={styles['wardrobe-banner-content']}>
          <span className={styles['wardrobe-subtitle']}>THE MAZHAI VAANAM ATELIER</span>
          <h3>Curate Your Entire Wardrobe</h3>
          <div className={styles['wardrobe-gold-divider']}>
            <Sparkles size={16} className={styles['wardrobe-sparkle']} />
          </div>
          <p>Explore our latest arrivals in Silk, Cotton, and Bridal couture. Handcrafted specifically for the connoisseur of heritage.</p>
          <button 
            className={`${styles['wardrobe-discover-btn']} pill-btn`}
            onClick={() => setCurrentTab('shop')}
          >
            <span>DISCOVER NEW ARRIVALS</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Trust & Heritage Service Badges Section */}
      <section className={styles['trust-badges-section']}>
        <div className={styles['trust-badges-header']}>
          <span className={styles['trust-subtitle']}>THE MAZHAI VAANAM ASSURANCE</span>
          <h3>Heritage Service &amp; Quality Guarantee</h3>
        </div>

        <div className={styles['trust-badges-container']}>
          <div className={styles['trust-badge-card']}>
            <div className={styles['trust-badge-icon-box']}>
              <Award size={26} className={styles['trust-badge-icon']} />
            </div>
            <h4>100% Silk Mark Certified</h4>
            <p>Authentic pure Kanchipuram &amp; Banarasi silk handwoven by master heritage weavers.</p>
          </div>

          <div className={styles['trust-badge-card']}>
            <div className={styles['trust-badge-icon-box']}>
              <Truck size={26} className={styles['trust-badge-icon']} />
            </div>
            <h4>Free Insured Shipping</h4>
            <p>Complimentary express shipping across India and fully insured global delivery.</p>
          </div>

          <div className={styles['trust-badge-card']}>
            <div className={styles['trust-badge-icon-box']}>
              <Video size={26} className={styles['trust-badge-icon']} />
            </div>
            <h4>Live Video Shopping</h4>
            <p>Schedule a personalized 1-on-1 video call to view sarees live with our stylists.</p>
          </div>

          <div className={styles['trust-badge-card']}>
            <div className={styles['trust-badge-icon-box']}>
              <RotateCcw size={26} className={styles['trust-badge-icon']} />
            </div>
            <h4>Hassle-Free 7-Day Returns</h4>
            <p>Easy 7-day return and exchange policy for complete confidence in your purchase.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
