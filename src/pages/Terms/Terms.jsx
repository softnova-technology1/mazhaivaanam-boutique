import { useState, useEffect } from 'react';
import { 
  Download, 
  CheckCircle, 
  Award, 
  ShieldCheck, 
  Scale, 
  Truck, 
  Compass, 
  Globe, 
  Mail, 
  AlertCircle,
  FileText,
  Clock
} from 'lucide-react';
import styles from './Terms.module.css';

export const Terms = ({ setCurrentTab }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'agreement', 'responsibilities', 'logistics', 'intellectual', 'pricing', 'contact'];
      let current = 'overview';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.termsPageContainer}>
      
      {/* Luxury Hero Section */}
      <header className={styles.heroSection}>
        
        
        
        <div className={styles.heroContent}>
          <span className={styles.heroCategory}>Legal Identity</span>
          <h1 className={styles.heroTitle}>Terms &amp; Conditions</h1>
          <p className={styles.heroDesc}>
            Clear commitments for a secure and premium shopping experience. We value the trust you place in our craftsmanship.
          </p>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className={styles.mainLayoutGrid}>
        
        {/* Sticky Sidebar Navigation */}
        <aside className={styles.sidebarCol}>
          <div className={styles.stickySidebarWrapper}>
            <p className={styles.sidebarHeader}>SECTIONS</p>
            <nav className={styles.sidebarNav}>
              <button 
                onClick={() => scrollToSection('overview')}
                className={`${styles.navLink} ${activeSection === 'overview' ? styles.navLinkActive : ''}`}
              >
                01. Overview
              </button>
              <button 
                onClick={() => scrollToSection('agreement')}
                className={`${styles.navLink} ${activeSection === 'agreement' ? styles.navLinkActive : ''}`}
              >
                02. Welcome Agreement
              </button>
              <button 
                onClick={() => scrollToSection('responsibilities')}
                className={`${styles.navLink} ${activeSection === 'responsibilities' ? styles.navLinkActive : ''}`}
              >
                03. Responsibilities
              </button>
              <button 
                onClick={() => scrollToSection('logistics')}
                className={`${styles.navLink} ${activeSection === 'logistics' ? styles.navLinkActive : ''}`}
              >
                04. Order Logistics
              </button>
              <button 
                onClick={() => scrollToSection('intellectual')}
                className={`${styles.navLink} ${activeSection === 'intellectual' ? styles.navLinkActive : ''}`}
              >
                05. Intellectual Property
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className={`${styles.navLink} ${activeSection === 'pricing' ? styles.navLinkActive : ''}`}
              >
                06. Pricing &amp; Shipping
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`${styles.navLink} ${activeSection === 'contact' ? styles.navLinkActive : ''}`}
              >
                07. Contact Legal
              </button>
            </nav>
            
            <button onClick={() => alert("Downloading Legal Terms PDF...")} className={styles.sidebarDownloadBtn}>
              <Download size={16} />
              <span>Terms PDF</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <div className={styles.contentCol}>
          
          {/* Section 1: Overview */}
          <section id="overview" className={styles.contentBlock}>
            <div className={styles.textLimitWidth}>
              <h2 className={styles.blockHeadline}>01. Digital Atelier Usage</h2>
              <p className={styles.bodyParagraph}>
                Welcome to Mazhai Vaanam. By accessing this platform, you acknowledge that you are entering a space dedicated to the preservation of Indian heritage. Your interaction with our digital atelier is governed by these protocols.
              </p>
              
              <div className={styles.quoteBox}>
                <p className={styles.quoteText}>
                  "Luxury is not just the product; it is the integrity of the journey from loom to your wardrobe."
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Welcome Agreement */}
          <section id="agreement" className={styles.contentBlock}>
            <div className={`${styles.glassPanelCard} ${styles.glassCard}`}>
              <div className={styles.stampOverlayIcon}>
                <CheckCircle size={180} />
              </div>
              
              <div className={styles.agreementFlexBox}>
                <div className={styles.premiumBadgeCircle}>
                  <div className={styles.innerBadgeFrame}>
                    <Award size={36} />
                  </div>
                </div>
                
                <div className={styles.agreementText}>
                  <h3>The Heritage Seal</h3>
                  <p>
                    Every interaction on our site constitutes an agreement to our terms. We ensure that every saree listed is 100% authentic hand-woven silk, certified by our master weavers. This agreement protects both your purchase and the artisans' livelihood.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: User Responsibilities */}
          <section id="responsibilities" className={styles.contentBlock}>
            <h2 className={styles.blockHeadline}>03. Respectful Conduct</h2>
            
            <div className={styles.guidelinesGrid}>
              
              <div className={styles.conductCard}>
                <ShieldCheck size={36} className={styles.conductIcon} />
                <h4>Account Security</h4>
                <p>Users are solely responsible for maintaining the confidentiality of their digital suite credentials and for restricting access to their devices.</p>
              </div>

              <div className={styles.conductCard}>
                <Scale size={36} className={styles.conductIcon} />
                <h4>Respectful Usage</h4>
                <p>The platform must be used only for lawful purposes. Any attempt to disrupt our digital architecture or scrape data is strictly prohibited.</p>
              </div>

            </div>
          </section>

          {/* Section 4: Order Logistics */}
          <section id="logistics" className={`${styles.contentBlock} ${styles.warmIvoryBanner}`}>
            <h2 className={styles.blockHeadline}>04. The Journey of Your Saree</h2>
            
            <div className={styles.progressRowGrid}>
              <div className={styles.progressLineTrack}></div>
              
              <div className={styles.progressNode}>
                <div className={styles.nodeStepNum}>1</div>
                <h5>Curation</h5>
                <p>Selection of your bespoke piece and payment verification.</p>
              </div>

              <div className={styles.progressNode}>
                <div className={`${styles.nodeStepNum} ${styles.outlineStepNum}`}>2</div>
                <h5>Preparation</h5>
                <p>Artisan quality check and protective climate-controlled packaging.</p>
              </div>

              <div className={styles.progressNode}>
                <div className={`${styles.nodeStepNum} ${styles.outlineStepNum}`}>3</div>
                <h5>Transit</h5>
                <p>Express worldwide delivery via our premium logistics partners.</p>
              </div>

              <div className={styles.progressNode}>
                <div className={`${styles.nodeStepNum} ${styles.outlineStepNum}`}>4</div>
                <h5>Arrival</h5>
                <p>Unboxing experience with our signature heritage certificate.</p>
              </div>
            </div>
          </section>

          {/* Section 5: Intellectual Property */}
          <section id="intellectual" className={styles.contentBlock}>
            <div className={styles.intellectualFlexGrid}>
              
              <div className={styles.designSketchImgBox}>
                <div className={styles.designImgBacking}></div>
                <div className={styles.designSketchCover}></div>
              </div>

              <div className={styles.intellectualText}>
                <h2>05. Design Integrity</h2>
                <p>
                  All content on this platform, including but not limited to the weave patterns, textile designs, photography, and the Mazhai Vaanam brand mark, is our exclusive intellectual property.
                </p>
                <p>
                  Reproduction or imitation of our handcrafted motifs is a violation of copyright laws. We take the protection of our artisans' creative labor with the utmost seriousness.
                </p>
              </div>

            </div>
          </section>

          {/* Section 6: Pricing & Shipping */}
          <section id="pricing" className={styles.contentBlock}>
            <h2 className={styles.blockHeadline}>06. Investment &amp; Delivery</h2>
            
            <div className={styles.pricingBoxesGrid}>
              
              {/* Domestic */}
              <div className={styles.priceCard}>
                <h4 className={styles.priceCardHeader}>Domestic (India)</h4>
                <div className={styles.priceRowItem}>
                  <span>Shipping Cost</span>
                  <span className={styles.boldTextGold}>Complimentary</span>
                </div>
                <div className={styles.priceRowItem}>
                  <span>Timeline</span>
                  <span>3 - 5 Business Days</span>
                </div>
                <div className={styles.priceRowItem}>
                  <span>Taxes</span>
                  <span>Inclusive of GST</span>
                </div>
              </div>

              {/* International */}
              <div className={styles.priceCard}>
                <h4 className={styles.priceCardHeader}>International</h4>
                <div className={styles.priceRowItem}>
                  <span>Shipping Cost</span>
                  <span className={styles.boldTextGold}>$45 USD</span>
                </div>
                <div className={styles.priceRowItem}>
                  <span>Timeline</span>
                  <span>7 - 12 Business Days</span>
                </div>
                <div className={styles.priceRowItem}>
                  <span>Taxes</span>
                  <span>Excl. Custom Duties</span>
                </div>
              </div>

            </div>
          </section>

          {/* Section 7: Contact Legal */}
          <section id="contact" className={styles.contentBlock}>
            <div className={styles.legalAdvisoryBox}>
              <div className={styles.legalInfoLeft}>
                <h2>Legal Advisory</h2>
                <p>For any inquiries regarding your rights or our service protocols.</p>
              </div>
              <div className={styles.legalActionRight}>
                <a href="mailto:legal@mazhaivaanam.com" className={styles.legalMailBtn}>
                  legal@mazhaivaanam.com
                </a>
                <button onClick={() => alert("Connecting to Legal compliance manager...")} className={styles.legalInquireBtn}>
                  Inquire Now
                </button>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Interactive Newsletter Section */}
      <section className={styles.newsletterJoinSection}>
        <div className={styles.newsletterBackdropImage}></div>
        <div className={styles.newsletterDimOverlay}></div>
        
        <div className={styles.newsletterWrapperContent}>
          <h2>Join the Heritage</h2>
          <p>Be the first to explore our seasonal lookbooks and private collection launches.</p>
          
          {newsletterSubscribed ? (
            <div className={styles.newsletterDoneBox}>
              <CheckCircle size={20} />
              <span>Subscription Successful. Welcome to the atelier circles list.</span>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setNewsletterSubscribed(true); }} className={styles.newsletterFormInputRow}>
              <div className={styles.inputFieldBlock}>
                <label>YOUR EMAIL</label>
                <input 
                  type="email" 
                  required 
                  placeholder="atelier@vogue.com" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className={styles.plainUnderlineInput}
                />
              </div>
              <button type="submit" className={styles.newsletterSubmitBtn}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default Terms;
