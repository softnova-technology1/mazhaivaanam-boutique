import React, { useState, useEffect, useRef } from 'react';
import { getProducts } from '../../services/api';
import styles from './LimitedOffer.module.css';

export const LimitedOffer = ({ setCurrentTab, setSelectedProduct }) => {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 45 });
  
  // Lucky Draw State
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinText, setSpinText] = useState("SPIN THE WHEEL");
  const [wonPrize, setWonPrize] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  
  // Copy Coupons State
  const [copiedCode, setCopiedCode] = useState(null);

  // View All Offers State
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    getProducts({ limit: 6 })
      .then(res => {
        if (isMounted && res.products && res.products.length > 0) {
          const items = res.products.map(p => ({
            id: p.id,
            title: p.name,
            price: `₹ ${p.price.toLocaleString('en-IN')}`,
            image: p.image,
            tag: p.tag || 'FESTIVAL CHOICE',
            raw: p
          }));
          setLiveProducts(items);
        }
      })
      .catch(console.error);
    return () => { isMounted = false; };
  }, []);

  const galleryItems = liveProducts.length > 0 ? liveProducts : [
    {
      title: "Banarasi Silk Elegance",
      price: "₹ 14,500",
      image: "/Images/silk1.png",
      tag: "FESTIVAL CHOICE"
    },
    {
      title: "Golden Temple Kanchipuram",
      price: "₹ 22,800",
      image: "/Images/saree1.png",
      tag: "BESTSELLER"
    },
    {
      title: "Handloom Cotton Saree",
      price: "₹ 4,200",
      image: "/Images/fancy1.png",
      tag: "NEW ARRIVAL"
    }
  ];

  // WebGL Canvas Ref
  const canvasRef = useRef(null);

  // Gallery Carousel Ref
  const galleryRef = useRef(null);

  const scrollGallery = (direction) => {
    if (galleryRef.current) {
      const scrollAmount = 340; // match the width of the card
      galleryRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll effect (Continuous Marquee)
  useEffect(() => {
    let animationId;
    const scrollNode = galleryRef.current;
    
    if (!scrollNode) return;

    let isHovered = false;

    const scroll = () => {
      if (!isHovered) {
        scrollNode.scrollLeft += 1; // Speed of the continuous scroll
        
        // When we've scrolled exactly halfway (past the first set), seamlessly reset to start
        if (scrollNode.scrollLeft >= scrollNode.scrollWidth / 2) {
          scrollNode.scrollLeft -= scrollNode.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    // Pause on hover
    const pause = () => { isHovered = true; };
    const resume = () => { isHovered = false; };

    scrollNode.addEventListener('mouseenter', pause);
    scrollNode.addEventListener('mouseleave', resume);
    // Touch support for pausing
    scrollNode.addEventListener('touchstart', pause, { passive: true });
    scrollNode.addEventListener('touchend', resume, { passive: true });
    
    return () => {
      cancelAnimationFrame(animationId);
      scrollNode.removeEventListener('mouseenter', pause);
      scrollNode.removeEventListener('mouseleave', resume);
      scrollNode.removeEventListener('touchstart', pause);
      scrollNode.removeEventListener('touchend', resume);
    };
  }, []);

  // WebGL Canvas animation setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = v_texCoord;
    vec2 p = (uv - 0.5) * u_resolution.xy / min(u_resolution.x, u_resolution.y);
    
    // Background: Deep Sage Green gradient (brand-aligned)
    vec3 colorSage = vec3(0.482, 0.518, 0.404); // #7B8467
    vec3 colorOlive = vec3(0.373, 0.400, 0.322); // #5F6652
    vec3 baseColor = mix(colorSage, colorOlive * 0.5, length(p));
    
    // Golden Shimmer / Silk floating effect
    float shimmer = sin(uv.x * 5.0 + u_time * 0.5) * cos(uv.y * 3.0 - u_time * 0.3);
    vec3 gold = vec3(0.702, 0.541, 0.290); // #B38A4A
    
    vec3 finalColor = mix(baseColor, gold, shimmer * 0.05 * (1.0 - length(p)));
    
    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    function render(t) {
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    
    render(0);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    const target = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft({ days: d, hours: h, minutes: m });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Spinning Wheel Logic
  const handleSpinWheel = () => {
    if (isSpinning) return;
    const extraRotation = Math.floor(Math.random() * 360) + 1440; // 4 full rotations + random
    const newRotation = rotation + extraRotation;
    
    setRotation(newRotation);
    setIsSpinning(true);
    setSpinText("SPINNING...");
    
    setTimeout(() => {
      setIsSpinning(false);
      setSpinText("SPIN AGAIN");
      
      // Calculate which prize the wheel landed on
      // 0 deg points to the first slice. Wheel spins clockwise.
      const winningAngle = (360 - (newRotation % 360)) % 360;
      const winningIndex = Math.floor(winningAngle / 60);
      const prizes = ['Premium Saree', '10% Discount', 'Free Styling', 'Surprise Box', 'Artisan Blouse', 'Free Shipping'];
      
      setWonPrize(prizes[winningIndex]);
      setShowPopup(true);
    }, 4100);
  };

  // Copy Coupon Code Logic
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    });
  };

  // Reveal-on-scroll Simulation (CSS-based standard is fine, but we will add direct class triggers)
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="pt-0">
        {/* Hero Section */}
        <section 
          className="relative min-h-[480px] md:min-h-[600px] md:h-[600px] py-12 md:py-0 flex flex-col items-center justify-center text-center px-4 overflow-hidden"
          style={{ 
            backgroundImage: "url('/Images/limited.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
          }}
        >
          {/* Dark Overlay matching Best Sellers */}
          <div className="absolute inset-0 bg-black/60 z-0"></div>
          
          <div className="relative z-10 hero-content flex flex-col items-center justify-center mt-6 md:mt-0 pb-6 md:pb-0">
            <div className="inline-flex items-center px-5 py-2 mb-4 md:mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="font-label-caps text-[10px] text-white tracking-[0.2em] uppercase">Limited Exclusive Offer</span>
            </div>
            
            <h1 className="font-display-lg text-3xl md:text-[42px] text-white mb-3 md:mb-4 leading-[1.1] drop-shadow-2xl">
              Exclusive Offers, <span className={`italic serif font-light ${styles['text-shimmer']}`}>Limited Time</span>
            </h1>
            
            <p className="text-white/90 text-sm md:text-lg mb-6 md:mb-10 max-w-4xl mx-auto">
              Enjoy special prices on selected sarees for a limited period. Elevate your wardrobe with premium collections while these exclusive offers last.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[280px] sm:max-w-none mx-auto">
              <button 
                onClick={() => setCurrentTab('catalog')}
                className="btn-cloud w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-4 bg-secondary text-white hover:bg-white hover:text-secondary transition-all duration-500 font-label-caps text-label-caps tracking-widest shadow-[0_8px_30px_rgb(179,138,74,0.3)] hover:shadow-[0_8px_30px_rgb(255,255,255,0.4)] transform hover:-translate-y-1"
              >
                EXPLORE COLLECTION
              </button>
              <button 
                onClick={() => setCurrentTab('about')}
                className="pill rounded-full w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-4 border border-white text-white bg-transparent hover:bg-[#FFBEA2] hover:text-[#4F4E22] hover:border-[#FFBEA2] transition-all duration-500 font-label-caps text-label-caps tracking-widest transform hover:-translate-y-1"
              >
                OUR HERITAGE
              </button>
            </div>
          </div>
        </section>

        {/* Live Offer Countdown */}
        <section className="relative -mt-12 md:-mt-24 z-20 px-4 md:px-margin-desktop">
          <div className="max-w-7xl mx-auto bg-[#FDFBF7] border border-[#D4AF37]/40 py-6 px-4 md:p-14 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 shadow-[0_20px_50px_rgba(179,138,74,0.15)] relative overflow-hidden">
            {/* Subtle decorative background pattern */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            
            {/* Subtle glow effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
            
            <div className="flex-1 text-center md:text-left relative z-10">
              <span className="font-label-caps text-[10px] text-[#D4AF37] tracking-[0.3em] uppercase block mb-2 md:mb-4">Time is running out</span>
              <h2 className="font-display-lg font-bold tracking-tight text-2xl sm:text-3xl md:text-5xl mb-3 md:mb-5 text-[#B38A4A]">The Grand Gala Sale</h2>
              <p className="text-on-surface-variant max-w-md mx-auto md:mx-0 text-xs sm:text-sm md:text-base leading-relaxed">
                Our most prestigious annual celebration ends soon. Secure your heritage pieces today before they return to the vault.
              </p>
            </div>
            
            <div className="flex gap-3 md:gap-5 text-center relative z-10" id="countdown">
              <div className="flex flex-col items-center justify-center bg-white border border-[#D4AF37]/20 backdrop-blur-md rounded-xl p-3 min-w-[75px] md:p-4 md:min-w-[90px] shadow-sm">
                <span className="font-display-lg text-2xl md:text-4xl text-primary">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[8px] md:text-[9px] text-[#D4AF37] tracking-[0.2em] mt-1 md:mt-2">DAYS</span>
              </div>
              <div className="font-display-lg text-2xl md:text-4xl text-primary/30 self-center -mt-3 md:-mt-6">:</div>
              <div className="flex flex-col items-center justify-center bg-white border border-[#D4AF37]/20 backdrop-blur-md rounded-xl p-3 min-w-[75px] md:p-4 md:min-w-[90px] shadow-sm">
                <span className="font-display-lg text-2xl md:text-4xl text-primary">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[8px] md:text-[9px] text-[#D4AF37] tracking-[0.2em] mt-1 md:mt-2">HOURS</span>
              </div>
              <div className="font-display-lg text-2xl md:text-4xl text-primary/30 self-center -mt-3 md:-mt-6">:</div>
              <div className="flex flex-col items-center justify-center bg-white border border-[#D4AF37]/20 backdrop-blur-md rounded-xl p-3 min-w-[75px] md:p-4 md:min-w-[90px] shadow-sm">
                <span className="font-display-lg text-2xl md:text-4xl text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[8px] md:text-[9px] text-[#D4AF37] tracking-[0.2em] mt-1 md:mt-2">MINS</span>
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
                alt="A multi-generational Indian family dressed in opulent silk attire, celebrating together in a heritage courtyard." 
                src="/Images/heritage.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            
            <div className={`transition-all duration-1000 flex flex-col justify-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-px bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] uppercase">Curated Festival Duo</span>
              </div>
              
              <h2 className="font-display-lg text-4xl md:text-[56px] text-primary mb-3 leading-[1.1]">
                The Heritage Gift
              </h2>
              
              <div className="font-label-caps text-[12px] md:text-[14px] tracking-[0.2em] text-[#B38A4A] mb-8 uppercase font-medium">
                Buy 2 Sarees, Get 1 Free
              </div>
              
              <p className="text-[#4A4F40] text-base md:text-lg mb-12 leading-[1.8] max-w-lg font-light">
                Embrace the timeless tradition of gifting. Choose from our exquisite hand-woven silk collections and receive a complimentary heritage piece as a symbol of our festive gratitude.
              </p>
              
              <div>
                <div 
                  onClick={() => setCurrentTab('catalog')} 
                  className="inline-flex items-center justify-center gap-4 px-12 py-4 bg-transparent border-[1.5px] border-primary text-primary font-label-caps text-[11px] tracking-[0.25em] uppercase hover:bg-primary hover:text-white transition-colors duration-500 group cursor-pointer"
                >
                  <span>Explore Collection</span>
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-2 transition-transform duration-500">east</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offer Products Grid */}
        <section className="pt-16 pb-0 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex flex-col items-center mb-14 text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-[#D4AF37]"></div>
              <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] uppercase">Festive Deals</span>
              <div className="w-12 h-px bg-[#D4AF37]"></div>
            </div>
            <h3 className="font-display-lg text-4xl md:text-5xl text-primary leading-tight">Exclusive Offers</h3>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {(showAllOffers ? [...galleryItems, ...galleryItems.slice(0, 2)] : galleryItems.slice(0, 4)).map((item, index) => {
              // Calculate a dummy original price for the offer display (40% higher)
              const originalPrice = Math.round(parseInt(item.price.replace(/[^\d]/g, '')) * 1.4);
              return (
                <div key={`offer-${index}`} className="group cursor-pointer flex flex-col items-center" onClick={() => {
                  if (setSelectedProduct) {
                    setSelectedProduct({
                      id: `offer-${index}`,
                      name: item.title,
                      category: "Limited Offer",
                      fabric: "Festive Collection",
                      color: "#6B102A",
                      price: parseInt(item.price.replace(/[^\d]/g, '')),
                      oldPrice: originalPrice,
                      rating: 4.8,
                      tag: item.tag || "LIMITED OFFER",
                      image: item.image,
                      description: "Exclusive festive collection piece available for a limited time.",
                      inStock: true
                    });
                  }
                  setCurrentTab('product-detail');
                }}>
                  <div className="relative w-full p-1.5 md:p-2.5 bg-white border border-[#D4AF37]/30 shadow-sm group-hover:shadow-2xl transition-all duration-700 mb-3 md:mb-6 rounded-sm">
                    <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-high">
                      <img 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={item.title}
                        src={item.image}
                      />
                      <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3 bg-red-800 text-white px-1.5 py-0.5 md:px-2.5 md:py-1 shadow-sm border border-white/20">
                        <span className="font-label-caps text-[6px] md:text-[8.5px] tracking-[0.1em] md:tracking-[0.2em] uppercase font-bold whitespace-nowrap leading-none block">FLAT 30% OFF</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center flex-1 flex flex-col justify-start px-1 md:px-2 w-full">
                    <h4 className="font-display-lg text-[13px] md:text-[19px] text-primary mb-1 md:mb-1.5 leading-snug group-hover:text-[#B38A4A] transition-colors truncate">{item.title}</h4>
                    <div className="flex items-center justify-center gap-1.5 md:gap-3 mt-0.5 md:mt-1 flex-wrap">
                      <p className="text-[#5F6652]/60 line-through text-[9px] md:text-[12px]">₹ {originalPrice.toLocaleString('en-IN')}</p>
                      <p className="text-red-800 font-label-caps text-[10px] md:text-[13px] tracking-[0.1em] md:tracking-[0.2em] font-bold">{item.price}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center mt-10">
            <button 
              onClick={() => setShowAllOffers(!showAllOffers)}
              className="load-more-btn px-10 py-4 bg-primary border border-primary text-white font-bold font-label-caps text-[12px] tracking-[0.2em] uppercase hover:bg-transparent hover:text-primary transition-all duration-300 rounded-none shadow-sm"
            >
              {showAllOffers ? "View Less" : "View All Offers"}
            </button>
          </div>
        </section>

        {/* Product Grid */}
        <section className="pt-16 pb-0 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-14">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] uppercase">Eligible Selection</span>
              </div>
              <h3 className="font-display-lg text-4xl md:text-5xl text-primary leading-tight">The Buy 2 Get 1 Gallery</h3>
            </div>
            <div className="hidden md:flex gap-4">
              <div onClick={() => scrollGallery('left')} role="button" className="w-11 h-11 flex items-center justify-center border border-[#D4AF37] rounded-[12px] text-[#D4AF37] hover:bg-[#F2A987] hover:border-[#F2A987] hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-[20px]">west</span>
              </div>
              <div onClick={() => scrollGallery('right')} role="button" className="w-11 h-11 flex items-center justify-center border border-[#D4AF37] rounded-[12px] text-[#D4AF37] hover:bg-[#F2A987] hover:border-[#F2A987] hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-[20px]">east</span>
              </div>
            </div>
          </div>
          
          <div ref={galleryRef} className="flex overflow-x-auto gap-4 md:gap-6 lg:gap-8 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[...galleryItems, ...galleryItems].map((item, index) => (
              <div key={index} className="w-[150px] md:w-[340px] shrink-0 group cursor-pointer flex flex-col items-center" onClick={() => setCurrentTab('catalog')}>
                <div className="relative w-full p-1.5 md:p-2.5 bg-white border border-[#D4AF37]/30 shadow-sm group-hover:shadow-2xl transition-all duration-700 mb-3 md:mb-6 rounded-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-high">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      alt={item.title}
                      src={item.image}
                    />
                    {item.tag && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/95 backdrop-blur-md px-1.5 md:px-2.5 py-0.5 md:py-1 shadow-sm border border-white/40">
                        <span className="text-[#B38A4A] font-label-caps text-[6px] md:text-[8.5px] tracking-[0.1em] md:tracking-[0.2em] uppercase font-bold leading-none block">{item.tag}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center flex-1 flex flex-col justify-start px-1 md:px-2 w-full">
                  <h4 className="font-display-lg text-[13px] md:text-[21px] text-primary mb-1 md:mb-1.5 leading-snug group-hover:text-[#B38A4A] transition-colors truncate">{item.title}</h4>
                  <div className="flex items-center justify-center gap-1.5 md:gap-3 mt-0.5 md:mt-1">
                    <div className="w-2 md:w-4 h-[1px] bg-[#D4AF37]/40"></div>
                    <p className="text-[#5F6652] font-label-caps text-[9px] md:text-[11px] tracking-[0.1em] md:tracking-[0.2em]">{item.price}</p>
                    <div className="w-2 md:w-4 h-[1px] bg-[#D4AF37]/40"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Offer Categories (Bento Grid Style) */}
        <section 
          className="relative pt-8 md:pt-16 pb-6 md:pb-16 px-margin-mobile md:px-margin-desktop text-white bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/Images/offer.png')" }}
        >
          {/* Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>
          
          <div className="relative z-10 max-w-container-max mx-auto">
            <div className="mb-5 md:mb-10 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-4 mb-2 md:mb-3">
                <div className="w-12 h-px bg-[#D4AF37]"></div>
                <span className="text-[#D4AF37] font-label-caps text-[10px] tracking-[0.3em] uppercase">Curation of Joy</span>
                <div className="w-12 h-px bg-[#D4AF37]"></div>
              </div>
              <h2 className="font-display-lg text-2xl sm:text-3xl md:text-[52px] leading-tight text-[#FDFBF7]">Bespoke Offer Tiers</h2>
            </div>
            
            <div className="flex flex-row justify-center md:grid md:grid-cols-3 gap-3 md:gap-6 h-auto md:h-[360px] pt-2">
              {/* Card 1 */}
              <div className="relative group overflow-hidden rounded-full md:rounded-t-full md:rounded-b-md border border-[#D4AF37] md:border-[#D4AF37]/40 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 w-24 h-24 mx-auto md:w-full md:h-full flex shrink-0 items-center justify-center md:block bg-black/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none" onClick={() => setCurrentTab('catalog')}>
                <img 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt="A vibrant Diwali celebration scene at a luxury estate." 
                  src="/Images/diwali.png"
                />
                <div className="hidden md:block absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700"></div>
                
                <div className="md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[85%] md:bg-black/40 md:backdrop-blur-md md:border border-[#D4AF37]/30 p-1 md:p-5 flex flex-col items-center justify-center text-center transform md:translate-y-2 group-hover:translate-y-0 transition-transform duration-700 w-full h-full md:h-auto rounded-full md:rounded-none">
                  <h3 className="font-display-lg text-[12px] md:text-[28px] mb-0.5 md:mb-2 text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors duration-500">Diwali Offers</h3>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-1.5 md:w-4 h-[1px] bg-[#D4AF37]"></div>
                    <span className="font-label-caps text-[6px] md:text-[9px] tracking-[0.1em] md:tracking-[0.2em] text-[#D4AF37] whitespace-nowrap">UP TO 40%</span>
                    <div className="w-1.5 md:w-4 h-[1px] bg-[#D4AF37]"></div>
                  </div>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="relative group overflow-hidden rounded-full md:rounded-t-full md:rounded-b-md border border-[#D4AF37] md:border-[#D4AF37]/40 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 w-24 h-24 mx-auto md:w-full md:h-full flex shrink-0 items-center justify-center md:block bg-black/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none" onClick={() => setCurrentTab('catalog')}>
                <img 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt="Bridal silk sarees in shades of crimson and gold." 
                  src="/Images/bridal.png"
                />
                <div className="hidden md:block absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700"></div>
                
                <div className="md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[85%] md:bg-black/40 md:backdrop-blur-md md:border border-[#D4AF37]/30 p-1 md:p-5 flex flex-col items-center justify-center text-center transform md:translate-y-2 group-hover:translate-y-0 transition-transform duration-700 w-full h-full md:h-auto rounded-full md:rounded-none">
                  <h3 className="font-display-lg text-[12px] md:text-[28px] mb-0.5 md:mb-2 text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors duration-500">Bridal Offers</h3>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-1.5 md:w-4 h-[1px] bg-[#D4AF37]"></div>
                    <span className="font-label-caps text-[6px] md:text-[9px] tracking-[0.1em] md:tracking-[0.2em] text-[#D4AF37] whitespace-nowrap">20% OFF</span>
                    <div className="w-1.5 md:w-4 h-[1px] bg-[#D4AF37]"></div>
                  </div>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="relative group overflow-hidden rounded-full md:rounded-t-full md:rounded-b-md border border-[#D4AF37] md:border-[#D4AF37]/40 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 w-24 h-24 mx-auto md:w-full md:h-full flex shrink-0 items-center justify-center md:block bg-black/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none" onClick={() => setCurrentTab('catalog')}>
                <img 
                  className="hidden md:block absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  alt="A collection of vibrant festival sarees in bright colors." 
                  src="/Images/wedding.png"
                />
                <div className="hidden md:block absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-700"></div>
                
                <div className="md:absolute md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-[85%] md:bg-black/40 md:backdrop-blur-md md:border border-[#D4AF37]/30 p-1 md:p-5 flex flex-col items-center justify-center text-center transform md:translate-y-2 group-hover:translate-y-0 transition-transform duration-700 w-full h-full md:h-auto rounded-full md:rounded-none">
                  <h3 className="font-display-lg text-[12px] md:text-[28px] mb-0.5 md:mb-2 text-[#FDFBF7] group-hover:text-[#D4AF37] transition-colors duration-500">Combo Set</h3>
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-1.5 md:w-4 h-[1px] bg-[#D4AF37]"></div>
                    <span className="font-label-caps text-[6px] md:text-[9px] tracking-[0.1em] md:tracking-[0.2em] text-[#D4AF37] whitespace-nowrap">SAVE 5K</span>
                    <div className="w-1.5 md:w-4 h-[1px] bg-[#D4AF37]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>




        {/* Lucky Draw Spinning Wheel */}
        <section className="pt-12 md:pt-16 pb-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="bg-[#FDFBF7] rounded-[2rem] border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 md:p-16 overflow-hidden relative">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
            <div className="reveal-on-scroll">
              <h3 className="font-display-lg text-4xl md:text-[52px] text-[#2D3326] mb-6">Festival Lucky Draw</h3>
              <p className="text-[#2D3326]/70 text-lg mb-10 font-light leading-relaxed max-w-lg">Spin the heritage wheel for a chance to win exclusive gift cards, artisan blouses, or a signature silk saree from our royal vault.</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-[#2D3326]">
                  <span className="material-symbols-outlined text-[#D4AF37]">check_circle</span>
                  <span>Grand Prize: Royal Banarasi Saree</span>
                </li>
                <li className="flex items-center gap-3 text-[#2D3326]">
                  <span className="material-symbols-outlined text-[#D4AF37]">check_circle</span>
                  <span>Gift Cards worth ₹ 10,000</span>
                </li>
                <li className="flex items-center gap-3 text-[#2D3326]">
                  <span className="material-symbols-outlined text-[#D4AF37]">check_circle</span>
                  <span>Artisan Blouse Customizations</span>
                </li>
              </ul>
              
              <button 
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="px-10 py-4 bg-primary text-on-primary font-label-caps tracking-widest rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95 disabled:opacity-50" 
                id="spin-btn"
              >
                {spinText}
              </button>
            </div>
            
            <div className="relative flex justify-center py-6">
              <div 
                className="w-72 h-72 md:w-[420px] md:h-[420px] border-8 border-[#D4AF37] relative shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden bg-white" 
                id="wheel"
                style={{
                  borderRadius: '50%',
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
                }}
              >
                {/* Simulated wheel segments with brand design colors */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ borderRadius: '50%', overflow: 'hidden' }}>
                  <div 
                    className="w-full h-full" 
                    style={{ 
                      borderRadius: '50%',
                      background: 'conic-gradient(#490017 0deg 60deg, #fed579 60deg 120deg, #a13b51 120deg 180deg, #ffb2bc 180deg 240deg, #6b102a 240deg 300deg, #775a04 300deg 360deg)' 
                    }}
                  ></div>
                  
                  {/* Text for each section */}
                  {[
                    { text: 'Premium Saree', color: 'text-white' },
                    { text: '10% Discount', color: 'text-[#490017]' },
                    { text: 'Free Styling', color: 'text-white' },
                    { text: 'Surprise Box', color: 'text-[#490017]' },
                    { text: 'Artisan Blouse', color: 'text-white' },
                    { text: 'Free Shipping', color: 'text-white' }
                  ].map((prize, i) => {
                    // Flip text for the bottom half of the wheel so it's readable
                    const isBottomHalf = i > 1 && i < 5;
                    return (
                      <div 
                        key={i} 
                        className="absolute inset-0 flex items-start justify-center"
                        style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                      >
                        <div className={`pt-6 md:pt-10 w-24 text-center font-display-lg text-[11px] md:text-sm tracking-wide leading-tight ${prize.color}`}>
                          <span className="block" style={{ transform: isBottomHalf ? 'rotate(180deg)' : 'none' }}>
                            {prize.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div 
                    className={`w-10 h-10 bg-white rounded-full z-10 shadow-xl border-4 border-[#D4AF37] pointer-events-auto flex items-center justify-center transition-all duration-300 ${isSpinning ? 'opacity-80' : 'cursor-pointer hover:scale-110 hover:shadow-2xl'}`}
                    onClick={isSpinning ? undefined : handleSpinWheel}
                    title={isSpinning ? "Spinning..." : "Click to Spin!"}
                  >
                    <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Golden Indicator */}
              <div 
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-12 bg-[#D4AF37] z-20 drop-shadow-md" 
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
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
              
              <div className="bg-white border border-[#D4AF37]/30 rounded-xl py-6 px-4 mb-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#490017] via-[#D4AF37] to-[#490017]"></div>
                <span className="block font-label-caps text-[#D4AF37] text-[10px] tracking-widest uppercase mb-2">Your Prize</span>
                <span className="font-display-lg text-[32px] text-[#490017] font-bold leading-none">{wonPrize}</span>
              </div>
              
              <button 
                onClick={() => setShowPopup(false)}
                className="w-full py-4 bg-[#D4AF37] text-white font-bold font-label-caps text-[11px] tracking-[0.2em] uppercase hover:bg-[#490017] transition-all duration-300 rounded-full shadow-lg hover:shadow-xl"
              >
                Claim Reward
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
