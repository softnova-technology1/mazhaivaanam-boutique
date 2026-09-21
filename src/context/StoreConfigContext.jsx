import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Default fallback values
const DEFAULT_CONFIG = {
  storeName: 'Mazhai Vaanam',
  email: 'mazhaivaanampvi@gmail.com',
  phone: '+91 8807959179',
  whatsapp: '+91 8807959179',
  address: 'ANA Complex, Sethu Road, Peravurani, Thanjavur, Tamil Nadu, India 614804',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61569890920943',
  instagramUrl: 'https://www.instagram.com/mazhaivaanam',
  youtubeUrl: 'https://www.youtube.com/@mazhaivaanam',
  announcementText1: '✨ Handwoven Luxury, Delivered Worldwide.',
  announcementText2: '🥻 Unveiling Authentic Kanjeevaram & Banarasi Heritage.',
  announcementText3: '📞 Book a Personalized Video Shopping Experience.',
  announcementText: '✨ Handwoven Luxury, Delivered Worldwide.',
  announcementBgColor: '#4F4E22',
  announcementTextColor: '#F4E4BC',
  announcementEnabled: true,
  convenienceFee: 2,
  giftWrapPrice: 499,
};

const getInitialConfig = () => {
  try {
    const cached = localStorage.getItem('mv_store_config');
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse cached store config', e);
  }
  return DEFAULT_CONFIG;
};

const StoreConfigContext = createContext(DEFAULT_CONFIG);

export function StoreConfigProvider({ children }) {
  const [config, setConfig] = useState(getInitialConfig);

  useEffect(() => {
    fetch(`${API_BASE}/store/config`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setConfig(data.data);
          try {
            localStorage.setItem('mv_store_config', JSON.stringify(data.data));
          } catch (e) {}
        }
      })
      .catch(() => {
        // Silently fall back to cached / default config
      });
  }, []);

  return (
    <StoreConfigContext.Provider value={config}>
      {children}
    </StoreConfigContext.Provider>
  );
}

export function useStoreConfig() {
  return useContext(StoreConfigContext);
}
