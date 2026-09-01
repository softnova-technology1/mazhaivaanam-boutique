import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Tag, Save, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { storeConfigAPI } from '../api/api.js';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [convenienceFee, setConvenienceFee] = useState(2);
  const [giftWrapPrice, setGiftWrapPrice] = useState(499);

  useEffect(() => {
    storeConfigAPI.getConfig()
      .then(res => {
        const d = res.data;
        setConvenienceFee(d.convenienceFee ?? 2);
        setGiftWrapPrice(d.giftWrapPrice ?? 499);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await storeConfigAPI.updateConfig({
        convenienceFee: Number(convenienceFee),
        giftWrapPrice: Number(giftWrapPrice),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Manage store fees & admin preferences</p>
        </div>
      </div>

      {/* Fee Settings */}
      <div className="card" style={{ maxWidth: 520, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag size={20} />
          Fee Settings
        </h3>

        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Loading...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label className="form-label">Convenience Fee (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  value={convenienceFee}
                  onChange={e => setConvenienceFee(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Gift Wrap Price (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  min={0}
                  value={giftWrapPrice}
                  onChange={e => setGiftWrapPrice(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {saving ? <RefreshCw size={16} /> : <Save size={16} />}
              {saved ? '✅ Saved!' : saving ? 'Saving...' : 'Save Settings'}
            </button>
          </>
        )}
      </div>

      {/* Appearance */}
      <div className="card" style={{ maxWidth: 520 }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={20} />
          Appearance
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
    </div>
  );
}
