import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Tag, Save, RefreshCw, Store, Share2, MapPin, Mail, Phone, Palette, Smartphone, Megaphone, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { storeConfigAPI } from '../api/api.js';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('announcement');
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  // Form State
  const [config, setConfig] = useState({
    storeName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    announcementText1: '',
    announcementText2: '',
    announcementText3: '',
    announcementText: '',
    announcementBgColor: '#6B102A',
    announcementTextColor: '#F4E4BC',
    announcementEnabled: true,
    convenienceFee: 2,
    giftWrapPrice: 499,
  });

  useEffect(() => {
    storeConfigAPI.getConfig()
      .then(res => {
        const d = res.data || res;
        setConfig({
          storeName: d.storeName || '',
          email: d.email || '',
          phone: d.phone || '',
          whatsapp: d.whatsapp || '',
          address: d.address || '',
          facebookUrl: d.facebookUrl || '',
          instagramUrl: d.instagramUrl || '',
          youtubeUrl: d.youtubeUrl || '',
          announcementText1: d.announcementText1 || '✨ Handwoven Luxury, Delivered Worldwide.',
          announcementText2: d.announcementText2 || '🥻 Unveiling Authentic Kanjeevaram & Banarasi Heritage.',
          announcementText3: d.announcementText3 || '📞 Book a Personalized Video Shopping Experience.',
          announcementText: d.announcementText || d.announcementText1 || '✨ Handwoven Luxury, Delivered Worldwide.',
          announcementBgColor: d.announcementBgColor || '#6B102A',
          announcementTextColor: d.announcementTextColor || '#F4E4BC',
          announcementEnabled: d.announcementEnabled ?? true,
          convenienceFee: d.convenienceFee ?? 2,
          giftWrapPrice: d.giftWrapPrice ?? 499,
        });
      })
      .catch((err) => {
        console.error("Failed to load store config:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      await storeConfigAPI.updateConfig({
        ...config,
        convenienceFee: Number(config.convenienceFee),
        giftWrapPrice: Number(config.giftWrapPrice),
      });
      setSaved(true);
      setToast({
        type: 'success',
        message: '🎉 Announcement Bar & Settings saved successfully!'
      });
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setToast({
        type: 'error',
        message: `❌ Not Saved: ${err.response?.data?.message || err.message || 'Failed to save settings. Please try again.'}`
      });
    }
    setSaving(false);
  };

  const tabs = [
    { id: 'announcement', label: 'Announcement Bar', icon: <Megaphone size={18} /> },
    { id: 'general', label: 'General', icon: <Store size={18} /> },
    { id: 'social', label: 'Social Media', icon: <Share2 size={18} /> },
    { id: 'fees', label: 'Fees & Charges', icon: <Tag size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  ];

  return (
    <div className="page-container" style={{ paddingBottom: '80px' }}>
      <div className="page-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Store Settings</h2>
          <p className="page-subtitle">Manage your store details, social links, fees, and appearance.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || loading}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', fontSize: '0.95rem' }}
        >
          {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
          {saved ? '✅ Saved!' : 'Save All Changes'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sidebar Navigation */}
        <div className="card" style={{ width: '250px', padding: '16px', position: 'sticky', top: '24px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: activeTab === tab.id ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-main)',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, maxWidth: '600px' }}>
          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading settings...
            </div>
          ) : (
            <div className="card">
              {/* Notification Banner (Saved / Error Message) */}
              {toast && (
                <div
                  style={{
                    marginBottom: '20px',
                    padding: '14px 18px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: toast.type === 'success' ? '#1b4332' : '#5c1d24',
                    color: '#ffffff',
                    border: `1px solid ${toast.type === 'success' ? '#2d6a4f' : '#842029'}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {toast.type === 'success' ? (
                      <CheckCircle2 size={20} style={{ color: '#52b788', flexShrink: 0 }} />
                    ) : (
                      <AlertCircle size={20} style={{ color: '#ea868f', flexShrink: 0 }} />
                    )}
                    <span>{toast.message}</span>
                  </div>
                  <button
                    onClick={() => setToast(null)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', padding: '0 4px' }}
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Announcement Bar Tab */}
              {activeTab === 'announcement' && (
                <div>
                  <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <Megaphone size={20} /> Announcement Bar Settings
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Live Preview Header */}
                    <div>
                      <label className="form-label" style={{ fontWeight: 600, marginBottom: 8, display: 'block' }}>Live Header Preview (3 Sliding Ticker Messages)</label>
                      <div style={{
                        padding: '12px 16px',
                        background: config.announcementBgColor || '#6B102A',
                        color: config.announcementTextColor || '#F4E4BC',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        letterSpacing: '0.05em',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        {config.announcementEnabled ? (
                          <>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4 }}>
                              <span style={{ fontSize: '0.7rem', opacity: 0.7, marginRight: 6 }}>MESSAGE 1:</span>
                              {config.announcementText1 || '✨ Handwoven Luxury, Delivered Worldwide.'}
                            </div>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 4 }}>
                              <span style={{ fontSize: '0.7rem', opacity: 0.7, marginRight: 6 }}>MESSAGE 2:</span>
                              {config.announcementText2 || '🥻 Unveiling Authentic Kanjeevaram & Banarasi Heritage.'}
                            </div>
                            <div>
                              <span style={{ fontSize: '0.7rem', opacity: 0.7, marginRight: 6 }}>MESSAGE 3:</span>
                              {config.announcementText3 || '📞 Book a Personalized Video Shopping Experience.'}
                            </div>
                          </>
                        ) : (
                          <span style={{ opacity: 0.6, fontStyle: 'italic' }}>(Announcement Bar is currently Disabled)</span>
                        )}
                      </div>
                    </div>

                    {/* Enable / Disable Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-main)' }}>Enable Announcement Bar</h4>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Show or hide the top header offer ticker bar across the entire website.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.announcementEnabled}
                        onChange={(e) => setConfig(prev => ({ ...prev, announcementEnabled: e.target.checked }))}
                        style={{ width: 20, height: 20, cursor: 'pointer' }}
                      />
                    </div>

                    {/* 3 Announcement Text Inputs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <label className="form-label" style={{ fontWeight: 600 }}>Announcement Message 1 📢</label>
                        <input
                          type="text"
                          className="form-input"
                          name="announcementText1"
                          value={config.announcementText1}
                          onChange={handleChange}
                          placeholder="e.g. ✨ Handwoven Luxury, Delivered Worldwide."
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontWeight: 600 }}>Announcement Message 2 🪔 (Festival / Offer Deal)</label>
                        <input
                          type="text"
                          className="form-input"
                          name="announcementText2"
                          value={config.announcementText2}
                          onChange={handleChange}
                          placeholder="e.g. 🪔 GRAND DIWALI SILK UTSAV: Extra 20% Off! Use Code: DIWALI20 🪔"
                        />
                      </div>

                      <div>
                        <label className="form-label" style={{ fontWeight: 600 }}>Announcement Message 3 📞 (Special Privilege)</label>
                        <input
                          type="text"
                          className="form-input"
                          name="announcementText3"
                          value={config.announcementText3}
                          onChange={handleChange}
                          placeholder="e.g. 📞 Book a Personalized Video Shopping Experience."
                        />
                      </div>

                      <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                        These 3 messages will automatically rotate continuously in a smooth marquee slider at the top of your website header.
                      </small>
                    </div>

                    {/* Background Color Picker */}
                    <div>
                      <label className="form-label">Background Color</label>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                        <input
                          type="color"
                          name="announcementBgColor"
                          value={config.announcementBgColor || '#6B102A'}
                          onChange={handleChange}
                          style={{ width: 44, height: 38, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }}
                        />
                        <input
                          type="text"
                          className="form-input"
                          name="announcementBgColor"
                          value={config.announcementBgColor}
                          onChange={handleChange}
                          placeholder="#6B102A"
                          style={{ flex: 1, textTransform: 'uppercase' }}
                        />
                      </div>
                      {/* Preset color shortcuts */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                        {[
                          { label: 'Deep Maroon', hex: '#6B102A' },
                          { label: 'Festive Red', hex: '#8B0000' },
                          { label: 'Royal Gold', hex: '#C8A34D' },
                          { label: 'Olive Green', hex: '#4F4E22' },
                          { label: 'Midnight Black', hex: '#111111' },
                        ].map(preset => (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => setConfig(prev => ({ ...prev, announcementBgColor: preset.hex }))}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 4,
                              border: config.announcementBgColor === preset.hex ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                              background: preset.hex,
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Color Picker */}
                    <div>
                      <label className="form-label">Text Color</label>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                        <input
                          type="color"
                          name="announcementTextColor"
                          value={config.announcementTextColor || '#F4E4BC'}
                          onChange={handleChange}
                          style={{ width: 44, height: 38, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent' }}
                        />
                        <input
                          type="text"
                          className="form-input"
                          name="announcementTextColor"
                          value={config.announcementTextColor}
                          onChange={handleChange}
                          placeholder="#F4E4BC"
                          style={{ flex: 1, textTransform: 'uppercase' }}
                        />
                      </div>
                      {/* Preset color shortcuts */}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                        {[
                          { label: 'Warm Ivory', hex: '#F4E4BC' },
                          { label: 'Pure White', hex: '#FFFFFF' },
                          { label: 'Gold', hex: '#D4AF37' },
                          { label: 'Charcoal Black', hex: '#1A1A1A' },
                        ].map(preset => (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => setConfig(prev => ({ ...prev, announcementTextColor: preset.hex }))}
                            style={{
                              padding: '4px 10px',
                              borderRadius: 4,
                              border: config.announcementTextColor === preset.hex ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                              background: preset.hex,
                              color: preset.hex === '#FFFFFF' || preset.hex === '#F4E4BC' || preset.hex === '#D4AF37' ? '#111' : '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
                      {saved ? '✅ Saved Announcement Bar!' : 'Save Announcement Bar'}
                    </button>
                  </div>
                </div>
              )}

              {/* General Tab */}
              {activeTab === 'general' && (
                <div>
                  <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <Store size={20} /> General Details
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="form-label">Store Name</label>
                      <input type="text" className="form-input" name="storeName" value={config.storeName} onChange={handleChange} placeholder="e.g. MAZHAI VAANAM" />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> Support Email</label>
                        <input type="email" className="form-input" name="email" value={config.email} onChange={handleChange} placeholder="support@domain.com" />
                      </div>
                      <div>
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> Phone Number</label>
                        <input type="tel" className="form-input" name="phone" value={config.phone} onChange={handleChange} placeholder="+91..." />
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Smartphone size={14} /> WhatsApp Number</label>
                      <input type="tel" className="form-input" name="whatsapp" value={config.whatsapp} onChange={handleChange} placeholder="+91..." />
                      <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>Used for the WhatsApp chat button on the website.</small>
                    </div>

                    <div>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> Business Address</label>
                      <textarea className="form-input" name="address" value={config.address} onChange={handleChange} placeholder="Enter full address" rows={3} style={{ resize: 'vertical' }}></textarea>
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
                      {saved ? 'Saved!' : 'Save General Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === 'social' && (
                <div>
                  <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <Share2 size={20} /> Social Links
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Leave a link blank to hide its icon from the footer.</p>
                    <div>
                      <label className="form-label">Facebook URL</label>
                      <input type="url" className="form-input" name="facebookUrl" value={config.facebookUrl} onChange={handleChange} placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                      <label className="form-label">Instagram URL</label>
                      <input type="url" className="form-input" name="instagramUrl" value={config.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                      <label className="form-label">YouTube URL</label>
                      <input type="url" className="form-input" name="youtubeUrl" value={config.youtubeUrl} onChange={handleChange} placeholder="https://youtube.com/..." />
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
                      {saved ? 'Saved!' : 'Save Social Links'}
                    </button>
                  </div>
                </div>
              )}

              {/* Fees Tab */}
              {activeTab === 'fees' && (
                <div>
                  <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <Tag size={20} /> Fees & Charges
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label className="form-label">Convenience Fee (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        name="convenienceFee"
                        min={0}
                        value={config.convenienceFee}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="form-label">Gift Wrap Price (₹)</label>
                      <input
                        type="number"
                        className="form-input"
                        name="giftWrapPrice"
                        min={0}
                        value={config.giftWrapPrice}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {saving ? <RefreshCw size={16} className="spin" /> : <Save size={16} />}
                      {saved ? 'Saved!' : 'Save Fees & Charges'}
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div>
                  <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <Palette size={20} /> Appearance
                  </h3>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Theme Preference</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Choose between light and dark mode for the admin dashboard.
                      </p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="btn btn-outline"
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '130px', justifyContent: 'center' }}
                    >
                      {theme === 'light' ? (
                        <><Moon size={16} /><span>Dark Mode</span></>
                      ) : (
                        <><Sun size={16} /><span>Light Mode</span></>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      </div>

  );
}
