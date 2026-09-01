import { useState, useEffect } from 'react';
import { offerAPI, uploadAPI, productAPI } from '../api/api.js';
import { Sparkles, Clock, Gift, Layers, Disc, Save, CheckCircle, RefreshCw, Upload, Package, Trash2, Edit2, Plus, X, Search } from 'lucide-react';

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

  // â”€â”€ Offer Sections State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [sectionSaving, setSectionSaving] = useState(false);
  // Create section form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', description: '', slot: 1, startDate: '', endDate: '' });
  // Edit section
  const [editSectionId, setEditSectionId] = useState(null);
  const [editSectionForm, setEditSectionForm] = useState({});
  // Product picker per section
  const [addingProductTo, setAddingProductTo] = useState(null); // sectionId
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);


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
        'Gift Cards worth â‚¹ 10,000',
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

  useEffect(() => {
    if (activeTab === 'products') loadSections();
  }, [activeTab]);


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


  // â”€â”€ Section handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const loadSections = async () => {
    setSectionsLoading(true);
    try {
      const res = await offerAPI.getSections();
      if (res?.data) setSections(res.data);
    } catch (err) { console.error('Error loading sections:', err); }
    setSectionsLoading(false);
  };

  const handleCreateSection = async () => {
    if (!createForm.name || !createForm.endDate) {
      alert('Section name and end date are required.');
      return;
    }
    setSectionSaving(true);
    try {
      await offerAPI.createSection({ ...createForm, slot: Number(createForm.slot) });
      setShowCreateForm(false);
      setCreateForm({ name: '', description: '', slot: 1, startDate: '', endDate: '' });
      setToastMsg('Offer section created!');
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleUpdateSection = async (sectionId) => {
    setSectionSaving(true);
    try {
      await offerAPI.updateSection(sectionId, editSectionForm);
      setEditSectionId(null);
      setEditSectionForm({});
      setToastMsg('Section updated!');
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleDeleteSection = async (sectionId, name) => {
    if (!window.confirm(`Delete offer section "${name}"? Products will NOT be deleted.`)) return;
    setSectionSaving(true);
    try {
      await offerAPI.deleteSection(sectionId);
      setToastMsg('Section deleted.');
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleToggleSectionActive = async (section) => {
    setSectionSaving(true);
    try {
      await offerAPI.updateSection(section._id, { isActive: !section.isActive });
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  // Product search within a section
  const handleProductSearch = async (q) => {
    setProductSearch(q);
    if (!q || q.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    try {
      const res = await productAPI.getAll(`search=${encodeURIComponent(q)}&limit=8`);
      setSearchResults(res?.data?.products || res?.products || []);
    } catch { setSearchResults([]); }
    setSearchLoading(false);
  };

  const handleAddProductToSection = async (sectionId, product) => {
    setSectionSaving(true);
    try {
      await offerAPI.addProductToSection(sectionId, product._id);
      setAddingProductTo(null);
      setProductSearch('');
      setSearchResults([]);
      setToastMsg(`"${product.name}" added to section!`);
      setTimeout(() => setToastMsg(''), 3500);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
  };

  const handleRemoveProductFromSection = async (sectionId, productId, productName) => {
    if (!window.confirm(`Remove "${productName}" from this section?`)) return;
    setSectionSaving(true);
    try {
      await offerAPI.removeProductFromSection(sectionId, productId);
      setToastMsg('Product removed.');
      setTimeout(() => setToastMsg(''), 3000);
      await loadSections();
    } catch (err) { alert(err.message); }
    setSectionSaving(false);
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
          { id: 'products', label: 'Offer Products', icon: Package },
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

        {/* TAB 6: OFFER SECTIONS (Section-level timing) */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Package size={20} /> Offer Sections Manager
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Create a section with timing â†’ then add products to it. All products in a section share the same countdown timer.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
                onClick={() => { setShowCreateForm(true); setEditSectionId(null); }}
              >
                <Plus size={15} /> Add Offer Section
              </button>
            </div>

            {/* â”€â”€ Create Section Form â”€â”€ */}
            {showCreateForm && (
              <div className="card" style={{ padding: 20, marginBottom: 24, border: '2px solid var(--primary)', borderRadius: 12 }}>
                <h4 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Plus size={15} /> Create New Offer Section
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Section Name <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-input" placeholder="e.g. Diwali Grand Sale" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Section Slot <span style={{ color: 'red' }}>*</span></label>
                    <select className="form-input" value={createForm.slot} onChange={e => setCreateForm(f => ({ ...f, slot: Number(e.target.value) }))}>
                      <option value={1}>Slot 1 â€” Exclusive Offers Grid</option>
                      <option value={2}>Slot 2 â€” Preview Gallery Carousel</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Start Date (optional â€” blank = show immediately)</label>
                    <input type="datetime-local" className="form-input" value={createForm.startDate} onChange={e => setCreateForm(f => ({ ...f, startDate: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">End Date & Time <span style={{ color: 'red' }}>*</span></label>
                    <input type="datetime-local" className="form-input" value={createForm.endDate} onChange={e => setCreateForm(f => ({ ...f, endDate: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0, gridColumn: '1/-1' }}>
                    <label className="form-label">Description (optional)</label>
                    <input type="text" className="form-input" placeholder="e.g. Special festive offers for Diwali season" value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button type="button" className="btn btn-primary" onClick={handleCreateSection} disabled={sectionSaving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {sectionSaving ? <RefreshCw className="spinner" size={14} /> : <Plus size={14} />}
                    {sectionSaving ? 'Creating...' : 'Create Section'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCreateForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* â”€â”€ Sections List â”€â”€ */}
            {sectionsLoading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading sections...</div>
            ) : sections.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', border: '2px dashed var(--border-color)', borderRadius: 12 }}>
                <Package size={40} style={{ marginBottom: 12, opacity: 0.25 }} />
                <div style={{ fontWeight: 600, marginBottom: 6 }}>No Offer Sections Yet</div>
                <div style={{ fontSize: '0.85rem' }}>Click "Add Offer Section" above to create your first timed offer section.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {sections.map(sec => {
                  const now = new Date();
                  const end = new Date(sec.endDate);
                  const start = sec.startDate ? new Date(sec.startDate) : null;
                  const isExpired = end < now;
                  const isScheduled = start && start > now;
                  const statusColor = !sec.isActive ? '#9ca3af' : isExpired ? '#dc2626' : isScheduled ? '#d97706' : '#16a34a';
                  const statusLabel = !sec.isActive ? 'âš« Paused' : isExpired ? 'ðŸ”´ Expired' : isScheduled ? 'ðŸ• Scheduled' : 'ðŸŸ¢ Active';
                  const isEditingThis = editSectionId === sec._id;

                  return (
                    <div key={sec._id} className="card" style={{ padding: 20, border: `2px solid ${statusColor}30`, borderRadius: 12 }}>
                      {/* Section header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          {isEditingThis ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              <input type="text" className="form-input" style={{ padding: '4px 10px', fontSize: '0.87rem', flex: 1 }} value={editSectionForm.name ?? sec.name} onChange={e => setEditSectionForm(f => ({ ...f, name: e.target.value }))} placeholder="Section name" />
                              <select className="form-input" style={{ padding: '4px 10px', fontSize: '0.87rem', width: 180 }} value={editSectionForm.slot ?? sec.slot} onChange={e => setEditSectionForm(f => ({ ...f, slot: Number(e.target.value) }))}>
                                <option value={1}>Slot 1 â€” Grid</option>
                                <option value={2}>Slot 2 â€” Carousel</option>
                              </select>
                              <input type="datetime-local" className="form-input" style={{ padding: '4px 10px', fontSize: '0.87rem' }} value={editSectionForm.endDate ?? end.toISOString().slice(0, 16)} onChange={e => setEditSectionForm(f => ({ ...f, endDate: e.target.value }))} />
                              <button type="button" className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.82rem' }} onClick={() => handleUpdateSection(sec._id)} disabled={sectionSaving}>Save</button>
                              <button type="button" className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.82rem' }} onClick={() => { setEditSectionId(null); setEditSectionForm({}); }}>Cancel</button>
                            </div>
                          ) : (
                            <>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{sec.name}</span>
                                <span style={{ background: sec.slot === 1 ? '#eff6ff' : '#fef3c7', color: sec.slot === 1 ? '#1d4ed8' : '#92400e', borderRadius: 6, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 700 }}>
                                  {sec.slot === 1 ? 'Slot 1 â€” Grid' : 'Slot 2 â€” Carousel'}
                                </span>
                                <span style={{ color: statusColor, fontWeight: 700, fontSize: '0.8rem' }}>{statusLabel}</span>
                              </div>
                              {sec.description && <div style={{ color: 'var(--text-muted)', fontSize: '0.83rem', marginTop: 2 }}>{sec.description}</div>}
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                                â± Ends: <strong>{end.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong>
                                {start && <> &nbsp;Â·&nbsp; Starts: {start.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</>}
                              </div>
                            </>
                          )}
                        </div>
                        {!isEditingThis && (
                          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                            <button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
                              onClick={() => { setEditSectionId(sec._id); setEditSectionForm({}); }}>
                              <Edit2 size={12} /> Edit
                            </button>
                            <button type="button" style={{ padding: '4px 10px', fontSize: '0.78rem', background: sec.isActive ? '#fef3c7' : '#dcfce7', border: '1px solid', borderColor: sec.isActive ? '#fcd34d' : '#86efac', color: sec.isActive ? '#92400e' : '#166534', borderRadius: 6, cursor: 'pointer' }}
                              onClick={() => handleToggleSectionActive(sec)}>
                              {sec.isActive ? 'Pause' : 'Resume'}
                            </button>
                            <button type="button" style={{ padding: '4px 10px', fontSize: '0.78rem', background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                              onClick={() => handleDeleteSection(sec._id, sec.name)}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Products in this section */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {sec.productIds?.length || 0} product{(sec.productIds?.length || 0) !== 1 ? 's' : ''}
                          </span>
                          <button type="button" className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4 }}
                            onClick={() => { setAddingProductTo(addingProductTo === sec._id ? null : sec._id); setProductSearch(''); setSearchResults([]); }}>
                            <Plus size={13} /> Add Product
                          </button>
                        </div>

                        {/* Product picker */}
                        {addingProductTo === sec._id && (
                          <div style={{ marginBottom: 12, padding: 14, background: '#f9fafb', borderRadius: 8, border: '1px solid var(--border-color)', position: 'relative' }}>
                            <div style={{ position: 'relative', marginBottom: searchResults.length > 0 ? 0 : 0 }}>
                              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                              <input type="text" className="form-input" placeholder="Type to search products..." value={productSearch}
                                onChange={e => handleProductSearch(e.target.value)}
                                style={{ paddingLeft: 30, fontSize: '0.85rem', padding: '8px 10px 8px 30px' }} />
                            </div>
                            {searchLoading && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Searching...</div>}
                            {searchResults.length > 0 && (
                              <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, maxHeight: 220, overflowY: 'auto', marginTop: 6, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                                {searchResults.map(p => {
                                  const alreadyAdded = sec.productIds?.some(pid => (pid._id || pid) === p._id);
                                  return (
                                    <div key={p._id}
                                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', cursor: alreadyAdded ? 'default' : 'pointer', borderBottom: '1px solid var(--border-color)', opacity: alreadyAdded ? 0.5 : 1, transition: 'background 0.12s' }}
                                      onMouseEnter={e => { if (!alreadyAdded) e.currentTarget.style.background = '#f5f5f5'; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = ''; }}
                                      onClick={() => !alreadyAdded && handleAddProductToSection(sec._id, p)}
                                    >
                                      <img src={p.images?.[0]?.url || '/Images/saree1.png'} alt={p.name} style={{ width: 36, height: 46, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.84rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>â‚¹{p.price?.toLocaleString('en-IN')} Â· {p.tag || 'No tag'}</div>
                                      </div>
                                      {alreadyAdded ? <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>âœ“ Added</span> : <Plus size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Product chips */}
                        {sec.productIds?.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {sec.productIds.map(p => {
                              const pid = p._id || p;
                              const pname = p.name || 'Product';
                              const pimg = p.images?.[0]?.url || '/Images/saree1.png';
                              return (
                                <div key={pid} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f5f0e8', border: '1px solid #E9DDC7', borderRadius: 8, padding: '5px 10px 5px 6px' }}>
                                  <img src={pimg} alt={pname} style={{ width: 28, height: 36, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2D3326', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pname}</span>
                                  <button type="button"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', alignItems: 'center', marginLeft: 2, transition: 'color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                                    onClick={() => handleRemoveProductFromSection(sec._id, pid, pname)}
                                  ><X size={13} /></button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', padding: '8px 0', fontStyle: 'italic' }}>
                            No products yet â€” click "Add Product" to add some.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab !== 'products' && (
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
        )}
      </form>
    </div>
  );
}
