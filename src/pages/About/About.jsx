import React from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  User,
  MapPin,
  Flame,
  Star,
  Quote
} from 'lucide-react';
import styles from './About.module.css';

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
          <h2 className={styles.heroTitle}>Every Saree Tells A Story</h2>
          <p className={styles.heroSubtext}>Celebrating timeless traditions and the artistry of hand-woven heritage.</p>

          <div className={styles.heroActionRow}>
            <button
              onClick={() => setCurrentTab('catalog')}
              className={styles.primaryActionBtn}
            >
              Explore Collection
            </button>
            <button
              onClick={handleScrollToStory}
              className={styles.secondaryActionBtn}
            >
              Discover Our Story
            </button>
          </div>
        </div>

        <div className={styles.scrollDownBadge} onClick={handleScrollToStory}>
          <span className={styles.scrollDownLabel}>SCROLL</span>
          <span className={styles.scrollChevron}>↓</span>
        </div>
      </section>

      {/* Our Story */}
      <section className={styles.storySection} id="ourStorySection">
        <div className={styles.storyLayoutGrid}>
          <div className={styles.storyImageContainer}>
            <div className={styles.storyImgBorderFrame}></div>
            <img
              src="/Images/rich silk.png"
              alt="Rich silk handloom weaving with silk cocoons, gold zari thread, and folded sarees"
              className={styles.storyMainImg}
            />
          </div>

          <div className={styles.storyTextContainer}>
            <span className={styles.sinceLabel}>SINCE 1984</span>
            <h3 className={styles.storySectionTitle}>A Dream Preserved In Silk</h3>

            <div className={styles.storyBodyParagraphs}>
              <p>
                Born from the monsoon-kissed looms of Southern India, Mazhai Vaanam — meaning 'Rainy Sky' — was founded on a singular vision: to bring the soul of Indian weaving to the global stage.
              </p>
              <p>
                What began in a small digital atelier has evolved into a movement. We don't just sell sarees; we archive the rhythmic tap-tap of the handloom and the whispers of artisans who have carried these patterns in their blood for generations.
              </p>
              <p>
                Our dream is a world where every woman drapes herself not just in fabric, but in the pride, history, and uncompromising grace of an authentic masterpiece.
              </p>
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
              src="/Images/essence_of_saree.png"
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

      {/* Journey of a Saree (Horizontal Timeline) */}
      <section className={styles.sareeJourneySection}>
        <div className={styles.sareeJourneyHeader}>
          <h3 className={styles.sareeJourneyTitle}>From Loom to Love</h3>
          <p className={styles.sareeJourneySub}>The meticulous seven-step journey of your masterpiece.</p>
        </div>

        <div className={styles.horizontalScrollWrapper}>
          <div className={styles.timelineHorizontalTrack}>

            {/* Step 1 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>1</div>
              <h5 className={styles.timelineNodeTitle}>Design</h5>
              <p className={styles.timelineNodeDesc}>Conceptualizing patterns inspired by nature and architecture.</p>
            </div>

            {/* Step 2 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>2</div>
              <h5 className={styles.timelineNodeTitle}>Material</h5>
              <p className={styles.timelineNodeDesc}>Sourcing the finest Grade-A mulberry silk and pure cotton.</p>
            </div>

            {/* Step 3 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>3</div>
              <h5 className={styles.timelineNodeTitle}>Weaving</h5>
              <p className={styles.timelineNodeDesc}>15-20 days of rhythmic, patient handloom weaving.</p>
            </div>

            {/* Step 4 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>4</div>
              <h5 className={styles.timelineNodeTitle}>Detailing</h5>
              <p className={styles.timelineNodeDesc}>Hand-finished tassels and intricate embroidery work.</p>
            </div>

            {/* Step 5 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>5</div>
              <h5 className={styles.timelineNodeTitle}>Quality</h5>
              <p className={styles.timelineNodeDesc}>Meticulous check for every thread, zari, and color bleed.</p>
            </div>

            {/* Step 6 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>6</div>
              <h5 className={styles.timelineNodeTitle}>Packaging</h5>
              <p className={styles.timelineNodeDesc}>Eco-luxury boxing with a personalized artisan story card.</p>
            </div>

            {/* Step 7 */}
            <div className={styles.timelineNodeBlock}>
              <div className={styles.timelineNodeCircle}>7</div>
              <h5 className={styles.timelineNodeTitle}>Delivery</h5>
              <p className={styles.timelineNodeDesc}>Global white-glove shipping to your doorstep.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Signature Curated Collection Previews */}
      <section className={styles.curatedSection}>
        <h3 className={styles.curatedTitle}>Curated For Moments</h3>

        <div className={styles.curatedLayoutGrid}>
          {/* Box 1 */}
          <div className={styles.curatedMainBox} onClick={() => setCurrentTab('catalog')}>
            <img
              src="/Images/wedding.png"
              alt="Bridal red saree draped elegantly"
            />
            <div className={styles.curatedHoverContent}>
              <span className={styles.hoverCategoryLabel}>SIGNATURE</span>
              <h4>Wedding Collection</h4>
            </div>
          </div>

          {/* Box 2 */}
          <div className={styles.curatedSecondaryBox} onClick={() => setCurrentTab('catalog')}>
            <img
              src="/Images/festival.png"
              alt="Green and gold silk saree on wooden chair"
            />
            <div className={styles.curatedHoverContent}>
              <span className={styles.hoverCategoryLabel}>VIBRANT</span>
              <h4>Festival</h4>
            </div>
          </div>

          {/* Box 3 Stack */}
          <div className={styles.curatedStackColumn}>

            <div className={styles.curatedStackHalfBox} onClick={() => setCurrentTab('catalog')}>
              <img
                src="/Images/office.png"
                alt="Minimalist cotton silk saree art gallery"
              />
              <div className={styles.curatedHoverContentSmall}>
                <h4>Office Minimal</h4>
              </div>
            </div>

            <div className={styles.curatedStackHalfBox} onClick={() => setCurrentTab('catalog')}>
              <img
                src="/Images/party.png"
                alt="Silver blue organza saree cocktail lounge"
              />
              <div className={styles.curatedHoverContentSmall}>
                <h4>Party Shimmer</h4>
              </div>
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
            <p className={styles.metricVal}>25K+</p>
            <p className={styles.metricMeta}>Global Customers</p>
          </div>
          <div>
            <p className={styles.metricVal}>150+</p>
            <p className={styles.metricMeta}>Unique Designs</p>
          </div>
          <div>
            <p className={styles.metricVal}>500+</p>
            <p className={styles.metricMeta}>Cities Served</p>
          </div>
          <div>
            <p className={styles.metricVal}>1200+</p>
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
