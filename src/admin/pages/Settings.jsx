import { Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <p className="page-subtitle">Manage your admin panel preferences</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
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
              <>
                <Moon size={16} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={16} />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
