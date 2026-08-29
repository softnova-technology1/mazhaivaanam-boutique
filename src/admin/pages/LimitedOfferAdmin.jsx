import { useState, useEffect } from 'react';
import { offerAPI, uploadAPI } from '../api/api.js';
import { Sparkles, Clock, Gift, Layers, Disc, Save, CheckCircle, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react';

const ImageUploaderInput = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadImage(file);
      if (res && res.data && res.data.url) {
        onChange(res.data.url);
      } else {
        alert('Image uploaded but no URL returned');
      }
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="form-group" style={{ marginBottom: 16 }}>
      <label className="form-label">{label}</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input 
          type="text" 
          className="form-input" 
          value={value || ''} 
          placeholder="/Images/... or http://..."
          onChange={e => onChange(e.target.value)} 
          style={{ flex: 1 }}
        />
        <label className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: 0, padding: '8px 16px', whiteSpace: 'nowrap' }}>
          <Upload size={15} />
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} disabled={uploading} />
        </label>
      </div>
      {value && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={value} alt="Preview" style={{ height: 60, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border-color)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Image Preview</span>
        </div>
      )}
    </div>
  );
};

export default function LimitedOfferAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  const [config, setConfig] = useState({
    heroSection: {
      badgeText: 'Limited Exclusive Offer',
      title: 'Exclusive Offers,',
      titleItalic: 'Limited Time',
      subtitle: 'Enjoy special prices on selected sarees for a limited period. Elevate your wardrobe with premium collections while these exclusive offers last.',
      bgImage: '/Images/limited.png',
      primaryCtaText: 'EXPLORE COLLECTION',
      secondaryCtaText: 'OUR HERITAGE',
    },
    timerSection: {
      badgeText: 'Time is running out',
      title: 'The Grand Gala Sale',
      description: 'Our most prestigious annual celebration ends soon. Secure your heritage pieces today before they return to the vault.',
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    },
    featuredDuoSection: {
      badgeText: 'Curated Festival Duo',
      heading: 'The Heritage Gift',
      subHeading: 'Buy 2 Sarees, Get 1 Free',
      description: 'Embrace the timeless tradition of gifting. Choose from our exquisite hand-woven silk collections and receive a complimentary heritage piece as a symbol of our festive gratitude.',
      image: '/Images/heritage.png',
      ctaText: 'Explore Collection',
    },
    curationOfJoySection: {
      badgeText: 'Curation of Joy',
      heading: 'Bespoke Offer Tiers',
      cards: [
        { title: 'Diwali Offers', discountBadge: 'UP TO 40%', image: '/Images/diwali.png', linkTab: 'catalog' },
        { title: 'Bridal Offers', discountBadge: '20% OFF', image: '/Images/bridal.png', linkTab: 'catalog' },
        { title: 'Combo Set', discountBadge: 'SAVE 5K', image: '/Images/wedding.png', linkTab: 'catalog' },
      ],
    },
    spinningWheelSection: {
      title: 'Festival Lucky Draw',
      description: 'Spin the heritage wheel for a chance to win exclusive gift cards, artisan blouses, or a signature silk saree from our royal vault.',
      bulletPoints: [
        'Grand Prize: Royal Banarasi Saree',
        'Gift Cards worth ₹ 10,000',
        'Artisan Blouse Customizations',
      ],
      prizes: [
        'Premium Saree',
        '10% Discount',
        'Free Styling',
        'Surprise Box',
        'Artisan Blouse',
        'Free Shipping',
      ],
    },
  });

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await offerAPI.getConfig();
      if (res && res.data) {
        const d = res.data;
        setConfig(prev => ({
          heroSection: { ...prev.heroSection, ...(d.heroSection || {}) },
          timerSection: {
            ...prev.timerSection,
            ...(d.timerSection || {}),
            endDate: d.timerSection?.endDate ? new Date(d.timerSection.endDate).toISOString().slice(0, 16) : prev.timerSection.endDate
          },
          featuredDuoSection: { ...prev.featuredDuoSection, ...(d.featuredDuoSection || {}) },
          curationOfJoySection: {
            ...prev.curationOfJoySection,
            ...(d.curationOfJoySection || {}),
            cards: d.curationOfJoySection?.cards?.length ? d.curationOfJoySection.cards : prev.curationOfJoySection.cards
          },
          spinningWheelSection: {
            ...prev.spinningWheelSection,
            ...(d.spinningWheelSection || {}),
            bulletPoints: d.spinningWheelSection?.bulletPoints?.length ? d.spinningWheelSection.bulletPoints : prev.spinningWheelSection.bulletPoints,
            prizes: d.spinningWheelSection?.prizes?.length === 6 ? d.spinningWheelSection.prizes : prev.spinningWheelSection.prizes
          },
        }));
      }
    } catch (err) {
      console.error('Error loading offer config:', err);
    }
    setLoading(false);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await offerAPI.updateConfig(config);
      if (res && res.success) {
        setToastMsg('Limited Offer page configuration saved & updated live!');
        setTimeout(() => setToastMsg(''), 4000);
      } else {
        alert(res?.message || 'Failed to save config');
      }
    } catch (err) {
      console.error('Save config error:', err);
      alert('Failed to save config: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="loader"><div className="spinner" /></div>;
  }

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles color="var(--primary)" size={28} /> Limited Offer Page Manager
          </h1>
          <p className="page-subtitle">Customize all sections, countdown timer, banner images, offer tiers & wheel prizes for customer storefront.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px' }}
        >
          {saving ? <RefreshCw className="spinner" size={16} /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Live Configuration'}
        </button>
      </div>

      {toastMsg && (
        <div style={{
          background: 'rgba(22, 163, 74, 0.15)',
          border: '1px solid #16a34a',
          color: '#16a34a',
          padding: '12px 20px',
          borderRadius: 8,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 600
        }}>
          <CheckCircle size={18} /> {toastMsg}
        </div>
      )}

      {/* Tabs Bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
        {[
          { id: 'hero', label: 'Hero Banner', icon: Sparkles },
          { id: 'timer', label: 'Countdown Timer', icon: Clock },
          { id: 'duo', label: 'Curated Duo', icon: Gift },
          { id: 'tiers', label: 'Bespoke Offer Tiers', icon: Layers },
          { id: 'wheel', label: 'Spinning Wheel', icon: Disc },
        ].map(t => (
          <button
            key={t.id}
            type="button"
            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSave} className="card" style={{ padding: 28 }}>
        
        {/* TAB 1: HERO BANNER */}
        {activeTab === 'hero' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              1. Hero Banner Settings
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Top Pill Badge Text</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.heroSection.badgeText} 
                onChange={e => setConfig({ ...config, heroSection: { ...config.heroSection, badgeText: e.target.value } })} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Title Main Part</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.heroSection.title} 
                  onChange={e => setConfig({ ...config, heroSection: { ...config.heroSection, title: e.target.value } })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Title Italic Highlight (Text Carousel Words - Comma Separated)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.heroSection.titleItalic} 
                  placeholder="e.g. Limited Time, Festive Deals, Royal Vault, Handloom Luxury"
                  onChange={e => setConfig({ ...config, heroSection: { ...config.heroSection, titleItalic: e.target.value } })} 
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Enter multiple 2-word phrases separated by comma (,) to automatically animate in the carousel.
                </span>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Subtitle Description</label>
              <textarea 
                className="form-input" 
                rows="3" 
                value={config.heroSection.subtitle} 
                onChange={e => setConfig({ ...config, heroSection: { ...config.heroSection, subtitle: e.target.value } })} 
              />
            </div>
            
            {/* Image Uploader for Hero Banner */}
            <ImageUploaderInput 
              label="Hero Background Image" 
              value={config.heroSection.bgImage} 
              onChange={url => setConfig({ ...config, heroSection: { ...config.heroSection, bgImage: url } })} 
            />
          </div>
        )}

        {/* TAB 2: COUNTDOWN TIMER */}
        {activeTab === 'timer' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              2. Countdown Timer & Event Settings
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Timer Badge Sub-Label</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.timerSection.badgeText} 
                onChange={e => setConfig({ ...config, timerSection: { ...config.timerSection, badgeText: e.target.value } })} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Sale Event Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.timerSection.title} 
                onChange={e => setConfig({ ...config, timerSection: { ...config.timerSection, title: e.target.value } })} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Sale Description</label>
              <textarea 
                className="form-input" 
                rows="2" 
                value={config.timerSection.description} 
                onChange={e => setConfig({ ...config, timerSection: { ...config.timerSection, description: e.target.value } })} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Sale Event Expiry Date & Time</label>
              <input 
                type="datetime-local" 
                className="form-input" 
                value={config.timerSection.endDate} 
                onChange={e => setConfig({ ...config, timerSection: { ...config.timerSection, endDate: e.target.value } })} 
              />
            </div>
          </div>
        )}

        {/* TAB 3: CURATED FESTIVAL DUO */}
        {activeTab === 'duo' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              3. Curated Festival Duo Section
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Section Tag Label</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.featuredDuoSection.badgeText} 
                onChange={e => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, badgeText: e.target.value } })} 
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Main Heading</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.featuredDuoSection.heading} 
                  onChange={e => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, heading: e.target.value } })} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Offer Sub-Heading / Tagline</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={config.featuredDuoSection.subHeading} 
                  onChange={e => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, subHeading: e.target.value } })} 
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Description Text</label>
              <textarea 
                className="form-input" 
                rows="3" 
                value={config.featuredDuoSection.description} 
                onChange={e => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, description: e.target.value } })} 
              />
            </div>
            
            {/* Image Uploader for Curated Duo */}
            <ImageUploaderInput 
              label="Curated Duo Banner Image" 
              value={config.featuredDuoSection.image} 
              onChange={url => setConfig({ ...config, featuredDuoSection: { ...config.featuredDuoSection, image: url } })} 
            />
          </div>
        )}

        {/* TAB 4: BESPOKE OFFER TIERS */}
        {activeTab === 'tiers' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              4. Bespoke Offer Tier Cards (Curation of Joy)
            </h3>
            {config.curationOfJoySection.cards.map((card, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: 18, borderRadius: 8, marginBottom: 16, border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: 12 }}>Card #{idx + 1}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label className="form-label">Card Title</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={card.title} 
                      onChange={e => {
                        const updated = [...config.curationOfJoySection.cards];
                        updated[idx].title = e.target.value;
                        setConfig({ ...config, curationOfJoySection: { ...config.curationOfJoySection, cards: updated } });
                      }} 
                    />
                  </div>
                  <div>
                    <label className="form-label">Discount Badge Text</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={card.discountBadge} 
                      onChange={e => {
                        const updated = [...config.curationOfJoySection.cards];
                        updated[idx].discountBadge = e.target.value;
                        setConfig({ ...config, curationOfJoySection: { ...config.curationOfJoySection, cards: updated } });
                      }} 
                    />
                  </div>
                </div>

                {/* Card Image Uploader */}
                <ImageUploaderInput 
                  label={`Card #${idx + 1} Image`} 
                  value={card.image} 
                  onChange={url => {
                    const updated = [...config.curationOfJoySection.cards];
                    updated[idx].image = url;
                    setConfig({ ...config, curationOfJoySection: { ...config.curationOfJoySection, cards: updated } });
                  }} 
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: SPINNING WHEEL */}
        {activeTab === 'wheel' && (
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 20, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: 10 }}>
              5. Festival Lucky Draw Spinning Wheel
            </h3>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Wheel Section Heading</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.spinningWheelSection.title} 
                onChange={e => setConfig({ ...config, spinningWheelSection: { ...config.spinningWheelSection, title: e.target.value } })} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Wheel Section Description</label>
              <textarea 
                className="form-input" 
                rows="2" 
                value={config.spinningWheelSection.description} 
                onChange={e => setConfig({ ...config, spinningWheelSection: { ...config.spinningWheelSection, description: e.target.value } })} 
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Bullet Point Benefits (3 Items)</label>
              {config.spinningWheelSection.bulletPoints.map((bp, i) => (
                <input 
                  key={i} 
                  type="text" 
                  className="form-input" 
                  style={{ marginBottom: 8 }}
                  value={bp} 
                  onChange={e => {
                    const updated = [...config.spinningWheelSection.bulletPoints];
                    updated[i] = e.target.value;
                    setConfig({ ...config, spinningWheelSection: { ...config.spinningWheelSection, bulletPoints: updated } });
                  }}
                />
              ))}
            </div>

            <div>
              <label className="form-label">Spinning Wheel 6 Slice Prizes</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {config.spinningWheelSection.prizes.map((pz, i) => (
                  <div key={i}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slice #{i + 1}</span>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={pz} 
                      onChange={e => {
                        const updated = [...config.spinningWheelSection.prizes];
                        updated[i] = e.target.value;
                        setConfig({ ...config, spinningWheelSection: { ...config.spinningWheelSection, prizes: updated } });
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 28px' }}
          >
            {saving ? <RefreshCw className="spinner" size={16} /> : <Save size={16} />}
            {saving ? 'Saving Changes...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
}
