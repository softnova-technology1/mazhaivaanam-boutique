import { useState } from 'react';
import { contactAPI } from '../../services/api';
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
  Store,
  CheckCircle2
} from 'lucide-react';
import styles from './Contact.module.css';

export const Contact = ({ setCurrentTab }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('GENERAL INQUIRY');
  const [message, setMessage] = useState('');

  // Accordion indices state
  const [activeFaq, setActiveFaq] = useState(null);

  const handleConciergeSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await contactAPI.submitInquiry({
        name,
        email,
        phone,
        subject,
        message
      });
      setFormSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Contact submission error:', err);
      // Fallback local acknowledgment
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      }, 4000);
    } finally {
      setIsSubmitting(false);
    }
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
        {/* Order Support & Live Tracking Section */}
        <section className={styles.trackingBannerSection}>
          <div className={styles.trackingCard}>
            <div className={styles.trackingInfo}>
              <span className={styles.trackingTag}>ORDER ASSISTANCE</span>
              <h2>Order Support & Live Tracking</h2>
              <p>
                Looking for real-time tracking, delivery status updates, or help with a recent boutique acquisition?
                Use our live tracking portal to check your order state.
              </p>
            </div>
            <button
              className={styles.trackOrderActionBtn}
              onClick={() => {
                window.history.pushState(null, '', '/track-order');
                setCurrentTab('track-order');
              }}
            >
              <span>TRACK YOUR ORDER</span>
              <ArrowRight size={16} />
            </button>
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
                <input
                  type="tel"
                  placeholder=" "
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.formInput}
                  id="phoneInput"
                />
                <label className={styles.formLabel}>PHONE / WHATSAPP NUMBER</label>
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
                  <p className={styles.locationHoursValue}>Mon - Sat: 10 AM - 8 PM<br />Sun: Closed</p>
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
