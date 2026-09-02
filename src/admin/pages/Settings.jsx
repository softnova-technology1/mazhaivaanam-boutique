import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Tag, Save, RefreshCw, Store, Share2, MapPin, Mail, Phone, Palette, Smartphone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { storeConfigAPI } from '../api/api.js';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

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
    convenienceFee: 2,
    giftWrapPrice: 499,
  });

  useEffect(() => {
    storeConfigAPI.getConfig()
      .then(res => {
        const d = res.data;
        setConfig({
          storeName: d.storeName || '',
          email: d.email || '',
          phone: d.phone || '',
          whatsapp: d.whatsapp || '',
          address: d.address || '',
          facebookUrl: d.facebookUrl || '',
          instagramUrl: d.instagramUrl || '',
          youtubeUrl: d.youtubeUrl || '',
          convenienceFee: d.convenienceFee ?? 2,
          giftWrapPrice: d.giftWrapPrice ?? 499,
        });
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await storeConfigAPI.updateConfig({
        ...config,
        convenienceFee: Number(config.convenienceFee),
        giftWrapPrice: Number(config.giftWrapPrice),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    }
    setSaving(false);
  };

  const tabs = [
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
