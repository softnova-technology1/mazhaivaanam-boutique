import { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  Info, 
  User, 
  Gift, 
  Sparkles,
  PlayCircle,
  MessageSquare,
  Phone,
  Mail,
  Video,
  CheckCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import styles from './Support.module.css';

export const Support = ({ setCurrentTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [faqSearchFiltered, setFaqSearchFiltered] = useState(null);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const [activeFaqId, setActiveFaqId] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setFaqSearchFiltered(null);
      return;
    }
    
    // Simple filter simulation
    if (query.includes('track') || query.includes('order') || query.includes('shipp')) {
      setFaqSearchFiltered('orders');
      scrollToSection('orders');
    } else if (query.includes('silk') || query.includes('care') || query.includes('clean')) {
      setFaqSearchFiltered('care');
      scrollToSection('care');
    } else if (query.includes('return') || query.includes('refund') || query.includes('exchang')) {
      setFaqSearchFiltered('returns');
      scrollToSection('returns');
    } else {
      setFaqSearchFiltered('shopping');
      scrollToSection('shopping');
    }
  };

  const faqs = [
    {
      id: 1,
      q: "How do I track my bespoke ensemble?",
      a: "Once your masterpiece is finalized and shipped from our atelier, you will receive a tracking link via email and WhatsApp. You can also view status updates in your profile under 'My Collections'."
    },
    {
      id: 2,
      q: "Do you offer international shipping for silk sarees?",
      a: "Yes, we deliver our heritage pieces to over 150 countries. Every international shipment is insured and packed in our signature climate-controlled luxury boxes to preserve the silk's integrity."
    },
    {
      id: 3,
      q: "What is your policy on bespoke alterations?",
      a: "We provide one complimentary alteration for all couture orders. Please contact your dedicated styling consultant within 7 days of receiving your order to schedule a session."
    }
  ];

  return (
    <div className={styles.supportPageContainer}>
      
      {/* Cinematic Hero */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackgroundImage}></div>
        <div className={styles.heroGradientOverlay}></div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>How Can We Help You?</h1>
          <p className={styles.heroSubtitle}>Explore our curated guide to artisanal care, orders, and our heritage services.</p>
          
          <form onSubmit={handleSearchSubmit} className={styles.searchBarForm}>
            <input 
              type="text" 
              placeholder="Search for help..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInputField}
            />
            <button type="submit" className={styles.searchSubmitBtn}>
              <Search size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Quick Help Categories Links */}
      <section className={styles.quickHelpSection}>
        <div className={styles.quickGrid}>
          
          <div className={styles.quickCard} onClick={() => scrollToSection('shopping')}>
            <ShoppingBag size={36} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Shopping Guide</span>
          </div>

          <div className={styles.quickCard} onClick={() => scrollToSection('orders')}>
            <Truck size={36} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Orders &amp; Tracking</span>
          </div>

          <div className={styles.quickCard} onClick={() => scrollToSection('payments')}>
            <CreditCard size={36} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Payments</span>
          </div>

          <div className={styles.quickCard} onClick={() => scrollToSection('returns')}>
            <RotateCcw size={36} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Returns &amp; Refunds</span>
          </div>

          <div className={styles.quickCard} onClick={() => scrollToSection('care')}>
            <Info size={36} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Product Care</span>
          </div>

          <div className={styles.quickCard} onClick={() => alert("Navigate to Account settings or login tab")}>
            <User size={36} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Your Account</span>
          </div>

          <div className={styles.quickCard} onClick={() => alert("Gift Wrapping addons are configured in Cart Page")}>
            <Gift size={36} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Gift Services</span>
          </div>

          <div className={styles.quickCard} onClick={() => scrollToSection('consult')}>
            <Sparkles size={36} className={styles.quickIcon} />
            <span className={styles.quickLabel}>Styling Help</span>
          </div>

        </div>
      </section>

      {/* Popular Frequently Asked Accordions */}
      <section className={styles.popularFaqsSection}>
        <div className={styles.faqsWrapper}>
          <h2 className={styles.faqsSectionTitle}>Most Frequently Asked</h2>
          
          <div className={styles.accordionStack}>
            {faqs.map((faq) => {
              const isOpen = activeFaqId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`${styles.accordionItem} ${isOpen ? styles.accordionOpen : ''}`}
                >
                  <div 
                    onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                    className={styles.accordionHeader}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`${styles.chevronIcon} ${isOpen ? styles.chevronRotated : ''}`} />
                  </div>
                  {isOpen && (
                    <div className={styles.accordionBody}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial FAQ Grid */}
      <section className={styles.editorialFaqSection}>
        <div className={styles.editorialGrid}>
          
          {/* Shopping Guide */}
          <div id="shopping" className={styles.editorialCol}>
            <h3 className={styles.editorialHeaderNum}>01 / Shopping Guide</h3>
            <h4 className={styles.editorialColHeadline}>Discovering Heritage</h4>
            <ul className={styles.editorialLinksStack}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Silk fabrics guides loaded."); }}>How to choose the right silk for your occasion</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Weaving techniques details."); }}>Understanding our weaving techniques</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("GI Tags certificates."); }}>Authenticity certificates &amp; GI Tags</a></li>
            </ul>
          </div>

          {/* Orders */}
          <div id="orders" className={styles.editorialCol}>
            <h3 className={styles.editorialHeaderNum}>02 / Orders &amp; Delivery</h3>
            <h4 className={styles.editorialColHeadline}>Timely Elegance</h4>
            <ul className={styles.editorialLinksStack}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Custom orders settings."); }}>Modifying your custom order</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Bridal wear expedited shipping."); }}>Expedited shipping for bridal wear</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Secure courier insurance."); }}>Insurance and safe handling during transit</a></li>
            </ul>
          </div>

          {/* Payments */}
          <div id="payments" className={styles.editorialCol}>
            <h3 className={styles.editorialHeaderNum}>03 / Payments</h3>
            <h4 className={styles.editorialColHeadline}>Secure Transactions</h4>
            <ul className={styles.editorialLinksStack}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Global payment details."); }}>Accepted payment methods globally</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Instalments setups."); }}>Interest-free bespoke installment plans</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Duties and tax info."); }}>Tax and customs duties for global orders</a></li>
            </ul>
          </div>

          {/* Returns */}
          <div id="returns" className={styles.editorialCol}>
            <h3 className={styles.editorialHeaderNum}>04 / Returns</h3>
            <h4 className={styles.editorialColHeadline}>Graceful Exchanges</h4>
            <ul className={styles.editorialLinksStack}>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Ready to wear returns policy."); }}>Eligibility for returns on ready-to-wear</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Pickups scheduled."); }}>Return shipping process and pick-ups</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Exchanges guidelines."); }}>Exchange policy for non-bespoke items</a></li>
            </ul>
          </div>

        </div>
      </section>

      {/* Saree Care Infographic */}
      <section className={styles.careSection} id="care">
        <div className={styles.careLayoutWrapper}>
          
          <div className={styles.careHeaderRow}>
            <div className={styles.careHeaderText}>
              <h2 className={styles.careMainHeadline}>The Art of Preservation</h2>
              <p className={styles.careSubtitle}>
                To own a Mazhai Vaanam piece is to steward a legacy. Our care guide ensures your textiles breathe and bloom for generations.
              </p>
            </div>
            <div className={styles.careHeaderImage}>
              <div className={styles.careImageFrame}></div>
            </div>
          </div>

          <div className={styles.carePillarsGrid}>
            
            <div className={styles.carePillarCard}>
              <span className={styles.pillarStepNum}>01</span>
              <h5>Pure Silk</h5>
              <p>Wrap in unbleached cotton or muslin. Air dry in shade. Professional dry clean only.</p>
            </div>

            <div className={styles.carePillarCard}>
              <span className={styles.pillarStepNum}>02</span>
              <h5>Banarasi</h5>
              <p>Store with silica gel. Refold every 3 months to prevent zari breakage at creases.</p>
            </div>

            <div className={styles.carePillarCard}>
              <span className={styles.pillarStepNum}>03</span>
              <h5>Cotton</h5>
              <p>Cold hand wash with mild detergents. Starch lightly for that crisp, editorial fall.</p>
            </div>

            <div className={styles.carePillarCard}>
              <span className={styles.pillarStepNum}>04</span>
              <h5>Organza</h5>
              <p>Never hang; always store flat. Avoid heavy perfumes directly on the delicate mesh.</p>
            </div>

          </div>

        </div>
      </section>

      {/* Video Help Center (Visual Studio) */}
      <section className={styles.visualStudioSection}>
        <h2 className={styles.visualStudioHeadline}>Visual Studio</h2>
        
        <div className={styles.visualStudioGrid}>
          
          {/* Video 1 */}
          <div className={styles.videoCardBox} onClick={() => alert("Playing Draping video tutorial...")}>
            <div className={styles.videoThumbnailBackground}>
              <PlayCircle size={48} className={styles.playIconGlow} />
              <span className={styles.videoTagText}>01. Perfect Draping</span>
            </div>
          </div>

          {/* Video 2 */}
          <div className={styles.videoCardBox} onClick={() => alert("Playing Fabric Care video tutorial...")}>
            <div className={styles.videoThumbnailBackground}>
              <PlayCircle size={48} className={styles.playIconGlow} />
              <span className={styles.videoTagText}>02. Fabric Care</span>
            </div>
          </div>

          {/* Video 3 */}
          <div className={styles.videoCardBox} onClick={() => alert("Playing Unboxing Reveal video...")}>
            <div className={styles.videoThumbnailBackground}>
              <PlayCircle size={48} className={styles.playIconGlow} />
              <span className={styles.videoTagText}>03. The Box Reveal</span>
            </div>
          </div>

          {/* Video 4 */}
          <div className={styles.videoCardBox} onClick={() => { window.history.pushState(null, '', '/track-order'); setCurrentTab('track-order'); }}>
            <div className={styles.videoThumbnailBackground}>
              <PlayCircle size={48} className={styles.playIconGlow} />
              <span className={styles.videoTagText}>04. Trace My Piece</span>
            </div>
          </div>

        </div>
      </section>

      {/* Still Need Help Banner (Personalized Assistance) */}
      <section className={styles.assistanceBannerSection} id="consult">
        <div className={styles.assistanceGlowOverlay}></div>
        
        <div className={styles.assistanceContentWrapper}>
          <div className={styles.assistanceHeader}>
            <h2>Personalized Assistance</h2>
            <p>Our curators are standing by to assist your journey.</p>
          </div>

          <div className={styles.channelsGrid}>
            
            {/* Channel 1 */}
            <div className={styles.channelCard} onClick={() => { setCurrentTab('contact'); scrollToSection('conciergeForm'); }}>
              <MessageSquare size={32} className={styles.channelIcon} />
              <h6>Live Concierge</h6>
              <p>Available 10 AM - 8 PM IST</p>
              <span className={styles.channelActionBtn}>Start Chat</span>
            </div>

            {/* Channel 2 */}
            <div className={styles.channelCard} onClick={() => alert("Direct styling chat via WhatsApp launched.")}>
              <Phone size={32} className={styles.channelIcon} />
              <h6>WhatsApp</h6>
              <p>Direct styling queries</p>
              <span className={styles.channelActionBtn}>Message Us</span>
            </div>

            {/* Channel 3 */}
            <div className={styles.channelCard} onClick={() => { setCurrentTab('contact'); scrollToSection('conciergeForm'); }}>
              <Mail size={32} className={styles.channelIcon} />
              <h6>Email Support</h6>
              <p>Response within 24 hours</p>
              <span className={styles.channelActionBtn}>Write to Us</span>
            </div>

            {/* Channel 4 */}
            <div className={styles.channelCard} onClick={() => { setCurrentTab('contact'); scrollToSection('conciergeForm'); }}>
              <Video size={32} className={styles.channelIcon} />
              <h6>Virtual Fitting</h6>
              <p>Schedule a private call</p>
              <span className={styles.channelActionBtn}>Book Slot</span>
            </div>

          </div>
        </div>
      </section>

      {/* invitations newsletter section */}
      <section className={styles.invitationNewsletterSection}>
        <div className={styles.newsletterBackgroundImage}></div>
        <div className={styles.newsletterBlurOverlay}></div>
        
        <div className={styles.newsletterWrapper}>
          <span className={styles.newsletterCategory}>The Heritage Journal</span>
          <h3>Invitations to Private Showcases</h3>
          <p>Be the first to view our limited edition collections and weaver stories.</p>
          
          {newsletterSubscribed ? (
            <div className={styles.newsletterSubscribedAlert}>
              <CheckCircle size={20} />
              <span>Invitation List Confirmed. Welcome to the showcases list.</span>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setNewsletterSubscribed(true); }} className={styles.newsletterInputRow}>
              <input 
                type="email" 
                placeholder="Your email address" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className={styles.newsletterEmailInput}
              />
              <button type="submit" className={styles.newsletterJoinBtn}>
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

export default Support;
