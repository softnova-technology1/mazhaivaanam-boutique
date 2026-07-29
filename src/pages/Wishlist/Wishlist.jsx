import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { Heart, Star, TrendingDown, ChevronLeft, ChevronRight, Trash2, ArrowRight, Sparkles, X } from 'lucide-react';
import styles from './Wishlist.module.css';

export const Wishlist = ({ setCurrentTab, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [toastMessage, setToastMessage] = useState('');

  // Load wishlist from local storage on mount
  useEffect(() => {
    const loadWishlist = () => {
      const saved = localStorage.getItem('boutique_wishlist');
      if (saved) {
        setWishlistItems(JSON.parse(saved));
      } else {
        setWishlistItems([]);
      }
    };
    loadWishlist();

    // Listen to storage events to sync changes across tabs/components
    window.addEventListener('storage', loadWishlist);
    return () => window.removeEventListener('storage', loadWishlist);
  }, []);

  const handleRemoveFromWishlist = (productId, productName) => {
    const updated = wishlistItems.filter(item => item.id !== productId);
    localStorage.setItem('boutique_wishlist', JSON.stringify(updated));
    setWishlistItems(updated);
    // Notify Navbar and other listeners
    window.dispatchEvent(new Event('storage'));

    setToastMessage(`Removed "${productName}" Saree from Wishlist.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setToastMessage(`"${product.name}" Saree added to Trousseau!`);
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
    }).format(val);
  };

  // Calculations for stats
  const totalItems = wishlistItems.length;
  const wishlistValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
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

  // Recommended Products Data (from mockup)
  const recommendedProducts = [
    {
      id: 'rec-1',
      name: "Linen Dusk Gold",
      price: 18500,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlSHhJ16hl5EXAAvsrKn7qGHkQIZeIxXDArt4m-w5ge0gAFDtEp8WpEYeMU-S6QA1p9hbjlCWFEScPwBxWbbSK-XnVJP6dhSs5aBMxxwZr9IDpq8RTDuLJtXQ39vLCgmq_BCVYQRlpv-eA43Y78QXTxlkFmwfj2ASY-43oWi405scyVuAOS9bSbvhXhTU3gtApTW-RFvcVqrK0N35lSUMMUnFugxKiVMyuVL6KeT9Bity9qG29Gizk",
      category: "Linen Handloom",
      fabric: "Linen",
      color: "#DAA520",
      rating: 4.8,
      description: "Fine organic linen saree detailed with beautiful metallic gold zari weave boundaries."
    },
    {
      id: 'rec-2',
      name: "Emerald Forest Silk",
      price: 56000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqQ9uAJu2HmdCjmYdCKPGkkqo0SgpPpoAT0B2GHJgoBQ2tvHtAFUil77pTTxNoqMEGZmWkNLbnFTOXgpAsn7Isu3egWgAg5kUJ8D6ST8jRYjKdI6e1KM2da_B1v-Tt5DZsig4n6xkblQ1uGatsL8ELC8c4OezyMPukfQhQI-4XKwGINQSbrpWmq--hSxxAzpDDGisG324N8NLB_qmTUfglz26AmXJssTwEjzSDldkAjyhEn5b-Zaur",
      category: "Silk Saree",
      fabric: "Pure Silk",
      color: "#004D40",
      rating: 4.9,
      description: "Deep forest emerald green pure Kanchipuram silk detailed with antique style zari borders."
    },
    {
      id: 'rec-3',
      name: "Twilight Banarasi",
      price: 92000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiJugKfXFDlCKbEegEB33rTbyvDuGUg8Z-JSxJg8KXVRBHamyuMkcZBc9yWqq44xNiFQu0HFnmEOLqMOUZiy2jNz90pNZghSvAgsaISsgrmyEfXlrJIdLboKMOmNRCvckQdougWJwNqXNAp9IsEIIGXceQwz-n-UUp_xRmAGt_vWAuGmKW2Xkf-QhiTc2aXX-7JVQoH9q1BlLYm-5PgtK7hqmmAFuYzCSbasK2JknNwbkKMum49dB6",
      category: "Banarasi Silk",
      fabric: "Pure Silk",
      color: "#1A237E",
      rating: 5.0,
      description: "Atmospheric royal blue Banarasi silk saree woven with real silver threads."
    },
    {
      id: 'rec-4',
      name: "Royal Ivory Heritage",
      price: 42500,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzVvpAjotKSrt4LyLKgVej-NdCHOwz1DJCW3qLZ4Hh2eVjvwJK95t0WkF6WQ7eagxge5fW5TYYcmcMhpwnjHO__yAoZh_tV2JN7JblQyCHCcWNrF0fkV6FiEoxgiSyNzRZUyj1TWnsPVN3OYGGqNTsu_VVhHOwpZNHDzvLGpNpauz5Q3Vf2dwpdiH0y6AX_ELy6BxeoSv-FGXs9XN_HUk5wDaBQtOgKwTJvf81M1m7aJ3ppkdqeVRM",
      category: "Pure Silk",
      fabric: "Pure Silk",
      color: "#FFF9E3",
      rating: 4.7,
      description: "Regal ivory cream silk saree showing traditional motifs in metallic gold zari threads."
    }
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
          <span className={styles['sort-tag']}>SORT BY: RECENTLY ADDED</span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className={styles['empty-fallback-box']}>
            <Heart size={48} strokeWidth={1} className={styles['empty-heart']} />
            <h4>Your Collection is Empty</h4>
            <p>Begin curating your dream trousseau by adding your favorite handwoven sarees from our catalog.</p>
            <button 
              className={styles['explore-weaves-btn']}
              onClick={() => setCurrentTab('catalog')}
            >
              EXPLORE OUR WEAVES
            </button>
          </div>
        ) : (
          <div className={styles['wishlist-grid']}>
            {wishlistItems.map((item) => {
              const hasDrop = item.oldPrice && item.oldPrice > item.price;
              const savings = hasDrop ? item.oldPrice - item.price : 0;
              
              return (
                <div key={item.id} className={styles['wishlist-item-card']}>
                  {/* Remove Close Button - Top Right */}
                  <button 
                    className={`${styles['remove-card-btn']} close-btn`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.id, item.name);
                    }}
                    title="Remove from Wishlist"
                  >
                    <X size={15} />
                  </button>

                  <div className={styles['card-image-box']}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={styles['card-img']}
                      onClick={() => handleProductClick(item)}
                    />
                    
                    {/* Corner Tag - Top Left */}
                    <div className={styles['card-badge-container']}>
                      {hasDrop ? (
                        <span className={styles['price-drop-badge']}>Price Drop</span>
                      ) : item.tag ? (
                        <span className={styles['tag-badge']}>{item.tag}</span>
                      ) : (
                        <span className={styles['limited-badge']}>Limited Edition</span>
                      )}
                    </div>

                    {/* Savings Badge - Opposite side (Bottom Right) */}
                    {hasDrop && (
                      <div className={styles['card-savings-badge']}>
                        YOU SAVE {formatCurrency(savings)}
                      </div>
                    )}
                  </div>

                  <div className={styles['card-description-box']}>
                    <span className={styles['card-category']}>{item.fabric || item.category || 'Mulberry Silk'}</span>
                    <h4 onClick={() => handleProductClick(item)} style={{ cursor: 'pointer' }}>{item.name} Saree</h4>
                    <div className={styles['card-prices-row']}>
                      {hasDrop && <span className={styles['card-price-old']}>{formatCurrency(item.oldPrice)}</span>}
                      <span className={styles['card-price-current']}>{formatCurrency(item.price)}</span>
                    </div>
                    


                    <button 
                      className={styles['card-bottom-cart-btn']}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>



      {/* Recommended Carousel */}
      <section className={styles['recommended-section']}>
        <div className={styles['recommended-header']}>
          <h3>Recommended For You</h3>
          <div className={styles['carousel-arrows']}>
            <button 
              className={styles['arrow-btn']}
              onClick={() => setToastMessage("Showing previous recommendations...")}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className={styles['arrow-btn']}
              onClick={() => setToastMessage("Showing next recommendations...")}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className={styles['recommended-grid']}>
          {recommendedProducts.map((rec) => (
            <div key={rec.id} className={styles['rec-card']}>
              <div className={styles['rec-image-box']}>
                <img 
                  src={rec.image} 
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
      </section>

      {/* Recently Viewed Luxury Showcase */}
      <section className={styles['recently-viewed-section']}>
        <div className={styles['recent-section-header']}>
          <span className={styles['recent-subtitle']}>CURATED MEMORIES</span>
          <h3 className={styles['recent-title']}>Recently Viewed Weaves</h3>
          <div className={styles['recent-gold-line']} />
        </div>

        <div className={styles['recent-items-grid']}>
          <div className={styles['recent-item-card']} onClick={() => setCurrentTab('catalog')}>
            <div className={styles['recent-thumb-wrapper']}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcJblDJrLmd27oPFCauspoVqreUEA3wjnHTlpb4C-heRtyYySKX_1vzs6LTJFvRbRPl7XQgmKv-bPFKBwXNexk_43AqS2ky_9ksz6Jo0FtyBbBdW3J7jDbD0t8yJ8qpYfw-oPFHaFjVH30x1oPGLO35jTzQtIbhEad6k3K5Y_hkoQdygnK3PvJKR_gypyTxd6_eXl-lnBMhEeIl3oDtIyqsq5QLI4GMfyYBeYZfF5uYBu2NNay1CT9" 
                alt="Classic Maroon" 
                className={styles['recent-img']}
              />
            </div>
            <div className={styles['recent-info']}>
              <span className={styles['recent-category']}>PURE KANJIVARAM</span>
              <h4 className={styles['recent-name']}>Classic Maroon</h4>
              <span className={styles['recent-price']}>₹24,500</span>
            </div>
            <div className={styles['recent-arrow']}>
              <ArrowRight size={16} />
            </div>
          </div>

          <div className={styles['recent-item-card']} onClick={() => setCurrentTab('catalog')}>
            <div className={styles['recent-thumb-wrapper']}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_vcIyf5sMWsujKf0WxuZHmhTeyArEjn0Ir9r7c93HhVV7SPi5w8K0b8bf5ePlbFVQJIeC8KkzQgoUhj79NHGsW70eb6C1dMAaHUnNeMUANcvnArycmTHMk6UyyTGgVWmdHOMjvTnGmMCzHWMqxd3cWIeSclAyjVEdbE2etWGQY6OIv5j1qOaZPvYuoMBtQgj5ajrj5B-t_k6JMuyLNn-jVYW2pV76NsmvRKmyjYTep2wcdmhube5J" 
                alt="Teal Handloom" 
                className={styles['recent-img']}
              />
            </div>
            <div className={styles['recent-info']}>
              <span className={styles['recent-category']}>HANDLOOM SILK</span>
              <h4 className={styles['recent-name']}>Teal Handloom</h4>
              <span className={styles['recent-price']}>₹18,900</span>
            </div>
            <div className={styles['recent-arrow']}>
              <ArrowRight size={16} />
            </div>
          </div>

          <div className={styles['recent-item-card']} onClick={() => setCurrentTab('catalog')}>
            <div className={styles['recent-thumb-wrapper']}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBttIDSSOlda3E_xxLDP9YtTr2yl-4WMoR-Lx16sqAQ9pZ2fkrcD7sPRW9-K2Oe3WBrlgjcBFiwFEj43S9XZa3r9H9ZGQAnxCSwAm6n3Dmh_ioo9mR2pCOvn0almpibaMGhuXODDME80veh4c8EBMmKUSqIiBZfpI4f9lxYs1KQUqVk6M6pkkOX9gfoCOS0CWrmMroUkTOr77RleooJxYUDAp0T_CuWddBTCUR8J6Mjmt-j4QJm5A9H" 
                alt="Zari White" 
                className={styles['recent-img']}
              />
            </div>
            <div className={styles['recent-info']}>
              <span className={styles['recent-category']}>HERITAGE ZARI</span>
              <h4 className={styles['recent-name']}>Zari White</h4>
              <span className={styles['recent-price']}>₹31,000</span>
            </div>
            <div className={styles['recent-arrow']}>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </section>

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
            onClick={() => setCurrentTab('catalog')}
          >
            <span>DISCOVER NEW ARRIVALS</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
