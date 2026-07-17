import React, { useState, useEffect, useRef } from 'react';
import styles from './LimitedOffer.module.css';

export const LimitedOffer = ({ setCurrentTab }) => {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 45 });
  
  // Lucky Draw State
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinText, setSpinText] = useState("SPIN THE WHEEL");
  
  // Copy Coupons State
  const [copiedCode, setCopiedCode] = useState(null);

  // WebGL Canvas Ref
  const canvasRef = useRef(null);

  // Dynamically load Google Fonts & Material Symbols
  useEffect(() => {
    const fontsLink = document.createElement('link');
    fontsLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,300&family=Inter:wght@300;400;500;600&display=swap';
    fontsLink.rel = 'stylesheet';
    document.head.appendChild(fontsLink);

    const symbolsLink = document.createElement('link');
    symbolsLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
    symbolsLink.rel = 'stylesheet';
    document.head.appendChild(symbolsLink);

    return () => {
      fontsLink.remove();
      symbolsLink.remove();
    };
  }, []);

  // Tailwind Play CDN dynamic load and configuration
  useEffect(() => {
    // Check if the script is already added
    let tailwindScript = document.getElementById('tailwind-cdn');
    if (!tailwindScript) {
      tailwindScript = document.createElement('script');
      tailwindScript.src = 'https://cdn.tailwindcss.com?plugins=forms,container-queries';
      tailwindScript.id = 'tailwind-cdn';
      document.head.appendChild(tailwindScript);
      
      tailwindScript.onload = () => {
        setupTailwindConfig();
      };
    } else {
      setupTailwindConfig();
    }

    function setupTailwindConfig() {
      if (window.tailwind) {
        window.tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              colors: {
                primary: "#7B8467",          // Sage Green
                "primary-container": "#5F6652", // Dark Olive
                secondary: "#B38A4A",        // Gold Accent
                "secondary-container": "#E7DDCE", // Warm Beige
                background: "#F7F3EB",       // Cream Background
                surface: "#FFFFFF",
                "on-background": "#3B3B36",
                "on-surface": "#3B3B36",
                "on-surface-variant": "#5D5D56",
                "outline-variant": "#D8CCBC",
                "primary-fixed": "#AEB49C",
                "secondary-fixed": "#B38A4A",
                "on-primary": "#FFFFFF",
                "on-secondary": "#FFFFFF",
                "tertiary-fixed": "#f5e1af",
                "surface-container-highest": "#e5e2e1",
                "surface-tint": "#7B8467",
                "secondary-fixed-dim": "#e9c168",
                "surface-container-low": "#F7F3EB",
                "inverse-on-surface": "#f3f0ef",
                "surface-dim": "#dcd9d9",
                "outline": "#887174",
                "tertiary-container": "#bcaa7c",
                "error-container": "#ffdad6",
                "on-secondary-container": "#B38A4A",
                "surface-variant": "#e5e2e1",
                "primary-fixed-dim": "#AEB49C",
                "surface-bright": "#FFFFFF",
                "error": "#ba1a1a",
                "on-secondary-fixed": "#251a00",
                "on-primary-fixed-variant": "#5F6652",
                "tertiary-fixed-dim": "#d8c595",
                "inverse-surface": "#313030",
                "surface-container-high": "#eae7e7",
                "surface-container": "#f0eded",
                "on-error-container": "#93000a",
                "on-error": "#ffffff",
                "on-tertiary-fixed": "#241a00",
                "inverse-primary": "#ffb2bc",
                "surface-container-lowest": "#ffffff",
                "on-primary-fixed": "#400013",
                "on-tertiary-container": "#4b3e1a"
              },
              borderRadius: {
                DEFAULT: "0.125rem",
                lg: "0.25rem",
                xl: "0.5rem",
                full: "0.75rem"
              },
              spacing: {
                "stack-sm": "8px",
                "margin-desktop": "80px",
                "container-max": "1440px",
                "stack-md": "16px",
                "gutter": "32px",
                "stack-lg": "32px",
                "section-gap": "120px",
                "margin-mobile": "20px"
              },
              fontFamily: {
                "display-lg": ["Playfair Display"],
                "headline-lg": ["Playfair Display"],
                "body-md": ["Inter"],
                "headline-xl": ["Playfair Display"],
                "display-lg-mobile": ["Playfair Display"],
                "body-lg": ["Inter"],
                "headline-md": ["Playfair Display"],
                "label-caps": ["Inter"]
              },
              fontSize: {
                "display-lg": ["72px", {lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "400"}],
                "headline-lg": ["32px", {lineHeight: "1.3", fontWeight: "400"}],
                "body-md": ["16px", {lineHeight: "1.6", fontWeight: "400"}],
                "headline-xl": ["48px", {lineHeight: "1.2", fontWeight: "400"}],
                "display-lg-mobile": ["44px", {lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400"}],
                "body-lg": ["18px", {lineHeight: "1.7", fontWeight: "400"}],
                "headline-md": ["24px", {lineHeight: "1.4", fontWeight: "500"}],
                "label-caps": ["12px", {lineHeight: "1.4", letterSpacing: "0.15em", fontWeight: "600"}]
              }
            }
          }
        };
      }
    }
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
      alert("Congratulations! You've won a 'Special Blouse Customization' voucher. Check your email for details!");
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
    <div className="bg-background text-on-background font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="pt-0">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Shader Canvas Background */}
          <div className="absolute inset-0 w-full h-full" style={{ display: 'block' }}>
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }}></canvas>
          </div>
          
          {/* Cinematic Background Mask */}
          <div 
            className="absolute inset-0 opacity-70 bg-cover bg-center mix-blend-overlay" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida/AP1WRLsdmmnAkFIfCbDHoYUCbpJDRacCZmG781UOyCNRxlk8pRidDUsxJ6XnZ5GEQ4RU0LryrPmASKBbkxZvg0KPbQwM1PX33K_nni-MQEN68p2tJo8xg2rV6gdlmCJjb78qCyDqdNAP6wcZAuJ5RIVIrcq8MIYDGTXWjXics7nPgZZ337zx60e3wvrW2Yu93OXdvxNaZ_6LymgM-l5azsfQkpMxdksGvVjFNxBMZZH3cNJrjqRw_dxvhbXpkg')" }}
          ></div>
          
          <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop max-w-4xl">
            <div className="inline-flex items-center px-4 py-1 mb-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <span className="font-label-caps text-label-caps text-white/90 tracking-[0.2em]">Limited Exclusive Offer</span>
            </div>
            
            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white mb-8 leading-[1.1] drop-shadow-sm">
              Celebrate Every Festival <br/>
              <span className="italic serif font-light text-secondary">In Timeless Elegance</span>
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => setCurrentTab('catalog')}
                className="px-10 py-4 bg-primary text-on-primary rounded-full hover:bg-secondary hover:text-on-secondary transition-colors duration-300 font-label-caps text-label-caps tracking-widest shadow-xl"
              >
                EXPLORE COLLECTION
              </button>
              <button 
                onClick={() => setCurrentTab('about')}
                className="px-10 py-4 border border-white text-white rounded-full hover:bg-white hover:text-primary transition-all duration-300 font-label-caps text-label-caps tracking-widest"
              >
                OUR HERITAGE
              </button>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70">
            <span className="font-label-caps text-[10px] tracking-widest uppercase">Scroll to Discover</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
          </div>
        </section>

        {/* Live Offer Countdown */}
        <section className="relative -mt-24 z-20 px-margin-mobile md:px-margin-desktop">
          <div className="max-w-container-max mx-auto bg-white/70 backdrop-blur-xl border border-outline-variant/30 p-10 md:p-16 rounded-xl flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display-lg text-headline-xl text-primary mb-4">The Grand Gala Sale</h2>
              <p className="text-on-surface-variant max-w-md">Our most prestigious annual celebration ends in limited time. Secure your heritage pieces today.</p>
            </div>
            
            <div className="flex gap-4 md:gap-8 text-center" id="countdown">
              <div className="flex flex-col gap-2 min-w-[80px]">
                <span className="font-display-lg text-headline-xl text-primary">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.2em]">DAYS</span>
              </div>
              <div className="font-display-lg text-headline-xl text-primary opacity-30">:</div>
              <div className="flex flex-col gap-2 min-w-[80px]">
                <span className="font-display-lg text-headline-xl text-primary">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.2em]">HOURS</span>
              </div>
              <div className="font-display-lg text-headline-xl text-primary opacity-30">:</div>
              <div className="flex flex-col gap-2 min-w-[80px]">
                <span className="font-display-lg text-headline-xl text-primary">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.2em]">MINS</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Offer Banner */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-low overflow-hidden">
          <div className="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-20">
            <div className="relative group h-[600px] overflow-hidden rounded-xl">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="A multi-generational Indian family dressed in opulent silk attire, celebrating together in a heritage courtyard." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVs-LD_aZSAZJV2S-LaKTUfg2odLlfh7eA3LY11bmMjsQVq7ZUTGbEM5CYEjtfaEwOxzy7sc_lRAJeaqbKmRfzBAwbW4X_AUlyOnxkx5ceamjSOXh47kKQ3L5K95pwzF0zSs59v925rd6t1DF1gWQ6G6kuzVIMzNFeDSa3JIik6WtFdTySXPpZPlDCYl_t4OGTpW2RN6voqFxOS3HmmGjbSQJmW7yvBgjTGBUNlPJIqnFQ7UPOnDGb"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="text-secondary font-label-caps text-label-caps tracking-widest block mb-6">CURATED FESTIVAL DUO</span>
              <h2 className="font-display-lg text-display-lg-mobile md:text-headline-xl text-primary mb-8 leading-tight">
                The Heritage Gift: <br/>Buy 2 Sarees, <br/>Get 1 Free
              </h2>
              <p className="text-on-surface-variant text-body-lg mb-10 leading-relaxed">
                Embrace the tradition of gifting. Choose from our hand-woven silk collections and receive a complimentary heritage piece as a symbol of our festive gratitude.
              </p>
              <button 
                onClick={() => setCurrentTab('catalog')} 
                className="inline-flex items-center gap-4 text-primary font-label-caps text-label-caps tracking-widest group"
              >
                SHOP THE COLLECTION
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
              </button>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-secondary font-label-caps text-label-caps tracking-widest block mb-4 uppercase">Eligible Selection</span>
              <h3 className="font-display-lg text-headline-xl text-primary">The Buy 2 Get 1 Gallery</h3>
            </div>
            <div className="hidden md:flex gap-4">
              <button className="p-2 border border-outline rounded-full hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 border border-outline rounded-full hover:bg-primary hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* Product Card 1 */}
            <div className="group cursor-pointer" onClick={() => setCurrentTab('catalog')}>
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-surface-container-high rounded-sm">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="Close-up of a deep maroon silk saree with intricate antique gold zari borders." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiws1LqlrLrZC3jcnsCtT5_Rku07pHF2AlAn7Zyj1gO2Sam7TcnCtkrPrhBfdF_BOMAWWOU0SUREtD1wIyNSDP3dqQV5uU58sfI1KUYmJx8KnyPQnAdhw-EbPeEOqsWH8JU3TVWcMOKKM_SIVyDKWaiWZJiHMR3edgYspjB9OHkEmy82KsiXdiS06-88TnLGP2c_xctj2Ybvh47BXpYvsvjX8nG0HX88Bol8iYSomxPmNzeKJg-zXY"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1">
                  <span className="text-primary font-label-caps text-[10px] tracking-tighter">FESTIVAL CHOICE</span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-display-lg text-body-lg text-on-surface mb-2">Banarasi Silk Elegance</h4>
                <p className="text-secondary font-medium">₹ 14,500</p>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group cursor-pointer" onClick={() => setCurrentTab('catalog')}>
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-surface-container-high rounded-sm">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="A gold-toned Kanchipuram silk saree draped artistically over a vintage wooden frame." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDgVmqwuLg4cRCmfYi1gTvh-1pWOTm42ozSAB0G-QGoHRFNM2GM9Qw31SxFySO36kmEw3Egv5p25Ues8POMis97hEgmfCZKLBnfeNosKbtpvlJlzObawUlUHRVI5rVuBKu8ZTI10IrlFS7UciPSrmsGb5dYxkKDvNavM_fWz5Rn-emc-ti2v2U_BlTJLv35gntt22r4PaHCn8LF-1nUd6Pe7gWrEZgRHIG5dwB0sAUtvlw4XeUK3HR"
                />
              </div>
              <div className="text-center">
                <h4 className="font-display-lg text-body-lg text-on-surface mb-2">Golden Temple Kanchipuram</h4>
                <p class="text-secondary font-medium">₹ 22,800</p>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group cursor-pointer" onClick={() => setCurrentTab('catalog')}>
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-surface-container-high rounded-sm">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="A delicate blush pink organza saree with hand-painted floral motifs." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5sgxRjroNTNCuoxkwsqyIDePKlQiHflxsCP7kxClGHeksK7eqj_r46kvqTvbuwD-n4FSyRIpjl15vqvbsptSdrRRjlcOvZ_Tg3G2g0XTx7hgYdnPfBvkyysP_hIjytE65LdgWCxmcDn7K4TgKyWB_4Fm5HDy8urdJvci79Z9xUldtkCO_J74BlU95VdXnxazJ9yknpEBkXGMCV_ejzdAS--iDT1UPnqFzbmJ86ZHPzMHqGocFzP31"
                />
                <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1">
                  <span className="font-label-caps text-[10px] tracking-tighter">BESTSELLER</span>
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-display-lg text-body-lg text-on-surface mb-2">Hand-Painted Organza</h4>
                <p className="text-secondary font-medium">₹ 11,200</p>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="group cursor-pointer" onClick={() => setCurrentTab('catalog')}>
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-surface-container-high rounded-sm">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  alt="A rich emerald green silk saree with a wide contrast border." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa97nLerZJ32cFOROn_rj1WxFojT9ps_a64W4pdZXgcWLH-wCKzsGXaUOZwYjNiX2aBWVopyRyxJ-Jn_KZbJgMgKbsz9mmMBZ9f18wZs9IC6wBjr7PPJwLAjTVFf-rvAYjuEag1YaqaRBUyJDN_ulJIXQK2viX3czJjP9AYKwSowNhNx81blxVR4ybDVYfnd28RewkE8YCjkt8lRkF-vm4vp8kFC0Ps4hMVcy0cDpgzeIWtLsMzXB2"
                />
              </div>
              <div className="text-center">
                <h4 className="font-display-lg text-body-lg text-on-surface mb-2">Emerald Heritage Pattu</h4>
                <p className="text-secondary font-medium">₹ 18,900</p>
              </div>
            </div>
          </div>
        </section>

        {/* Offer Categories (Bento Grid Style) */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-primary text-on-primary">
          <div className="max-w-container-max mx-auto">
            <div className="mb-16 text-center">
              <span className="text-secondary-fixed font-label-caps text-label-caps tracking-widest block mb-4 uppercase">Curation of Joy</span>
              <h2 className="font-display-lg text-headline-xl">Bespoke Offer Tiers</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[600px]">
              <div className="md:col-span-8 relative group overflow-hidden rounded-xl border border-white/10">
                <img 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt="A vibrant Diwali celebration scene at a luxury estate." 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfFmZDi3Rp4XsPRuJl4bhrwOKb-Ug8D3a5FtXouZVZ5pp1w0EDGPH_lyVsWYhX0ZHzCWRg3c7xcdYwCAhA3L743Dtm7lfmFf2iNUEGRm8P0jLg5aq0mkrt1pZi-A0seYDTwb0qmLspzbZT6DznH0JBo2C4lH5cD7Toeamt6fkxkIMgFw8Q3-HJBU2SXq6femflS-Rn_PeaHiBAjrMLrSJMFn0DEdNvFcoLtodpveAlOWPaTH-Ykdft"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent"></div>
                <div className="absolute bottom-10 left-10">
                  <h3 className="font-display-lg text-headline-xl mb-4">Diwali Offers</h3>
                  <p className="text-on-primary/70 mb-6 max-w-sm">Illuminate your wardrobe with up to 40% off on signature silks.</p>
                  <button 
                    onClick={() => setCurrentTab('catalog')}
                    className="px-8 py-3 bg-secondary-fixed text-on-secondary font-label-caps text-label-caps tracking-widest hover:bg-white hover:text-primary transition-colors"
                  >
                    VIEW ALL
                  </button>
                </div>
              </div>
              
              <div className="md:col-span-4 grid grid-rows-2 gap-8">
                <div className="relative group overflow-hidden rounded-xl border border-white/10">
                  <img 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    alt="Bridal silk sarees in shades of crimson and gold." 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVRB6R0q71IWGPli0PjFqKnmtnibOmZ9XsSdau4mKBkxZ5_bhMsVMXmFdo26bNL4N4zBLBUze8fqTskHoFTixPG26CvZTSJl8SiY0T-oQX7Z9NmfbCEixNagihf3h1TRtIKbSHwejdLJMxHxVuVogTurW7akrg9Bw4Pt-3bZU8M0X-VAUwu5PvYnSknBkN-ZvckeMZ3zg9rH_5-y7Igs1g5RasWookgebkfBYCvSE6RTBxCOS7_oxK"
                  />
                  <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm group-hover:backdrop-blur-none transition-all"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center" onClick={() => setCurrentTab('catalog')}>
                    <h3 className="font-display-lg text-headline-md mb-2">Bridal Offers</h3>
                    <span className="font-label-caps text-[10px] tracking-widest text-secondary-container">20% OFF WEDDING TRUSSEAU</span>
                  </div>
                </div>
                
                <div className="relative group overflow-hidden rounded-xl border border-white/10">
                  <img 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    alt="A collection of vibrant festival sarees in bright colors." 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf9St4SOd627r_IIaeNObi0TEI6pTyBBQKTamzwXjgu3bDA_cjzbtn4X0bhpnvcq4N36MkVaJXPImmJKhxnTethp3lFDsNtqlAGNbq0YtnRyE0rapfmjDQVct_UBr3Hv4K4s8-Q0VT9br3rYdn7haoSAD0rcoOOUDdOYV3_0t00yjgurMl1SKoPt9i5-8UaeD59hBl8E6nbFMjkZZlo_JvH3SPuV1HcrQ-9PwfdNJPpfj_Zwo58zJF"
                  />
                  <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm group-hover:backdrop-blur-none transition-all"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center" onClick={() => setCurrentTab('catalog')}>
                    <h3 className="font-display-lg text-headline-md mb-2">Wedding Combo</h3>
                    <span className="font-label-caps text-[10px] tracking-widest text-secondary-container">SAVE ₹ 5,000 ON SETS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Combo Offers Horizontal */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <h3 className="font-display-lg text-headline-xl text-primary mb-12 text-center">Festive Bundle Savings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border border-outline-variant hover:border-primary transition-all duration-300 group">
              <div className="flex justify-between items-start mb-8">
                <span className="material-symbols-outlined text-4xl text-secondary">workspace_premium</span>
                <div className="bg-primary-fixed px-3 py-1 rounded-full text-primary font-label-caps text-[10px]">SAVE 25%</div>
              </div>
              <h4 className="font-display-lg text-headline-md mb-4 text-primary">The Wedding Combo</h4>
              <p className="text-on-surface-variant mb-8">Bridal Saree + Reception Saree + Matching Blouse Fabrics.</p>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-headline-md font-bold text-primary">₹ 45,999</span>
                <span className="text-on-surface-variant line-through mb-1">₹ 61,000</span>
              </div>
              <button 
                onClick={() => alert("The Wedding Combo has been reserved. Our personal shopper will contact you shortly!")}
                className="w-full py-4 border border-primary text-primary font-label-caps text-label-caps tracking-widest group-hover:bg-primary group-hover:text-on-primary transition-all"
              >
                RESERVE BUNDLE
              </button>
            </div>
            
            <div className="bg-white p-8 border border-outline-variant hover:border-primary transition-all duration-300 group">
              <div className="flex justify-between items-start mb-8">
                <span className="material-symbols-outlined text-4xl text-secondary">celebration</span>
                <div className="bg-primary-fixed px-3 py-1 rounded-full text-primary font-label-caps text-[10px]">SAVE 15%</div>
              </div>
              <h4 className="font-display-lg text-headline-md mb-4 text-primary">Family Combo</h4>
              <p className="text-on-surface-variant mb-8">Saree for Mother + Saree for Daughter + Kurta for Father.</p>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-headline-md font-bold text-primary">₹ 32,500</span>
                <span className="text-on-surface-variant line-through mb-1">₹ 38,000</span>
              </div>
              <button 
                onClick={() => alert("The Family Combo has been reserved. Our personal shopper will contact you shortly!")}
                className="w-full py-4 border border-primary text-primary font-label-caps text-label-caps tracking-widest group-hover:bg-primary group-hover:text-on-primary transition-all"
              >
                RESERVE BUNDLE
              </button>
            </div>
            
            <div className="bg-white p-8 border border-outline-variant hover:border-primary transition-all duration-300 group">
              <div className="flex justify-between items-start mb-8">
                <span className="material-symbols-outlined text-4xl text-secondary">auto_awesome</span>
                <div className="bg-primary-fixed px-3 py-1 rounded-full text-primary font-label-caps text-[10px]">SAVE 20%</div>
              </div>
              <h4 className="font-display-lg text-headline-md mb-4 text-primary">Classic Trio</h4>
              <p className="text-on-surface-variant mb-8">Three Daily-Wear Heritage Silks in assorted jewel tones.</p>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-headline-md font-bold text-primary">₹ 21,999</span>
                <span className="text-on-surface-variant line-through mb-1">₹ 27,500</span>
              </div>
              <button 
                onClick={() => alert("The Classic Trio has been reserved. Our personal shopper will contact you shortly!")}
                className="w-full py-4 border border-primary text-primary font-label-caps text-label-caps tracking-widest group-hover:bg-primary group-hover:text-on-primary transition-all"
              >
                RESERVE BUNDLE
              </button>
            </div>
          </div>
        </section>

        {/* Member Exclusive Banner */}
        <section className="px-margin-mobile md:px-margin-desktop mb-section-gap">
          <div className="max-w-container-max mx-auto bg-primary-container p-12 md:p-20 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-secondary-fixed/20 to-transparent"></div>
            <div className="relative z-10 grid md:grid-cols-2 items-center gap-12">
              <div>
                <span className="material-symbols-outlined text-secondary-fixed-dim text-6xl mb-6">stars</span>
                <h2 className="font-display-lg text-headline-xl text-on-primary mb-6">Mazhai Vaanam Gold Membership</h2>
                <p className="text-primary-fixed text-body-lg mb-10">Get an additional 10% off on all festival offers and gain 24-hour early access to upcoming launches.</p>
                <button 
                  onClick={() => alert("Thank you for your interest! Gold Membership registration is temporarily offline.")}
                  className="px-10 py-4 bg-secondary text-on-secondary font-label-caps text-label-caps tracking-widest hover:bg-white hover:text-primary transition-colors shadow-lg"
                >
                  JOIN EXCLUSIVE CIRCLE
                </button>
              </div>
              
              <div className="flex justify-center">
                <div className="w-64 h-64 border-2 border-dashed border-secondary/30 rounded-full flex items-center justify-center animate-[spin_12s_linear_infinite]">
                  <div className="w-48 h-48 bg-secondary/10 rounded-full flex items-center justify-center backdrop-blur-md">
                    <span className="font-display-lg text-headline-xl text-secondary">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lucky Draw Spinning Wheel */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container overflow-hidden">
          <div className="max-w-container-max mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div className="reveal-on-scroll">
              <h3 className="font-display-lg text-headline-xl text-primary mb-6">Festival Lucky Draw</h3>
              <p className="text-on-surface-variant text-body-lg mb-8 leading-relaxed">Spin the heritage wheel for a chance to win exclusive gift cards, artisan blouses, or a signature silk saree from our royal vault.</p>
              
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span>Grand Prize: Royal Banarasi Saree</span>
                </li>
                <li className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span>Gift Cards worth ₹ 10,000</span>
                </li>
                <li className="flex items-center gap-3 text-on-surface">
                  <span className="material-symbols-outlined text-secondary">check_circle</span>
                  <span>Artisan Blouse Customizations</span>
                </li>
              </ul>
              
              <button 
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="px-10 py-4 bg-primary text-on-primary font-label-caps text-label-caps tracking-widest rounded-full shadow-xl hover:scale-105 transition-transform active:scale-95 disabled:opacity-50" 
                id="spin-btn"
              >
                {spinText}
              </button>
            </div>
            
            <div className="relative flex justify-center">
              <div 
                className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border-8 border-primary relative shadow-2xl overflow-hidden bg-white" 
                id="wheel"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
                }}
              >
                {/* Simulated wheel segments with gradients */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-full h-full" 
                    style={{ 
                      background: 'conic-gradient(#7B8467 0deg 60deg, #B38A4A 60deg 120deg, #5F6652 120deg 180deg, #E7DDCE 180deg 240deg, #7B8467 240deg 300deg, #B38A4A 300deg 360deg)' 
                    }}
                  ></div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-4 h-4 bg-white rounded-full z-10 shadow-lg"></div>
                </div>
              </div>
              
              {/* Indicator */}
              <div 
                className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-primary z-20" 
                style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
              ></div>
            </div>
          </div>
        </section>

        {/* Premium Coupons */}
        <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <h3 className="font-display-lg text-headline-xl text-primary mb-12 text-center">Unlock Your Exclusive Vouchers</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            <div className="relative overflow-hidden group">
              <div className="bg-surface-container-high p-8 border-2 border-dashed border-outline-variant hover:border-primary transition-all text-center">
                <span className="font-label-caps text-[10px] text-secondary tracking-widest block mb-4">MIN PURCHASE ₹ 20,000</span>
                <h5 className="font-display-lg text-headline-md text-primary mb-6">FESTIVE3000</h5>
                <button 
                  className={`px-6 py-2 text-on-primary font-label-caps text-label-caps tracking-widest hover:opacity-80 transition-opacity ${copiedCode === 'FESTIVE3000' ? 'bg-secondary' : 'bg-primary'}`}
                  onClick={() => handleCopyCode('FESTIVE3000')}
                >
                  {copiedCode === 'FESTIVE3000' ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
            </div>
            
            <div className="relative overflow-hidden group">
              <div className="bg-surface-container-high p-8 border-2 border-dashed border-outline-variant hover:border-primary transition-all text-center">
                <span className="font-label-caps text-[10px] text-secondary tracking-widest block mb-4">PRE-WEDDING PACKS</span>
                <h5 className="font-display-lg text-headline-md text-primary mb-6">BRIDE2024</h5>
                <button 
                  className={`px-6 py-2 text-on-primary font-label-caps text-label-caps tracking-widest hover:opacity-80 transition-opacity ${copiedCode === 'BRIDE2024' ? 'bg-secondary' : 'bg-primary'}`}
                  onClick={() => handleCopyCode('BRIDE2024')}
                >
                  {copiedCode === 'BRIDE2024' ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
            </div>
            
            <div className="relative overflow-hidden group">
              <div className="bg-surface-container-high p-8 border-2 border-dashed border-outline-variant hover:border-primary transition-all text-center">
                <span className="font-label-caps text-[10px] text-secondary tracking-widest block mb-4">FIRST FESTIVAL ORDER</span>
                <h5 className="font-display-lg text-headline-md text-primary mb-6">MAZHAI15</h5>
                <button 
                  className={`px-6 py-2 text-on-primary font-label-caps text-label-caps tracking-widest hover:opacity-80 transition-opacity ${copiedCode === 'MAZHAI15' ? 'bg-secondary' : 'bg-primary'}`}
                  onClick={() => handleCopyCode('MAZHAI15')}
                >
                  {copiedCode === 'MAZHAI15' ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
            </div>
            
            <div className="relative overflow-hidden group">
              <div className="bg-surface-container-high p-8 border-2 border-dashed border-outline-variant hover:border-primary transition-all text-center">
                <span className="font-label-caps text-[10px] text-secondary tracking-widest block mb-4">ACCESSORY BUNDLE</span>
                <h5 className="font-display-lg text-headline-md text-primary mb-6">GRACE10</h5>
                <button 
                  className={`px-6 py-2 text-on-primary font-label-caps text-label-caps tracking-widest hover:opacity-80 transition-opacity ${copiedCode === 'GRACE10' ? 'bg-secondary' : 'bg-primary'}`}
                  onClick={() => handleCopyCode('GRACE10')}
                >
                  {copiedCode === 'GRACE10' ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
