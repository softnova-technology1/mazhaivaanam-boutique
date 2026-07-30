import React from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  User,
  MapPin,
  Flame,
  Star,
  Quote,
  Palette,
  Layers,
  Scissors,
  Package,
  Compass
} from 'lucide-react';
import styles from './About.module.css';

const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeProgress * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, hasAnimated]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const About = ({ setCurrentTab }) => {

  const handleScrollToStory = () => {
    const el = document.getElementById('ourStorySection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.aboutPageContainer}>

      {/* Cinematic Hero */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackgroundImage}></div>
        <div className={styles.heroGradientOverlay}></div>

        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>Celebrating Elegance, Preserving Tradition</h2>
          <p className={styles.heroSubtext}>At Mazhai Vaanam, we celebrate the timeless beauty of Indian ethnic fashion through carefully curated sarees that blend heritage, craftsmanship, and contemporary elegance. Every collection reflects our passion for quality, comfort, and helping every woman embrace her unique style with confidence.</p>

          <div className={styles.heroActionRow}>
            <button
              onClick={() => setCurrentTab('catalog')}
              className={`${styles.primaryActionBtn} btn-cloud`}
            >
              Explore Collection
            </button>
            <button
              onClick={handleScrollToStory}
              className={`pill ${styles.secondaryActionBtn}`}
            >
              Discover Our Story
            </button>
          </div>
        </div>

      </section>

      {/* Our Story */}
      <section className={styles.storySection} id="ourStorySection">
        <div className={styles.storyLayoutGrid}>
          <div className={styles.storyImageContainer}>
            <div className={styles.storyImgBorderFrame}></div>
            <img
              src="/Images/contact1.png"
              alt="Rich silk handloom weaving with silk cocoons, gold zari thread, and folded sarees"
              className={styles.storyMainImg}
            />
          </div>

          <div className={styles.storyTextContainer}>
           
            <h3 className={styles.storySectionTitle}>About Mazhai Vaanam</h3>

            <div className={styles.storyBodyParagraphs}>
              <p>
                At Mazhai Vaanam, we celebrate the timeless beauty of Indian ethnic fashion. Inspired by grace and tradition, we curate premium sarees that blend classic craftsmanship with modern elegance.
              </p>
              <p>
                From everyday cottons to luxurious silks for special occasions, every collection is thoughtfully selected for quality, comfort, and style. Our mission is to help every woman express her unique elegance with confidence.
              </p>
              <p>
                Mazhai Vaanam is more than a boutique—it’s where tradition, beauty, and timeless style come together.
              </p>
              <div className={styles.storyTaglineBox}>
                <span className={styles.taglineLine}></span>
                <p className={styles.storyTagline}>Wear Elegance. Celebrate Tradition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy (Principles) */}
      <section className={styles.principlesSection}>
        <div className={styles.principlesHeader}>
          <h3 className={styles.principlesMainTitle}>The Atelier Principles</h3>
        </div>

        <div className={styles.principlesGrid}>

          {/* Card 1 */}
          <div className={styles.principleCard}>
            <div className={styles.principleImgFrame}>
              <img
                src="/Images/timeless.png"
              />
            </div>
            <h4 className={styles.principleCardTitle}>Timeless Elegance</h4>
            <p className={styles.principleCardDesc}>Designs that transcend seasons, crafted for the woman who values enduring style.</p>
          </div>

          {/* Card 2 */}
          <div className={`${styles.principleCard} ${styles.pushedCard}`}>
            <div className={styles.principleImgFrame}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpzmYR2UUsyl0klN0MjKHnkG18I33_hoQcsi5DtvwAGE4KeEu1TjJ2boomJJWDxDphIdnXHMz0T0JL4apFc8eOoQ-Sz7a4fRhDEoqTkDRGnRCX6OqDJLKPbEjSN5nvNJsU_Fhlr6UdKBSjDFzfopZQgOZ3lM57Hf6_4gb10o78rVFDWZPkyQYCpiJ8yjNP-Pjh7WeZkSPPQDwvHJj86CoFCz1Ry-oiTsMJ6HqKxV5vwWr5Z4kjpNCI"
                alt="Golden thread spools in workshop"
              />
            </div>
            <h4 className={styles.principleCardTitle}>Authentic Craft</h4>
            <p className={styles.principleCardDesc}>Every thread is placed by hand, honoring the techniques of master weavers.</p>
          </div>

          {/* Card 3 */}
          <div className={styles.principleCard}>
            <div className={styles.principleImgFrame}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxNn8pnIfOMXOOJP6GsFti9iuwi6J0VKd4JMRoX_fb69SHVyIbpqOTsNijML_uMQlOUi3CQgkdUmW3sJoPqgfRF15QKMv0vKxyK-NxB3c2VeU7F6dAahOgjFpHahV7UsScJK-vfV7LFb7KzUfwt38hRWEYczEKwMs88M1TPB9Xz-SF4vaCuF7-3sbwlHMQoooTEX8CN14ZuVy5q1WFrz-dRd4ibR5hQVfnF0lZicG2n3TQt7ADGDtV"
                alt="Inspecting gold zari border with magnifying glass"
              />
            </div>
            <h4 className={styles.principleCardTitle}>Uncompromising Quality</h4>
            <p className={styles.principleCardDesc}>Triple-layer inspection ensures that only perfection reaches your doorstep.</p>
          </div>

          {/* Card 4 */}
          <div className={`${styles.principleCard} ${styles.pushedCard}`}>
            <div className={styles.principleImgFrame}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHI7sOUpxj13CrxgFbd1lFkoEd9U3m0jWOHj70Dsxm70niHnFQ9GM1BC7m1fmWJB1RF9BIey-6F8dG8v2XzkKqPSsHPkeDiS2uBtfVzgaQA-Y52vt8qV7DngGJt-LmVNlVedtHlfRrIRLJf1O7_1FjonuXjXV8xY2oueRcb7LpxfcrCzWzaw8Bk696bV1FMuwRvnfiSH_ClKkMkdCKOOIqnVay5IrCTcByH81vkxvk3sY9OvUu70Ra"
                alt="Luxury showroom layout minimal"
              />
            </div>
            <h4 className={styles.principleCardTitle}>Customer First</h4>
            <p className={styles.principleCardDesc}>A bespoke shopping journey designed to celebrate you at every single touchpoint.</p>
          </div>

        </div>
      </section>

      {/* Brand Mission & Vision */}
      <section className={styles.founderSection}>
        <div className={styles.founderLayoutGrid}>
          <div className={styles.founderImageBox}>
            <img
              src="/Images/sareemodel.png"
              alt="Royal silk saree drape showcasing rich handloom zari art"
              className={styles.founderPortraitImg}
            />
            <div className={styles.founderSignatureOverlay}>
              <p className={styles.signatureRole}>OUR CORE PURPOSE</p>
              <p className={styles.signatureName}>Artisan First Heritage</p>
            </div>
          </div>

          <div className={styles.founderTextDetails}>
            <Quote size={56} className={styles.founderQuoteIcon} />
            <blockquote className={styles.founderBlockquote}>
              "Mazhai Vaanam — meaning 'Rainy Sky' — was created with a singular purpose: to bring authentic handloom sarees directly from traditional artisans to modern women across the world."
            </blockquote>
            <p className={styles.founderBodyDesc}>
              Our mission goes beyond selling sarees. We partner directly with rural master weavers to ensure fair livelihoods while preserving centuries-old handloom techniques. Each Mazhai Vaanam saree is an eco-luxury heirloom — hand-woven with pure silks, organic dyes, and genuine zari — empowering you to drape yourself in authentic culture, dignity, and sustainable fashion.
            </p>
          </div>
        </div>
      </section>

      {/* Journey of a Saree (Horizontal Timeline - Luxury Stepper) */}
      <section className={styles.sareeJourneySection}>
        <div className={styles.sareeJourneyBackgroundGlow}></div>

        <div className={styles.sareeJourneyHeader}>
          <span className={styles.sareeJourneyBadge}>ARTISANAL CRAFTSMANSHIP</span>
          <h3 className={styles.sareeJourneyTitle}>From Loom to Love</h3>
          <div className={styles.goldDivider}></div>
          <p className={styles.sareeJourneySub}>The meticulous seven-step journey of your handcrafted masterpiece.</p>
        </div>

        <div className={styles.horizontalScrollWrapper}>
          <div className={styles.timelineHorizontalTrack}>
            <div className={styles.timelineProgressLine}></div>

            {/* Step 1 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>
                <Palette size={22} className={styles.nodeIcon} />
                <span className={styles.stepNum}>01</span>
              </div>
              <h5 className={styles.timelineNodeTitle}>Design</h5>
              <p className={styles.timelineNodeDesc}>Conceptualizing motifs inspired by nature & royal temple art.</p>
            </div>

            {/* Step 2 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>
                <Layers size={22} className={styles.nodeIcon} />
                <span className={styles.stepNum}>02</span>
              </div>
              <h5 className={styles.timelineNodeTitle}>Material</h5>
              <p className={styles.timelineNodeDesc}>Sourcing Grade-A mulberry silk & pure gold-plated zari yarn.</p>
            </div>

            {/* Step 3 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>
                <Scissors size={22} className={styles.nodeIcon} />
                <span className={styles.stepNum}>03</span>
              </div>
              <h5 className={styles.timelineNodeTitle}>Weaving</h5>
              <p className={styles.timelineNodeDesc}>15–20 days of patient, rhythmic handloom weaving by master artisans.</p>
            </div>

            {/* Step 4 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>
                <Sparkles size={22} className={styles.nodeIcon} />
                <span className={styles.stepNum}>04</span>
              </div>
              <h5 className={styles.timelineNodeTitle}>Detailing</h5>
              <p className={styles.timelineNodeDesc}>Hand-knotted tassels & intricate zari border finishing.</p>
            </div>

            {/* Step 5 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>
                <ShieldCheck size={22} className={styles.nodeIcon} />
                <span className={styles.stepNum}>05</span>
              </div>
              <h5 className={styles.timelineNodeTitle}>Quality</h5>
              <p className={styles.timelineNodeDesc}>Meticulous 30-point check for thread weave & color perfection.</p>
            </div>

            {/* Step 6 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>
                <Package size={22} className={styles.nodeIcon} />
                <span className={styles.stepNum}>06</span>
              </div>
              <h5 className={styles.timelineNodeTitle}>Packaging</h5>
              <p className={styles.timelineNodeDesc}>Eco-luxury heirloom boxing with a personalized weaver story card.</p>
            </div>

            {/* Step 7 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>
                <Compass size={22} className={styles.nodeIcon} />
                <span className={styles.stepNum}>07</span>
              </div>
              <h5 className={styles.timelineNodeTitle}>Delivery</h5>
              <p className={styles.timelineNodeDesc}>Global white-glove insured delivery right to your doorstep.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Why Mazhai Vaanam */}
      <section className={styles.whyBrandSection}>
        <div className={styles.whyBrandWrapper}>
          <h3 className={styles.whyBrandTitle}>The Mazhai Vaanam Difference</h3>

          <div className={styles.whyBrandGrid}>
            <div className={styles.whyCard}>
              <Award size={36} className={styles.whyCardIcon} />
              <h4>100% Handloom</h4>
              <p>We strictly prohibit power-loom products. Each saree is a labor of love, woven manually by master artisans.</p>
            </div>

            <div className={styles.whyCard}>
              <Sparkles size={36} className={styles.whyCardIcon} />
              <h4>Exclusive Designs</h4>
              <p>Limited edition pieces with motifs that are unique to our label, ensuring you own a rare masterpiece.</p>
            </div>

            <div className={styles.whyCard}>
              <ShieldCheck size={36} className={styles.whyCardIcon} />
              <h4>Eco-Luxury Packaging</h4>
              <p>Sustainable, handcrafted boxes designed for preservation and gift-giving excellence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements metrics banner */}
      <section className={styles.metricsSection}>
        <div className={styles.metricsLayoutGrid}>
          <div>
            <p className={styles.metricVal}>
              <AnimatedCounter target={25} suffix="K+" />
            </p>
            <p className={styles.metricMeta}>Global Customers</p>
          </div>
          <div>
            <p className={styles.metricVal}>
              <AnimatedCounter target={150} suffix="+" />
            </p>
            <p className={styles.metricMeta}>Unique Designs</p>
          </div>
          <div>
            <p className={styles.metricVal}>
              <AnimatedCounter target={500} suffix="+" />
            </p>
            <p className={styles.metricMeta}>Cities Served</p>
          </div>
          <div>
            <p className={styles.metricVal}>
              <AnimatedCounter target={1200} suffix="+" />
            </p>
            <p className={styles.metricMeta}>Artisans Empowered</p>
          </div>
        </div>
      </section>

      {/* Family Newsletter */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterThreadBackground}></div>
        <div className={styles.newsletterContent}>
          <h3 className={styles.newsletterTitle}>Join The Family</h3>
          <p className={styles.newsletterDesc}>
            Subscribe to receive exclusive access to our newest collection launches and artisan stories.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert("Subscription saved! Welcome to the Atelier family."); }} className={styles.newsletterForm}>
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              required
              className={styles.newsletterInput}
            />
            <button type="submit" className={styles.newsletterSubmitBtn}>
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default About;
