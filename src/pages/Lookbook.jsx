import React from 'react';
import './Pages.css';

export const Lookbook = ({ setCurrentTab }) => {
  const editorialCampaigns = [
    {
      id: 1,
      title: "The Rajkumari Heirloom",
      collection: "Kanchipuram Silk Collection",
      tagline: "Regal crimson and gold thread orchestrations made for the traditional bride.",
      imageLeft: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=500&q=80",
      imageRight: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=500&q=80",
      colorTheme: "#8B2332"
    },
    {
      id: 2,
      title: "Varanasi Whisperings",
      collection: "Authentic Banarasi Brocades",
      tagline: "Fine pure silk weave patterns depicting ancient Mughal architecture details.",
      imageLeft: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80",
      imageRight: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
      colorTheme: "#C97044"
    },
    {
      id: 3,
      title: "Pastel Symphony",
      collection: "Modern Organza & Tissue",
      tagline: "Ethereal translucent silhouettes woven for garden receptions and evening cocktails.",
      imageLeft: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=500&q=80",
      imageRight: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
      colorTheme: "#4A6B82"
    }
  ];

  return (
    <div className="lookbook-page-container">
      {/* 1. Page Header */}
      <section className="lookbook-hero">
        <span className="lookbook-meta">EDITORIAL EDIT</span>
        <h1 className="lookbook-title">Aaranya Chronicles</h1>
        <p className="lookbook-lead">Explore our curated seasonal campaigns, blending legacy techniques with modern drapes.</p>
        <div className="lookbook-scroll-indicator">
          <span>SCROLL DOWN</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* 2. Editorial Blocks */}
      {editorialCampaigns.map((camp, idx) => (
        <section 
          key={camp.id} 
          className={`lookbook-block ${idx % 2 === 1 ? 'row-reverse' : ''}`}
          style={{ '--camp-theme': camp.colorTheme }}
        >
          <div className="container lookbook-grid">
            <div className="lookbook-images">
              <div className="img-frame-main">
                <img src={camp.imageLeft} alt={camp.title} className="camp-img-1" />
              </div>
              <div className="img-frame-sub">
                <img src={camp.imageRight} alt={camp.title} className="camp-img-2" />
              </div>
            </div>
            
            <div className="lookbook-text">
              <span className="camp-collection">{camp.collection}</span>
              <h2>{camp.title}</h2>
              <p>{camp.tagline}</p>
              <p className="camp-body">
                Woven over 240 hours using ancient jacquard cards, each border tells a story of local fauna, floral temple reliefs, and traditional motifs. Perfectly balanced with weight and high gold density.
              </p>
              <button 
                onClick={() => setCurrentTab('shop')} 
                className="lookbook-shop-btn"
              >
                Shop Campaign
              </button>
            </div>
          </div>
        </section>
      ))}

      {/* 3. Quote Block */}
      <section className="lookbook-quote">
        <div className="container">
          <p className="quote-text">
            "A saree is not just an attire. It's a memory passed from a mother, a blessing woven by an artisan, and a drape that holds history."
          </p>
          <span className="quote-author">— The Aaranya Loom Philosophy</span>
        </div>
      </section>
    </div>
  );
};

export default Lookbook;
