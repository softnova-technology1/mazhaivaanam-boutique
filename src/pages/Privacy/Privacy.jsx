import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  Download, 
  Trash2, 
  Sliders, 
  Mail, 
  FileText, 
  History,
  CheckCircle,
  Activity,
  Key,
  Shield,
  Briefcase,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import styles from './Privacy.module.css';

export const Privacy = ({ setCurrentTab }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'collection', 'usage', 'security', 'rights', 'contact'];
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
    <div className={styles.privacyPageContainer}>
      
      {/* Cinematic Hero */}
      <header className={styles.heroSection}>
        
        
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Privacy &amp; Trust</h1>
          <p className={styles.heroSubtitle}>Woven with integrity, secured with honor.</p>
          
          <div className={styles.heroCardsGrid}>
            <div className={`${styles.glassPanelCard} ${styles.glassCard}`}>
              <Shield size={36} className={styles.shieldIcon} />
              <div>
                <h4>Secure Shopping</h4>
                <p>End-to-end encryption for every interaction.</p>
              </div>
            </div>

            <div className={`${styles.glassPanelCard} ${styles.glassCard}`}>
              <Lock size={36} className={styles.shieldIcon} />
              <div>
                <h4>Encrypted Payments</h4>
                <p>Industry-leading data protection standards.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className={styles.mainLayoutGrid}>
        
        {/* Sticky Sidebar Navigation */}
        <aside className={styles.sidebarCol}>
          <div className={styles.stickySidebarWrapper}>
            <nav className={styles.sidebarNav}>
              <button 
                onClick={() => scrollToSection('overview')}
                className={`${styles.navLink} ${activeSection === 'overview' ? styles.navLinkActive : ''}`}
              >
                Overview
              </button>
              <button 
                onClick={() => scrollToSection('collection')}
                className={`${styles.navLink} ${activeSection === 'collection' ? styles.navLinkActive : ''}`}
              >
                Collection
              </button>
              <button 
                onClick={() => scrollToSection('usage')}
                className={`${styles.navLink} ${activeSection === 'usage' ? styles.navLinkActive : ''}`}
              >
                Usage
              </button>
              <button 
                onClick={() => scrollToSection('security')}
                className={`${styles.navLink} ${activeSection === 'security' ? styles.navLinkActive : ''}`}
              >
                Security
              </button>
              <button 
                onClick={() => scrollToSection('rights')}
                className={`${styles.navLink} ${activeSection === 'rights' ? styles.navLinkActive : ''}`}
              >
                Rights
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`${styles.navLink} ${activeSection === 'contact' ? styles.navLinkActive : ''}`}
              >
                Contact
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className={styles.contentCol}>
          
          {/* Section 1: Overview */}
          <section id="overview" className={styles.contentBlock}>
            <div className={styles.overviewFlexGrid}>
              <div className={styles.overviewTextPane}>
                <h2>Our Commitment To Your Privacy</h2>
                <p>
                  At Mazhai Vaanam, we believe that the protection of your personal information is as vital as the craftsmanship of our hand-loomed textiles. Your trust is the foundation upon which our heritage is built. We treat your data with the same meticulous care that our master weavers apply to every thread of silk.
                </p>
                <div className={styles.badgeRow}>
                  <span className={styles.artisanPledgeBadge}>The Artisan Pledge</span>
                </div>
              </div>

              <div className={styles.overviewImageBox}>
                <div className={styles.imageBackingBorderFrame}></div>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKTVW6Dl-A10q98mW1RuT3o_hZFXQpFg-VOfMjVJiXfEwTaYRkjwm5u0XAIcmUts8cZSYXS-985E45vX-YC1w6XUeOeXEo1Wh3PvbP7QmAB4JgAd_1jQGwpGL9A-x_NLRWGVbshJbspGT-GAI_MRYaJIpey6pzjcUn8jrPb6KWMAw538BnvIHdYWnBtspu7nuzfGXDWRGlpiEVRK4roSdwILOwdKUiRhv2oermaxg0OeDSHH1dXqn8" 
                  alt="Gold filigree security shield backdrop" 
                  className={styles.shieldVisualImg}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Collection */}
          <section id="collection" className={styles.contentBlock}>
            <h3 className={styles.sectionHeadline}>Information We Collect</h3>
            
            <div className={styles.cardsGrid}>
              
              <div className={styles.lexiconCard}>
                <div className={styles.cardHeaderRow}>
                  <ShieldAlert size={28} className={styles.cardIconColor} />
                  <h5>Personal</h5>
                </div>
                <ul className={styles.cardListItems}>
                  <li>• Full Name</li>
                  <li>• Contact Details</li>
                  <li>• Mailing Address</li>
                </ul>
              </div>

              <div className={styles.lexiconCard}>
                <div className={styles.cardHeaderRow}>
                  <Activity size={28} className={styles.cardIconColor} />
                  <h5>Account</h5>
                </div>
                <ul className={styles.cardListItems}>
                  <li>• Order History</li>
                  <li>• Wishlist Items</li>
                  <li>• Style Preferences</li>
                </ul>
              </div>

              <div className={styles.lexiconCard}>
                <div className={styles.cardHeaderRow}>
                  <Key size={28} className={styles.cardIconColor} />
                  <h5>Payment</h5>
                </div>
                <ul className={styles.cardListItems}>
                  <li>• Billing Info</li>
                  <li>• Transaction IDs</li>
                  <li>• Masked Card Details</li>
                </ul>
              </div>

              <div className={styles.lexiconCard}>
                <div className={styles.cardHeaderRow}>
                  <History size={28} className={styles.cardIconColor} />
                  <h5>Device</h5>
                </div>
                <ul className={styles.cardListItems}>
                  <li>• IP Address</li>
                  <li>• Browser Type</li>
                  <li>• Interaction Logs</li>
                </ul>
              </div>

            </div>
          </section>

          {/* Section 3: Usage */}
          <section id="usage" className={styles.contentBlock}>
            <h3 className={styles.sectionHeadline}>Curating Your Experience</h3>
            
            <div className={styles.usageGrid}>
              
              <div className={styles.usageItem}>
                <div className={styles.usageIconBox}>
                  <Sparkles size={36} />
                </div>
                <div className={styles.usageText}>
                  <h6>Personalization</h6>
                  <p>Tailoring our collections and journal recommendations to match your unique sartorial aesthetic.</p>
                </div>
              </div>

              <div className={styles.usageItem}>
                <div className={styles.usageIconBox}>
                  <History size={36} />
                </div>
                <div className={styles.usageText}>
                  <h6>Order Processing</h6>
                  <p>Ensuring the seamless transit of your chosen heirlooms from our atelier to your doorstep.</p>
                </div>
              </div>

              <div className={styles.usageItem}>
                <div className={styles.usageIconBox}>
                  <Briefcase size={36} />
                </div>
                <div className={styles.usageText}>
                  <h6>Concierge Support</h6>
                  <p>Providing priority assistance for private appointments and bespoke tailoring inquiries.</p>
                </div>
              </div>

              <div className={styles.usageItem}>
                <div className={styles.usageIconBox}>
                  <Shield size={36} />
                </div>
                <div className={styles.usageText}>
                  <h6>Enhanced Security</h6>
                  <p>Continuous monitoring to prevent fraudulent activities and protect your digital identity.</p>
                </div>
              </div>

            </div>
          </section>

          {/* Section 4: Security */}
          <section id="security" className={`${styles.contentBlock} ${styles.burgundySec}`}>
            <span className={styles.burgundyLockIcon}><Lock size={48} /></span>
            <h2>Impenetrable Security Standards</h2>
            <p className={styles.burgundyDesc}>
              Your financial safety is non-negotiable. Every transaction is processed through a multi-layered fortress of digital encryption.
            </p>

            <div className={styles.securityStandardsGrid}>
              <div className={styles.stdItem}>
                <div className={styles.stdIcon}>
                  <Shield size={24} />
                </div>
                <span className={styles.stdLabel}>PCI COMPLIANT</span>
              </div>

              <div className={styles.stdItem}>
                <div className={styles.stdIcon}>
                  <Key size={24} />
                </div>
                <span className={styles.stdLabel}>256-BIT SSL</span>
              </div>

              <div className={styles.stdItem}>
                <div className={styles.stdIcon}>
                  <Lock size={24} />
                </div>
                <span className={styles.stdLabel}>ENCRYPTED VAULT</span>
              </div>
            </div>
          </section>

          {/* Section 5: Data Journey Timeline */}
          <section className={styles.contentBlock}>
            <h3 className={styles.timelineMainTitle}>The Digital Thread: Your Data Journey</h3>
            
            <div className={styles.horizontalTimelineWrapper}>
              <div className={styles.horizontalTrackLine}></div>
              
              <div className={styles.timelineRow}>
                
                <div className={styles.timelineNodeBlock}>
                  <div className={styles.timelineCircleNode}>1</div>
                  <h6 className={styles.nodeTitle}>Collect</h6>
                  <p className={styles.nodeSub}>INITIAL ENTRY</p>
                </div>

                <div className={styles.timelineNodeBlock}>
                  <div className={styles.timelineCircleNode}>2</div>
                  <h6 className={styles.nodeTitle}>Encrypt</h6>
                  <p className={styles.nodeSub}>OBFUSCATION</p>
                </div>

                <div className={styles.timelineNodeBlock}>
                  <div className={`${styles.timelineCircleNode} ${styles.solidCircleNode}`}>3</div>
                  <h6 className={styles.nodeTitle}>Secure Storage</h6>
                  <p className={styles.nodeSub}>PRIVATE VAULT</p>
                </div>

                <div className={styles.timelineNodeBlock}>
                  <div className={styles.timelineCircleNode}>4</div>
                  <h6 className={styles.nodeTitle}>Authorized</h6>
                  <p className={styles.nodeSub}>STRICT ACCESS</p>
                </div>

                <div className={styles.timelineNodeBlock}>
                  <div className={styles.timelineCircleNode}>5</div>
                  <h6 className={styles.nodeTitle}>Safe Deletion</h6>
                  <p className={styles.nodeSub}>PURGE CYCLE</p>
                </div>

              </div>
            </div>
          </section>

          {/* Section 6: Rights */}
          <section id="rights" className={styles.contentBlock}>
            <h3 className={styles.sectionHeadline}>Your Exclusive Rights</h3>
            
            <div className={styles.rightsButtonsGrid}>
              
              <button onClick={() => alert("Access request log created. Check your profile dashboard.")} className={styles.rightsBtnCard}>
                <div className={styles.btnHeader}>
                  <Eye size={28} className={styles.btnIcon} />
                  <span>→</span>
                </div>
                <h5>Access Your Data</h5>
                <p>Request a comprehensive overview of all information we hold regarding your account and identity.</p>
              </button>

              <button onClick={() => alert("Downloading digital PDF data report...")} className={styles.rightsBtnCard}>
                <div className={styles.btnHeader}>
                  <Download size={28} className={styles.btnIcon} />
                  <span>→</span>
                </div>
                <h5>Download Report</h5>
                <p>Export your data in a portable, structured digital format for your personal records or transfer.</p>
              </button>

              <button onClick={() => alert("Erasure request filed. Our governance team will contact you within 24 hours.")} className={styles.rightsBtnCard}>
                <div className={styles.btnHeader}>
                  <Trash2 size={28} className={styles.btnIcon} />
                  <span>→</span>
                </div>
                <h5>The Right to Erasure</h5>
                <p>Request the permanent deletion of your profile and data from our active records at any time.</p>
              </button>

              <button onClick={() => { setCurrentTab('contact'); alert("Redirected to Atelier Concierge page to manage communications preferences."); }} className={styles.rightsBtnCard}>
                <div className={styles.btnHeader}>
                  <Sliders size={28} className={styles.btnIcon} />
                  <span>→</span>
                </div>
                <h5>Manage Preferences</h5>
                <p>Fine-tune how we communicate with you and control your personalized recommendations.</p>
              </button>

            </div>
          </section>

          {/* Section 7: Contact */}
          <section id="contact" className={styles.contentBlock}>
            <div className={styles.governanceBox}>
              <div className={styles.governanceLeft}>
                <h3>Privacy Governance</h3>
                <p>
                  For any inquiries regarding our data handling practices or to exercise your privacy rights, please reach out to our dedicated Privacy Compliance Team.
                </p>
                <a href="mailto:privacy@mazhaivaanam.com" className={styles.complianceEmail}>
                  <Mail size={16} />
                  <span>privacy@mazhaivaanam.com</span>
                </a>
              </div>

              <div className={styles.governanceRight}>
                <button onClick={() => alert("Downloading Privacy Policy Document PDF...")} className={styles.govDownloadBtn}>
                  <Download size={16} />
                  <span>DOWNLOAD POLICY PDF</span>
                </button>
                <button onClick={() => alert("Displaying revision logs: Updated July 2026.")} className={styles.govHistoryBtn}>
                  <History size={16} />
                  <span>REVISION HISTORY</span>
                </button>
              </div>
            </div>
          </section>

        </div>

      </main>

    </div>
  );
};

export default Privacy;
