import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import styles from './Home.module.css';

export const Home = ({ setCurrentTab }) => {
  const [email, setEmail] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

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
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCFCA9k7R_SAF0s8Z2oer0go-OV16Dr0zEOd-7VhVdRIwmxkDOrtLzUYj74V_aL8k6uNp8MNItHjOdn36nY9qLascXy9WgjgpiPEbsTbmYM1Tct3Cat5GNRP6pTXUSfmp87kYsRmQaIh0mi2nwBCztGlBAA_cWD9yoZ7vrm_nK2GqrvxNOnYzz0CStSzzmmd-FpXmjbEuDZCrh8o8tau3bXovxSPvh7krTVVKFjBTwvyb9QuydBUNNl",
      tag: "Maison Heritage",
      title: "Elegance Woven Into Every Thread",
      desc: "Discover handcrafted luxury sarees designed for life's most precious celebrations. A bridge between timeless Indian craftsmanship and contemporary aesthetics."
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiaf59tcalpuVycg_KGWRUiEUXpejpqfUe2PGNhQqO8x6Pr5v9U2wMrshKSH_tdDQLOEpSPvp_jhlYnA8F7r2olm1t4lfy7RqBg5D0Qw2367XV96xoFC6OViYpl6gJYxTNUFY1WW8OSpaUVZ0Duw1OZcX13c9jWpTIyaFHnGwkkwYEiORAY5R4lNtfb6NYr4BAZC0q0QoqIxZNFZ6D8Y2EBRibzJGz84N7sSf0u4SJLDBDaMV_hMxO",
      tag: "Bridal Masterpieces",
      title: "The Ruby Collection of Royal Silks",
      desc: "Woven with authentic gold threads and certified handloom silks, our custom-tailored bridal sarees represent the summit of Kanjeevaram design."
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDI6R_12woJKAYaLiudDb0eusyX1BwvaDGetnwQ3d_-BXwI3RxF41KY8785DtXMtPxWzc2pMYPvUzT2tbhUDjgUOMWwVRgSrgB9sD-X6SC75cx3VfMmIjHg86bIcD2Kmq2rTgojUxOnou5HaqqO1v4IkFObWuO7hgZJpVVbWqFpAiqRAcAsjYYU79xmEQuH4mCjmkN94Ju8ZOZ8Z5BmodOtr79Yt8pYCHbNjgwMj7vyHq6hcRKtyltC",
      tag: "Preserving Craftsmanship",
      title: "Legacy From the Weaver’s Loom",
      desc: "Each purchase directly sustains the creative labor of our master weaver cooperatives, ensuring authentic heritage techniques live for generations."
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

      {/* 2. Stats Section */}
      <section className={styles['stats-section']}>
        <div className="container">
          <div className={styles['stats-grid']}>
            <div className={styles['stats-item']}>
              <span className={styles['stats-num']}>50k+</span>
              <span className={styles['stats-label']}>Happy Customers</span>
            </div>
            <div className={styles['stats-item']}>
              <span className={styles['stats-num']}>250+</span>
              <span className={styles['stats-label']}>Exclusive Designs</span>
            </div>
            <div className={styles['stats-item']}>
              <span className={styles['stats-num']}>20+</span>
              <span className={styles['stats-label']}>Saree Collections</span>
            </div>
            <div className={styles['stats-item']}>
              <div className={styles['stats-star-row']}>
                <span className={styles['stats-num']}>4.9</span>
                <span className={styles['star-icon']}>★</span>
              </div>
              <span className={styles['stats-label']}>5 Star Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curation of Craft */}
      <section className={`${styles['curation-section']} container`}>
        <div className={styles['curation-header']}>
          <h2>Curation of Craft</h2>
          <span className={styles['view-all-link']}>VIEW ALL COLLECTIONS</span>
        </div>
        <div className={styles['curation-grid']}>
          {/* Left Large Card */}
          <div className={`${styles['curation-card']} ${styles['curation-large']}`}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8hK8cCTT5l1H7rvdu0MdPi2ETnx9YOisxFbOBZyW6hxKyf8_6cckRKn5scEecA1T1M8EHTQzvTgUYEljNm4MNSIhEQPDo5hKvfUG6rIIQA4ZUQySgpmaFnhZRKjXk34DIQyUgSODa5koKke322WAUMknEZqCVjNTLp5pOUkFxGBYJzgF9DMyLYfWRGYuiRAClV0KBKxjdr38b5DeGtIN_iIhruZBErRgMzt52dv105noxkLIynwtv" 
              alt="Banarasi Collection" 
            />
            <div className={styles['curation-overlay']}>
              <span className={styles['curation-tag']}>HERITAGE</span>
              <h3>Banarasi Collection</h3>
              <span className={styles['shop-link']}>EXPLORE</span>
            </div>
          </div>

          {/* Right Stacked Cards */}
          <div className={styles['curation-right-stack']}>
            <div className={`${styles['curation-card']} ${styles['curation-small']}`}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkuMc4sudSIWYxnpcnI9Z4RR8u6OTeOPpiMEC17tWtM8uAobELpUL5akoL3RttXWQj0A9pD4ebMu5P6Mk9rYF9kpqGmTs8CGIvkI2QjxheNF2ohZ92YMwzdr7XCLZF1175j8ph6u9gQAai4qQwI3RVa2Lact8fMq5QicG-GEdKI1rHxTdTKkIN7Oxp3uNxOHC5OyZOvMi0AjqGLYveuhu68O1nLoV82uqy6L163L0CkAV0-1dL78JT" 
                alt="Kanchipuram Silk" 
              />
              <div className={styles['curation-overlay']}>
                <h3>Kanchipuram Silk</h3>
              </div>
            </div>
            <div className={`${styles['curation-card']} ${styles['curation-small']}`}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBtySipCJXeT7GvcVNCFnydBGV44GJnI-1UUv4aLHVPflSBaEAtYBEBbVXdcAOMFbn4ojElM8iRVlfQYMt7DpiUEBqiGtDds46y0NKgpsY_p6AZ0ZfI0PfSOX0j2-x1kM5MU_a-pJZJBMk6H8WsUm8uezI_ctYUnnACSDC-FmubUTLlr_gPRC762Ha3fp0xyig22HTf9nDJM2ZBu1EMLgWnTC11VAJ6xVTyFmM-LiCwnNIs4Z7cnRT" 
                alt="Soft Cotton" 
              />
              <div className={styles['curation-overlay']}>
                <h3>Soft Cotton</h3>
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. The Bridal Edit */}
      <section className={styles['bridal-edit-section']}>
        <div className={styles['bridal-grid']}>
          <div className={styles['bridal-image-pane']}>
            <div className={styles['shimmer-overlay']}></div>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeOMYzJBNcryzep-_2-r9Fz1-5SKo_I9QTJrqOKlCKckqxIB4_BwGhGQzp35GnHmfatMRV5F-ij-SCJ3GWFHwB7xfD6wRrvx1M5v4w4Yi408oM2F9u2a9G_3wEeuZTzHR76bc9sbt27WRBClTui8Epc-_plc0PAoDt1bqlRvEcLQjDEVAmzolmfFVFbiNAjJCXgl5ybA90naM6gwgIRo9SqtFLWJsfUeywoVWx4RrZB383FaUaUWO4" 
              alt="Bridal Edit Model" 
            />
          </div>
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
            <div className={styles['decor-box']}></div>
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
            <button className={styles['btn-meet-artisans']}>
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
              <div className={styles['value-icon']}>🛡️</div>
              <h4>100% ORIGINAL</h4>
              <p>Silk Mark Certified and ethically sourced directly from looms.</p>
            </div>
            <div className={styles['values-item']}>
              <div className={styles['value-icon']}>🌿</div>
              <h4>PREMIUM FABRICS</h4>
              <p>Only the finest mulberry silk and long-staple cotton threads.</p>
            </div>
            <div className={styles['values-item']}>
              <div className={styles['value-icon']}>🔒</div>
              <h4>SECURE PAYMENTS</h4>
              <p>PCI-DSS compliant encrypted transactions for your peace of mind.</p>
            </div>
            <div className={styles['values-item']}>
              <div className={styles['value-icon']}>📦</div>
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
        <div className={styles['social-grid']}>
          {/* Card 1: Text Testimonial */}
          <div className={styles['social-text-card']}>
            <p>
              "The saree is even more beautiful in person. The zari work is incredibly fine, and the drape is absolute perfection. Highly recommend!"
            </p>
            <div className={styles['social-user-info']}>
              <div className={styles['user-avatar']}></div>
              <div>
                <span className={styles['social-author']}>ANANYA R.</span>
                <span className={styles['social-role']}>Verified Buyer</span>
              </div>
            </div>
          </div>

          {/* Card 2: Image */}
          <div className={styles['social-img-card']}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9J_Q7jOWawajmiqySs-_LfCpGRtiFFoUpmqQQo7c561Iwdz08UwJ-4ppCiBCt7uwZc5TR5Wmu1uUegKCMeJcA2mwKhGi3suCNgjjdJJNQMHlgo74O1ApnWH0uIZfuS7SQl2vJSet5RV57sbCzr2fOKI2EaOQURbOETeI2_cUkJsXebCgDSanEaGhQ9KYiT5cf1AvahdPU1T77J0OM4Fcmq7H8JMMFNda_0VWh_Z6oFBnrFI0mLUZ_" 
              alt="Woman in garden" 
            />
          </div>

          {/* Card 3: Image */}
          <div className={styles['social-img-card']}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS5dUlDrXgcLXeAfrtbm6bpkLMa2De10OTD3E3O0UkWLKvxvyu5fgIfEjC_3LlMUUIAlLm1WLAsLNJoWy4B8JQ7bREVnsTsSyuxGgDEkVFVIBn4_vtUYVpafMFpJ-90CcAGpWpDXIc09AII3rZ-rmBvJxPTzqF3PI-abBrLpmFyI9uXrtbohocYODzHv9a43pHQmYLapQ8XbjBa1SL7XgkVVR3z8xt_4fH535evmyXhoNglxq5OHuw" 
              alt="Bride hands touching saree" 
            />
          </div>

          {/* Card 4: Text Testimonial */}
          <div className={`${styles['social-text-card']} ${styles['social-dark-card']}`}>
            <p>
              "Mazhai Vaanam has redefined what luxury handloom means to me. The packaging itself was a work of art."
            </p>
            <div className={styles['social-user-info']}>
              <div className={styles['user-avatar-gold']}></div>
              <div>
                <span className={styles['social-author-white']}>MEGHA S.</span>
                <span className={styles['social-role-gold']}>Fashion Stylist</span>
              </div>
            </div>
          </div>

          {/* Card 5: Image */}
          <div className={styles['social-img-card']}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYuFjAXKyW_0p4At-q11yX2qN1DLHsS-4VZyF7WXFWipfqs_q3-ftdMhmOHQGUA-2G52g_AWD_21kSRTW9raBfQUjGPsb8vxE8uTK-D6sq8z2IUj-RTHeoShoKhtXWuTs661ynsWHOIFJ9-m862hzskYxRcPQ3PILDgSxbFD7Ll34R4JaR711wOMrT7-gJHQDP55nrlWkUBHEAO2-pMR7QaRDBkQY2RZgJCM0tzrYtpJg3Nu2_2EvA" 
              alt="Folded Silk Sarees" 
            />
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
    </div>
  );
};

export default Home;
