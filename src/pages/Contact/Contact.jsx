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
      q: "How long does it take for a bespoke bridal ensemble?",
      a: "Our bespoke bridal ensembles typically take 12 to 16 weeks from the initial consultation to final delivery. This includes hand-weaving, embroidery, and multiple fittings."
    },
    {
      q: "Do you offer international shipping for collections?",
      a: "Yes, we provide premium international shipping to over 50 countries via our courier partners DHL and FedEx. Shipping times vary from 7-14 business days."
    },
    {
      q: "Can I request a virtual styling consultation?",
      a: "Absolutely. We offer high-definition video consultations via Zoom or WhatsApp for our global clients who cannot visit our physical boutiques."
    },
    {
      q: "What is your policy on returns for heritage pieces?",
      a: "Our heritage pieces are curated with extreme care. We offer returns or exchanges on non-bespoke items within 7 days of receipt, provided the tags and seals are intact."
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
          <span className={styles.heroSubtitle}>Direct Access to the Atelier</span>
          <h1 className={styles.heroTitle}>Let's Begin a Beautiful Conversation</h1>
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
                <Phone size={18} className={styles.infoCardIcon} />
                <div className={styles.infoCardText}>
                  <h4>Phone Support</h4>
                  <p>+91 44 4829 1102</p>
                  <span>Mon - Sat: 11:00 AM - 8:00 PM IST</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <MessageCircle size={18} className={styles.infoCardIcon} />
                <div className={styles.infoCardText}>
                  <h4>WhatsApp Concierge</h4>
                  <a href="https://wa.me/919840123456" target="_blank" rel="noopener noreferrer" className={styles.whatsappLink}>
                    +91 98401 23456 &rarr;
                  </a>
                  <span>Instant stylist chat assistance</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <Mail size={18} className={styles.infoCardIcon} />
                <div className={styles.infoCardText}>
                  <h4>Email Support</h4>
                  <a href="mailto:concierge@mazhaivaanam.com" className={styles.emailLink}>
                    concierge@mazhaivaanam.com
                  </a>
                  <span>Expected response within 24 hours</span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <Store size={18} className={styles.infoCardIcon} />
                <div className={styles.infoCardText}>
                  <h4>Our Flagship Boutique</h4>
                  <p>No. 42, Khader Nawaz Khan Road, Nungambakkam, Chennai - 600006</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Boutique Locations Flagship Cards */}
        <section className={styles.locationsSection}>
          <h2 className={styles.locationsMainTitle}>Boutique Locations</h2>
          
          <div className={styles.locationsGrid}>
            
            {/* Chennai Flagship */}
            <div className={styles.locationDetailCard}>
              <div className={styles.locationImageBox}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhu1MdbcdJZD0C26tx3KXEiLVNNLmJT9Fz9D1zLxqrCZvrNhETmzLwtU_dUPPBrh9mxVHmm8bJQbmkea2OZMEx5t53WmnMUhbVqEccuw0N-DA6R2_SjMyxXc0O34lqmJ86f2WrSqFXo9onuqZUt3NxmSBp9BnxPHasOR1dQ4qf_AI-oMPewjz7tJ-spjAyddO890Pm1fgaXrRShWs_hqY5U7AbxJ8msJNKahtuLeOa_LwvDhtOiond" 
                  alt="Chennai Flagship Storefront" 
                />
              </div>
              <div className={styles.locationTextDetails}>
                <div>
                  <h3 className={`${styles.locationTitleHeader} ${styles.lineAccent}`}>The Chennai Flagship</h3>
                  <p className={styles.locationAddressText}>No. 42, Khader Nawaz Khan Road, Nungambakkam, Chennai - 600006</p>
                  <p className={styles.locationHoursLabel}>Hours</p>
                  <p className={styles.locationHoursValue}>Mon - Sat: 11 AM - 8 PM<br />Sun: 12 PM - 6 PM</p>
                </div>
                <button onClick={() => window.open("https://maps.google.com", "_blank")} className={styles.locationActionBtn}>
                  GET DIRECTIONS
                </button>
              </div>
            </div>

            {/* Bangalore Studio */}
            <div className={styles.locationDetailCard}>
              <div className={styles.locationImageBox}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZUJgQ1RW2qp4ChGLA58o31DzmiUP_fIlkm-1jgs7S8FhULpEzO0mO07Fx7s0q5SuwlX262J7Ct1ZQhpzEkh1uUU5f6AFvPQrzobxogteUUvyZKglvUsWrg4Ak1ErFgACMa3tWR5m2NmKOg9UT8CScwla3_R8OOqoHwfgVt5EQKUo4qm3nAXsB1yiwduLyByJNqwVeEEwEZYeFum8q2PsTTXWlVghJOo43SuGffmvdugnPojHi8aDc" 
                  alt="Bangalore Studio Storefront" 
                />
              </div>
              <div className={styles.locationTextDetails}>
                <div>
                  <h3 className={`${styles.locationTitleHeader} ${styles.lineAccent}`}>The Bangalore Studio</h3>
                  <p className={styles.locationAddressText}>15th Cross, Lavelle Road, Bangalore - 560001</p>
                  <p className={styles.locationHoursLabel}>Hours</p>
                  <p className={styles.locationHoursValue}>Tue - Sun: 11 AM - 8 PM<br />Mon: Closed</p>
                </div>
                <button onClick={() => window.open("https://maps.google.com", "_blank")} className={styles.locationActionBtn}>
                  GET DIRECTIONS
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Boutique Interactive Maps */}
        <section className={styles.mapsSection}>
          <div className={styles.mapsHeader}>
            <span className={styles.mapsTag}>FIND US ON THE MAP</span>
            <h2>Locate Our Boutiques</h2>
            <div className={styles.divider} />
          </div>
          <div className={styles.mapsGrid}>
            <div className={styles.mapCard}>
              <h4>The Chennai Flagship</h4>
              <div className={styles.mapFrameWrapper}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.29177114674!2d80.25055047585093!3d13.061730013175853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526615e45a2789%3A0xc36c7c40d7c71d6f!2sKhader%20Nawaz%20Khan%20Rd%2C%20Nungambakkam%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1716382103445!5m2!1sen!2sin" 
                  width="100%" 
                  height="350" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Chennai Flagship Store Map"
                ></iframe>
              </div>
            </div>
            <div className={styles.mapCard}>
              <h4>The Bangalore Studio</h4>
              <div className={styles.mapFrameWrapper}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9806497259164!2d77.59628047584898!3d12.973099714856424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae167b5eb46115%3A0xe5cdcdadbe3ff98d!2sLavelle%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1716382142103!5m2!1sen!2sin" 
                  width="100%" 
                  height="350" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bangalore Studio Map"
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
