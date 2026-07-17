import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useCart } from './hooks/useCart';
import { Navbar } from './components/layout/Navbar/Navbar';
import { Home } from './pages/Home/Home';
import { Cart } from './pages/Cart/Cart';
import { Login } from './pages/Login/Login';
import { Catalog, ALL_PRODUCTS } from './pages/Catalog/Catalog';
import { Lookbook } from './pages/Lookbook/Lookbook';
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
import { Occasions } from './pages/Occasions/Occasions';
import './App.css';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('shop');
  const [catalogFilter, setCatalogFilter] = useState({ category: '', occasion: '', label: 'All Collections' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cartItemCount } = useCart();
  const [toastMessage, setToastMessage] = useState('');

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
        const prod = ALL_PRODUCTS.find(p => p.id === productId);
        if (prod) {
          setSelectedProduct(prod);
          setCurrentTab('product-detail');
        } else {
          setCurrentTab('shop');
        }
      } else if (['lookbook', 'about', 'contact', 'cart', 'login', 'wishlist', 'checkout', 'my-orders', 'track-order', 'support', 'privacy', 'returns', 'terms', 'limited-offer'].includes(path.substring(1))) {
      } else if (['lookbook', 'about', 'contact', 'cart', 'login', 'wishlist', 'checkout', 'my-orders', 'track-order', 'support', 'privacy', 'returns', 'terms', 'new-arrivals', 'best-sellers', 'collections', 'occasions'].includes(path.substring(1))) {
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
  }, [currentTab, selectedProduct]);

  const renderContent = () => {
    switch (currentTab) {
      case 'shop':
        return <Home setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
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
      case 'lookbook':
        return <Lookbook setCurrentTab={setCurrentTab} />;
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
        return <LimitedOffer setCurrentTab={setCurrentTab} />;
      case 'new-arrivals':
        return <NewArrivals setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
      case 'best-sellers':
        return <BestSellers setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
      case 'collections':
        return <Collections setCurrentTab={setCurrentTab} setCatalogFilter={setCatalogFilter} />;
      case 'occasions':
        return <Occasions setCurrentTab={setCurrentTab} setCatalogFilter={setCatalogFilter} />;
      default:
        return <Home setCurrentTab={setCurrentTab} setSelectedProduct={setSelectedProduct} />;
    }
  };

  return (
    <div className="app-container">
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        setCatalogFilter={setCatalogFilter}
        cartItemCount={cartItemCount} 
      />
      <main className="main-content">
        {renderContent()}
      </main>
      <Footer setCurrentTab={setCurrentTab} />

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
