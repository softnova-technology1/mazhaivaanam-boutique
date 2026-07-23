
import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Leaf, LockKeyhole, Gift, Star } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
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

export const Home = ({ setCurrentTab, setSelectedProduct }) => {
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

  const bestSellers = useMemo(() => [
    {
      id: 'prod-1',
      name: "Celestial Blue Zari",
      category: "Kanchipuram Pure Silk",
      price: 42500,
      oldPrice: 48000,
      rating: 4.9,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkRuajLDcBWPazr6lv5c906qF0pGWB4-Ke1cY7Qc8LFWNUDGlM9MNsyuVAK0B81OaDi7a3eX5PWLvar4UFlcXzFx4T6i9mYoZh8zFPHjbz_jJt7XkBwKgO4LVbEI45hkE3Fu4G8IBh2ls5xV7ThxPW06QCHp43P2GvOXaFJW2FNHZJr5sQFJbSWWX1qSMsS7YGQGCMc-VawrfXqWOQwiXMpM7C4tbBmlD5coSua7GF66oDsIY1_ASD",
      description: "Celestial blue Kanchipuram silk featuring high-density gold zari work, traditional paisley motifs, and a rich contrast pallu.",
      isNew: true
    },
    {
      id: 'prod-2',
      name: "Emerald Peacock",
      category: "Banarasi Handloom",
      price: 38900,
      rating: 4.8,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6_fYJUJ8lopUs6Mmjbe7mPWcNpXrk6cWPPHywkC8jyla6EifMxzI9ATXrz0HPR6s-EKgTsvnIKFbwinpKsyK35stBdPHihyLefFO30ofcNdphFWgiHa8PMauggjVJlqakhn5R8_iUNF2bFlgXmqUVOmVj4aXY7RSn3ymJfS3-gHRgkyxNEOqRdRrSlISYc4mWtV7-17Mm4VTCKiKDcm0xRMs0SQmDWYqVKyfXgqHUnhM03JhbdInR",
      description: "Authentic Varanasi handloom silk brocade woven with intricate peacock motifs in gold zari thread work."
    },
    {
      id: 'prod-3',
      name: "Ethereal Flora",
      category: "Sheer Organza Silk",
      price: 24500,
      oldPrice: 29000,
      rating: 4.7,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkR9FP0wylSHCLbJuc1rcd1b3ZZZ8hPEL79wJ3qy6sPZb23EDPHdq6ZfzdFbfFhCQ_J-Zs33rEECZzszDKe_B9tuFcLRSaCTSCDoVsPydnpVzJj49KDmzM83hLlJjIpV_d54bRNpOj3rdfWAQcSd6yYa1HM-4TyjSedtglyEiKssTfPHkS63BI4vSp7ImYuM3uzJ0GQjIm6Fdla04KWqvcBwn6-i0YaoIrB-2Vwitv2TGfRZTRTeGt",
      description: "Translucent premium organza with hand-painted pastel floral bouquets and delicate silver scalloped borders."
    },
    {
      id: 'prod-4',
      name: "Royal Marwari",
      category: "Bridal Collection",
      price: 62000,
      rating: 5.0,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEH4SvqsRb6gvN8FIu3w__9u6JGQcuLJwJeUAdIapFYRlwKAVg0_hwrxckkrk6TrJbEWoasQRjiNu_oSYcuhnfDRQu3n5ddWbpCV1Rbzw_KxR07Ajc6lb9vFOUyZ81jlcaIa-JjCzIE7t01zulpMacgbYsXqAjTxh83xzYUiXcPnd_LAdY8DSLWfZA7fzJ0cBSZn_c6VMZK8Lwm7si8WNDVtJ1N5_BWnX45CS9xhSgFnUgpgefVDmy",
      description: "An heirloom bridal masterwork featuring checks and heavy gold border zari panels.",
      isLimited: true
    }
  ], []);

  const slides = useMemo(() => [
    {
      image: "/Images/saree4.png",
      tag: "Festive Collection",
      title: "Grace In Every Fold",
      desc: "Celebrate the spirit of festivities with our handpicked heirloom sarees."
    },
    {
      image: "/Images/saree3.png",
      tag: "New Arrivals",
      title: "Timeless Classic Saree",
      desc: "Experience the timeless elegance with our newly arrived exclusive collection."
    },
    {
      image: "/Images/saree5.png",
      tag: "Bridal Masterpieces",
      title: "Elegance Woven Into Every Thread",
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
                  className={styles['btn-explore']}
                >
                  EXPLORE COLLECTION
                </button>
                <button 
                  onClick={() => setCurrentTab && setCurrentTab('contact')} 
                  className={styles['btn-custom']}
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

      {/* 1.5. Circular Categories */}
      <section className="bg-background pt-12 pb-6 border-b border-outline-variant/30">
        <div className="container overflow-hidden">
          <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 justify-start md:justify-center px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { name: 'Kanchipuram', img: '/Images/saree1.png' },
              { name: 'Banarasi', img: '/Images/saree2.png' },
              { name: 'Bridal Silk', img: '/Images/bridal.png' },
              { name: 'Soft Silk', img: '/Images/saree4.png' },
              { name: 'Gadwal', img: '/Images/saree5.png' },
              { name: 'Mysore Silk', img: '/Images/saree6.png' },
              { name: 'Cotton', img: '/Images/saree7.png' },
              { name: 'Designer', img: '/Images/saree8.png' },
            ].map((category, index) => (
              <div key={index} className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0">
                <div className="w-20 h-20 md:w-[104px] md:h-[104px] rounded-full p-1 border-[1.5px] border-outline-variant group-hover:border-secondary transition-colors duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-surface-container-high shadow-sm">
                    <img 
                      src={category.img} 
                      alt={category.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </div>
                <span className="font-label-caps text-[10px] md:text-xs text-on-surface tracking-widest uppercase group-hover:text-secondary transition-colors">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 3. Curation of Craft - Premium Redesign */}
      <section className="py-16 md:py-24 px-4 md:px-10 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 relative">
          <div className="relative pl-4 border-l-2 border-[#D4AF37]">
            <span className="font-label-caps text-[#D4AF37] tracking-[0.3em] text-[10px] uppercase mb-3 block">Handpicked For You</span>
            <h2 className="font-display-lg text-4xl md:text-5xl text-[#2D3326] m-0">Curation of Craft</h2>
          </div>
          <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF37] text-[#2D3326] font-label-caps text-[10px] tracking-widest hover:bg-[#D4AF37] hover:text-white transition-colors cursor-pointer mt-6 md:mt-0">
            VIEW ALL COLLECTIONS
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Large Card */}
          <div className="w-full md:w-7/12 relative group overflow-hidden rounded-sm shadow-2xl cursor-pointer min-h-[400px] md:min-h-[650px] outline outline-1 outline-[#D4AF37]/60 outline-offset-[-12px] flex">
            <img 
              src="/Images/banasari.png" 
              alt="Banarasi Collection" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            {/* Deep Neutral Shadow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 p-10 md:p-14 flex flex-col justify-end w-full h-full mt-auto pointer-events-none">
              <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">HERITAGE</span>
              <h3 className="font-display-lg text-3xl md:text-[56px] leading-tight text-white mb-3 drop-shadow-lg transform group-hover:-translate-y-2 transition-transform duration-500">Banarasi Collection</h3>
              <p className="text-white/80 text-sm font-body font-light mb-6 md:mb-8 pr-4 md:pr-12 leading-relaxed transform group-hover:-translate-y-2 transition-transform duration-500 delay-75 pointer-events-auto">
                Woven with golden threads of heritage, these pure Banarasi silks bring timeless royal grandeur and unparalleled craftsmanship to your everyday wardrobe.
              </p>
              <div className="flex items-center gap-2 text-white font-label-caps text-xs tracking-widest group-hover:text-[#D4AF37] transition-colors pointer-events-auto">
                <span className="border-b border-[#D4AF37] pb-1">EXPLORE COLLECTION</span>
                <span className="material-symbols-outlined text-sm transform group-hover:translate-x-2 transition-transform">east</span>
              </div>
            </div>
          </div>

          {/* Right Stacked Cards - Perfectly Aligned */}
          <div className="w-full md:w-5/12 flex flex-col gap-6">
            {/* Top Right Card */}
            <div className="flex-1 relative group overflow-hidden rounded-sm shadow-xl cursor-pointer outline outline-1 outline-[#D4AF37]/60 outline-offset-[-10px] flex min-h-[300px]">
              <img 
                src="/Images/kanchi.png" 
                alt="Kanchipuram Silk" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 p-8 flex flex-col justify-end w-full h-full mt-auto pointer-events-none">
                <h3 className="font-display-lg text-2xl md:text-3xl text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">Kanchipuram Silk</h3>
                <p className="text-white/80 text-xs font-body font-light mb-4 leading-relaxed pr-6 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75 pointer-events-auto">
                  Exquisite temple motifs and rich zari work handwoven by the master artisans of Kanchipuram.
                </p>
                <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-auto">VIEW COLLECTION →</span>
              </div>
            </div>

            {/* Bottom Right Card */}
            <div className="flex-1 relative group overflow-hidden rounded-sm shadow-xl cursor-pointer outline outline-1 outline-[#D4AF37]/60 outline-offset-[-10px] flex min-h-[300px]">
              <img 
                src="/Images/cotton.png" 
                alt="Soft Cotton" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 p-8 flex flex-col justify-end w-full h-full mt-auto pointer-events-none">
                <h3 className="font-display-lg text-2xl md:text-3xl text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">Soft Cotton</h3>
                <p className="text-white/80 text-xs font-body font-light mb-4 leading-relaxed pr-6 transform group-hover:-translate-y-2 transition-transform duration-500 delay-75 pointer-events-auto">
                  Breathable, lightweight, and effortlessly elegant cotton drapes designed for your everyday grace.
                </p>
                <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-auto">VIEW COLLECTION →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Best Sellers */}
      <section className={`${styles['bestsellers-section']} container`}>
        <div className={styles['section-header-center']}>
          <span className={styles['section-label-small']}>EXCLUSIVES</span>
          <h2>The Best Sellers</h2>
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
            <div className={styles['gold-divider']}></div>
            <p className={styles['bridal-quote']}>
              "For the most sacred moments, we weave dreams into silk. Discover our exclusive bridal collection, where every thread is a testament to tradition and every weave is a blessing."
            </p>
            <button className={styles['btn-bridal-explore']}>DISCOVER THE COLLECTION</button>
          </div>
        </div>
      </section>

      {/* 6. Our Story */}
      <section className={`${styles['story-section']} container`}>
        <div className={styles['story-grid']}>
          <div className={styles['story-image-pane']}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCikpQ9GWpGx4o_O9UH9sn_G1jaqTxvOOqN3-nDWsM1UqPPM7YlHjC-L580RsvNjQbMmWCjJWoK_Bi6-yQEuEdXxztXe65K5niFoqvx817_Rp02ldELr7DouQ32JSISkx9OG-kV2unqSOGhDCOH4JSGJeZLqOEvlZvD2934b0i_GcWlsSLqiMFwE89s2N_6dObA46O9hM1_J7Khb9i2Tr7kNYw4iS0nleQLZs1iCEVXPO4V5XD4NHwS" 
              alt="Artisans weaving tradition" 
            />
          </div>
          <div className={styles['story-text-pane']}>
            <span className={styles['story-label']}>OUR STORY</span>
            <h2>Every Thread Carries Tradition</h2>
            <p className={styles['story-quote-italic']}>
              "For centuries, the loom has been the heartbeat of our heritage. At Mazhai Vaanam, we don't just sell sarees; we preserve the rhythmic dance of the artisan's hands."
            </p>
            <p>
              Our journey began with a single loom in the heart of Tamil Nadu. Today, we work with over 200 master artisans across India to bring you pieces that are as unique as the women who wear them. Each Mazhai Vaanam saree takes 15-20 days to weave, ensuring that the legacy of slow fashion thrives in a fast-paced world.
            </p>
            <button 
              className={styles['btn-meet-artisans']}
              onClick={() => setCurrentTab('about')}
            >
              MEET OUR ARTISANS <span className={styles['arrow-icon']}>→</span>
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
              <p>Every piece arrives in a handcrafted, eco-friendly heritage box.</p>
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
          <div className={styles['header-line']}></div>
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
