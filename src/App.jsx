import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useCart } from './hooks/useCart';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Catalog } from './pages/Catalog';
import { Lookbook } from './pages/Lookbook';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Footer } from './components/layout/Footer';
import './App.css';

function AppContent() {
  const [currentTab, setCurrentTab] = useState('shop');
  const [catalogFilter, setCatalogFilter] = useState({ category: '', occasion: '', label: 'All Collections' });
  const { cartItemCount } = useCart();

  const renderContent = () => {
    switch (currentTab) {
      case 'shop':
        return <Home />;
      case 'catalog':
        return <Catalog activeFilter={catalogFilter} setActiveFilter={setCatalogFilter} />;
      case 'lookbook':
        return <Lookbook setCurrentTab={setCurrentTab} />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'cart':
        return <Cart setCurrentTab={setCurrentTab} />;
      case 'login':
        return <Login setCurrentTab={setCurrentTab} />;
      default:
        return <Home />;
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
      <Footer />
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
