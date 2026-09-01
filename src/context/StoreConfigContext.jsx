import { createContext, useContext, useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Default fallback values
const DEFAULT_CONFIG = {
  convenienceFee: 2,
  giftWrapPrice: 499,
};

const StoreConfigContext = createContext(DEFAULT_CONFIG);

export function StoreConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    fetch(`${API_BASE}/store/config`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setConfig(data.data);
        }
      })
      .catch(() => {
        // Silently fall back to defaults
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
