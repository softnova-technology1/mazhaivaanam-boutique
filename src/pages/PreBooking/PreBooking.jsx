import React from 'react';
import styles from './PreBooking.module.css';
import { ShieldAlert, Award, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const PREORDER_PRODUCTS = [
  {
    id: 'pre-1',
    name: "Sona Roopa Kanjeevaram",
    category: "Blended South Cotton",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Wedding",
    price: 30600,
    oldPrice: 34000,
    progress: 75,
    weaver: "Master Weaver Ramalingam",
    image: "/Images/saree11.png",
    description: "Exquisite gold and silver zari Kanjeevaram, meticulously hand-woven with traditional wedding temple motifs.",
    isPreorder: true,
    estimatedDays: 12
  },
  {
    id: 'pre-2',
    name: "Shahi Shikargah Banarasi",
    category: "Handloom Sarees",
    fabric: "Pure Silk",
    color: "#C8A34D",
    occasion: "Wedding",
    price: 41400,
    oldPrice: 46000,
    progress: 50,
    weaver: "Master Weaver Kabir",
    image: "/Images/saree13.png",
    description: "Featuring complex hunting scenes woven in 24k gold zari, this Katan silk Banarasi is an imperial masterwork.",
    isPreorder: true,
    estimatedDays: 22
  },
  {
    id: 'pre-3',
    name: "Chanderi Indigo Bloom",
    category: "Linen Cotton",
    fabric: "Pure Silk",
    color: "#1A237E",
    occasion: "Party Wear",
    price: 18900,
    oldPrice: 21000,
    progress: 90,
    weaver: "Artisan Meenakshi",
    image: "/Images/saree14.png",
    description: "Delicate Chanderi silk with hand-woven indigo floral butis, golden borders, and tissue pallu.",
    isPreorder: true,
    estimatedDays: 5
  },
  {
    id: 'pre-4',
    name: "Organic Sage Cotton",
    category: "Chanderi Cotton",
    fabric: "Cotton",
    color: "#004D40",
    occasion: "Festival",
    price: 11250,
    oldPrice: 12500,
    progress: 40,
    weaver: "Weaver Kumar",
    image: "/Images/saree2.png",
    description: "Loom-woven pure organic cotton tinted with natural plant dyes, showcasing structural elegance and breathable weight.",
    isPreorder: true,
    estimatedDays: 28
  }
];

export const PreBooking = ({ setCurrentTab, setSelectedProduct }) => {
  
  const handlePreorderClick = (product) => {
    if (setSelectedProduct && setCurrentTab) {
      setSelectedProduct(product);
      setCurrentTab('product-detail');
    }
  };

  const timelineSteps = [
    {
      days: "Days 1 - 5",
      title: "Thread Prep & Dyeing",
      desc: "Pure mulberry silk yarn is selected and dyed in organic herbal vats to achieve deep colors."
    },
    {
      days: "Days 6 - 12",
      title: "Loom Warp Setup",
      desc: "The warp threads are aligned, stretched, and tensioned on the wooden throw-shuttle loom."
    },
    {
      days: "Days 13 - 35",
      title: "Meticulous Weaving",
      desc: "Two weavers coordinate on a single loom, weaving intricate gold zari motifs row by row."
    },
    {
      days: "Days 36 - 40",
      title: "Vetting & Certification",
      desc: "Saree undergoes Silk Mark testing, gold zari purity checks, and editorial dry-pressing."
    },
    {
      days: "Days 41 - 45",
      title: "Tailoring & Dispatched",
      desc: "Complementary blouse is custom-stitched, and the saree is packed in climate-control boxes."
    }
  ];

  return (
    <div className={styles.preorderPageContainer}>
      
      {/* 1. Hero Header */}
      <header className={styles.heroSection}>
        <div className={styles.heroBackgroundImage}></div>
        <div className={styles.heroGradientOverlay}></div>
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>EXCLUSIVE RESERVATIONS</span>
          <h1 className={styles.heroTitle}>Reserve Your Favorite Before It Arrives</h1>
          <p className={styles.heroSubtitle}>
            Be the first to own our upcoming exclusive collections. Pre-book your favorite sarees in advance and ensure you never miss a limited-edition design.
          </p>
        </div>
      </header>

      {/* 2. Disclaimer Bar */}
      <section className={styles.disclaimerSection}>
        <div className={`container ${styles.disclaimerContainer}`}>
          <div className={styles.disclaimerCard}>
            <ShieldAlert size={24} className={styles.disclaimerIcon} />
            <div className={styles.disclaimerText}>
              <h4>Atelier Disclaimer &amp; Timeline</h4>
              <p>
                Every pre-booked saree is custom-woven on demand. 
                Please note that weaving, quality vetting, and custom tailoring require <strong>30 to 45 days</strong> before dispatch. 
                Order now to secure this exclusive design at a special pre-book discount. Payment is processed in full.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pre-Order Saree Grid */}
      <section className={`container ${styles.gridSection}`}>
        <div className={styles.sectionHeader}>
          <h3>Active Looms in Production</h3>
          <p>Choose an ensemble currently in the weaving phase to customize and reserve.</p>
        </div>

        <div className={styles.preorderGrid}>
          {PREORDER_PRODUCTS.map((product) => (
            <div key={product.id} className={styles.preorderCard}>
              {/* Image Frame */}
              <div 
                className={styles.imageFrame}
                onClick={() => handlePreorderClick(product)}
              >
                <img src={product.image} alt={product.name} />
                <span className={styles.progressBadge}>{product.progress}% WOVEN</span>
              </div>

              {/* Card Details */}
              <div className={styles.cardDetails}>
                <div className={styles.titleRow}>
                  <h4 onClick={() => handlePreorderClick(product)}>{product.name}</h4>
                  <span className={styles.fabricLabel}>{product.fabric}</span>
                </div>
                
                <p className={styles.descriptionText}>{product.description}</p>

                {/* Progress Bar */}
                <div className={styles.progressBarWrapper}>
                  <div className={styles.progressBarLabel}>
                    <span>Loom Progress</span>
                    <span>{product.progress}%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div 
                      className={styles.progressBarFill} 
                      style={{ width: `${product.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Specs Box */}
                <div className={styles.specsBox}>
                  <div className={styles.specItem}>
                    <User size={13} />
                    <span>{product.weaver}</span>
                  </div>
                  <div className={styles.specItem}>
                    <Clock size={13} />
                    <span>Est: {product.estimatedDays} days left</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className={styles.priceCtaRow}>
                  <div className={styles.priceColumn}>
                    <span className={styles.fullPriceLabel}>Retail: {formatCurrency(product.oldPrice)}</span>
                    <span className={styles.depositLabel}>Pay Total: <strong>{formatCurrency(product.price)}</strong></span>
                  </div>
                  <button 
                    className={styles.prebookBtn}
                    onClick={() => handlePreorderClick(product)}
                  >
                    PRE-BOOK NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Unique Section: The Loom Journey */}
      <section className={styles.timelineSection}>
        <div className="container">
          <div className={styles.sectionHeaderCentered}>
            <span className={styles.timelineTag}>THE CRAFT SCHEDULE</span>
            <h3>The Weaving Journey: 45 Days of Art</h3>
            <div className={styles.divider} />
            <p>Trace the meticulous, day-by-day journey of your saree as it moves from organic fiber to a luxury masterpiece.</p>
          </div>

          <div className={styles.timelineGrid}>
            {timelineSteps.map((step, idx) => (
              <div key={idx} className={styles.timelineCard}>
                <div className={styles.stepNumBox}>
                  <Award size={18} />
                  <span>{step.days}</span>
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
                {idx < timelineSteps.length - 1 && (
                  <ArrowRight size={20} className={styles.timelineArrow} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default PreBooking;
