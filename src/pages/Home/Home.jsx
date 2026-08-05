
import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Leaf, LockKeyhole, Gift, Star } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { ALL_PRODUCTS } from '../Catalog/Catalog';
import styles from './Home.module.css';

const AnimatedCounter = ({ end, duration = 2000, suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = progress * end;
      setCount(currentValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count);
  return (
    <span ref={ref}>
      {displayValue}{suffix}
    </span>
  );
};

export const Home = ({ setCurrentTab, setSelectedProduct, setCatalogFilter }) => {
  const [email, setEmail] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const reviews = useMemo(() => [
    {
      id: 1,
      name: "Ananya Ravishankar",
      role: "Verified Buyer",
      initials: "AR",
      rating: 5,
      drape: "Ruby Petal Pure Silk Saree",
      text: "The saree is even more beautiful in person. The zari work is incredibly fine, and the drape is absolute perfection. Truly an heirloom piece that I will cherish forever!"
    },
    {
      id: 2,
      name: "Megha Sundaram",
      role: "Fashion Stylist",
      initials: "MS",
      rating: 5,
      drape: "Snow Elegance Banarasi Saree",
      text: "Mazhai Vaanam has redefined what luxury handloom means to me. The packaging itself was a work of art, and the fabric has a beautiful, rich weight to it. Absolute class."
    },
    {
      id: 3,
      name: "Priya Govind",
      role: "Verified Patron",
      initials: "PG",
      rating: 5,
      drape: "Sunset Glow Cotton Saree",
      text: "Perfect lightweight cotton drape for festive summers. It breathes so well, holds its pleats beautifully, and the natural dyes give it a gorgeous warm glow."
    },
    {
      id: 4,
      name: "Devi Narayanan",
      role: "Collector",
      initials: "DN",
      rating: 5,
      drape: "Mystic Forest Banarasi Saree",
      text: "A masterpiece of heritage weaving. The emerald green color is deeply saturated and the floral zari jaal looks absolutely regal. Excellent client support too."
    }
  ], []);

  const bestSellers = useMemo(() => {
    return ALL_PRODUCTS.filter(product => product.tag === "BESTSELLER").slice(0, 4);
  }, []);

  const slides = useMemo(() => [
    {
      image: "/Images/saree4.png",
      tag: "Wear Confidence",
      title: "Fashion Rooted in Tradition.",
      desc: "Your Style, Your Story."
    },
    {
      image: "/Images/saree3.png",
      tag: "Where Beauty Meets Tradition.",
      title: "Celebrate Every Moment with Elegance.",
      desc: "From Our Collection to Your Celebration."
    },
    {
      image: "/Images/saree5.png",
      tag: "Mazhai Vaanam",
      title: "Grace Begins with Mazhai Vaanam.",
      desc: "Discover handcrafted luxury sarees designed for life's most precious celebrations."
    }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing, ${email}! Welcome to the Mazhai Vaanam Family.`);
      setEmail('');
    }
  };

  const handleCategoryClick = (category) => {
    if (setCatalogFilter) {
      setCatalogFilter({ category: category, occasion: '', label: category });
    }
    if (setCurrentTab) {
      setCurrentTab('catalog');
      
      // Wait for Catalog to render, then scroll specifically to the product grid section 
      setTimeout(() => {
        document.getElementById('catalog-products-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className={styles['home-wrapper']}>
      {/* 1. Hero Carousel Slider */}
      <section className={styles['hero-slider-section']}>
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`${styles['hero-slide']} ${idx === currentSlide ? styles['active-slide'] : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={styles['hero-bg-overlay']}></div>
            <div className={styles['hero-content']}>
              <span className={styles['hero-slide-tag']}>{slide.tag}</span>
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>
              
              <div className={styles['hero-actions']}>
                <button 
                  onClick={() => setCurrentTab && setCurrentTab('catalog')} 
                  className={`${styles['btn-explore']} btn-cloud`}
                >
                  EXPLORE COLLECTION
                </button>
                <button 
                  onClick={() => setCurrentTab && setCurrentTab('contact')} 
                  className={`${styles['btn-custom']} pill`}
                >
                  BOOK CONSULTATION
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Chevrons */}
        <button onClick={handlePrevSlide} className={`${styles['slide-arrow']} ${styles['arrow-left']}`} aria-label="Previous slide">
          <ChevronLeft size={24} />
        </button>
        <button onClick={handleNextSlide} className={`${styles['slide-arrow']} ${styles['arrow-right']}`} aria-label="Next slide">
          <ChevronRight size={24} />
        </button>

        {/* Slide Dash Indicators with progress fillers */}
        <div className={styles['slide-indicators']}>
          {slides.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentSlide(idx)}
              className={`${styles['indicator-bar']} ${idx === currentSlide ? styles['active-indicator'] : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div className={styles['indicator-progress-fill']}></div>
            </button>
          ))}
        </div>
      </section>


      {/* 3. Curation of Craft - Premium Redesign */}
      <section className={`${styles['curation-section']} px-4 md:px-10 max-w-[1400px] mx-auto`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 relative gap-6 md:gap-0">
          <div className="relative pl-4 border-l-2 border-[#D4AF37]">
            <span className="font-label-caps text-[#D4AF37] tracking-[0.3em] text-[10px] uppercase mb-3 block">Handpicked For You</span>
            <h2 className="font-display-lg text-3xl md:text-5xl text-[#2D3326] m-0">Curation of Craft</h2>
          </div>
          <span 
            onClick={() => setCurrentTab && setCurrentTab('collections')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF37] text-[#2D3326] font-label-caps text-[10px] tracking-widest hover:bg-[#FFBEA2] hover:text-[#4F4E22] hover:border-[#FFBEA2] transition-colors cursor-pointer"
          >
            VIEW ALL COLLECTIONS
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Everyday Elegance */}
          <div onClick={() => handleCategoryClick('Everyday Elegance')} className="relative group overflow-hidden rounded-sm shadow-xl cursor-pointer outline outline-1 outline-[#D4AF37]/60 outline-offset-[-10px] flex min-h-[350px]">
            <img 
              src="/Images/cotton3.png" 
              alt="Everyday Elegance" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end w-full h-full mt-auto pointer-events-none">
              <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">CASUAL & CHIC</span>
              <h3 className="font-display-lg text-3xl md:text-4xl text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">Everyday Elegance</h3>
              <p className="text-white/80 text-sm font-body font-light mb-4 leading-relaxed pr-6 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75 pointer-events-auto">
                Breathable comfort meets sophisticated style. Premium cotton sarees crafted for seamless day-to-night wear.
              </p>
              <div className="flex items-center gap-2 text-white font-label-caps text-xs tracking-widest group-hover:text-[#D4AF37] transition-colors pointer-events-auto opacity-0 group-hover:opacity-100">
                <span className="border-b border-[#D4AF37] pb-1">EXPLORE COLLECTION</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </div>
            </div>
          </div>

          {/* Card 2: Festive Glow */}
          <div onClick={() => handleCategoryClick('Festive Glow')} className="relative group overflow-hidden rounded-sm shadow-xl cursor-pointer outline outline-1 outline-[#D4AF37]/60 outline-offset-[-10px] flex min-h-[350px]">
            <img 
              src="/Images/silk1.png" 
              alt="Festive Glow" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end w-full h-full mt-auto pointer-events-none">
              <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">CELEBRATION READY</span>
              <h3 className="font-display-lg text-3xl md:text-4xl text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">Festive Glow</h3>
              <p className="text-white/80 text-sm font-body font-light mb-4 leading-relaxed pr-6 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75 pointer-events-auto">
                Illuminate your celebrations. Exquisite pure silk sarees woven with rich traditional zari motifs.
              </p>
              <div className="flex items-center gap-2 text-white font-label-caps text-xs tracking-widest group-hover:text-[#D4AF37] transition-colors pointer-events-auto opacity-0 group-hover:opacity-100">
                <span className="border-b border-[#D4AF37] pb-1">EXPLORE COLLECTION</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </div>
            </div>
          </div>

          {/* Card 3: Style Studio */}
          <div onClick={() => handleCategoryClick('Style Studio')} className="relative group overflow-hidden rounded-sm shadow-xl cursor-pointer outline outline-1 outline-[#D4AF37]/60 outline-offset-[-10px] flex min-h-[350px]">
            <img 
              src="/Images/fancy1.png" 
              alt="Style Studio" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end w-full h-full mt-auto pointer-events-none">
              <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">MODERN TRENDS</span>
              <h3 className="font-display-lg text-3xl md:text-4xl text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">Style Studio</h3>
              <p className="text-white/80 text-sm font-body font-light mb-4 leading-relaxed pr-6 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75 pointer-events-auto">
                Step into the spotlight. Fashion-forward fancy sarees featuring modern patterns and unique textures.
              </p>
              <div className="flex items-center gap-2 text-white font-label-caps text-xs tracking-widest group-hover:text-[#D4AF37] transition-colors pointer-events-auto opacity-0 group-hover:opacity-100">
                <span className="border-b border-[#D4AF37] pb-1">EXPLORE COLLECTION</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </div>
            </div>
          </div>

          {/* Card 4: Black Magic */}
          <div onClick={() => handleCategoryClick('Black Magic')} className="relative group overflow-hidden rounded-sm shadow-xl cursor-pointer outline outline-1 outline-[#D4AF37]/60 outline-offset-[-10px] flex min-h-[350px]">
            <img 
              src="/Images/black1.png" 
              alt="Black Magic" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end w-full h-full mt-auto pointer-events-none">
              <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">BOLD & BEAUTIFUL</span>
              <h3 className="font-display-lg text-3xl md:text-4xl text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">Black Magic</h3>
              <p className="text-white/80 text-sm font-body font-light mb-4 leading-relaxed pr-6 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75 pointer-events-auto">
                Embrace the midnight allure. Deeply glamorous dark-hued masterpieces for unforgettable evenings.
              </p>
              <div className="flex items-center gap-2 text-white font-label-caps text-xs tracking-widest group-hover:text-[#D4AF37] transition-colors pointer-events-auto opacity-0 group-hover:opacity-100">
                <span className="border-b border-[#D4AF37] pb-1">EXPLORE COLLECTION</span>
                <span className="material-symbols-outlined text-sm">east</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Best Sellers */}
      <section className={`${styles['bestsellers-section']} container`}>
        <div className="grid grid-cols-1 md:grid-cols-3 items-end mb-6 md:mb-8">
          <div className="hidden md:block"></div>
          <div className={styles['section-header-center']} style={{ marginBottom: 0 }}>
            <span className={styles['section-label-small']}>EXCLUSIVES</span>
            <h2>The Best Sellers</h2>
          </div>
          <div className="flex justify-center md:justify-end pb-2 mt-2 md:mt-0">
            <button 
              onClick={() => setCurrentTab && setCurrentTab('best-sellers')}
              className="pill px-8 py-3 border border-[#D4AF37] text-[#1a1a1a] rounded-[8px] hover:bg-[#FFBEA2] hover:text-[#4F4E22] hover:border-[#FFBEA2] transition-all duration-300 font-inter text-[11px] tracking-[2px] font-semibold uppercase flex items-center gap-2"
            >
              VIEW ALL <span className="text-[14px]">→</span>
            </button>
          </div>
        </div>
        <div className="product-grid">
          {bestSellers.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              setSelectedProduct={setSelectedProduct}
              setCurrentTab={setCurrentTab}
            />
          ))}
        </div>
      </section>

      {/* 5. The Bridal Edit */}
      <section 
        className={styles['bridal-edit-section']}
        style={{ backgroundImage: `url('/Images/saree2.png')` }}
      >
        <div className={styles['bridal-overlay']}></div>
        <div className={styles['bridal-text-pane']}>
          <div className={styles['bridal-text-content']}>
            <span className={styles['bridal-label']}>THE CEREMONY</span>
            <h2>The Bridal Edit</h2>
            <p className={styles['bridal-quote']}>
              "For the most sacred moments, we weave dreams into silk. Discover our exclusive bridal collection, where every thread is a testament to tradition and every weave is a blessing."
            </p>
            <button 
              className={styles['btn-bridal-explore']}
              onClick={() => setCurrentTab && setCurrentTab('collections')}
            >
              DISCOVER THE COLLECTION
            </button>
          </div>
        </div>
      </section>


      {/* 7. Why Choose */}
      <section className={styles['values-section']}>
        <div className="container">
          <div className={styles['values-grid']}>
            <div className={styles['values-item']}>
              <div className={styles['value-icon']}>
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <h4>100% ORIGINAL</h4>
              <p>Silk Mark Certified and ethically sourced directly from looms.</p>
            </div>
            <div className={styles['values-item']}>
              <div className={styles['value-icon']}>
                <Leaf size={32} strokeWidth={1.5} />
              </div>
              <h4>PREMIUM FABRICS</h4>
              <p>Only the finest mulberry silk and long-staple cotton threads.</p>
            </div>
            <div className={styles['values-item']}>
              <div className={styles['value-icon']}>
                <LockKeyhole size={32} strokeWidth={1.5} />
              </div>
              <h4>SECURE PAYMENTS</h4>
              <p>PCI-DSS compliant encrypted transactions for your peace of mind.</p>
            </div>
            <div className={styles['values-item']}>
              <div className={styles['value-icon']}>
                <Gift size={32} strokeWidth={1.5} />
              </div>
              <h4>LUXURY PACKAGING</h4>
              <p>Every piece arrives beautifully presented with exceptional care.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials & Instagram */}
      <section className={`${styles['worn-with-love-section']} container`}>
        <div className={styles['section-header-center']}>
          <h2>Worn With Love</h2>
          <span className={styles['instagram-hashtag']}>#MAZHAIVAANAMHERITAGE</span>
        </div>
        <div className={styles['social-bento-grid']}>
          {/* Card 1: Text Testimonial (Spans 2 cols, 1 row) */}
          <div className={`${styles['social-text-card']} ${styles['bento-col-2']}`}>
            <span className={styles['quote-mark']}>“</span>
            <p>
              "The saree is even more beautiful in person. The zari work is incredibly fine, and the drape is absolute perfection. Highly recommend!"
            </p>
            <div className={styles['social-user-info']}>
              <div className={styles['user-avatar']}>AR</div>
              <div>
                <span className={styles['social-author']}>ANANYA R.</span>
                <span className={styles['social-role']}>Verified Buyer</span>
              </div>
            </div>
          </div>

          {/* Card 2: Image (Spans 2 cols, 2 rows) */}
          <div className={`${styles['social-img-card']} ${styles['bento-col-2']} ${styles['bento-row-2']}`}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9J_Q7jOWawajmiqySs-_LfCpGRtiFFoUpmqQQo7c561Iwdz08UwJ-4ppCiBCt7uwZc5TR5Wmu1uUegKCMeJcA2mwKhGi3suCNgjjdJJNQMHlgo74O1ApnWH0uIZfuS7SQl2vJSet5RV57sbCzr2fOKI2EaOQURbOETeI2_cUkJsXebCgDSanEaGhQ9KYiT5cf1AvahdPU1T77J0OM4Fcmq7H8JMMFNda_0VWh_Z6oFBnrFI0mLUZ_" 
              alt="Woman in garden" 
            />
            <div className={styles['social-img-caption']}>
              <span className={styles['caption-hashtag']}>#HeritageDrape</span>
              <span className={styles['caption-handle']}>@ananya_r</span>
            </div>
          </div>

          {/* Card 3: Image (1 col, 1 row) */}
          <div className={styles['social-img-card']}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS5dUlDrXgcLXeAfrtbm6bpkLMa2De10OTD3E3O0UkWLKvxvyu5fgIfEjC_3LlMUUIAlLm1WLAsLNJoWy4B8JQ7bREVnsTsSyuxGgDEkVFVIBn4_vtUYVpafMFpJ-90CcAGpWpDXIc09AII3rZ-rmBvJxPTzqF3PI-abBrLpmFyI9uXrtbohocYODzHv9a43pHQmYLapQ8XbjBa1SL7XgkVVR3z8xt_4fH535evmyXhoNglxq5OHuw" 
              alt="Bride hands touching saree" 
            />
            <div className={styles['social-img-caption']}>
              <span className={styles['caption-hashtag']}>#BridalCouture</span>
              <span className={styles['caption-handle']}>@bridal_drapes</span>
            </div>
          </div>

          {/* Card 5: Image (1 col, 1 row) */}
          <div className={styles['social-img-card']}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYuFjAXKyW_0p4At-q11yX2qN1DLHsS-4VZyF7WXFWipfqs_q3-ftdMhmOHQGUA-2G52g_AWD_21kSRTW9raBfQUjGPsb8vxE8uTK-D6sq8z2IUj-RTHeoShoKhtXWuTs661ynsWHOIFJ9-m862hzskYxRcPQ3PILDgSxbFD7Ll34R4JaR711wOMrT7-gJHQDP55nrlWkUBHEAO2-pMR7QaRDBkQY2RZgJCM0tzrYtpJg3Nu2_2EvA" 
              alt="Folded Silk Sarees" 
            />
            <div className={styles['social-img-caption']}>
              <span className={styles['caption-hashtag']}>#KanchipuramLoom</span>
              <span className={styles['caption-handle']}>@mazhaivaanam</span>
            </div>
          </div>

          {/* Card 4: Text Testimonial (Spans 2 cols, 1 row) */}
          <div className={`${styles['social-text-card']} ${styles['social-dark-card']} ${styles['bento-col-2']}`}>
            <span className={styles['quote-mark']}>“</span>
            <p>
              "Mazhai Vaanam has redefined what luxury handloom means to me. The packaging itself was a work of art."
            </p>
            <div className={styles['social-user-info']}>
              <div className={styles['user-avatar-gold']}>MS</div>
              <div>
                <span className={styles['social-author-white']}>MEGHA S.</span>
                <span className={styles['social-role-gold']}>Fashion Stylist</span>
              </div>
            </div>
          </div>

          {/* Card 6: Community CTA (Spans 2 cols, 1 row) */}
          <div className={`${styles['social-cta-card']} ${styles['bento-col-2']}`}>
            <div className={styles['cta-content']}>
              <h4>Join Our Community</h4>
              <p>Share your stories and drapes with us to get featured in our seasonal gallery.</p>
              <button 
                onClick={() => setCurrentTab && setCurrentTab('contact')}
                className={styles['cta-btn']}
              >
                SHARE YOUR MOMENT
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8.5. Patron Voices (Continuous Scrolling Reviews Marquee) */}
      <section className={styles['reviews-slider-section']}>
        <div className={styles['section-header-center']}>
          <span className={styles['review-section-tag']}>PATRON VOICES</span>
          <h2>Words From Our Family</h2>
        </div>

        <div className={styles['reviews-marquee-viewport']}>
          <div className={styles['reviews-marquee-track']}>
            {/* Render reviews list twice for seamless infinite looping */}
            {[...reviews, ...reviews].map((rev, idx) => (
              <div 
                key={`${rev.id}-${idx}`} 
                className={styles['review-marquee-card']}
              >
                <span className={styles['review-quote-icon']}>“</span>
                <div className={styles['rating-stars']}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#FFC107" stroke="#FFC107" />
                  ))}
                </div>
                <p className={styles['review-text-content']}>
                  "{rev.text}"
                </p>
                <div className={styles['review-purchased-badge']}>
                  Purchased: <strong>{rev.drape}</strong>
                </div>
                
                <div className={styles['reviewer-profile']}>
                  <div className={styles['reviewer-initials-avatar']}>
                    {rev.initials}
                  </div>
                  <div className={styles['reviewer-metadata']}>
                    <span className={styles['reviewer-name']}>{rev.name}</span>
                    <span className={styles['reviewer-status']}>
                      <span className={styles['verified-check-badge']}>✓</span> {rev.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Newsletter Block */}
      <section className={`${styles['newsletter-section']} container`}>
        <div className={styles['newsletter-box']}>
          <h2>Join the Mazhai Vaanam Family</h2>
          <p>Be the first to discover our new collections, artisan stories, and heritage previews.</p>
          <form onSubmit={handleSubscribe} className={styles['newsletter-form']}>
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
      </section>

      {/* Stats Section Moved to Bottom */}
      <section className={styles['stats-section']}>
        <div className="container">
          <div className={styles['stats-grid']}>
            <div className={styles['stats-item']}>
              <span className={styles['stats-num']}>
                <AnimatedCounter end={50} suffix="k+" />
              </span>
              <span className={styles['stats-label']}>Happy Customers</span>
            </div>
            <div className={styles['stats-item']}>
              <span className={styles['stats-num']}>
                <AnimatedCounter end={250} suffix="+" />
              </span>
              <span className={styles['stats-label']}>Exclusive Designs</span>
            </div>
            <div className={styles['stats-item']}>
              <span className={styles['stats-num']}>
                <AnimatedCounter end={20} suffix="+" />
              </span>
              <span className={styles['stats-label']}>Saree Collections</span>
            </div>
            <div className={styles['stats-item']}>
              <div className={styles['stats-star-row']}>
                <span className={styles['stats-num']}>
                  <AnimatedCounter end={4.9} decimals={1} />
                </span>
                <span className={styles['star-icon']}>★</span>
              </div>
              <span className={styles['stats-label']}>5 Star Rating</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
