import { useState, useEffect } from 'react';
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
import './App.css';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('shop');
  const [catalogFilter, setCatalogFilter] = useState({ category: '', occasion: '', label: 'All Collections' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { cartItemCount } = useCart();

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
