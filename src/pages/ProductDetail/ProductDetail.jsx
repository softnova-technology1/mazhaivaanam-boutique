import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { getBadgeClass } from '../../utils/badgeHelper';
import { Heart, Star, ShoppingBag, ArrowRight, Check, ShieldCheck, Gift, Truck, Play, Minimize, Maximize, Home, ChevronRight, ChevronLeft, Share2 } from 'lucide-react';
import { getProducts, reviewAPI } from '../../services/api';
import styles from './ProductDetail.module.css';

export const ProductDetail = ({ product, setCurrentTab, setSelectedProduct, setDirectCheckoutItem }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedHue, setSelectedHue] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Review form state with photo upload support & MongoDB Atlas Sync
  const [reviewForm, setReviewForm] = useState({ name: '', location: '', text: '', rating: 5, photo: '' });
  const [userReviews, setUserReviews] = useState([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;

    const newReview = {
      name: reviewForm.name.trim(),
      location: reviewForm.location.trim() || 'Verified Patron',
      text: reviewForm.text.trim(),
      rating: reviewForm.rating,
      photo: reviewForm.photo || '',
    };

    setReviewForm({ name: '', location: '', text: '', rating: 5, photo: '' });
    setReviewSubmitted(true);
    setShowReviewForm(false);
    setTimeout(() => setReviewSubmitted(false), 5000);

    // Save directly to MongoDB Atlas (Pending Admin Approval)
    try {
      const prodId = activeProduct._id || activeProduct.id;
      if (prodId) {
        await reviewAPI.createReview(prodId, newReview);
      }
    } catch (err) {
      console.log('Error saving review to DB:', err);
    }
  };

  // Fallback product data if none is passed (e.g. direct nav)
  const defaultProduct = {
    id: 'prod-catalog-1',
    name: "Ruby Petal",
    category: "Silk",
    fabric: "Pure Silk",
    color: "#6B102A",
    price: 13000,
    oldPrice: 15000,
    rating: 4.9,
    tag: "BESTSELLER",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-hN0onELnDgdOswyfAzJdw98YnefT7Zi-Dt0g7IxzqYuKK0TaBE4ZTit86sthNhhHWaETP5U6EPkJdQ2TF8NiA7csqXaXCMDhY3VfyoT7yodibzxkenJWfVDdPFIj9YQwTe_B2qlA3e4Sg8KUXPv4QX9GkevPmAgmVVpnY1xGSJkIONEBGz60tPRpNkxygpulKi7xC5gVJ_NCnFJG5nHKVTU98HQAfzC7nM8QYjmgbIyBBYSsnJFz",
    description: "Elegant ruby red handwoven pure silk saree adorned with heritage gold zari borders and temple motifs."
  };

  const activeProduct = product || defaultProduct;

  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Set initial images and color selection + Track Recently Viewed
  useEffect(() => {
    if (activeProduct.image) {
      setSelectedImage(activeProduct.image);
    }
    if (activeProduct.color) {
      setSelectedHue(activeProduct.color);
    }

    // Check if wishlisted
    if (activeProduct.id) {
      const saved = localStorage.getItem('boutique_wishlist');
      if (saved) {
        const wishlistItems = JSON.parse(saved);
        setIsWishlisted(wishlistItems.some(w => w.id === activeProduct.id));
      }
    }

    // Save to Recently Viewed in localStorage
    if (activeProduct.id && activeProduct.name) {
      const savedViewed = localStorage.getItem('boutique_recently_viewed');
      let viewedList = savedViewed ? JSON.parse(savedViewed) : [];
      // Remove current if exists, then prepend
      viewedList = viewedList.filter(item => item.id !== activeProduct.id);
      viewedList.unshift({
        id: activeProduct.id,
        _id: activeProduct._id || activeProduct.id,
        name: activeProduct.name,
        price: activeProduct.price,
        oldPrice: activeProduct.oldPrice,
        image: activeProduct.image,
        fabric: activeProduct.fabric,
        category: activeProduct.category,
        rating: activeProduct.rating || 4.8
      });
      // Keep up to 6 items
      viewedList = viewedList.slice(0, 6);
      localStorage.setItem('boutique_recently_viewed', JSON.stringify(viewedList));
      setRecentlyViewed(viewedList.filter(item => item.id !== activeProduct.id));
    }

    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let isMounted = true;
    const categoryParam = activeProduct.category ? { category: activeProduct.category, limit: 8 } : { limit: 8 };
    getProducts(categoryParam)
      .then(res => {
        if (isMounted && res.products) {
          setRelatedProducts(res.products.filter(p => p.id !== activeProduct.id));
        }
      })
    // Load Live Reviews for THIS specific product from MongoDB Atlas
    setUserReviews([]);
    setVisibleCount(3);
    const prodId = activeProduct._id || activeProduct.id;
    if (prodId) {
      reviewAPI.getByProduct(prodId)
        .then(dbReviews => {
          if (isMounted) {
            if (dbReviews && dbReviews.length > 0) {
              setUserReviews(dbReviews.map(r => ({
                id: r._id,
                name: r.name,
                location: r.location || 'Verified Patron',
                text: r.text,
                rating: r.rating,
                photo: r.photo || '',
                date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              })));
            } else {
              setUserReviews([]);
            }
          }
        })
        .catch(() => {
          if (isMounted) setUserReviews([]);
        });
    }

    return () => { isMounted = false; };
  }, [activeProduct]);

  // Derived calculations for price details card
  const boutiquePrice = (activeProduct.oldPrice || Math.round(activeProduct.price * 1.3)) * quantity;
  const finalPrice = activeProduct.price * quantity;
  const totalSavings = boutiquePrice - finalPrice;
  const totalDiscountPct = Math.round((totalSavings / boutiquePrice) * 100);

  // Helper to generate dynamic specifications based on fabric and category
  const getSpecs = () => {
    const category = activeProduct.category || "Silk";
    const fabric = activeProduct.fabric || "Pure Silk";

    let fabricType = "Double Warp Mulberry Silk";
    let weave = "Double Warp Kanchipuram Weave";
    let zari = "Pure 24k Gold Plated Silver Zari";
    let origin = "Kanchipuram, India";
    let weight = "850 Grams";
    let blouse = "0.8 Meters (Unstitched)";

    if (category === "Cotton" || fabric.toLowerCase().includes("cotton")) {
      fabricType = "Fine Organic Handloom Cotton";
      weave = "Traditional Jamdani Weave";
      zari = "Fine Metallic Thread Accents";
      origin = "Coimbatore, India";
      weight = "600 Grams";
      blouse = "0.8 Meters (Contrasting Cotton)";
    } else if (category === "Banarasi" || fabric.toLowerCase().includes("banarasi")) {
      fabricType = "Pure Mulberry Katan Silk";
      weave = "Banarasi Brocade Handloom Weave";
      zari = "Intricate Real Zari Weaving";
      origin = "Varanasi, India";
      weight = "950 Grams";
      blouse = "0.8 Meters (Matching Silk)";
    } else if (category === "Organza" || fabric.toLowerCase().includes("organza") || fabric.toLowerCase().includes("tussar")) {
      fabricType = "Premium Tussar & Organza Silk Blend";
      weave = "Sheer Fine Weft Craft Weaving";
      zari = "Delicate Silver Thread Borders";
      origin = "Bhagalpur, India";
      weight = "550 Grams";
      blouse = "1.0 Meters (Contrasting Silk)";
    } else if (category === "Bridal") {
      fabricType = "Thick Heavy Kanchipuram Silk";
      weave = "Triple Warp Traditional Loom Weave";
      zari = "Heavy 24k Gold Zari Threadwork";
      origin = "Kanchipuram, India";
      weight = "1100 Grams";
      blouse = "0.8 Meters (Heavy Embroidered)";
    }

    return { fabricType, weave, zari, origin, weight, blouse };
  };

  const productSpecs = getSpecs();

  // Helper to dynamically match thumbnail close-ups based on product color/category
  const getThumbnails = () => {
    const main = activeProduct.image;
    // Using local catalog images for details to prevent external link blocking
    const blueDetail = "/Images/cotton saree/0515ac1b-a928-4af5-a71c-7f5e033614e0_3aa.jpg";
    const goldDetail = "/Images/silk sarees/019afd9a-0bf9-49be-adde-9006ac3c2157_4.jpg";

    const cat = activeProduct.category || "";
    const col = activeProduct.color || "";

    if (cat === "Cotton" || col === "#C8A34D") {
      return [main, goldDetail, blueDetail];
    } else if (col === "#1A237E") {
      return [main, blueDetail, goldDetail];
    } else {
      return [main, goldDetail, blueDetail];
    }
  };

  const thumbnails = getThumbnails();

  const handleAddToCartClick = () => {
    if (activeProduct.isPreorder) {
      const preorderItem = {
        ...activeProduct,
        name: `[Pre-Order] ${activeProduct.name}`,
        price: activeProduct.price,
        isPreorder: true
      };
      addToCart(preorderItem, quantity);
    } else {
      addToCart(activeProduct, quantity);
    }
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  const handleBuyNowClick = () => {
    if (activeProduct.isPreorder) {
      const preorderItem = {
        ...activeProduct,
        name: `[Pre-Order] ${activeProduct.name}`,
        price: activeProduct.price,
        isPreorder: true
      };
      if (setDirectCheckoutItem) {
        setDirectCheckoutItem({ ...preorderItem, quantity });
      } else {
        addToCart(preorderItem, quantity);
      }
    } else {
      if (setDirectCheckoutItem) {
        setDirectCheckoutItem({ ...activeProduct, quantity });
      } else {
        addToCart(activeProduct, quantity);
      }
    }
    setCurrentTab('checkout');
  };

  const handleWishlistClick = () => {
    const saved = localStorage.getItem('boutique_wishlist');
    let wishlistItems = saved ? JSON.parse(saved) : [];

    if (isWishlisted) {
      wishlistItems = wishlistItems.filter(w => w.id !== activeProduct.id);
      setIsWishlisted(false);
      setWishlistMessage(`Removed ${activeProduct.name} from Wishlist!`);
    } else {
      wishlistItems.push({
        ...activeProduct,
        wishlistDate: new Date().toISOString()
      });
      setIsWishlisted(true);
      setWishlistMessage(`Added ${activeProduct.name} Saree to Wishlist!`);
    }

    localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
    window.dispatchEvent(new Event('wishlistUpdated'));

    setTimeout(() => setWishlistMessage(''), 3000);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className={styles['details-wrapper']}>
      {/* Toast Wishlist Notification */}
      {wishlistMessage && (
        <div className={styles['wishlist-toast']}>
          <span>{wishlistMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className={styles['breadcrumb-nav']}>
        <button onClick={() => setCurrentTab('shop')} className={styles['breadcrumb-link']}>
          <Home size={12} className={styles['breadcrumb-icon']} />
          Home
        </button>
        <span className={styles['breadcrumb-separator']}>
          <ChevronRight size={10} />
        </span>
        {activeProduct.isPreorder ? (
          <button onClick={() => setCurrentTab('pre-booking')} className={styles['breadcrumb-link']}>Pre-Reservations</button>
        ) : (
          <button onClick={() => setCurrentTab('catalog')} className={styles['breadcrumb-link']}>Shop Collections</button>
        )}
        <span className={styles['breadcrumb-separator']}>
          <ChevronRight size={10} />
        </span>
        <span className={styles['breadcrumb-active']}>{activeProduct.name} Saree</span>
      </nav>

      {/* Main product columns */}
      <div className={styles['product-columns-grid']}>

        {/* Left Column: Image Gallery */}
        <div className={styles['gallery-column']}>
          <div className={styles['main-image-viewport']}>
            {(selectedImage || activeProduct.image) && (
              <img
                src={selectedImage || activeProduct.image}
                alt={activeProduct.name || 'Handcrafted Saree'}
                className={styles['main-img']}
              />
            )}
            {activeProduct.tag && (
              <span className={`${styles['image-badge-tag']} ${getBadgeClass(activeProduct.tag)}`}>{activeProduct.tag}</span>
            )}

            <div className={styles['viewport-controls']}>
              <button
                className={`${styles['gallery-control-btn']} ${styles['share-control-btn']}`}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: activeProduct.name,
                      text: activeProduct.description,
                      url: window.location.href,
                    }).catch(console.error);
                  }
                }}
                aria-label="Share product"
              >
                <Share2 size={18} color="currentColor" />
              </button>

              <span
                className={styles['gallery-control-btn']}
                role="button"
                tabIndex={0}
                title="Add to Wishlist"
                onClick={handleWishlistClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleWishlistClick();
                  }
                }}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? "#e63946" : "none"}
                  stroke={isWishlisted ? "#e63946" : "currentColor"}
                />
              </span>
            </div>
          </div>

          <div className={styles['mobile-variant-text']}>
            <strong>Selected Color:</strong> {activeProduct.name.split(' ')[0]}
          </div>

          <div className={styles['thumbnails-strip']}>
            {thumbnails.map((imgUrl, idx) => (
              <div
                key={idx}
                className={`${styles['thumb-box']} ${selectedImage === imgUrl ? styles['active-thumb'] : ''}`}
                onClick={() => setSelectedImage(imgUrl)}
              >
                <img src={imgUrl} alt={`View detail ${idx + 1}`} />
              </div>
            ))}
            {/* <div className={styles['thumb-drape-btn']} onClick={() => setWishlistMessage("Buffering Atelier presentation video...")}>
              <span className="material-symbols-outlined">play_circle</span>
              <p>THE DRAPE</p>
            </div> */}
          </div>
        </div>

        {/* Right Column: Product Info Card */}
        <div className={styles['info-column']}>
          <header className={styles['info-header']}>
            <div className={styles['header-badges']}>
              {(activeProduct.category === "Limited Offer" ||
                activeProduct.isLimited ||
                (activeProduct.id && (activeProduct.id.startsWith('wish-') || activeProduct.id.startsWith('offer-')))) &&
                !(activeProduct.tag && activeProduct.tag.toUpperCase().includes('LIMIT')) && (
                  <span className={`${styles['detail-badge']} ${getBadgeClass('Limited Edition')}`}>Limited Edition</span>
                )}
              {activeProduct.tag && <span className={`${styles['detail-badge']} ${getBadgeClass(activeProduct.tag)}`}>{activeProduct.tag}</span>}
            </div>
            <p className={styles['collection-sub']}>MAZHAI VAANAM SIGNATURE COLLECTION</p>
            <h1>{activeProduct.name} Saree - Royal Heritage Edition</h1>
            {activeProduct.description && (
              <p className={styles['product-one-liner']}>
                {activeProduct.description}
              </p>
            )}

            {(() => {
              const productRatingScore = userReviews.length > 0
                ? (userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1)
                : (activeProduct.averageRating || activeProduct.rating || 5.0).toFixed(1);
              const productReviewCount = userReviews.length;

              return (
                <div
                  className={styles['ratings-row-clickable']}
                  onClick={() => {
                    const reviewsElem = document.getElementById('voices-of-grace-reviews');
                    if (reviewsElem) {
                      reviewsElem.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  title="Click to view customer reviews"
                >
                  <div className={styles['stars-group']}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        fill={Number(productRatingScore) >= n ? "#B38A4A" : "transparent"}
                        stroke={Number(productRatingScore) >= n ? "#B38A4A" : "#B38A4A"}
                      />
                    ))}
                  </div>
                  <span className={styles['rating-score']}>{productRatingScore}</span>
                  <span className={styles['rating-divider']}>•</span>
                  <span className={styles['reviews-count-badge']}>
                    {productReviewCount > 0
                      ? `${productReviewCount} ${productReviewCount === 1 ? 'Customer Review' : 'Customer Reviews'}`
                      : 'No reviews yet (Be the first!)'}
                  </span>
                </div>
              );
            })()}
          </header>

          {/* Luxury Price Breakdown Card */}
          <div className={styles['price-card']}>
            <div className={styles['card-shimmer']} />
            <div className={styles['price-card-content']}>
              {activeProduct.isPreorder ? (
                <>
                  <div className={styles['price-card-row']}>
                    <span>Original Retail Value</span>
                    <span className={styles['old-price-slashed']}>{formatCurrency((activeProduct.oldPrice || Math.round(activeProduct.price * 1.15)) * quantity)}</span>
                  </div>
                  <div className={styles['price-card-row']}>
                    <span style={{ color: '#C55A44', fontWeight: 'bold' }}>Special Pre-Order Offer</span>
                    <span style={{ color: '#C55A44', fontWeight: 'bold' }}>{formatCurrency(activeProduct.price * quantity)}</span>
                  </div>
                  <div className={styles['price-card-footer']}>
                    <div className={styles['savings-banner']} style={{ backgroundColor: 'rgba(181, 137, 61, 0.1)' }}>
                      <p className={styles['savings-lbl']} style={{ color: '#B5893D' }}>LOCKED DISCOUNT</p>
                      <p className={styles['savings-pct']} style={{ color: '#B5893D' }}>DISPATCH IN 30-45 DAYS</p>
                    </div>
                    <div className={styles['final-price-box']}>
                      <p className={styles['final-price-lbl']}>FINAL TOTAL PRICE</p>
                      <p className={styles['final-price-amt']}>
                        {formatCurrency(activeProduct.price * quantity)}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles['price-card-row']}>
                    <span>Original Showroom Price</span>
                    <span className={styles['old-price-slashed']}>{formatCurrency(boutiquePrice)}</span>
                  </div>
                  <div className={styles['price-card-row']}>
                    <span>Mazhai Vaanam Base Price</span>
                    <span className={styles['medium-price']}>{formatCurrency(activeProduct.price * quantity)}</span>
                  </div>


                  <div className={styles['price-card-footer']}>
                    <div className={styles['savings-banner']}>
                      <p className={styles['savings-lbl']}>SAVINGS {formatCurrency(totalSavings)}</p>
                      <p className={styles['savings-pct']}>{totalDiscountPct}% OFF ATELIER VALUE</p>
                    </div>
                    <div className={styles['final-price-box']}>
                      <p className={styles['final-price-lbl']}>FINAL BESPOKE PRICE</p>
                      <p className={styles['final-price-amt']}>
                        {formatCurrency(finalPrice)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Call to Actions with Quantity */}
          <div className={styles['actions-wrapper']}>
            <div className={styles['quantity-wrapper']}>
              <span className={styles['quantity-label']}>Qty</span>
              <div className={styles['quantity-controls']}>
                <button
                  className={styles['qty-btn']}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className={styles['qty-value']}>{quantity}</span>
                <button
                  className={styles['qty-btn']}
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className={styles['add-trousseau-btn']}
              onClick={handleAddToCartClick}
              style={activeProduct.isPreorder ? { backgroundColor: '#B5893D', borderColor: '#B5893D' } : {}}
            >
              {activeProduct.isPreorder ? (
                isAddedToCart ? 'PRE-ORDER ADDED' : 'PRE-BOOK NOW'
              ) : (
                isAddedToCart ? 'ADDED TO CART' : 'ADD TO CART'
              )}
              <ArrowRight size={14} />
            </button>
            <button
              className={styles['concierge-btn']}
              onClick={handleBuyNowClick}
            >
              BUY NOW
            </button>
          </div>

          {/* Classic Detailed Description */}
          <div className={styles['classic-description']}>
            <p className={styles['desc-intro']}>
              <strong>Exquisite {activeProduct.fabric || 'Pure Silk'} Saree with Contemporary Prints</strong>
            </p>
            <p>
              Elevate your ethnic wardrobe with the timeless elegance of <strong>{activeProduct.fabric || 'Pure Silk'}</strong>. Known for its rich texture and natural sheen, this collection combines heritage with modern artistic prints to create a look that is both grounded and sophisticated.
            </p>
            <p>
              Each saree features a luxurious drape and a subtle hand-feel that is characteristic of authentic handloom. Finished with a refined <strong>Zari border</strong>, these sarees are designed for the woman who appreciates understated luxury.
            </p>

            <p className={styles['highlights-title']}><strong>Product Highlights:</strong></p>
            <ul className={styles['highlights-list']}>
              <li><strong>Fabric:</strong> 100% {activeProduct.fabric || 'Pure Silk'} – breathable, lightweight, and durable.</li>
              <li><strong>Design:</strong> {activeProduct.description || 'Featuring unique motifs ranging from classic floral vines to modern geometric patterns and abstract twig prints.'}</li>
              <li><strong>Border:</strong> Elegant metallic Zari border that adds a touch of festive shimmer.</li>
              <li><strong>Texture:</strong> Naturally rich, uneven silk texture that lends an organic, high-end feel.</li>
              <li><strong>Occasion:</strong> Perfect for office wear, semi-formal gatherings, weddings, and festive celebrations.</li>
            </ul>

            <p className={styles['desc-note']}>
              <strong>Note:</strong> Digital images may vary slightly from the actual product colour due to screen settings and photography lighting.
            </p>
          </div>


        </div>

      </div>

      {/* Related Products Section */}
      <section className={styles['related-products-section']}>
        <div className={styles['related-header']}>
          <div className={styles['related-title-block']}>
            <h2>You May Also Like</h2>
            <p>Curated selections based on your exquisite taste</p>
          </div>
          <div className={styles['carousel-arrows']}>
            <button
              className={styles['arrow-btn']}
              onClick={() => {
                const container = document.getElementById('related-carousel');
                if (container) container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className={styles['arrow-btn']}
              onClick={() => {
                const container = document.getElementById('related-carousel');
                if (container) container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
              }}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div id="related-carousel" className={styles['related-grid']}>
          {(relatedProducts || []).slice(0, 12).map(prod => (
            <div
              key={prod.id}
              className={styles['related-card']}
              onClick={() => {
                if (setSelectedProduct) {
                  setSelectedProduct(prod);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  window.location.href = `/product/${prod.id}`;
                }
              }}
            >
              <div className={styles['related-image-wrapper']}>
                <img src={prod.image} alt={prod.name} />
                {prod.tag && <span className={`${styles['related-tag']} ${getBadgeClass(prod.tag)}`}>{prod.tag}</span>}
              </div>
              <div className={styles['related-info']}>
                <h4>{prod.name}</h4>
                <p className={styles['related-price']}>
                  {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(prod.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product-Specific Reviews section */}
      {(() => {
        return (
          <section id="voices-of-grace-reviews" className={styles['reviews-section']}>
            <div className={styles['reviews-section-header']}>
              <div>
                <h2>Voices of Grace</h2>
                <p>
                  {userReviews.length > 0
                    ? `Verified Patron Reviews for ${activeProduct.name} • ${userReviews.length} ${userReviews.length === 1 ? 'Approved Appraisal' : 'Approved Appraisals'}`
                    : `Authentic Patron Appraisals for ${activeProduct.name}`}
                </p>
              </div>
              <span
                role="button"
                tabIndex={0}
                className={styles['write-review-trigger']}
                onClick={() => setShowReviewForm(v => !v)}
                onKeyDown={e => e.key === 'Enter' && setShowReviewForm(v => !v)}
              >
                {showReviewForm ? '✕ Cancel' : '✦ Write a Review'}
              </span>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <div className={styles['write-review-panel']}>
                <div className={styles['review-panel-inner']}>
                  <h4 className={styles['review-form-title']}>Share Your Experience for {activeProduct.name}</h4>
                  <p className={styles['review-form-sub']}>Your honest appraisal helps fellow patrons choose their heirloom wisely.</p>

                  {/* Star Picker */}
                  <div className={styles['star-picker']}>
                    <span className={styles['star-picker-label']}>Your Rating</span>
                    <div className={styles['star-picker-stars']}>
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star
                          key={n}
                          size={22}
                          fill={(hoverRating || reviewForm.rating) >= n ? '#B38A4A' : 'transparent'}
                          stroke={(hoverRating || reviewForm.rating) >= n ? '#B38A4A' : 'rgba(79,78,34,0.3)'}
                          style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setReviewForm(f => ({ ...f, rating: n }))}
                        />
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleSubmitReview} className={styles['review-form-grid']}>
                    <div className={styles['review-field-group']}>
                      <label className={styles['review-field-label']}>Your Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sharma"
                        className={styles['review-field-input']}
                        value={reviewForm.name}
                        onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className={styles['review-field-group']}>
                      <label className={styles['review-field-label']}>City / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Chennai"
                        className={styles['review-field-input']}
                        value={reviewForm.location}
                        onChange={e => setReviewForm(f => ({ ...f, location: e.target.value }))}
                      />
                    </div>
                    <div className={styles['review-field-group']} style={{ gridColumn: '1 / -1' }}>
                      <label className={styles['review-field-label']}>Photo of Your Draped Look (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setReviewForm(f => ({ ...f, photo: reader.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: 4 }}
                      />
                      {reviewForm.photo && (
                        <div style={{ marginTop: 8, width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--primary)' }}>
                          <img src={reviewForm.photo} alt="Draped look preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>

                    <div className={styles['review-field-group']} style={{ gridColumn: '1 / -1' }}>
                      <label className={styles['review-field-label']}>Your Review *</label>
                      <textarea
                        rows={4}
                        placeholder="Describe how this saree draped, the quality of the zari, the weight — anything you'd want a fellow patron to know."
                        className={styles['review-field-textarea']}
                        value={reviewForm.text}
                        onChange={e => setReviewForm(f => ({ ...f, text: e.target.value }))}
                        required
                      />
                    </div>
                    <div className={styles['submit-review-wrapper']}>
                      <button type="submit" className={styles['submit-review-btn']}>
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Success toast */}
            {reviewSubmitted && (
              <div className={styles['review-success-banner']}>
                ✓ &nbsp;Your review for {activeProduct.name} has been submitted to MongoDB and is pending Admin approval! It will appear once approved by the Admin team. ✨
              </div>
            )}

            {/* Product-Specific DB Reviews Grid or Luxury Empty State */}
            {userReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px', background: '#faf8f5', borderRadius: 12, border: '1px dashed var(--accent)', margin: '24px 0' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', marginBottom: 8, fontSize: '1.25rem' }}>
                  Be the First to Appraise {activeProduct.name}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 520, margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                  No patron appraisals have been published for this masterpiece yet. Have you worn this saree? Share your draped look and feedback!
                </p>
                <button
                  className={styles['write-review-btn']}
                  onClick={() => setShowReviewForm(true)}
                  style={{ background: 'var(--primary)', color: '#fff', padding: '12px 28px', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, letterSpacing: '1px' }}
                >
                  ✦ Write the First Review
                </button>
              </div>
            ) : (
              <>
                <div className={styles['reviews-grid']}>
                  {userReviews.slice(0, visibleCount).map((r, idx) => (
                    <div key={r.id || r._id || idx} className={`${styles['review-card']} ${styles['user-review-card']}`}>
                      <div className={styles['review-stars']}>
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} size={12}
                            fill={r.rating >= n ? '#B38A4A' : 'transparent'}
                            stroke={r.rating >= n ? '#B38A4A' : 'rgba(79,78,34,0.3)'}
                          />
                        ))}
                      </div>
                      <p className={styles['review-quote']}>"{r.text}"</p>

                      {r.photo && (
                        <div style={{ width: 68, height: 68, borderRadius: 8, overflow: 'hidden', margin: '10px 0', border: '1px solid var(--primary)', background: '#111' }}>
                          <img src={r.photo} alt="Patron draped saree" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}

                      <div className={styles['reviewer-profile']}>
                        <div className={styles['reviewer-avatar-initial']}>
                          {r.name ? r.name[0].toUpperCase() : 'P'}
                        </div>
                        <div>
                          <h6>{r.name}</h6>
                          <p>{r.location || 'Verified Patron'} {r.date ? `• ${r.date}` : ''}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More / Show Less Toggle Button */}
                {userReviews.length > 3 && (
                  <div className={styles['load-more-container']}>
                    {visibleCount < userReviews.length ? (
                      <button
                        className={styles['load-more-reviews-btn']}
                        onClick={() => setVisibleCount(userReviews.length)}
                      >
                        ✦ Show More Reviews ({userReviews.length - visibleCount} Remaining)
                      </button>
                    ) : (
                      <button
                        className={styles['load-more-reviews-btn']}
                        onClick={() => setVisibleCount(3)}
                      >
                        ▲ Show Less
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </section>
        );
      })()}

      {/* 4. Similar Weaves You May Love Section */}
      {relatedProducts.length > 0 && (
        <section style={{ maxWidth: 1240, margin: '60px auto 40px auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, borderBottom: '1px solid rgba(200,163,77,0.2)', paddingBottom: 16 }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
                Curated Recommendations
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: 'var(--text-main)', marginTop: 4, marginBottom: 0 }}>
                Similar Weaves You May Love
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab('catalog')}
              style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              Explore Full Atelier <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
            {relatedProducts.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProduct(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ width: '100%', height: 320, position: 'relative', overflow: 'hidden', background: '#111' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  />
                  {item.tag && (
                    <span style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(107, 16, 42, 0.9)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: 4,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {item.tag}
                    </span>
                  )}
                </div>

                <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                      {item.fabric || item.category || 'Handloom Silk'}
                    </span>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', margin: '4px 0 8px 0', fontWeight: 600, lineHeight: 1.4 }}>
                      {item.name}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, borderTop: '1px solid var(--border-color)', paddingTop: 10 }}>
                    <div>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </span>
                      {item.oldPrice > item.price && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 8 }}>
                          ₹{Number(item.oldPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item, 1);
                      }}
                      style={{
                        padding: '6px 12px',
                        background: 'rgba(200,163,77,0.15)',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary-dark)',
                        borderRadius: 6,
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      + Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Recently Viewed Sarees Section */}
      {recentlyViewed.length > 0 && (
        <section style={{ maxWidth: 1240, margin: '40px auto 70px auto', padding: '0 20px' }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>
              Your Browsing History
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: 'var(--text-main)', marginTop: 4 }}>
              Recently Viewed Weaves
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
            {recentlyViewed.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedProduct(item);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--bg-surface)',
                  padding: 10,
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#111' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 2 }}>
                    {item.fabric || 'Pure Silk'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
