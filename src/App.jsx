import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useCart } from './hooks/useCart';
import { Navbar } from './components/layout/Navbar/Navbar';
import { WhatsAppButton } from './components/common/WhatsAppButton/WhatsAppButton';
import { ScrollToTopButton } from './components/common/ScrollToTopButton/ScrollToTopButton';
import { Breadcrumbs } from './components/common/Breadcrumbs/Breadcrumbs';
import { CartToast } from './components/common/CartToast/CartToast';
import { Home } from './pages/Home/Home';
import { Cart } from './pages/Cart/Cart';
import { Login } from './pages/Login/Login';
import { Catalog, ALL_PRODUCTS } from './pages/Catalog/Catalog';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';
import { Footer } from './components/layout/Footer/Footer';
import { ProductDetail } from './pages/ProductDetail/ProductDetail';
import { Wishlist } from './pages/Wishlist/Wishlist';
import { Checkout } from './pages/Checkout/Checkout';
import { MyOrders } from './pages/MyOrders/MyOrders';
import { TrackOrder } from './pages/TrackOrder/TrackOrder';
import { Support } from './pages/Support/Support';
import { Privacy } from './pages/Privacy/Privacy';
import { Returns } from './pages/Returns/Returns';
import { Terms } from './pages/Terms/Terms';
import { LimitedOffer } from './pages/LimitedOffer/LimitedOffer';
import { NewArrivals } from './pages/NewArrivals/NewArrivals';
import { BestSellers } from './pages/BestSellers/BestSellers';
import { Collections } from './pages/Collections/Collections';
import { ShippingPolicy } from './pages/ShippingPolicy/ShippingPolicy';
import { MyProfile } from './pages/MyProfile/MyProfile';
import { SavedAddress } from './pages/SavedAddress/SavedAddress';

import { PreBooking, PREORDER_PRODUCTS } from './pages/PreBooking/PreBooking';
import './App.css';

function getInitialState() {
  const path = window.location.pathname;
  let tab = 'shop';
  let prod = null;
  
  if (path === '/' || path === '') {
    tab = 'shop';
  } else if (path === '/catalog') {
    tab = 'catalog';
  } else if (path.startsWith('/product/')) {
    const productId = path.replace('/product/', '');
    const found = ALL_PRODUCTS.find(p => p.id === productId) || PREORDER_PRODUCTS.find(p => p.id === productId);
    if (found) {
      prod = found;
      tab = 'product-detail';
    }
  } else {
    const tabName = path.substring(1);
    const validTabs = [
      'about', 'contact', 'cart', 'login', 'wishlist', 'checkout',
      'my-orders', 'track-order', 'support', 'privacy', 'returns', 'terms',
      'limited-offer', 'new-arrivals', 'best-sellers', 'collections',
      'pre-booking', 'shipping-policy', 'my-profile', 'saved-address'
    ];
    if (validTabs.includes(tabName)) {
      tab = tabName;
    }
  }
  return { tab, prod };
}

function AppContent() {
  const initialState = getInitialState();
  const [currentTab, setCurrentTab] = useState(initialState.tab);
  const [catalogFilter, setCatalogFilter] = useState({ category: '', occasion: '', label: 'All Collections' });
  const [selectedProduct, setSelectedProduct] = useState(initialState.prod);
  const { cartItemCount } = useCart();
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handler for navbar navigation to trigger loader
  const handleNavbarNavigation = (tab) => {
    if (tab === currentTab) return;
    setIsLoading(true);
    setCurrentTab(tab);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  // Listen for global toast alerts
  useEffect(() => {
    let timer;
    const handleShowToast = (e) => {
      setToastMessage(e.detail.message);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setToastMessage('');
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => {
      window.removeEventListener('show-toast', handleShowToast);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Handle initial load and back/forward browser navigation
  useEffect(() => {
    const handleUrlSync = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setCurrentTab('shop');
      } else if (path === '/catalog') {
        setCurrentTab('catalog');
      } else if (path.startsWith('/product/')) {
        const productId = path.replace('/product/', '');
        const prod = ALL_PRODUCTS.find(p => p.id === productId) || PREORDER_PRODUCTS.find(p => p.id === productId);
        if (prod) {
          setSelectedProduct(prod);
          setCurrentTab('product-detail');
        } else {
          setCurrentTab('shop');
        }
      } else if ([
        'about', 'contact', 'cart', 'login', 'wishlist', 'checkout',
        'my-orders', 'track-order', 'support', 'privacy', 'returns', 'terms',
        'limited-offer', 'new-arrivals', 'best-sellers', 'collections',
        'pre-booking', 'shipping-policy', 'my-profile', 'saved-address'
      ].includes(path.substring(1))) {
        setCurrentTab(path.substring(1));
      } else {
        setCurrentTab('shop');
      }
    };

    // Run on mount
    handleUrlSync();

    // Listen to history pop events (back/forward clicks)
    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  // Sync URL with tab state when tabs or selected product changes
  useEffect(() => {
    const path = window.location.pathname;
    let expectedPath = '/';
    if (currentTab === 'product-detail' && selectedProduct) {
      expectedPath = `/product/${selectedProduct.id}`;
    } else if (currentTab !== 'shop') {
      expectedPath = `/${currentTab}`;
    }
    
    // Only push if the path is actually different to avoid duplicates
    if (path !== expectedPath) {
      window.history.pushState(null, '', expectedPath);
    }
    
    // Scroll to top on page navigation
    window.scrollTo(0, 0);
  }, [currentTab, selectedProduct]);

  const renderContent = () => {
    switch (currentTab) {
      case 'shop':
        return <Home setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} setCatalogFilter={setCatalogFilter} />;
      case 'catalog':
        return (
          <Catalog 
            activeFilter={catalogFilter} 
            setActiveFilter={setCatalogFilter} 
            setCurrentTab={setCurrentTab} 
            setSelectedProduct={setSelectedProduct} 
          />
        );
      case 'product-detail':
        return <ProductDetail product={selectedProduct} setCurrentTab={setCurrentTab} />;
      case 'wishlist':
        return <Wishlist setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;

      case 'about':
        return <About setCurrentTab={setCurrentTab} />;
      case 'contact':
        return <Contact setCurrentTab={setCurrentTab} />;
      case 'track-order':
        return <TrackOrder setCurrentTab={setCurrentTab} />;
      case 'cart':
        return <Cart setCurrentTab={setCurrentTab} />;
      case 'checkout':
        return <Checkout setCurrentTab={setCurrentTab} />;
      case 'my-orders':
        return <MyOrders setCurrentTab={setCurrentTab} />;
      case 'my-profile':
        return <MyProfile setCurrentTab={setCurrentTab} />;
      case 'saved-address':
        return <SavedAddress setCurrentTab={setCurrentTab} />;
      case 'login':
        return <Login setCurrentTab={setCurrentTab} />;
      case 'support':
        return <Support setCurrentTab={setCurrentTab} />;
      case 'privacy':
        return <Privacy setCurrentTab={setCurrentTab} />;
      case 'returns':
        return <Returns setCurrentTab={setCurrentTab} />;
      case 'terms':
        return <Terms setCurrentTab={setCurrentTab} />;
      case 'limited-offer':
        return <LimitedOffer setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
      case 'new-arrivals':
        return <NewArrivals setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
      case 'best-sellers':
        return <BestSellers setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
      case 'collections':
        return <Collections setCurrentTab={setCurrentTab} setCatalogFilter={setCatalogFilter} />;

      case 'pre-booking':
        return <PreBooking setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
      case 'shipping-policy':
        return <ShippingPolicy />;
      default:
        return <Home setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
    }
  };

  return (
    <div className="app-container">
      {isLoading && (
        <div className="global-loader">
          <div className="rain-container">
            {Array.from({ length: 150 }).map((_, i) => (
              <i key={i} className="drop" style={{ 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 3}s`
              }}></i>
            ))}
          </div>
          <img src="/logo.png" alt="Loading..." className="loader-logo" />
        </div>
      )}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={handleNavbarNavigation} 
        setCatalogFilter={setCatalogFilter}
        cartItemCount={cartItemCount} 
      />
      <main className="main-content">
        <Breadcrumbs 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab}
          catalogFilter={catalogFilter}
          setCatalogFilter={setCatalogFilter}
          selectedProduct={selectedProduct}
        />
        {renderContent()}
      </main>
      <Footer setCurrentTab={setCurrentTab} setCatalogFilter={setCatalogFilter} />

      {/* Global Scroll To Top Button */}
      <ScrollToTopButton />

      {/* Global WhatsApp Button */}
      <WhatsAppButton />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: 'var(--primary-dark)',
          color: '#ffffff',
          padding: '12px 24px',
          zIndex: 10005,
          fontFamily: 'Inter, sans-serif',
          fontSize: '13px',
          fontWeight: '600',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(79, 78, 34, 0.25)',
          borderLeft: '4px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'none'
        }}>
          <Heart size={14} fill="var(--accent)" stroke="var(--accent)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cart Popup Notification */}
      <CartToast setCurrentTab={handleNavbarNavigation} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
