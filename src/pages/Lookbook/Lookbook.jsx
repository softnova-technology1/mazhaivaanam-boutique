import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  PlayCircle, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  CheckCircle,
  Clock,
  Compass
} from 'lucide-react';
import styles from './Lookbook.module.css';

export const Lookbook = ({ setCurrentTab }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [emailValue, setEmailValue] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Particles for floating silk threads in hero
  const particles = Array.from({ length: 20 });

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement;
      const b = document.body;
      const st = 'scrollTop';
      const sh = 'scrollHeight';
      const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
      setScrollProgress(percent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (!emailValue.trim()) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmailValue('');
    }, 4000);
  };

  const editorsPicks = [
    {
      id: 1,
      tag: "CRAFTSMANSHIP",
      title: "The Alchemy of Zari: Pure Gold & Silk",
      desc: "Inside the atelier where 100% pure silk meets 24k gold-dipped threads.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDvpJaef1GUnqQxkeOYQhg0Iny_c2KF189axwa9Y2plB75n-Bn_w3da0zdWZCXAd7fvGmTVENTuZjJ4OpnZ8WdS-h9N4YO2BexP3Ra7j68LcG_YVqtmIgS9__o3KXwRd-QRQh7xJllrhrn4QBQXFSh0whNt2JIAZJCzjkCX57VaVve3yAEUsxMHqUuMqZr-enTUUl35PKyh6xJWLz644-VlylEQDWLJUDBQvOUVR7XvzZb_22dkdkf",
      offset: false
    },
    {
      id: 2,
      tag: "STYLING GUIDE",
      title: "Modern Heirlooms: Saree Redefined",
      desc: "How to style traditional weaves for contemporary global galas.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7RHGgDSjgCR67domreN-G58R-xBGQY5wWa2OJI6FGoHKqQYnOiz2dZ7Pu3BlxFc-r6dCoyQLQROFym1XHusMi-HDZIQbem2AeS4pCIUXfEE8UL39DWsw2T-a_XIsUNV09q6BQm55WDBbZPIQHO6rZjC9tslAVFyo3ON1o8ShlkxDhWSpGAZiY9pyOkzIo2OswgIlxYs8UDWscJ0U9Zs4Iq2kMUDungWTHTNVIH_uEqcc-YRBpT8FU",
      offset: true
    },
    {
      id: 3,
      tag: "THE BOUTIQUE",
      title: "The Private Atelier Experience",
      desc: "A journey through our bespoke bridal consultation service.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB4MJ2-CgNMUVpdemdPWBF_mlqPiVBCVEEFJOJQuAq-DHduHRvKkgJZE_bB8ek9DLHd3BpuFNlwExoopHSWMxV3ZtFVhWjOo0oDUZ9wGpa0sM5MXTCrse3wW4H7-omXlSaOlmSkbMm5f2gZonvcLWvV0qBdl2EEl76vZlYphndE-3pcViaieHHKGjlJQh5mLFmhQScy5sLEqiouf4KGa2lbyjrerZTjh3BT7fLEKlv7J0ExGzlpiKV",
      offset: false
    },
    {
      id: 4,
      tag: "CARE GUIDE",
      title: "Preserving Memories: Silk Care",
      desc: "Professional secrets to keeping your heritage sarees pristine for generations.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzLbSwrDuE6bZSEjSD_CZr_hrWutPjYSPXt-3x5TiO6QSSSNjZTJIm1Zy-VilnsJFivxKXbvrNCYWQhT5Sr2RSlAazPtj5iPiyx0suGwNgB00wGrbRbZtLQudxsL9qsyImHRcU53dcDIBPo9QhNW3nnAWK0S6Ig62BzJ_gpQy0bgQJLp4htMIUmAV0tO-0THt_PMmOlNK01xH9m3XyRDl-Mqc_sWYlvbsi_MCfP3PRH15l4fLEdjd9",
      offset: true
    }
  ];

  return (
    <div className={styles.journalPageContainer}>
      
      {/* Top scroll reading progress bar */}
      <div 
        className={styles.readingProgressBar} 
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Full Screen Hero */}
      <header className={styles.heroSection}>
        <div className={styles.heroBackgroundImage}></div>
        <div className={styles.heroGradientOverlay}></div>
        
        {/* Floating particles container */}
        <div className={styles.particlesContainer}>
          {particles.map((_, i) => (
            <div 
              key={i} 
              className={styles.silkParticle} 
              style={{
                left: `${(i * 5.7) % 100}%`,
                animationDelay: `${(i * 0.9) % 10}s`,
                animationDuration: `${((i * 1.1) % 6) + 7}s`,
                opacity: 0.15 + ((i % 4) * 0.05)
              }}
            />
          ))}
        </div>

        <div className={styles.heroContent}>
          <span className={styles.heroCategoryTag}>Digital Anthology</span>
          <h1 className={styles.heroTitle}>
            The Journal of <br />
            <span className={styles.italicDisplayTitle}>Timeless Elegance</span>
          </h1>
          <div className={styles.dividerGoldLine}></div>
          <p className={styles.heroDesc}>
            Exploring the intersections of heritage craftsmanship, contemporary styling, and the soulful stories woven into every silk thread.
          </p>
        </div>
      </header>

      {/* Featured Story Section */}
      <section className={styles.featuredSection}>
        <div className={styles.featuredLayoutGrid}>
          
          {/* Left Column: Cover Image & Glass Metadata */}
          <div className={styles.featuredImgWrapper}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcKqZjf-l4AA5wmA1Czy-6MVb142yu1xNdK9tHRm-bbzbWPeGcGE5c1r5j00cVoSYGM1x3XMUrSSgsyzjOHjon_fKDE-07x0b_4UKnUxKXt77HecxWJ11ZqTrY_QbGDCy8RBEmYjQs-9cSwSYzUER-pPlw79zC-tXBygCg-RiWLwu-haLtdXhTc5jT4PnOz0QbXN-z7jexQ0mrSXLLYTDWlt3D9ov4D48KLCrejIcYy8AAjZyXIiWC" 
              alt="Artistic flatlay of silk sarees and gold jewelry" 
              className={styles.featuredMainImg}
            />
            
            {/* Glassmorphic Metadata overlay */}
            <div className={`${styles.glassMetadataBox} ${styles.glassCard}`}>
              <div className={styles.metadataReadTimeRow}>
                <BookOpen size={16} className={styles.readIcon} />
                <span className={styles.readTimeText}>8 MINUTE READ</span>
              </div>
              <h3 className={styles.glassHeadline}>The Bridal Masterclass</h3>
              <p className={styles.glassDesc}>A definitive guide to selecting the weave that defines your legacy.</p>
              <button 
                onClick={() => alert("Loading Bridal Masterclass guide...")} 
                className={styles.glassActionBtn}
              >
                READ THE STORY
              </button>
            </div>
          </div>

          {/* Right Column: Narrative details */}
          <div className={styles.featuredNarrativePane}>
            <span className={styles.narrativeTagHeader}>FEATURED ARTICLE</span>
            <h2 className={styles.narrativeTitle}>The Art Of Choosing The Perfect Wedding Saree</h2>
            <p className={styles.narrativeSummary}>
              From the heavy silks of Kanchipuram to the ethereal translucence of Banarasi organza, discover how to match heritage weaves with your personal bridal aesthetic.
            </p>

            <div className={styles.authorProfileRow}>
              <div className={styles.authorAvatarBox}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP_uePwUg1WkioCMGaYWV63q9Be3TrHFihUsQz_HECxu8fZDhACAA_OvDJGlGgbOSI_LxLzosY5dHFdvzL7gLqp48LHdjrI9QKUOWh3Mr68XPr8s0vOY8H7l5MFFB1vvYJ88Zy1aNt6nzmZENwG2i1HCQrdeE2ultru4ZKgG0bvEXBe0bOFBtl-NZyEOuulq4oNJX65FB61ZBEbjSH8ygRAZGywsWJ3vwmMv6OBb7A6aMRL-cMFrNr" 
                  alt="Ananya Iyer" 
                />
              </div>
              <div>
                <p className={styles.authorName}>By Ananya Iyer</p>
                <p className={styles.authorTitle}>Creative Director</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Curated Editor's Picks (Asymmetric Bento Grid) */}
      <section className={styles.editorsPicksSection}>
        <div className={styles.editorsPicksWrapper}>
          
          <div className={styles.picksHeaderFlex}>
            <div>
              <span className={styles.picksSubLabel}>CURATED COLLECTIONS</span>
              <h2 className={styles.picksHeadline}>Editor's Picks</h2>
            </div>
            <button 
              onClick={() => setCurrentTab('catalog')} 
              className={styles.viewAllStoriesBtn}
            >
              VIEW ALL STORIES
            </button>
          </div>

          {/* Bento Grid */}
          <div className={styles.bentoGridContainer}>
            {editorsPicks.map((pick) => (
              <div 
                key={pick.id} 
                className={`${styles.bentoCardGroup} ${pick.offset ? styles.asymmetricOffset : ''}`}
                onClick={() => alert(`Redirecting to article: ${pick.title}`)}
              >
                <div className={styles.bentoImgFrame}>
                  <img src={pick.image} alt={pick.title} />
                  <div className={styles.bentoHoverDim}></div>
                </div>
                <span className={styles.bentoTagLabel}>{pick.tag}</span>
                <h4 className={styles.bentoCardTitle}>{pick.title}</h4>
                <p className={styles.bentoCardSummary}>{pick.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Categories: Browse by Narrative */}
      <section className={styles.narrativesSection}>
        <h2 className={styles.narrativesSectionTitle}>Browse by Narrative</h2>
        
        <div className={styles.narrativesGrid}>
          
          {/* Card 1 */}
          <div className={styles.narrativeItemCard} onClick={() => setCurrentTab('catalog')}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyfQ6rerJfSFJhy4aS0xYz8OlwPzEkStsDPoOTgc4Mc8bcdtfx0I_8xkqBGVmqVE01xjk3dDdC7_whnU6XRPUU7FEYYia0m4W50jgZHXTr0hqqa7pdNrwrIycl-jOia6que5X_ViQOiY-IbPgreNcrAVmLHPT3PRvX2gHjXZPlULGJc42fs1NiwOs4UpOT6aZ19q0NPzXDOu4WzCgpZ4fRd1qTJGq0TJiNicJaNqV_ZI97FGuZ3fmX" 
              alt="Bride walking away in gold silk" 
            />
            <div className={styles.narrativeHoverOverlay}>
              <span className={styles.narrativeLabelText}>Wedding Styling</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className={styles.narrativeItemCard} onClick={() => setCurrentTab('catalog')}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvNDUS7gO3N7JXKy3WlyYO_JAh6UDc9cpb-YLTbfb8hHDcNaAREvDresk3lrpylpMn7-KkiFQFrdVG86zGvUQ21ZEgXK6tS_aX60ByNKqAa28cXn1Yj1wgh3VTIXwyw7KVzc9GjYjyWWpkeRhKNhEybf7UVQznKRo05BwU2flNQQmsh8WgBaSSVcGYxGF6M_0SRyIdNmE65dL4VNCO_Tv3d7H9t9y7HDYLrpIIQjpNy8dWqNCyM1Je" 
              alt="Model laughing in light organza" 
            />
            <div className={styles.narrativeHoverOverlay} style={{ backgroundColor: 'rgba(119, 90, 4, 0.4)' }}>
              <span className={styles.narrativeLabelText}>Bridal Fashion</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className={styles.narrativeItemCard} onClick={() => alert("Direct to fabric care walkthrough guidelines.")}>
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtFcVKcxnRC5kjv8iUKSZ6t30ufNSOVepE3SCeo7AaoNRNXRbxazCIMPOCTe58yNonaK_Jrfh6aTxoU16JL0bDrP3r2GlY9kZAWex1kgu_ZsQLI-p0uZRpDbwdXzgpwc4G6mOAyV6rQ_L-dfOeQC6qsTFB96SKKtvuzmtMigqfV2nQ-g9wiVeIF1COytBx7id0zlj4byQifXy0PHjOF_zJZQ_93fOnSH_bjIlWcf_6pCuyf2bEK9Gi" 
              alt="Silk spools on workbench" 
            />
            <div className={styles.narrativeHoverOverlay} style={{ backgroundColor: 'rgba(85, 66, 68, 0.4)' }}>
              <span className={styles.narrativeLabelText}>Saree Care</span>
            </div>
          </div>

        </div>
      </section>

      {/* Cinematic Video Stories */}
      <section className={styles.videoStoriesSection}>
        <div className={styles.videoStoriesWrapper}>
          
          <div className={styles.videoStoriesHeaderRow}>
            <h2 className={styles.videoSectionHeadline}>Cinematic Stories</h2>
            <p className={styles.videoSectionSub}>
              Immerse yourself in the rhythm of the loom and the grace of the drape.
            </p>
          </div>

          <div className={styles.videoGridRows}>
            {/* Video 1 */}
            <div className={styles.videoActionBlock} onClick={() => alert("Playing short film: The Journey of a Silk Saree")}>
              <div className={styles.videoAspectBox}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAbJIBTAyAwNsvp5N8gZ6o_vDwFMZz1XjfAdNzCYqY85Gt5RuO6MRsbEFObZc4Z1aNvvmkqUcLK_WiXCi0y34hNjdSTD8LwcbSa5QzAVCWFm6phoiwJkfVYIhbtDiakImw-K9s8iiXsr_7lCqoH4exIvNGBi-mebx6m0ZtfQy2yMVo18a-XVUc4cS-lloA2G3aG-wJxhWLLu22ZnkX8ZmKi4WoG9Z4oEFBuoULhDcRPhKDr76_ieZ9" 
                  alt="Silk saree shimmering cover" 
                />
                <div className={styles.videoDarkOverlay}>
                  <PlayCircle size={64} className={styles.playCenterIcon} />
                  <div className={styles.videoLabelsPane}>
                    <h3 className={styles.videoLabelTitle}>The Journey Of A Silk Saree</h3>
                    <p className={styles.videoLabelMeta}>WATCH SHORT FILM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video 2 */}
            <div className={styles.videoActionBlock} onClick={() => alert("Playing documentary: Behind the Bridal Collection")}>
              <div className={styles.videoAspectBox}>
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAchUpcbqZlCIHrbyeJmAeOLyZlfCem54aR2iPKaUFTSSodLGZ0rNLfiKw2edzMlXHS2WbwPyg7GMvm8ZzmIIiPTLNfKwSE8gKz3dKFG1pF2EzykTu8r7Jl-Za-A1M8GG68Ay_R0jTGXuDu-DtlE1TvD5s-vFJHQmySWGhr3waQtEhQGo4d6VV444CaXx1yHuEp0A7RsO3Da3nksqDyrJrDruq2TtvXrtOZp7aF8TvH8WiuHJRTnEwn" 
                  alt="Stylist adjusting bridal saree pleats" 
                />
                <div className={styles.videoDarkOverlay}>
                  <PlayCircle size={64} className={styles.playCenterIcon} />
                  <div className={styles.videoLabelsPane}>
                    <h3 className={styles.videoLabelTitle}>Behind The Bridal Collection</h3>
                    <p className={styles.videoLabelMeta}>WATCH DOCUMENTARY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Fabric Knowledge: The Weaver's Lexicon */}
      <section className={styles.lexiconSection}>
        <div className={styles.lexiconHeaderBox}>
          <span className={styles.lexiconBadge}>THE ATELIER ARCHIVE</span>
          <h2 className={styles.lexiconHeadline}>The Weaver's Lexicon</h2>
          <p className={styles.lexiconDesc}>
            A curated guide to the world's most exquisite fabrics, understood through touch, drape, and history.
          </p>
        </div>

        <div className={styles.lexiconCardsGrid}>
          
          {/* Card 1 */}
          <div className={styles.lexiconCard}>
            <div className={styles.lexiconIconBox}>
              <Compass size={32} />
            </div>
            <h3 className={styles.lexiconCardTitle}>Kanchipuram Pure Silk</h3>
            <p className={styles.lexiconCardBody}>
              Characterized by its heavy weight and durability, these sarees are woven with mulberry silk from South India and gold zari from Gujarat. The 'Korvai' technique joins the border and body in a seamless bond.
            </p>
            <ul className={styles.lexiconCardStats}>
              <li><CheckCircle size={14} className={styles.checkIconColor} /> HIGH DURABILITY</li>
              <li><CheckCircle size={14} className={styles.checkIconColor} /> ARCHIVAL QUALITY</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className={styles.lexiconCard}>
            <div className={styles.lexiconIconBox}>
              <Layers size={32} />
            </div>
            <h3 className={styles.lexiconCardTitle}>Banarasi Brocade</h3>
            <p className={styles.lexiconCardBody}>
              Originating from the holy city of Varanasi, these sarees are famed for their intricate floral and foliate motifs, inspired by Mughal aesthetics. The 'Kadwa' weave is a meticulous process where each motif is woven individually.
            </p>
            <ul className={styles.lexiconCardStats}>
              <li><CheckCircle size={14} className={styles.checkIconColor} /> INTRICATE DETAILING</li>
              <li><CheckCircle size={14} className={styles.checkIconColor} /> ROYAL PATTERNRY</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className={styles.lexiconCard}>
            <div className={styles.lexiconIconBox}>
              <Sparkles size={32} />
            </div>
            <h3 className={styles.lexiconCardTitle}>Bridal Organza</h3>
            <p className={styles.lexiconCardBody}>
              A lightweight, plain weave, sheer fabric traditionally made from silk. Modern luxury organzas often feature hand-painted florals, glass beads, or delicate silver zari, offering a contemporary, ethereal drape.
            </p>
            <ul className={styles.lexiconCardStats}>
              <li><CheckCircle size={14} className={styles.checkIconColor} /> ETHEREAL DRAPE</li>
              <li><CheckCircle size={14} className={styles.checkIconColor} /> LIGHTWEIGHT COMFORT</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Luxury Newsletter */}
      <section className={styles.luxuryNewsletterSection}>
        <div className={styles.radialDotPattern}></div>
        
        <div className={styles.luxuryNewsletterContent}>
          {isSubscribed ? (
            <div className={styles.subscribedConfirmation}>
              <h3>Subscription Confirmed</h3>
              <p>Welcome to the family. Digital issues of the Journal will arrive in your inbox.</p>
            </div>
          ) : (
            <>
              <h2 className={styles.newsletterTitle}>Join The Mazhai Vaanam Journal</h2>
              <p className={styles.newsletterDesc}>
                Be the first to explore new collections, exclusive heritage stories, and private atelier invitations.
              </p>

              <form onSubmit={handleSubscribeSubmit} className={styles.newsletterForm}>
                <input 
                  type="email" 
                  required 
                  placeholder="Your Email Address" 
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterSubmitBtn}>
                  SUBSCRIBE NOW
                </button>
              </form>
              <p className={styles.newsletterPrivacyDisclaimer}>
                We value your privacy like our finest silk.
              </p>
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default Lookbook;
