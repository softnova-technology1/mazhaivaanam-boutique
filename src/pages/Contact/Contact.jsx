import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Paperclip,
  Share2, 
  Mail,
  ChevronDown,
  Info,
  Phone,
  MessageCircle,
  Store
} from 'lucide-react';
import styles from './Contact.module.css';

export const Contact = ({ setCurrentTab }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('GENERAL INQUIRY');
  const [message, setMessage] = useState('');

  // Accordion indices state
  const [activeFaq, setActiveFaq] = useState(null);

  const handleConciergeSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill out all required fields.");
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  const faqs = [
    {
      q: "How do I place an order?",
      a: "To place an order, simply browse our product catalog, select the items you want, and add them to your cart. Once you're ready, proceed to the checkout, provide the necessary information, and complete your purchase."
    },
    {
      q: "Can I modify or cancel my order after placing it?",
      a: "Unfortunately, we are unable to modify or cancel orders once they have been placed. Please double-check your order before confirming your purchase."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Razorpay, UPI, Google Pay, Netbanking, and major credit/debit cards."
    },
    {
      q: "Is it safe to shop on your website?",
      a: "Yes, shopping on our website is secure. We use industry-standard encryption and security protocols to protect your personal and financial information."
    }
  ];

  return (
    <div className={styles.contactPageContainer}>
      
      {/* Absolute Toast Alerts */}
      {formSubmitted && (
        <div className={styles.toastNotification}>
          <span>Inquiry Submitted! Our Concierge will email you shortly.</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <header className={styles.heroSection}>
        <div className={styles.heroBackgroundImage}></div>
        <div className={styles.heroGradientOverlay}></div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>We're Here to Help</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '900px', margin: '0 auto 24px auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Have a question about our collections or need assistance with your order? Our team is always happy to help. Reach out to us—we'd love to hear from you and make your shopping experience seamless.
          </p>
          <div className={styles.heroActionRow}>
            <a href="#conciergeForm" className={styles.enquireBtn}>ENQUIRE NOW</a>
            <div className={styles.supportStatusBadge}>
              <span className={styles.pulseGreenDot}></span>
              LIVE SUPPORT ACTIVE: AVG RESPONSE 15 MIN
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className={styles.mainLayout}>

        {/* Service Pillars Section */}
        <section className={styles.pillarsSection}>
          
          {/* Pillar 1 */}
          <div className={styles.pillarCardGroup} onClick={() => alert("Redirecting to Styling Portfolio...")}>
            <div className={styles.pillarImageBox}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA26t0G-JutRDn17wxfgDb1SMTP5-ejobxgKNFAzrhf7I6hgYEFFCSlMB3krdROmRk3OQkJdEx8eVfeFbo0rsGeNjd2VhCWxkLCWCoO3Vqr5QrnLcx1L_YrwgiRXK0PAitTMRg7eM5ySQvkRA__YMuy6E3RKGmebnelsBqdNon76HyHDAbigK9ZIq6PtvUJWRhlo4uDWF3eGD1ITlG5u_5O5bZcrgLxQiJ9l_3kTDRuH6fp1iuuCyJZ" 
                alt="Styling Consultation" 
              />
            </div>
            <h3 className={styles.pillarTitle}>Styling Consultation</h3>
            <p className={styles.pillarDesc}>Curated looks for your special occasions, tailored to your personal aesthetic.</p>
            <span className={styles.pillarActionLink}>LEARN MORE</span>
          </div>

          {/* Pillar 2 */}
          <div className={styles.pillarCardGroup} onClick={() => alert("Opening Trousseau Planner calendar slots...")}>
            <div className={styles.pillarImageBox}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-1tiEWAH6tlNs9vEPgi5NH-itr4Yi11cSP2md12QGCBU1sNT25-ZH_pl4xmhJKyv4FAj8mbmZcykpsbsNpiCGUxTTkv3pDoGgdi-ZjRsspbrY7rDvxZ6ajkYm5nH7xy87KnPTqlj91CO5aCTGhRxmMlHcmy6JIAmKK1Gzj1MdyQm1KEjUF2PbY05MId9dXg0ZADijqSIuKIu3K-w35QmzKCc1sDQ3Z33l-Emy7ya68OAcy6ceQOlt" 
                alt="Bridal Enquiry" 
              />
            </div>
            <h3 className={styles.pillarTitle}>Bridal Enquiry</h3>
            <p className={styles.pillarDesc}>Bespoke trousseau planning and customized heritage bridal ensembles.</p>
            <span className={styles.pillarActionLink}>RESERVE DATE</span>
          </div>

          {/* Pillar 3 */}
          <div 
            className={styles.pillarCardGroup} 
            onClick={() => {
              window.history.pushState(null, '', '/track-order');
              setCurrentTab('track-order');
            }}
          >
            <div className={styles.pillarImageBox}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdIysYWGrcof0QaKcS9oG169g4hVtel2tklX9ncTjPy457EN93fVtfXvj_ShHDDS92toiscCVbz1iqrMV9scBlyTLOalCu3Wd4yDnqUi7A39Bn7t7c_88OxC8rDfzY30IzvW5OErD0fSKCY1qJBiz9i1SCd6PC3pd25Ru5WBMr76TKVb9GmlIyTsYq6q8eGJSM7TzmuBGohpWyJ1MjGFsljpJsWc1DWP7mOZsmQdbT_7sGypYmizSN" 
                alt="Order Support" 
              />
            </div>
            <h3 className={styles.pillarTitle}>Order Support</h3>
            <p className={styles.pillarDesc}>Real-time tracking and assistance for your recent boutique acquisitions.</p>
            <span className={styles.pillarActionLink}>TRACK ORDER</span>
          </div>

          {/* Pillar 4 */}
          <div className={styles.pillarCardGroup} onClick={() => alert("Corporate enquiry form matches custom logo box layouts.")}>
            <div className={styles.pillarImageBox}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8N2G_SH6WX1zFa9s3HoCX6OY4TbM5xcy1_NlB0HHCirv0eIYMOpzPaPINppO88eEK1Eb7mOYoFTg7vO4cq1qFjYWGQp9njduxPrXwfljix2Mrt8u7oocWzAhg5RJhI6a7PgdbC-8nDVN7UDyNkcxXXoDPDGoqoFLwcXYcE73bE0HJOPwTkwl0caPthcu7ZGvvK1acOb4wUeiQQGM0OER2LbK22NRxPQk4p4A8OXdoCTVEnq5CieZ8" 
                alt="Corporate Gifting" 
              />
            </div>
            <h3 className={styles.pillarTitle}>Corporate Gifting</h3>
            <p className={styles.pillarDesc}>Premium gifting solutions for your esteemed partners and stakeholders.</p>
            <span className={styles.pillarActionLink}>ENQUIRE</span>
          </div>

        </section>

        {/* Form Concierge & Private Calendar Grid */}
        <section className={styles.formsSectionGrid} id="conciergeForm">
          
          {/* Glass Form Concierge */}
          <div className={`${styles.glassFormContainer} ${styles.glassCard}`}>
            <h2 className={styles.formTitle}>The Atelier Concierge</h2>
            <p className={styles.formDesc}>Share your thoughts, and our curators will reach out shortly.</p>
            
            <form onSubmit={handleConciergeSubmit} className={styles.conciergeForm}>
              
              <div className={styles.floatingInputBlock}>
                <input 
                  type="text" 
                  required 
                  placeholder=" " 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.formInput} 
                  id="nameInput"
                />
                <label className={styles.formLabel}>FULL NAME</label>
              </div>

              <div className={styles.floatingInputBlock}>
                <input 
                  type="email" 
                  required 
                  placeholder=" " 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.formInput} 
                  id="emailInput"
                />
                <label className={styles.formLabel}>EMAIL ADDRESS</label>
              </div>

              <div className={styles.floatingInputBlock}>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="GENERAL INQUIRY">GENERAL INQUIRY</option>
                  <option value="BRIDAL CONSULTATION">BRIDAL CONSULTATION</option>
                  <option value="PRESS &amp; MEDIA">PRESS &amp; MEDIA</option>
                  <option value="CAREERS">CAREERS</option>
                </select>
                <label className={styles.selectLabelHeader}>SUBJECT</label>
              </div>

              <div className={styles.floatingInputBlock}>
                <textarea 
                  required 
                  placeholder=" " 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={styles.formTextarea} 
                  rows="4"
                  id="msgInput"
                />
                <label className={styles.formLabel}>YOUR MESSAGE</label>
              </div>

              <div className={styles.attachmentWrapper}>
                <label className={styles.attachmentBtnLabel}>
                  <Paperclip size={16} className={styles.attachmentIcon} />
                  <span>ATTACH REFERENCE STYLES</span>
                  <input type="file" className={styles.hiddenFileInput} onChange={() => triggerToast("Styles uploaded successfully!")} />
                </label>
              </div>

              <button type="submit" className={styles.submitMessageBtn}>
                SEND MESSAGE
              </button>

            </form>
          </div>

          {/* Contact Details & Info Card */}
          <div className={styles.contactDetailsBox}>
            <span className={styles.exclusiveBadge}>CONNECT WITH US</span>
            <h2 className={styles.detailsTitle}>Reach Out to Our Atelier</h2>
            <p className={styles.detailsDesc}>
              Whether you need assistance with custom styling, custom sizing, or order status, our curating team is ready to help.
            </p>

            <div className={styles.infoCardsList}>
              <div className={styles.infoCard}>
                <Info size={18} className={styles.infoCardIcon} />
                <div className={styles.infoCardText}>
                  <h4>Trade Name</h4>
                  <p>Mazhai Vaanam Women's Collections</p>
                  <span>Handle By Naveenkumar Kannan</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <Phone size={18} className={styles.infoCardIcon} />
                <div className={styles.infoCardText}>
                  <h4>Contact Number</h4>
                  <a href="https://wa.me/918807959179" target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
                    +91 8807959179
                  </a>
                  <span>Phone & WhatsApp Support</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <Mail size={18} className={styles.infoCardIcon} />
                <div className={styles.infoCardText}>
                  <h4>Email</h4>
                  <a href="mailto:mazhaivaanampvi@gmail.com" className={styles.emailLink}>
                    mazhaivaanampvi@gmail.com
                  </a>
                  <span>Expected response within 24 hours</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <Store size={18} className={styles.infoCardIcon} />
                <div className={styles.infoCardText}>
                  <h4>Physical Address</h4>
                  <p>ANA Complex- 1st Floor, Sethu Road, Peravurani, Thanjavur, Tamil Nadu, India 614804</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Boutique Location & Map */}
        <section className={styles.locationsSection}>
          <h2 className={styles.locationsMainTitle}>Locate Our Boutique</h2>
          
          <div className={styles.locationsGrid}>
            
            {/* The Physical Store Details */}
            <div className={styles.locationDetailCard}>
              <div className={styles.locationImageBox}>
                <img 
                  src="/Images/contact1.png" 
                  alt="Mazhai Vaanam Boutique Storefront" 
                />
              </div>
              <div className={styles.locationTextDetails}>
                <div>
                  <h3 className={`${styles.locationTitleHeader} ${styles.lineAccent}`}>Mazhai Vaanam Women's Collections</h3>
                  <p className={styles.locationAddressText}>ANA Complex- 1st Floor, Sethu Road, Peravurani, Thanjavur, Tamil Nadu - 614804</p>
                  <p className={styles.locationHoursLabel}>Hours</p>
                  <p className={styles.locationHoursValue}>Mon - Sat: 11 AM - 8 PM<br />Sun: Closed</p>
                </div>
                <button onClick={() => window.open("https://maps.google.com/?q=Mazhai+Vaanam+Womens+Collections,+Peravurani,+Thanjavur,+Tamil+Nadu", "_blank")} className={styles.locationActionBtn}>
                  GET DIRECTIONS
                </button>
              </div>
            </div>

            {/* The Interactive Map */}
            <div className={styles.mapCard}>
              <div className={styles.mapFrameWrapper} style={{ height: '100%', display: 'flex' }}>
                <iframe 
                  src="https://maps.google.com/maps?q=Mazhai%20Vaanam%20Womens%20Collections,%20ANA%20Complex,%20Sethu%20Road,%20Peravurani,%20Thanjavur,%20Tamil%20Nadu%20614804&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  style={{ border: 0, minHeight: '400px', borderRadius: '4px', flexGrow: 1 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mazhai Vaanam Location Map"
                ></iframe>
              </div>
            </div>

          </div>
        </section>

        {/* The FAQ Lounge (Accordions) */}
        <section className={styles.faqLoungeSection}>
          <h2 className={styles.faqTitle}>The FAQ Lounge</h2>
          
          <div className={styles.faqAccordionsWrapper}>
            {faqs.map((faq, index) => {
              const isActive = activeFaq === index;
              return (
                <div 
                  key={index} 
                  onClick={() => setActiveFaq(isActive ? null : index)}
                  className={styles.faqAccordionRowItem}
                >
                  <div className={styles.faqQuestionHeader}>
                    <h4>{faq.q}</h4>
                    <ChevronDown size={18} className={`${styles.faqChevronIcon} ${isActive ? styles.faqChevronRotated : ''}`} />
                  </div>
                  {isActive && (
                    <div className={styles.faqAnswerWrapper}>
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
};

export default Contact;
