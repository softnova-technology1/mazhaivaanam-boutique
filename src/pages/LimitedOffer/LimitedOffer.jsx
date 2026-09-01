import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLimitedOfferProducts, getProducts } from '../../services/api';
import styles from './LimitedOffer.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const LimitedOffer = ({ setCurrentTab, setSelectedProduct }) => {
  // Live Config State from DB
  const [config, setConfig] = useState({
    heroSection: {
      badgeText: 'Limited Exclusive Offer',
      title: 'Exclusive Offers,',
      titleItalic: 'Limited Time',
      subtitle: 'Enjoy special prices on selected sarees for a limited period. Elevate your wardrobe with premium collections while these exclusive offers last.',
      bgImage: '/Images/limited.png',
      primaryCtaText: 'EXPLORE COLLECTION',
      secondaryCtaText: 'OUR HERITAGE',
    },
    timerSection: {
      badgeText: 'Time is running out',
      title: 'The Grand Gala Sale',
      description: 'Our most prestigious annual celebration ends soon. Secure your heritage pieces today before they return to the vault.',
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    featuredDuoSection: {
      badgeText: 'Curated Festival Duo',
      heading: 'The Heritage Gift',
      subHeading: 'Buy 2 Sarees, Get 1 Free',
      description: 'Embrace the timeless tradition of gifting. Choose from our exquisite hand-woven silk collections and receive a complimentary heritage piece as a symbol of our festive gratitude.',
      image: '/Images/heritage.png',
      ctaText: 'Explore Collection',
    },
    curationOfJoySection: {
      badgeText: 'Curation of Joy',
      heading: 'Bespoke Offer Tiers',
      cards: [
        { title: 'Diwali Offers', discountBadge: 'UP TO 40%', image: '/Images/diwali.png', linkTab: 'catalog' },
        { title: 'Bridal Offers', discountBadge: '20% OFF', image: '/Images/bridal.png', linkTab: 'catalog' },
        { title: 'Combo Set', discountBadge: 'SAVE 5K', image: '/Images/wedding.png', linkTab: 'catalog' },
      ],
    },
    spinningWheelSection: {
      title: 'Festival Lucky Draw',
      description: 'Spin the heritage wheel for a chance to win exclusive gift cards, artisan blouses, or a signature silk saree from our royal vault.',
      bulletPoints: [
        'Grand Prize: Royal Banarasi Saree',
        'Gift Cards worth ₹ 10,000',
        'Artisan Blouse Customizations',
      ],
      prizes: [
        'Premium Saree',
        '10% Discount',
        'Free Styling',
        'Surprise Box',
        'Artisan Blouse',
        'Free Shipping',
      ],
    },
  });

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 45, seconds: 0 });

  // 2-Word Text Carousel for Hero Title
  const italicPhrases = React.useMemo(() => {
    const raw = config.heroSection?.titleItalic ? config.heroSection.titleItalic.trim() : '';
    const customList = raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    if (customList.length > 0) return customList;
    return ["Limited Time", "Festive Deals", "Special Savings", "Royal Vault", "Handloom Luxury"];
  }, [config.heroSection?.titleItalic]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!italicPhrases || italicPhrases.length <= 1) return;
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setPhraseIndex(prev => (prev + 1) % italicPhrases.length);
        setIsFading(false);
      }, 400);
    }, 2800);

    return () => clearInterval(timer);
  }, [italicPhrases]);
  
  // Lucky Draw State
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinText, setSpinText] = useState("SPIN THE WHEEL");
  const [wonPrize, setWonPrize] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [spinCoupon, setSpinCoupon] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // View All Offers State
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [liveProducts, setLiveProducts] = useState([]);


  // Fetch Live Config from Backend
  useEffect(() => {
    fetch(`${API_BASE}/limited-offer/config`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.data) {
          const d = data.data;
          setConfig(prev => ({
            heroSection: { ...prev.heroSection, ...(d.heroSection || {}) },
            timerSection: { ...prev.timerSection, ...(d.timerSection || {}) },
            featuredDuoSection: { ...prev.featuredDuoSection, ...(d.featuredDuoSection || {}) },
            offerProductsSection: { ...prev.offerProductsSection, ...(d.offerProductsSection || {}) },
            eligibleGallerySection: { ...prev.eligibleGallerySection, ...(d.eligibleGallerySection || {}) },
            curationOfJoySection: {
              ...prev.curationOfJoySection,
              ...(d.curationOfJoySection || {}),
              cards: d.curationOfJoySection?.cards?.length ? d.curationOfJoySection.cards : prev.curationOfJoySection.cards
            },
            spinningWheelSection: {
              ...prev.spinningWheelSection,
              ...(d.spinningWheelSection || {}),
              bulletPoints: d.spinningWheelSection?.bulletPoints?.length ? d.spinningWheelSection.bulletPoints : prev.spinningWheelSection.bulletPoints,
              prizes: d.spinningWheelSection?.prizes?.length === 6 ? d.spinningWheelSection.prizes : prev.spinningWheelSection.prizes
            },
          }));
        }
      })
      .catch(err => console.log('Using default offer config:', err));
  }, []);

  // Fetch Offer Products — prefer FESTIVAL CHOICE tagged, fallback to all
  useEffect(() => {
    let isMounted = true;
    const mapItems = (products) => products.map(p => ({
      id: p._id || p.id,
      title: p.name,
      price: `₹ ${p.price.toLocaleString('en-IN')}`,
      image: p.images?.[0]?.url || p.image || '/Images/saree1.png',
      tag: p.tag || 'LIMITED OFFER',
      raw: p,
    }));

    // First: try to get FESTIVAL CHOICE tagged products
    getProducts({ limit: 8, tag: 'FESTIVAL CHOICE' })
      .then(res => {
        if (!isMounted) return;
        if (res.products && res.products.length > 0) {
          setLiveProducts(mapItems(res.products));
        } else {
          // Fallback: any 8 products if no tagged ones exist
          return getProducts({ limit: 8 }).then(fb => {
            if (isMounted && fb.products?.length > 0) {
              setLiveProducts(mapItems(fb.products));
            }
          });
        }
      })
      .catch(console.error);
    return () => { isMounted = false; };
  }, []);

  const galleryItems = liveProducts;

  // Gallery Carousel Ref
  const galleryRef = useRef(null);
  const autoScrollPausedRef = useRef(false);
  const pauseTimerRef = useRef(null);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      autoScrollPausedRef.current = true;
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      
      const scrollAmount = 360;
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });

      pauseTimerRef.current = setTimeout(() => {
        autoScrollPausedRef.current = false;
      }, 3000);
    }
  };

  // Dynamic Countdown Timer Logic based on config.timerSection.endDate
  useEffect(() => {
    const targetDateStr = config.timerSection.endDate;
    const target = targetDateStr ? new Date(targetDateStr).getTime() : new Date().getTime() + (3 * 24 * 60 * 60 * 1000);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [config.timerSection.endDate]);

  // Spinning Wheel Logic
  const handleSpinWheel = () => {
    if (isSpinning) return;

    // Must be logged in to get a real prize
    const token = localStorage.getItem('boutique_token');
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    const extraRotation = Math.floor(Math.random() * 360) + 1440;
    const newRotation = rotation + extraRotation;

    setRotation(newRotation);
    setIsSpinning(true);
    setSpinText('SPINNING...');
    setSpinCoupon(null);

    setTimeout(async () => {
      setIsSpinning(false);
      setSpinText('SPIN AGAIN');

      try {
        const res = await fetch(`${API_BASE}/limited-offer/spin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.success) {
          setWonPrize(data.data.prize);
          setSpinCoupon(data.data.couponCode || null);
        } else {
          // Already spun today or error
          setWonPrize(data.message || 'Come back tomorrow!');
          setSpinCoupon(null);
        }
      } catch {
        // Network error — fallback to frontend random
        const winningAngle = (360 - (newRotation % 360)) % 360;
        const winningIndex = Math.floor(winningAngle / 60);
        const prizes = config.spinningWheelSection.prizes || ['Premium Saree', '10% Discount', 'Free Styling', 'Surprise Box', 'Artisan Blouse', 'Free Shipping'];
        setWonPrize(prizes[winningIndex] || prizes[0]);
        setSpinCoupon(null);
      }

      setShowPopup(true);
    }, 4100);
  };

  return (
    <div className="text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="pt-0">
        {/* Hero Section */}
        <section 
          className="relative min-h-[480px] md:min-h-[600px] md:h-[600px] py-12 md:py-0 flex flex-col items-center justify-center text-center px-4 overflow-hidden"
          style={{ 
            backgroundImage: `url('${config.heroSection.bgImage || '/Images/limited.png'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          
          <div className="relative z-10 hero-content flex flex-col items-center justify-center mt-6 md:mt-0 pb-6 md:pb-0">
            <div className="inline-flex items-center px-5 py-2 mb-4 md:mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="font-label-caps text-[10px] text-white tracking-[0.2em] uppercase">{config.heroSection.badgeText}</span>
            </div>
            
            <h1 className="font-display-lg text-3xl md:text-[42px] text-white mb-3 md:mb-4 leading-[1.1] drop-shadow-2xl">
              {config.heroSection.title}{' '}
              <span 
                className={`italic serif font-light inline-block pr-2 transition-all duration-500 ease-in-out ${
                  isFading ? 'opacity-0 transform -translate-y-1 scale-95' : 'opacity-100 transform translate-y-0 scale-100'
                } ${styles['text-shimmer']}`}
                style={{ overflow: 'visible' }}
              >
                {italicPhrases[phraseIndex]}
              </span>
            </h1>
            
            <p className="text-white/90 text-sm md:text-lg mb-6 md:mb-10 max-w-4xl mx-auto">
              {config.heroSection.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[280px] sm:max-w-none mx-auto">
              <button 
                onClick={() => setCurrentTab('shop')}
                className="btn-cloud w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-4 bg-secondary text-white hover:bg-white hover:text-secondary transition-all duration-500 font-label-caps text-label-caps tracking-widest shadow-[0_8px_30px_rgb(179,138,74,0.3)] hover:shadow-[0_8px_30px_rgb(255,255,255,0.4)] transform hover:-translate-y-1"
              >
                {config.heroSection.primaryCtaText}
              </button>
              <button 
                onClick={() => setCurrentTab('about')}
                className="pill rounded-full w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-4 border border-white text-white bg-transparent hover:bg-[#FFBEA2] hover:text-[#4F4E22] hover:border-[#FFBEA2] transition-all duration-500 font-label-caps text-label-caps tracking-widest transform hover:-translate-y-1"
              >
                {config.heroSection.secondaryCtaText}
              </button>
            </div>
          </div>
        </section>

        {/* Live Offer Countdown */}
        <section className="relative -mt-12 md:-mt-24 z-20 px-4 md:px-margin-desktop">
          <div className="max-w-7xl mx-auto bg-[#FDFBF7] border border-[#D4AF37]/40 py-6 px-4 md:p-14 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 shadow-[0_20px_50px_rgba(179,138,74,0.15)] relative overflow-hidden">
            <div className="flex-1 text-center md:text-left relative z-10">
              <span className="font-label-caps text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase block mb-2 md:mb-4">{config.timerSection.badgeText}</span>
              <h2 className="font-display-lg font-bold tracking-tight text-2xl sm:text-3xl md:text-5xl mb-3 md:mb-5 text-[#B38A4A]">{config.timerSection.title}</h2>
              <p className="text-on-surface-variant max-w-md mx-auto md:mx-0 text-xs sm:text-sm md:text-base leading-relaxed">
                {config.timerSection.description}
              </p>
            </div>
            
            <div className="flex gap-2 sm:gap-3 md:gap-4 text-center relative z-10" id="countdown">
              <div className="flex flex-col items-center justify-center bg-white border border-[#D4AF37]/20 backdrop-blur-md rounded-xl p-2.5 sm:p-3 min-w-[60px] sm:min-w-[72px] md:p-4 md:min-w-[85px] shadow-sm">
                <span className="font-display-lg text-xl sm:text-2xl md:text-4xl text-primary">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[7px] sm:text-[8px] md:text-[9px] text-[#D4AF37] tracking-[0.2em] mt-1 md:mt-2">DAYS</span>
              </div>
              <div className="font-display-lg text-xl sm:text-2xl md:text-4xl text-primary/30 self-center -mt-3 md:-mt-6">:</div>
              <div className="flex flex-col items-center justify-center bg-white border border-[#D4AF37]/20 backdrop-blur-md rounded-xl p-2.5 sm:p-3 min-w-[60px] sm:min-w-[72px] md:p-4 md:min-w-[85px] shadow-sm">
                <span className="font-display-lg text-xl sm:text-2xl md:text-4xl text-primary">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[7px] sm:text-[8px] md:text-[9px] text-[#D4AF37] tracking-[0.2em] mt-1 md:mt-2">HOURS</span>
              </div>
              <div className="font-display-lg text-xl sm:text-2xl md:text-4xl text-primary/30 self-center -mt-3 md:-mt-6">:</div>
              <div className="flex flex-col items-center justify-center bg-white border border-[#D4AF37]/20 backdrop-blur-md rounded-xl p-2.5 sm:p-3 min-w-[60px] sm:min-w-[72px] md:p-4 md:min-w-[85px] shadow-sm">
                <span className="font-display-lg text-xl sm:text-2xl md:text-4xl text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[7px] sm:text-[8px] md:text-[9px] text-[#D4AF37] tracking-[0.2em] mt-1 md:mt-2">MINS</span>
              </div>
              <div className="font-display-lg text-xl sm:text-2xl md:text-4xl text-primary/30 self-center -mt-3 md:-mt-6">:</div>
              <div className="flex flex-col items-center justify-center bg-white border border-[#D4AF37]/20 backdrop-blur-md rounded-xl p-2.5 sm:p-3 min-w-[60px] sm:min-w-[72px] md:p-4 md:min-w-[85px] shadow-sm">
                <span className="font-display-lg text-xl sm:text-2xl md:text-4xl text-[#B38A4A] font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[7px] sm:text-[8px] md:text-[9px] text-[#D4AF37] tracking-[0.2em] mt-1 md:mt-2">SECS</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Offer Banner */}
        <section className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low overflow-hidden">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-20">
            <div className="hidden md:block relative group h-[600px] overflow-hidden rounded-xl">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Featured Duo" 
                src={config.featuredDuoSection.image || '/Images/heritage.png'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-px bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] uppercase">{config.featuredDuoSection.badgeText}</span>
              </div>
              
              <h2 className="font-display-lg text-4xl md:text-[56px] text-primary mb-3 leading-[1.1]">
                {config.featuredDuoSection.heading}
              </h2>
              
              <div className="font-label-caps text-[12px] md:text-[14px] tracking-[0.2em] text-[#B38A4A] mb-8 uppercase font-medium">
                {config.featuredDuoSection.subHeading}
              </div>
              
              <p className="text-[#4A4F40] text-base md:text-lg mb-12 leading-[1.8] max-w-lg font-light">
                {config.featuredDuoSection.description}
              </p>
              
              <div>
                <div 
                  onClick={() => setCurrentTab('shop')} 
                  className="inline-flex items-center justify-center gap-4 px-12 py-4 bg-transparent border-[1.5px] border-primary text-primary font-label-caps text-[11px] tracking-[0.25em] uppercase hover:bg-primary hover:text-white transition-colors duration-500 group cursor-pointer"
                >
                  <span>{config.featuredDuoSection.ctaText || 'Explore Collection'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offer Products Grid */}
        <section className="pt-10 md:pt-16 pb-0 px-3 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex flex-col items-center mb-8 md:mb-14 text-center">
            <div className="flex items-center gap-3 mb-2 md:mb-4">
              <div className="w-8 md:w-12 h-px bg-[#D4AF37]"></div>
              <span className="text-[#D4AF37] font-label-caps text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase">{config?.offerProductsSection?.badgeText || 'Festive Deals'}</span>
              <div className="w-8 md:w-12 h-px bg-[#D4AF37]"></div>
            </div>
            <h3 className="font-display-lg text-2xl sm:text-4xl md:text-5xl text-primary leading-tight">{config?.offerProductsSection?.heading || 'Exclusive Offers'}</h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-8">
            {(showAllOffers ? [...galleryItems, ...galleryItems.slice(0, 2)] : galleryItems.slice(0, 4)).map((item, index) => {
              const originalPrice = Math.round(parseInt(item.price.replace(/[^\d]/g, '')) * 1.4);
              return (
                <div key={`offer-${index}`} className="group cursor-pointer flex flex-col items-center bg-white border border-[#E9DDC7] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500" onClick={() => {
                  if (setSelectedProduct) {
                    setSelectedProduct(item.raw || {
                      id: `offer-${index}`,
                      name: item.title,
                      price: parseInt(item.price.replace(/[^\d]/g, '')),
                      image: item.image,
                    });
                  }
                  setCurrentTab('product-detail');
                }}>
                  <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container-high">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt={item.title}
                      src={item.image}
                    />
                    {(() => {
                      const d = item.raw?.discount;
                      const active = item.raw?.discountActive;
                      let badgeText = 'SPECIAL PRICE';
                      if (active && d?.value) {
                        badgeText = d.type === 'percentage'
                          ? `FLAT ${d.value}% OFF`
                          : `₹${Number(d.value).toLocaleString('en-IN')} OFF`;
                      }
                      return (
                        <div className="absolute top-2 left-2 bg-red-700 text-white px-2 py-0.5 shadow-sm rounded-sm">
                          <span className="font-label-caps text-[7px] md:text-[8.5px] tracking-[0.1em] md:tracking-[0.15em] uppercase font-bold whitespace-nowrap leading-none block">{badgeText}</span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="text-center flex-1 flex flex-col justify-start p-2.5 md:p-4 w-full">
                    <h4 className="font-display-lg text-[12px] sm:text-[14px] md:text-[18px] text-primary mb-1 leading-snug group-hover:text-[#B38A4A] transition-colors truncate">{item.title}</h4>
                    <div className="flex items-center justify-center gap-1.5 md:gap-3 mt-0.5 flex-wrap">
                      <p className="text-[#5F6652]/60 line-through text-[9.5px] md:text-[12px]">₹ {originalPrice.toLocaleString('en-IN')}</p>
                      <p className="text-red-700 font-label-caps text-[11px] md:text-[13px] tracking-wide font-bold">{item.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center mt-6 md:mt-10 mb-8 md:mb-12">
            <button 
              onClick={() => setShowAllOffers(!showAllOffers)}
              className="px-10 py-3.5 bg-[#4F4E22] text-white font-bold font-label-caps text-[11px] md:text-[12px] tracking-[0.2em] uppercase hover:bg-[#3D3C1A] hover:scale-105 active:scale-95 transition-all duration-300 rounded-full shadow-lg border border-[#3D3C1A]/20 cursor-pointer"
              style={{ backgroundColor: '#4F4E22', color: '#ffffff' }}
            >
              {showAllOffers ? "VIEW LESS" : "VIEW ALL OFFERS"}
            </button>
          </div>
        </section>

        {/* Eligible Gallery Carousel Section */}
        <section className="pt-8 md:pt-16 pb-0 px-3 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-8 md:mb-14">
            <div>
              <div className="flex items-center gap-3 mb-2 md:mb-4">
                <div className="w-8 h-px bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-label-caps text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase">{config?.eligibleGallerySection?.badgeText || 'Eligible Selection'}</span>
              </div>
              <h3 className="font-display-lg text-2xl sm:text-4xl md:text-5xl text-primary leading-tight">{config?.eligibleGallerySection?.heading || 'The Buy 2 Get 1 Gallery'}</h3>
            </div>
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => scrollGallery('left')} 
                className="w-11 h-11 flex items-center justify-center border border-[#D4AF37] rounded-full text-[#4F4E22] bg-[#FAF9F6] hover:bg-[#4F4E22] hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={20} strokeWidth={2.2} />
              </button>
              <button 
                onClick={() => scrollGallery('right')} 
                className="w-11 h-11 flex items-center justify-center border border-[#D4AF37] rounded-full text-[#4F4E22] bg-[#FAF9F6] hover:bg-[#4F4E22] hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <ChevronRight size={20} strokeWidth={2.2} />
              </button>
            </div>
          </div>
          
          <div ref={galleryRef} className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 lg:gap-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[...galleryItems, ...galleryItems].map((item, index) => (
              <div key={index} className="w-[120px] sm:w-[160px] md:w-[240px] shrink-0 group cursor-pointer flex flex-col items-center bg-white border border-[#E9DDC7] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500" onClick={() => setCurrentTab('shop')}>
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container-high">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    alt={item.title}
                    src={item.image}
                  />
                  {item.tag && (
                    <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-1.5 py-0.5 shadow-sm border border-white/40 rounded-sm">
                      <span className="text-[#B38A4A] font-label-caps text-[6.5px] md:text-[8.5px] tracking-[0.1em] uppercase font-bold leading-none block">{item.tag}</span>
                    </div>
                  )}
                </div>
                <div className="text-center flex-1 flex flex-col justify-start p-2.5 md:p-3 w-full">
                  <h4 className="font-display-lg text-[12px] sm:text-[13px] md:text-[17px] text-primary mb-1 leading-snug group-hover:text-[#B38A4A] transition-colors truncate">{item.title}</h4>
                  <div className="flex items-center justify-center gap-1.5 md:gap-2 mt-0.5">
                    <div className="w-2 md:w-3 h-[1px] bg-[#D4AF37]/40"></div>
                    <p className="text-[#5F6652] font-label-caps text-[9.5px] md:text-[10px] tracking-wide font-bold">{item.price}</p>
                    <div className="w-2 md:w-3 h-[1px] bg-[#D4AF37]/40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Offer Categories (Bento Grid) */}
        <section 
          className="relative pt-8 md:pt-16 pb-6 md:pb-16 px-3 sm:px-6 md:px-margin-desktop text-white bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/Images/offer.png')" }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10 max-w-container-max mx-auto">
            <div className="mb-5 md:mb-10 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-4 mb-2 md:mb-3">
                <div className="w-12 h-px bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] uppercase">{config.curationOfJoySection.badgeText}</span>
                <div className="w-12 h-px bg-[#D4AF37]"></div>
              </div>
              <h2 className="font-display-lg text-2xl sm:text-3xl md:text-[52px] leading-tight text-[#FDFBF7]">{config.curationOfJoySection.heading}</h2>
            </div>
            
            <div className="flex flex-row justify-center md:grid md:grid-cols-3 gap-3 md:gap-6 h-auto md:h-[360px] pt-2">
              {config.curationOfJoySection.cards.map((card, idx) => (
                <div 
                  key={idx} 
                  className="relative group overflow-hidden rounded-full md:rounded-t-full md:rounded-b-md border border-[#D4AF37] md:border-[#D4AF37]/40 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 w-24 h-24 mx-auto md:w-full md:h-full flex shrink-0 items-center justify-center md:block bg-black/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none" 
                  onClick={() => setCurrentTab(card.linkTab || 'shop')}
                >
                  <img 
                    className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={card.title} 
                    src={card.image || '/Images/diwali.png'}
                  />
                  <div className="hidden md:block absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700"></div>
                  
                  <div className="md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[85%] md:bg-black/40 md:backdrop-blur-md md:border border-[#D4AF37]/30 p-1 md:p-5 flex flex-col items-center justify-center text-center transform md:translate-y-2 group-hover:translate-y-0 transition-transform duration-700 w-full h-full md:h-auto rounded-full md:rounded-none">
                    <h3 className="font-display-lg text-[12px] md:text-[28px] mb-0.5 md:mb-2 text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors duration-500">{card.title}</h3>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-1.5 md:w-4 h-[1px] bg-[#D4AF37]"></div>
                      <span className="font-label-caps text-[6px] md:text-[9px] tracking-[0.1em] md:tracking-[0.2em] text-[#D4AF37] whitespace-nowrap">{card.discountBadge}</span>
                      <div className="w-1.5 md:w-4 h-[1px] bg-[#D4AF37]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lucky Draw Spinning Wheel Section */}
        <section className="pt-8 md:pt-16 pb-16 px-3 sm:px-6 md:px-margin-desktop max-w-container-max mx-auto">
          <div className="bg-[#FDFBF7] rounded-3xl border border-[#D4AF37]/30 shadow-[0_15px_40px_rgba(0,0,0,0.05)] p-5 sm:p-8 md:p-14 overflow-hidden relative">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
              <div>
                <h3 className="font-display-lg text-2xl sm:text-4xl md:text-[48px] text-[#2D3326] mb-3 md:mb-5 leading-tight">{config.spinningWheelSection.title}</h3>
                <p className="text-[#2D3326]/80 text-xs sm:text-base mb-5 md:mb-8 font-normal leading-relaxed max-w-lg">{config.spinningWheelSection.description}</p>
                
                <ul className="space-y-2.5 sm:space-y-3.5 mb-6 md:mb-8">
                  {config.spinningWheelSection.bulletPoints.map((bp, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[#2D3326] text-xs sm:text-sm font-medium">
                      <span className="material-symbols-outlined text-[#D4AF37] text-base sm:text-lg shrink-0 mt-0.5">check_circle</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={handleSpinWheel}
                  disabled={isSpinning}
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary font-label-caps text-xs tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95 disabled:opacity-50" 
                  id="spin-btn"
                >
                  {spinText}
                </button>
              </div>
              
              <div className="relative flex justify-center py-4 md:py-6">
                <div 
                  className="w-56 h-56 sm:w-72 sm:h-72 md:w-[400px] md:h-[400px] border-4 md:border-8 border-[#D4AF37] relative shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white" 
                  id="wheel"
                  style={{
                    borderRadius: '50%',
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                    <div 
                      className="w-full h-full" 
                      style={{ 
                        borderRadius: '50%',
                        background: 'conic-gradient(#490017 0deg 60deg, #fed579 60deg 120deg, #a13b51 120deg 180deg, #ffb2bc 180deg 240deg, #6b102a 240deg 300deg, #775a04 300deg 360deg)' 
                      }}
                    ></div>
                    
                    {config.spinningWheelSection.prizes.map((prizeText, i) => {
                      const isBottomHalf = i > 1 && i < 5;
                      return (
                        <div 
                          key={i} 
                          className="absolute inset-0 flex items-start justify-center"
                          style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                        >
                          <div className={`pt-4 sm:pt-6 md:pt-10 w-20 sm:w-24 text-center font-display-lg text-[9.5px] sm:text-[11px] md:text-sm tracking-wide leading-tight ${i % 2 === 0 ? 'text-white' : 'text-[#490017]'}`}>
                            <span className="block" style={{ transform: isBottomHalf ? 'rotate(180deg)' : 'none' }}>
                              {prizeText}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div 
                      className={`w-8 h-8 md:w-10 md:h-10 bg-white rounded-full z-10 shadow-xl border-2 md:border-4 border-[#D4AF37] pointer-events-auto flex items-center justify-center transition-all duration-300 ${isSpinning ? 'opacity-80' : 'cursor-pointer hover:scale-110 hover:shadow-2xl'}`}
                      onClick={isSpinning ? undefined : handleSpinWheel}
                      title={isSpinning ? "Spinning..." : "Click to Spin!"}
                    >
                      <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-[#D4AF37] rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Golden Indicator */}
                <div 
                  className="absolute -top-1 md:-top-2 left-1/2 -translate-x-1/2 w-6 h-9 md:w-8 md:h-12 bg-[#D4AF37] z-20 drop-shadow-md" 
                  style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Prize Popup Modal */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-[#FDFBF7] rounded-[2rem] border-2 border-[#D4AF37] p-10 max-w-md w-full text-center shadow-2xl relative animate-in zoom-in-95 duration-500">
              <button 
                onClick={() => setShowPopup(false)}
                className="absolute top-6 right-6 text-[#2D3326]/50 hover:text-[#2D3326] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#D4AF37]">
                <span className="material-symbols-outlined text-4xl">workspace_premium</span>
              </div>
              <h3 className="font-display-lg text-3xl text-[#2D3326] mb-2">Congratulations!</h3>
              <p className="text-[#2D3326]/70 mb-6">You've unlocked an exclusive boutique reward.</p>
              
              <div className="bg-white border border-[#D4AF37]/30 rounded-xl py-6 px-4 mb-5 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#490017] via-[#D4AF37] to-[#490017]"></div>
                <span className="block font-label-caps text-[#D4AF37] text-[10px] tracking-widest uppercase mb-2">Your Prize</span>
                <span className="font-display-lg text-[32px] text-[#490017] font-bold leading-none">{wonPrize}</span>
              </div>

              {spinCoupon && (
                <div className="bg-[#FFF8EC] border border-[#D4AF37]/50 rounded-xl py-4 px-4 mb-5">
                  <span className="block font-label-caps text-[#4F4E22] text-[10px] tracking-widest uppercase mb-2">Your Coupon Code</span>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-display-lg text-[22px] text-[#490017] font-bold tracking-widest">{spinCoupon}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(spinCoupon);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="p-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 transition-colors"
                      title="Copy code"
                    >
                      <span className="material-symbols-outlined text-[#4F4E22] text-sm">{copiedCode ? 'check' : 'content_copy'}</span>
                    </button>
                  </div>
                  <p className="text-[#4F4E22]/60 text-[11px] mt-2">Valid for 7 days · Use at checkout</p>
                </div>
              )}
              
              <button 
                onClick={() => setShowPopup(false)}
                className="w-full py-4 bg-[#D4AF37] text-white font-bold font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-[#490017] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl"
              >
                {spinCoupon ? 'Use Coupon at Checkout' : 'Claim Reward'}
              </button>
            </div>
          </div>
        )}

        {/* Login Prompt — shown when guest tries to spin */}
        {showLoginPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#FDFBF7] rounded-[2rem] border-2 border-[#D4AF37] p-10 max-w-sm w-full text-center shadow-2xl relative">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-6 right-6 text-[#2D3326]/50 hover:text-[#2D3326] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-5 text-[#D4AF37]">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <h3 className="font-display-lg text-2xl text-[#2D3326] mb-2">Login to Spin!</h3>
              <p className="text-[#2D3326]/60 text-sm mb-6">You need to be logged in to spin the wheel and claim real prizes.</p>
              <button
                onClick={() => { setShowLoginPrompt(false); setCurrentTab('login'); }}
                className="w-full py-3.5 bg-[#D4AF37] text-white font-bold font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-[#490017] transition-all duration-300 rounded-full shadow-lg"
              >
                Login / Sign Up
              </button>
            </div>
          </div>
        )}



      </main>
    </div>
  );
};

export default LimitedOffer;
