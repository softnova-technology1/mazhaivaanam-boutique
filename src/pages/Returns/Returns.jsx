import { useState } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Camera,
  FileText,
  UploadCloud,
  MessageSquare,
  Smartphone,
  Scissors,
  ChevronDown
} from 'lucide-react';
import styles from './Returns.module.css';

export const Returns = ({ setCurrentTab }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setIssueSubmitted(true);
    setTimeout(() => {
      setIssueSubmitted(false);
      setOrderId('');
      setSelectedFile(null);
    }, 4000);
  };

  const refundSteps = [
    {
      id: "01",
      title: "Submit Request",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbiWVSQoyrZ8kXHwVg8PFLj6F8YNH_LhpdzxEMFZiSLYiTVluzJFNN4mDUDkdTOiZCQNbzfIiY2okyaem4yFD57v2aTRDakpPg4U0ege2eBkTuZ2xTyMp8ldU3oVx8q57z39LYclL4Tlv0SfOlqkvMFmd3hhKFNOwPzID8Qot1rvho1qROxA7vq_hDyq4aTHt2dzdkSybxkOOhM2nADzFEXtoQQ0uvm6z59WcR7Dt44nY8sa-R0QKy"
    },
    {
      id: "02",
      title: "Pickup Scheduled",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDg88KfrXoL9_EigUl-tLAeexsM0xHIZl8VBTw7mCExS7P0Ay6WhKgZ3W0j0IQVD1RRmKa3JWEX4O5liIebIkzRIlVgttpWVmf8dQjjncA7r3sCk1omY3yVt_f0R1tgPe1ofDm_2SA4_kvbp6OyZQZHsqeuP3YXT7hNcEOig6DlRw5QLNcXTS-muul0lEvZGxrDeQrBZ4_yFPWskpGQxeuGydXfC-fuFZuetUYn74fH6Ugwbcj1g0Qs"
    },
    {
      id: "03",
      title: "Artisan Inspection",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA8vTJQqrPRJghYNHEQMxVo8mp9r26QGmkzfcukGD63KCedJUG3T6tgTiX1OpLub6yALuCXiGLffTaA5IRTVXAgSWiieuroXR2uthp0Quu_Xe8Kx-nApLWtyfRGG9f8Nj8FZ64jvmebu83rUe2BqEDWoenGvb9xLTzE8D5Sfaz7lPmHfPIjAHzdvZxhoHs7cT49sOupgJy6mRrKUhg00tC247tNWn-fh6kmG-QIy3Bghii-vy3oa3-"
    },
    {
      id: "04",
      title: "Approval Notification",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4L706OJ-IZCvQeH55GZnQIHpNnqHVd3oiViVTL3WcN6M8_q-B-tZCDskwfeUPP7ThYObWKlbJF7hzRSDKyXb0pFTOlfqD-P3cksRVeYztdGYEjIygIkyvkwLFSo5ZUWpB9eiA_dREuiKQAZPlpLBbJgNVp3o1-fLu4MNau0D0oVCS3Sa-u7ZRAEUmd2Fd_7Nzn8-ltFVk1lM4ko_2GEvxqqMdjbbabw81BaRjHpNF9z0CqO1mYIZg"
    },
    {
      id: "05",
      title: "Money Credited",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIoOAljZfBfffK88HMM6ie9A4fR0cj6ANqA967rjoVR9pjQBBPTw8v2cUmamkLuxv-cTKeV4qbSFnKN-zXaIn6dw9pHv1B6PBoQ_RnpBfhlkhPAgRINDbFrDnRpsC1dc3ITMK40OcUVyv65IaVhxRyTxXtNj0T9FRvmGPCa8-GcMqUQRzb47RBoUhCk5in5nO9R3S5Hje__dMCNmILMM6RzKRyJz5G9QDHoykVrOQxXtgIclkrBSk6"
    }
  ];

  return (
    <div className={styles.returnsPageContainer}>
      
      {/* Cinematic Hero */}
      <header className={styles.heroSection}>
        
        
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Returns Made With Care.</h1>
          <p className={styles.heroSubtitle}>
            At Mazhai Vaanam, customer satisfaction comes first. We handle every return with the same artistry and respect as our hand-woven creations.
          </p>
          <div className={styles.actionBtnRow}>
            <button onClick={() => scrollToSection('overview')} className={styles.exploreBtn}>
              Explore Policy
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Quick Nav Bar */}
      <div className={styles.stickyQuickNav}>
        <div className={styles.quickNavContainer}>
          <button onClick={() => scrollToSection('overview')}>Return Policy</button>
          <button onClick={() => scrollToSection('eligibility')}>Exchange Policy</button>
          <button onClick={() => scrollToSection('timeline')}>Refund Process</button>
          <button onClick={() => scrollToSection('support')}>FAQs</button>
        </div>
      </div>

      {/* Return Overview Section */}
      <section className={styles.overviewSection} id="overview">
        <div className={styles.overviewFlexGrid}>
          
          <div className={styles.overviewText}>
            <span className={styles.promiseLabel}>OUR PROMISE</span>
            <h2 className={styles.overviewHeadline}>Grace in Every Interaction.</h2>
            <p className={styles.overviewDesc}>
              We understand that luxury is not just in the fabric, but in the peace of mind. If your selected piece doesn't perfectly resonate with your spirit, our return process is designed to be as seamless as silk.
            </p>

            <div className={styles.benefitsRow}>
              <div className={styles.benefitCard}>
                <Calendar size={36} className={styles.benefitIcon} />
                <h4>7-Day Easy Return</h4>
                <p>Hassle-free window to ensure your complete satisfaction.</p>
              </div>

              <div className={styles.benefitCard}>
                <CheckSquare size={36} className={styles.benefitIcon} />
                <h4>Quality Checked</h4>
                <p>Every returned item undergoes a rigorous inspection by our master weavers.</p>
              </div>
            </div>
          </div>

          <div className={styles.overviewImageBox}>
            <div className={styles.backingLineBorder}></div>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtAl-FMCdCthGZfKO4pInkrlth_uAuMZV6doEhGsmNmDHiqNM5Xdm9eXUlxMFS92FbYZru7QMVrwCiSYmLOqUzVuC8KQT3aYoJieZbEMkcqjY-APdN5-Gv7FIScePLooJA8jGiATaVTdP2JzibwOzHFOnQM6HzZ6NFjGGM0Wh1lccftZ292S9YJLMQLuu_68B_Zkx9ASN536lkXdAzcPD4KJpeyfH0p7VCbnLhH-fMdqgRQO0K1N72" 
              alt="Hands feeling the texture of an emerald green silk saree" 
              className={styles.tactileSilkImg}
            />
            <div className={styles.signatureBadge}>
              <p className={styles.signatureText}>"Crafting trust, one weave at a time."</p>
            </div>
          </div>

        </div>
      </section>

      {/* Guidelines Comparison Cards */}
      <section className={styles.guidelinesSection} id="eligibility">
        <div className={styles.sectionHeader}>
          <h2>Eligibility Guidelines</h2>
          <p>To maintain the sanctity of our garments, please ensure returns meet these criteria.</p>
        </div>

        <div className={styles.guidelinesGrid}>
          
          {/* Column 1: Eligible */}
          <div className={styles.eligibilityCard}>
            <div className={styles.eligibilityImgFrame}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC94aPm3dS9JYQy13nvYKmlJNOH0-DeAXfFoeF5HqlUN_HMAx0sOZ1bfmnYyAY2_nM3mOqJMmJTcxCE04a1ezFyTTDRZ2z1Ib5TsTZUi4N87KowVQTQevQcZGIwW5zxfyMvKGbnWup74G9IqeIGskpjQVbUMMYt5t5t_iMEUyJ6iVAc25STPoGMmKrNokQwfetGjvF-IHOSvLvBgGju_FjJm90cTQC9YINr8DBROLL-N-2rkDX7d5e6" 
                alt="Maroon silk saree folded in white gift box" 
              />
            </div>
            <div className={styles.eligibilityBody}>
              <div className={`${styles.statusRow} ${styles.eligibleStatus}`}>
                <CheckCircle size={20} />
                <span>ELIGIBLE FOR RETURN</span>
              </div>
              <ul className={styles.criteriaList}>
                <li><span className={styles.goldBullet}>•</span> Unworn, unwashed, and in original condition.</li>
                <li><span className={styles.goldBullet}>•</span> All original tags and safety seals intact.</li>
                <li><span className={styles.goldBullet}>•</span> Original luxury packaging must be returned.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: Not Eligible */}
          <div className={styles.eligibilityCard} style={{ borderBottomColor: '#ba1a1a' }}>
            <div className={styles.eligibilityImgFrame}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzQ6kIcy5pU9zr6opV0UbCAb8pzD-eQHQjcA1uJFfXtCzm23Zu4DdimwYd7A1kEh0vNu3_QxF1s29T8yPRe-cQiiF3YXyS6pJZiUDtkIDHb5WRf3PYJqv1CRk7nVtYdfM6sizkHmgVlREvhMq7qnqLRKMXCBIUlYYgEUKQW5IC0I0BqP1xIuZveFVfadtS_QO3UzdhemdMlprr9_1haZVupXLGcKb9c76wdAz9oBmS6DHQXBMnh0hE" 
                alt="Wrinkled disheveled silk saree return attempt" 
              />
            </div>
            <div className={styles.eligibilityBody}>
              <div className={`${styles.statusRow} ${styles.rejectedStatus}`}>
                <XCircle size={20} />
                <span>NOT ELIGIBLE</span>
              </div>
              <ul className={styles.criteriaList}>
                <li><span className={styles.redBullet}>•</span> Items with perfume, makeup, or sweat stains.</li>
                <li><span className={styles.redBullet}>•</span> Damaged tags or missing original packaging.</li>
                <li><span className={styles.redBullet}>•</span> Blouse pieces that have been cut or tailored.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Exchange timeline */}
      <section className={styles.exchangeTimelineSection} id="timeline">
        <h2 className={styles.exchangeMainTitle}>The Exchange Journey</h2>
        
        <div className={styles.timelineHorizontalRail}>
          <div className={styles.railLine}></div>
          <div className={styles.timelineRowNodes}>
            
            <div className={styles.timelineNodeBlock}>
              <div className={styles.circleNode}>1</div>
              <span className={styles.nodeLabel}>Request</span>
            </div>

            <div className={styles.timelineNodeBlock}>
              <div className={styles.circleNode}>2</div>
              <span className={styles.nodeLabel}>Verification</span>
            </div>

            <div className={styles.timelineNodeBlock}>
              <div className={styles.circleNode}>3</div>
              <span className={styles.nodeLabel}>Pickup</span>
            </div>

            <div className={styles.timelineNodeBlock}>
              <div className={styles.circleNode}>4</div>
              <span className={styles.nodeLabel}>Inspection</span>
            </div>

            <div className={styles.timelineNodeBlock}>
              <div className={styles.circleNode}>5</div>
              <span className={styles.nodeLabel}>Approval</span>
            </div>

            <div className={styles.timelineNodeBlock}>
              <div className={styles.circleNode}>6</div>
              <span className={styles.nodeLabel}>Shipping</span>
            </div>

          </div>
        </div>

        <div className={styles.timelineStepsTexts}>
          <p>Initiate your request via the "My Account" portal within 7 days of delivery.</p>
          <p>Complimentary reverse pickup will be scheduled at your convenience.</p>
          <p>Your new selection will be dispatched immediately upon quality clearance.</p>
        </div>
      </section>

      {/* Burgundy Pathway */}
      <section className={styles.refundPathwaySection}>
        <div className={styles.pathwayHeaderRow}>
          <div>
            <span className={styles.pathwaySubLabel}>FINANCIAL REASSURANCE</span>
            <h2 className={styles.pathwayHeadline}>The Refund Pathway</h2>
          </div>
          <div className={styles.pathwayBigWord}>STEPS</div>
        </div>

        <div className={styles.pathwayGrid}>
          {refundSteps.map((step) => (
            <div key={step.id} className={styles.pathwayColumnCard}>
              <div className={styles.pathwayImgWrapper}>
                <img src={step.image} alt={step.title} />
                <div className={styles.stepBadge}>{step.id}</div>
              </div>
              <h4 className={styles.pathwayCardTitle}>{step.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Report Damage Form Section */}
      <section className={styles.damageSupportSection}>
        <div className={styles.damageWrapperBox}>
          
          {/* Left Text */}
          <div className={styles.damageLeftText}>
            <h2>Damaged on Arrival?</h2>
            <p>
              Though we take utmost care in packaging, accidents happen during transit. If you receive a damaged piece, please notify us within 24 hours.
            </p>

            <div className={styles.actionStepsStack}>
              <div className={styles.actionStepItem}>
                <div className={styles.actionCircleIcon}>
                  <Camera size={20} />
                </div>
                <span>Capture photos of the outer box and product.</span>
              </div>

              <div className={styles.actionStepItem}>
                <div className={styles.actionCircleIcon}>
                  <FileText size={20} />
                </div>
                <span>Keep the original invoice and tags handy.</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className={styles.damageRightCard}>
            <div className={styles.shimmerOverlayLine}></div>
            
            {issueSubmitted ? (
              <div className={styles.successMessageBlock}>
                <CheckCircle size={32} className={styles.benefitIcon} />
                <h3>Issue Filed Successfully</h3>
                <p>Our quality curators have received your report and will reach out shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit} className={styles.damageForm}>
                <h3>Report an Issue</h3>
                
                <div className={styles.inputGroup}>
                  <label>ORDER ID</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. MV-2024-9981" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className={styles.borderLineInput}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>UPLOAD IMAGES</label>
                  <div className={styles.dashedDropzone} onClick={() => alert("Simulating upload trigger. Select files...")}>
                    <UploadCloud size={32} className={styles.uploadIcon} />
                    <p>Drop images here or click to browse</p>
                  </div>
                </div>

                <button type="submit" className={styles.submitIssueBtn}>
                  Submit Urgent Review
                </button>
              </form>
            )}

          </div>

        </div>
      </section>

      {/* Concierge & Support Accordions */}
      <section className={styles.conciergeSupportSection} id="support">
        <div className={styles.conciergeSupportGrid}>
          
          {/* Left Columns (Concierge details) */}
          <div className={styles.conciergeDetailsCol}>
            <h2>Concierge Support</h2>
            <p>Our styling experts and support team are available to guide you through every choice and concern.</p>
            
            <div className={styles.conciergeStack}>
              
              <div className={styles.conciergeCard} onClick={() => { setCurrentTab('contact'); }}>
                <MessageSquare size={28} className={styles.conciergeIconColor} />
                <div>
                  <h4>Live Chat</h4>
                  <p>Instant styling advice</p>
                </div>
              </div>

              <div className={styles.conciergeCard} onClick={() => alert("Opening WhatsApp updates panel...")}>
                <Smartphone size={28} className={styles.conciergeIconColor} />
                <div>
                  <h4>WhatsApp</h4>
                  <p>Quick order updates</p>
                </div>
              </div>

              <div className={styles.conciergeCard} onClick={() => { setCurrentTab('contact'); }}>
                <Scissors size={28} className={styles.conciergeIconColor} />
                <div>
                  <h4>Styling Consultation</h4>
                  <p>Book a virtual session</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Columns (Accordion faqs) */}
          <div className={styles.accordionsCol}>
            <h3 className={styles.accordionsMainHeadline}>Commonly Asked</h3>
            
            {/* Accordion item 1 */}
            <div className={styles.borderBottomAccordion}>
              <div 
                onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                className={styles.accordionHeaderBtn}
              >
                <span>Can I return a customized saree?</span>
                <ChevronDown size={18} className={`${styles.accordionChevron} ${activeFaq === 1 ? styles.rotatedChevron : ''}`} />
              </div>
              {activeFaq === 1 && (
                <div className={styles.accordionBodyText}>
                  <p>Sarees that have been customized with stitched blouses, attached falls, or picot edging are considered bespoke and are unfortunately not eligible for return unless a manufacturing defect is present.</p>
                </div>
              )}
            </div>

            {/* Accordion item 2 */}
            <div className={styles.borderBottomAccordion}>
              <div 
                onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                className={styles.accordionHeaderBtn}
              >
                <span>How long does the refund take to reflect?</span>
                <ChevronDown size={18} className={`${styles.accordionChevron} ${activeFaq === 2 ? styles.rotatedChevron : ''}`} />
              </div>
              {activeFaq === 2 && (
                <div className={styles.accordionBodyText}>
                  <p>Once approved, refunds typically reflect in your original payment method within 5-7 business days. For bank transfers, please allow an additional 48 hours for the credit to appear.</p>
                </div>
              )}
            </div>

            {/* Accordion item 3 */}
            <div className={styles.borderBottomAccordion}>
              <div 
                onClick={() => setActiveFaq(activeFaq === 3 ? null : 3)}
                className={styles.accordionHeaderBtn}
              >
                <span>Are international orders eligible for returns?</span>
                <ChevronDown size={18} className={`${styles.accordionChevron} ${activeFaq === 3 ? styles.rotatedChevron : ''}`} />
              </div>
              {activeFaq === 3 && (
                <div className={styles.accordionBodyText}>
                  <p>International orders are eligible for returns; however, the customer is responsible for shipping costs and any applicable customs duties for the return shipment. Please contact concierge@mazhaivaanam.com for international return authorization.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Returns;
