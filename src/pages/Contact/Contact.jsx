import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Paperclip,
  Share2, 
  Mail,
  ChevronDown,
  Info
} from 'lucide-react';
import styles from './Contact.module.css';

export const Contact = ({ setCurrentTab }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('GENERAL INQUIRY');
  const [message, setMessage] = useState('');

  // Calendar booking slot states
  const [selectedDay, setSelectedDay] = useState(1); // default active 1st
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

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

  const handleConfirmCalendar = () => {
    setBookingConfirmed(true);
    setTimeout(() => setBookingConfirmed(false), 4000);
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
      {bookingConfirmed && (
        <div className={styles.toastNotification} style={{ borderLeftColor: 'var(--secondary)' }}>
          <span>Slot Confirmed for Oct {selectedDay}, 2026! Check your inbox.</span>
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

          {/* Private Appointment Booking (Calendar) */}
          <div className={styles.calendarSectionBox}>
            <span className={styles.exclusiveBadge}>EXCLUSIVE SERVICE</span>
            <h2 className={styles.calendarTitle}>Private Appointment Booking</h2>
            <p className={styles.calendarDesc}>
              Experience Mazhai Vaanam in a one-on-one session with our lead designers. Available both in-person and virtually.
            </p>

            <div className={styles.calendarWidget}>
              <div className={styles.calendarWidgetHeader}>
                <button onClick={() => alert("Previous month limits reached")} className={styles.calChevronBtn}>
                  &lt;
                </button>
                <span className={styles.calendarMonthTitle}>OCTOBER 2026</span>
                <button onClick={() => alert("Next month coming soon")} className={styles.calChevronBtn}>
                  &gt;
                </button>
              </div>

              {/* Grid week headings */}
              <div className={styles.calendarDaysGridHeader}>
                <div>MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
                <div>SUN</div>
              </div>

              {/* Grid days layout */}
              <div className={styles.calendarDaysGrid}>
                {/* Out of month days */}
                <div className={styles.outOfMonthDay}>26</div>
                <div className={styles.outOfMonthDay}>27</div>
                <div className={styles.outOfMonthDay}>28</div>
                <div className={styles.outOfMonthDay}>29</div>
                <div className={styles.outOfMonthDay}>30</div>
                
                {/* Month Days */}
                <div 
                  onClick={() => setSelectedDay(1)}
                  className={`${styles.calendarDayCell} ${selectedDay === 1 ? styles.selectedDayCell : ''}`}
                >
                  1
                </div>
                <div 
                  onClick={() => setSelectedDay(2)}
                  className={`${styles.calendarDayCell} ${selectedDay === 2 ? styles.selectedDayCell : ''}`}
                >
                  2
                </div>
                
                {/* Available Slot 1 */}
                <div 
                  onClick={() => setSelectedDay(3)}
                  className={`${styles.calendarDayCell} ${styles.availableSlotDay} ${selectedDay === 3 ? styles.selectedDayCell : ''}`}
                >
                  3
                </div>
                <div 
                  onClick={() => setSelectedDay(4)}
                  className={`${styles.calendarDayCell} ${selectedDay === 4 ? styles.selectedDayCell : ''}`}
                >
                  4
                </div>
                <div 
                  onClick={() => setSelectedDay(5)}
                  className={`${styles.calendarDayCell} ${selectedDay === 5 ? styles.selectedDayCell : ''}`}
                >
                  5
                </div>
                <div 
                  onClick={() => setSelectedDay(6)}
                  className={`${styles.calendarDayCell} ${selectedDay === 6 ? styles.selectedDayCell : ''}`}
                >
                  6
                </div>
                <div 
                  onClick={() => setSelectedDay(7)}
                  className={`${styles.calendarDayCell} ${selectedDay === 7 ? styles.selectedDayCell : ''}`}
                >
                  7
                </div>
                
                {/* Available Slot 2 */}
                <div 
                  onClick={() => setSelectedDay(8)}
                  className={`${styles.calendarDayCell} ${styles.availableSlotDay} ${selectedDay === 8 ? styles.selectedDayCell : ''}`}
                >
                  8
                </div>
                <div 
                  onClick={() => setSelectedDay(9)}
                  className={`${styles.calendarDayCell} ${selectedDay === 9 ? styles.selectedDayCell : ''}`}
                >
                  9
                </div>
              </div>

              <button onClick={handleConfirmCalendar} className={styles.confirmSelectionBtn}>
                CONFIRM SELECTION (OCTOBER {selectedDay})
              </button>
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
                <button onClick={() => { setSelectedDay(3); alert("Redirected to Private Calendar. Please confirm selection."); }} className={styles.locationActionBtn}>
                  BOOK APPOINTMENT
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
                <button onClick={() => { setSelectedDay(8); alert("Redirected to Private Calendar. Please confirm selection."); }} className={styles.locationActionBtn}>
                  BOOK APPOINTMENT
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Global Presence Map placeholder with relative pins */}
        <section className={styles.globalPresenceMapSection}>
          <div className={styles.globalPresenceTitleWrapper}>
            <span className={styles.globalPresenceMainHeader}>Global Presence</span>
          </div>
          
          {/* Pin 1: Chennai */}
          <div className={styles.locationPinBlock} style={{ top: '45%', left: '55%' }}>
            <div className={styles.pinWrapper}>
              <div className={styles.pingCircleAnimation}></div>
              <div className={styles.pinDotSolid}></div>
            </div>
            <div className={`${styles.pinHoverCard} ${styles.glassCard}`}>
              <p>CHENNAI FLAGSHIP</p>
            </div>
          </div>

          {/* Pin 2: Bangalore */}
          <div className={styles.locationPinBlock} style={{ top: '55%', left: '52%' }}>
            <div className={styles.pinWrapper} style={{ color: 'var(--secondary)' }}>
              <div className={styles.pingCircleAnimation} style={{ backgroundColor: 'rgba(119, 90, 4, 0.2)' }}></div>
              <div className={styles.pinDotSolid} style={{ backgroundColor: 'var(--secondary)' }}></div>
            </div>
            <div className={`${styles.pinHoverCard} ${styles.glassCard}`} style={{ color: 'var(--secondary)' }}>
              <p>BANGALORE STUDIO</p>
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
