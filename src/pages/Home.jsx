import { useState, useEffect, useMemo } from 'react';
import { getProducts } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import './Pages.css';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  
  const slides = useMemo(() => [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=1000&q=80",
      color: "#C59B4B", // Warm Heritage Gold
      subtitle: "HERITAGE WEAVES",
      name: "AARANYA",
      title: "COLLECTION",
      script: "Crafting timeless silk stories",
      tagline: "for the modern bride",
      badge: "PURE * HANDLOOM * SILK"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
      color: "#8B2332", // Royal Maroon
      subtitle: "ARTISANAL SERIES",
      name: "BANARASI",
      title: "MASTERPIECES",
      script: "Generations of royal brocades",
      tagline: "woven with pure gold zari",
      badge: "AUTHENTIC * HANDWOVEN"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=1000&q=80",
      color: "#2C3E50", // Slate Navy
      subtitle: "DESIGNER COUTURE",
      name: "FESTIVE",
      title: "ENSEMBLES",
      script: "Bespoke hand embroidery edits",
      tagline: "tailored to absolute perfection",
      badge: "CUSTOM * EXPERT * FIT"
    }
  ], []);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.slice(0, 3)); // Display top 3 trending products
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // 6 seconds for custom progress line
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing, ${email}! Welcome to the Aaranya Club.`);
      setEmail('');
    }
  };

  return (
    <div className="page home-page">
      {/* 1. Sandstone Organic Curved Partition Hero Section */}
      <section className="hero-section-organic" style={{ '--slide-theme': slides[currentSlide].color }}>
        {/* Subtle leaf shadow texture overlaying the entire background */}
        <div className="organic-shadow-overlay"></div>

        {/* Dynamic Curved Split Background on the Right */}
        <div className="organic-bg-split"></div>

        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`organic-slide ${index === currentSlide ? 'active' : ''}`}
          >
            {/* Left Column: Sandstone Plaster Panel with Staggered Typography */}
            <div className="organic-slide-left">
              <div className="organic-slide-left-content">
                {/* Minimalist Leaf logo icon mark */}
                <div className="organic-logo-mark">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C45A30" strokeWidth="1.2">
                    <path d="M12 2C12 2 16 7 16 12C16 17 12 22 12 22C12 22 8 17 8 12C8 7 12 2 12 2Z" />
                    <path d="M12 6C14 8 15 10 15 12" />
                    <path d="M12 11C10 13 9 15 9 17" />
                  </svg>
                </div>

                <span className="organic-slide-subtitle">{slide.subtitle}</span>
                
                {/* Big Serif Split Title */}
                <h1 className="organic-slide-title">
                  <span className="title-line-wrapper">
                    <span className="title-line name">{slide.name}</span>
                  </span>
                  <span className="title-line-wrapper">
                    <span className="title-line main">{slide.title}</span>
                  </span>
                </h1>

                {/* Subtitle script cursive font */}
                <span className="organic-slide-script">{slide.script}</span>
                <span className="organic-slide-tagline">{slide.tagline}</span>

                {/* Curved underline stroke decoration */}
                <div className="organic-accent-line">
                  <svg width="120" height="12" viewBox="0 0 120 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 7C35 2 85 2 115 7" stroke="#C45A30" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Column: Model display in front of the curved split background */}
            <div className="organic-slide-right">
              <div className="organic-model-card">
                <img 
                  src={slide.image} 
                  alt={slide.name} 
                  className="organic-model-card-image"
                />
              </div>

              {/* Overlapping circular badge */}
              <div className="organic-badge-circle">
                <div className="organic-badge-text-inner">
                  {slide.badge}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Bottom Curved Wave Divider overlapping the page flow */}
        <div className="organic-wave-divider-container">
          <svg className="organic-wave-divider" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 80 C 300 0, 600 160, 1000 80 C 1200 40, 1350 90, 1440 100 V 120 H 0 Z" fill="#faf9f6"/>
          </svg>
        </div>

        {/* Carousel controls - minimalist center link */}
        <div className="organic-carousel-controls">
          <button className="organic-control-btn prev" onClick={handlePrevSlide} aria-label="Previous Slide">
            ←
          </button>
          <span className="organic-control-label">SELECTED WORK</span>
          <button className="organic-control-btn next" onClick={handleNextSlide} aria-label="Next Slide">
            →
          </button>
        </div>
      </section>

      {/* 2. Curated Collections Category Grid */}
      <section className="curated-section container">
        <div className="section-header-row">
          <div className="section-title-group">
            <h2 className="custom-section-title">Curated Collections</h2>
            <p className="custom-section-subtitle">Handpicked heritage fabrics & luxury ensembles, tailored to perfection.</p>
          </div>
          <button className="view-all-btn">VIEW ALL</button>
        </div>

        <div className="categories-grid-container">
          {/* Row 1: Two Wide Categories */}
          <div className="category-row-wide">
            <div className="category-card-custom tall">
              <img src="https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=800&q=80" alt="Kanjeevaram Collection" />
              <div className="category-card-overlay">
                <h3>Kanjeevaram Collection</h3>
                <span className="shop-now-text">SHOP NOW</span>
              </div>
            </div>
            <div className="category-card-custom tall">
              <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80" alt="Banarasi Saree Collection" />
              <div className="category-card-overlay">
                <h3>Banarasi Saree Collection</h3>
                <span className="shop-now-text">SHOP NOW</span>
              </div>
            </div>
          </div>

          {/* Row 2: Three Smaller Categories */}
          <div className="category-row-split">
            <div className="category-card-custom square">
              <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80" alt="Lehengas" />
              <div className="category-card-overlay">
                <h3>Lehengas</h3>
                <span className="shop-now-text">SHOP NOW</span>
              </div>
            </div>
            <div className="category-card-custom square">
              <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" alt="Salwar Suits" />
              <div className="category-card-overlay">
                <h3>Salwar Suits</h3>
                <span className="shop-now-text">SHOP NOW</span>
              </div>
            </div>
            <div className="category-card-custom square">
              <img src="https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80" alt="Festive Wear" />
              <div className="category-card-overlay">
                <h3>Festive Wear</h3>
                <span className="shop-now-text">SHOP NOW</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trending Now Showcase */}
      <section className="trending-section container">
        <div className="centered-section-header">
          <h2 className="custom-section-title">Trending Now</h2>
          <p className="custom-section-subtitle">Our most coveted luxury sarees of this season</p>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Fetching trending catalog...</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Editorial Stories Section */}
      <section className="editorial-section container">
        <div className="centered-section-header">
          <h2 className="custom-section-title">Editorial</h2>
          <p className="custom-section-subtitle">Discover the stories, craftsmanship, and legacy behind the weave</p>
        </div>

        <div className="editorial-grid">
          {/* Left Large Column */}
          <div className="editorial-left">
            <div className="editorial-card-large">
              <img src="https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=80" alt="Model in traditional setting" />
              <div className="editorial-content-box">
                <h4>Heritage Wear</h4>
                <h3>Weaving a Legacy</h3>
                <p>Exploring the preservation of the hand-woven zari arts that have draped generations of royal dynasties.</p>
                <span className="read-more-link">READ STORY</span>
              </div>
            </div>
          </div>

          {/* Right Smaller Grid Column */}
          <div className="editorial-right">
            <div className="editorial-sub-grid">
              <div className="editorial-sub-card">
                <img src="https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&w=600&q=80" alt="Fabric details" />
                <div className="editorial-sub-info">
                  <h4>Craftsmanship</h4>
                  <h3>Heritage Handloom</h3>
                </div>
              </div>
              <div className="editorial-sub-card">
                <img src="https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&w=600&q=80" alt="Boutique fitting room" />
                <div className="editorial-sub-info">
                  <h4>Experience</h4>
                  <h3>Tailored Elegance</h3>
                </div>
              </div>
              <div className="editorial-sub-card full-width-card">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80" alt="Weaving loom close up" />
                <div className="editorial-sub-info">
                  <h4>The loom</h4>
                  <h3>Loom Story</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Brand Features / Pillars */}
      <section className="brand-pillars-section">
        <div className="container">
          <div className="pillars-grid">
            <div className="pillar-item">
              <span className="pillar-num">100%</span>
              <span className="pillar-label">Handcrafted</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-num">PURE</span>
              <span className="pillar-label">Silk Assurance</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-num">FREE</span>
              <span className="pillar-label">Shipping Worldwide</span>
            </div>
            <div className="pillar-item">
              <span className="pillar-num">EASY</span>
              <span className="pillar-label">Customization</span>
            </div>
          </div>

          <div className="pillars-services-grid">
            <div className="service-pillar-card">
              <h3>Personal Styling Consultation</h3>
              <p>Work with our dedicated fashion coordinators to curate the perfect bridal trousseau or festive styling alignment.</p>
              <span className="pillar-action-link">BOOK CONSULTATION →</span>
            </div>
            <div className="service-pillar-card">
              <h3>Handloom Authenticity</h3>
              <p>Every piece is certified with the Silk Mark of India, ensuring pure mulberry silk, organic dyes, and authentic handlooms.</p>
              <span className="pillar-action-link">LEARN MORE →</span>
            </div>
            <div className="service-pillar-card">
              <h3>Custom Embroidery Services</h3>
              <p>Make your wedding ensemble unique. Customize blouse patterns, add custom zari messages, and tailor custom fits.</p>
              <span className="pillar-action-link">REQUEST SERVICE →</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Instagram Social Section */}
      <section className="instagram-section container">
        <div className="centered-section-header">
          <h2 className="custom-section-title">Follow Us On Instagram</h2>
          <p className="custom-section-subtitle">@AaranyaLuxurySarees</p>
        </div>
        <div className="instagram-feed-row">
          <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=300&q=80" alt="Insta Post 1" className="insta-img" />
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80" alt="Insta Post 2" className="insta-img" />
          <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=300&q=80" alt="Insta Post 3" className="insta-img" />
          <img src="https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=300&q=80" alt="Insta Post 4" className="insta-img" />
          <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80" alt="Insta Post 5" className="insta-img" />
        </div>
      </section>

      {/* 7. Newsletter Club Block */}
      <section className="newsletter-club-section container">
        <div className="newsletter-box glass-card">
          <h2>Join the Aaranya Club</h2>
          <p>Receive updates on private trunk shows, styling coordinates, and limited edition weaver drops.</p>
          <form onSubmit={handleSubscribe} className="newsletter-form-custom">
            <input 
              type="email" 
              placeholder="YOUR EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
