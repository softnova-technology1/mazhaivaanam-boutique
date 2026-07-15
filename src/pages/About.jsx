import React from 'react';
import './Pages.css';

export const About = () => {
  return (
    <div className="about-page-container">
      {/* 1. Hero / Header Banner */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="about-subtitle">SINCE 1994</span>
          <h1 className="about-title">The Legend of Aaranya</h1>
          <p className="about-tagline">Crafting timeless silk narratives, handwoven with pride.</p>
        </div>
      </section>

      {/* 2. Brand Story / Philosophy */}
      <section className="about-story container">
        <div className="story-grid">
          <div className="story-text">
            <span className="section-label">OUR HERITAGE</span>
            <h2>Woven into the Fabric of Tradition</h2>
            <p>
              Aaranya was founded with a singular, passionate dream: to revive and celebrate the glorious traditions of Indian handloom. For over three decades, we have collaborated directly with master weavers across Kanchipuram, Banaras, and handloom pockets of India, preserving techniques passed down through generations.
            </p>
            <p>
              Every Aaranya saree is not merely an outfit; it is a labor of love, a historical canvas, and a piece of wearable art. We source only the finest pure mulberry silk and authentic gold and silver Zari threads, ensuring that every drape radiates royal luxury and heritage beauty.
            </p>
          </div>
          <div className="story-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80" 
              alt="Artisan weaver hands" 
              className="story-img"
            />
            <div className="story-img-frame"></div>
          </div>
        </div>
      </section>

      {/* 3. The Loom Craft / Production pillars */}
      <section className="craft-pillars-section">
        <div className="container">
          <div className="center-header">
            <span className="section-label">OUR PROCESS</span>
            <h2>The Handloom Masterclass</h2>
            <p className="section-desc">From raw silk skeins to heirloom drapes, witness the precise steps of handloom weaving.</p>
          </div>

          <div className="craft-grid">
            <div className="craft-card">
              <span className="craft-num">01</span>
              <h3>Yarn Preparation & Dyeing</h3>
              <p>Raw mulberry silk threads are spun, sorted, and washed. They are hand-dyed in customized copper vats using organic colors to achieve our signature vibrant hues.</p>
            </div>
            
            <div className="craft-card">
              <span className="craft-num">02</span>
              <h3>Zari Thread Audits</h3>
              <p>We use pure silver threads coated with 24-karat gold Zari. Each thread is inspected manually for consistency, flexibility, and metallic sheen before hitting the looms.</p>
            </div>

            <div className="craft-card">
              <span className="craft-num">03</span>
              <h3>The Loom Choreography</h3>
              <p>Two weavers coordinate on traditional jacquard and throw-shuttle looms, weaving intricate borders, bootis, and pallus over several weeks of intense focus.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Meet the Founders / Weaver Committment */}
      <section className="weaver-commitment container">
        <div className="commitment-banner">
          <div className="commitment-text">
            <h2>Empowering Our Weaver Guilds</h2>
            <p>
              By bypassing middlemen, Aaranya ensures that 70% of the saree's value goes directly to the weaver families. We currently support over 450 weaver households, guaranteeing fair wages, medical aid, and educational funds for their children. When you choose Aaranya, you sustain a lineage of artisans.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
