import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { getBadgeClass } from '../../utils/badgeHelper';
import { Heart, Star, ShoppingBag, ArrowRight, Check, ShieldCheck, Gift, Truck, Play, Minimize, Maximize, Home, ChevronRight, ChevronLeft, Share2 } from 'lucide-react';
import { ALL_PRODUCTS } from '../Catalog/Catalog';
import styles from './ProductDetail.module.css';

export const ProductDetail = ({ product, setCurrentTab }) => {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedHue, setSelectedHue] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [reviewForm, setReviewForm] = useState({ name: '', location: '', text: '', rating: 5 });
  const [userReviews, setUserReviews] = useState([]);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;
    const newReview = {
      id: Date.now(),
      name: reviewForm.name.trim(),
      location: reviewForm.location.trim() || 'Verified Patron',
      text: reviewForm.text.trim(),
      rating: reviewForm.rating,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setUserReviews(prev => [newReview, ...prev]);
    setReviewForm({ name: '', location: '', text: '', rating: 5 });
    setReviewSubmitted(true);
    setShowReviewForm(false);
    setTimeout(() => setReviewSubmitted(false), 4000);
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

  // Set initial images and color selection
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
    
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      addToCart(preorderItem, quantity);
    } else {
      addToCart(activeProduct, quantity);
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
            <img
              src={selectedImage}
              alt={activeProduct.name}
              className={styles['main-img']}
            />
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
              <span className={`${styles['edition-badge']} ${getBadgeClass('Limited Edition')}`}>Limited Edition</span>
              {activeProduct.tag && <span className={`${styles['bestseller-badge']} ${getBadgeClass(activeProduct.tag)}`}>{activeProduct.tag}</span>}
            </div>
            <p className={styles['collection-sub']}>MAZHAI VAANAM SIGNATURE COLLECTION</p>
            <h1>{activeProduct.name} Saree - Royal Heritage Edition</h1>
            {activeProduct.description && (
              <p className={styles['product-one-liner']}>
                {activeProduct.description}
              </p>
            )}

            <div className={styles['ratings-row']}>
              <div className={styles['stars-group']}>
                <Star size={14} fill="var(--accent)" stroke="var(--accent)" />
                <Star size={14} fill="var(--accent)" stroke="var(--accent)" />
                <Star size={14} fill="var(--accent)" stroke="var(--accent)" />
                <Star size={14} fill="var(--accent)" stroke="var(--accent)" />
                <Star size={14} fill="var(--accent)" stroke="var(--accent)" />
              </div>
              <span className={styles['reviews-count']}>{Math.round(activeProduct.price / 4.5)} verified collectors</span>
            </div>
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

          {/* Trust Value Box */}
          <div className={styles['trust-box']}>
            <div className={styles['trust-item']}>
              <span className="material-symbols-outlined">verified</span>
              <div>
                <h6>100% Original Masterpiece</h6>
                <p>Certified by Silk Mark India & Handloom Mark verification standards.</p>
              </div>
            </div>
            <div className={styles['trust-item']}>
              <span className="material-symbols-outlined">redeem</span>
              <div>
                <h6>Luxury Gift Box Packaging</h6>
                <p>Each saree arrives encased in our signature teak-finish legacy box wrap.</p>
              </div>
            </div>
            <div className={styles['trust-item']}>
              <span className="material-symbols-outlined">local_shipping</span>
              <div>
                <h6>Express Global Insured Shipping</h6>
                <p>Completely insured shipping with custom tracked delivery (3-5 business days).</p>
              </div>
            </div>
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
          {(ALL_PRODUCTS || []).filter(p => p.id !== activeProduct.id).slice(0, 12).map(prod => (
            <div key={prod.id} className={styles['related-card']} onClick={() => window.location.href = `/product/${prod.id}`}>
              <div className={styles['related-image-wrapper']}>
                <img src={prod.image} alt={prod.name} />
                {prod.tag && <span className={styles['related-tag']}>{prod.tag}</span>}
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

      {/* Customer Love Reviews section */}
      <section className={styles['reviews-section']}>
        <div className={styles['reviews-section-header']}>
          <div>
            <h2>Voices of Grace</h2>
            <p>Real stories shared by our global patrons</p>
          </div>
          <span
            role="button"
            tabIndex={0}
            className={styles['write-review-trigger']}
            onClick={() => setShowReviewForm(v => !v)}
            onKeyDown={e => e.key === 'Enter' && setShowReviewForm(v => !v)}
          >
            {showReviewForm ? '\u2715 Cancel' : '\u2726 Write a Review'}
          </span>
        </div>

        {/* Write Review Form */}
        {showReviewForm && (
          <div className={styles['write-review-panel']}>
            <div className={styles['review-panel-inner']}>
              <h4 className={styles['review-form-title']}>Share Your Experience</h4>
              <p className={styles['review-form-sub']}>Your honest appraisal helps fellow patrons choose their heirloom wisely.</p>

              {/* Star Picker */}
              <div className={styles['star-picker']}>
                <span className={styles['star-picker-label']}>Your Rating</span>
                <div className={styles['star-picker-stars']}>
                  {[1,2,3,4,5].map(n => (
                    <Star
                      key={n}
                      size={22}
                      fill={(hoverRating || reviewForm.rating) >= n ? 'var(--accent)' : 'transparent'}
                      stroke={(hoverRating || reviewForm.rating) >= n ? 'var(--accent)' : 'rgba(79,78,34,0.3)'}
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
            &#x2713; &nbsp;Your appraisal has been added. Thank you!
          </div>
        )}

        <div className={styles['reviews-grid']}>
          {/* User submitted reviews */}
          {userReviews.map(r => (
            <div key={r.id} className={`${styles['review-card']} ${styles['user-review-card']}`}>
              <div className={styles['review-stars']}>
                {[1,2,3,4,5].map(n => (
                  <Star key={n} size={12}
                    fill={r.rating >= n ? 'var(--accent)' : 'transparent'}
                    stroke={r.rating >= n ? 'var(--accent)' : 'rgba(79,78,34,0.3)'}
                  />
                ))}
              </div>
              <p className={styles['review-quote']}>&#x201C;{r.text}&#x201D;</p>
              <div className={styles['reviewer-profile']}>
                <div className={styles['reviewer-avatar-initial']}>
                  {r.name[0]?.toUpperCase()}
                </div>
                <div>
                  <h6>{r.name}</h6>
                  <p>Verified Patron &bull; {r.location} &nbsp;&middot;&nbsp; {r.date}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Static curated reviews */}
          <div className={styles['review-card']}>
            <div className={styles['review-stars']}>
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
            </div>
            <p className={styles['review-quote']}>
              "The gold zari work is absolutely breathtaking. It sits lighter than expected and drapes like a dream. Truly an heirloom masterpiece."
            </p>
            <div className={styles['reviewer-profile']}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwGYgKGfLt0I5ir4KaYDuyebEgspSKAgBAYwY8l2gD16JLr7ersoFQTb1G9SaNQW4vP2DweEV3bj8hRccX3iM1o-KThEhxDCv7iup32Ju4TzXuI_IfVZS2MJnfP9kt1-Uyc8F0zY4omWra5AEAY2tXm6mwlOZNekBzOSzyMh4nQ50nOIAc1zGeS9JmxpAu3wSyo_wD1-VYVCIsPkdO8FV6XP6YOiZ11gKh2twG8xCu1wOuwicqSrvi"
                alt="Collector profile 1"
              />
              <div>
                <h6>Ananya R.</h6>
                <p>Verified Saree Collector &bull; Mumbai</p>
              </div>
            </div>
          </div>

          <div className={styles['review-card']}>
            <div className={styles['review-stars']}>
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
            </div>
            <p className={styles['review-quote']}>
              "Wore this for my daughter's wedding reception. The colors are incredibly rich. Everyone asked about the provenance of the fabric."
            </p>
            <div className={styles['reviewer-profile']}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnqP1XyRmq2K3_Vm9XzgBLP4aCPsdRiRoYk--9bp6-jB3Iy7wHTG9PBqrh-KftWFSpMvZkdgNej2nP5ax3ZsgiuOx6V2SHYm8ze7xSe1DBDqYOMe6Fa3CRCejUIN12W0-4nzb6hd2sN43MG1XIYzyDOYI2oM95GkcfjSq3pg5TeGss7qKJ2Rp0MlH-aBVoRcLN2VhhFQWzBOqGH8428Ul4wj4u_0M7GeRpQ16jxVr8cmQP22Jj2FRg"
                alt="Collector profile 2"
              />
              <div>
                <h6>Dr. Meera S.</h6>
                <p>Verified Saree Collector &bull; London</p>
              </div>
            </div>
          </div>

          <div className={styles['review-card']}>
            <div className={styles['review-stars']}>
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
              <Star size={12} fill="var(--accent)" stroke="var(--accent)" />
            </div>
            <p className={styles['review-quote']}>
              "The custom teak wooden box packaging itself is worth 5 stars. It felt like receiving a heritage heirloom from another era."
            </p>
            <div className={styles['reviewer-profile']}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdhFNhEQiiOCeRIklQUI8DA_0cKcj17bFhkqMwiBgLfq66QEjiCVvcbUmvltVCTRo2qYZoq0KmxsUjPtzbnmZUWwBpc3tSjmrz0UEQK3exVC_3GlR0qjgz5jz8d3utxw8gHmfpZz-sC5Tbt9sL3WMUQo8kIbmBnfxlEejN-pqiNq7BbhbaEKn_BWlDbMQB0KW8Z5y8BhiXWoh0jM8pfZW5MebNPJV5uBoJDdMaxaIQ7s9QMFnZ3jQt"
                alt="Collector profile 3"
              />
              <div>
                <h6>Kavita M.</h6>
                <p>Verified Saree Collector &bull; Bangalore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
