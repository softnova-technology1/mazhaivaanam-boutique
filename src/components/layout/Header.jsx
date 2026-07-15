import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

export const Header = ({ currentTab, setCurrentTab }) => {
  const { cartItemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="main-header glass-card">
      <div className="container header-container">
        <div className="logo" onClick={() => setCurrentTab('shop')}>
          <span className="logo-icon">✧</span>
          <span className="logo-text">SHANMATHI BOUTIQUE</span>
        </div>
        
        <nav className="nav-links">
          <button 
            className={`nav-link ${currentTab === 'shop' ? 'active' : ''}`}
            onClick={() => setCurrentTab('shop')}
          >
            Shop
          </button>
          
          <button 
            className={`nav-link cart-nav-link ${currentTab === 'cart' ? 'active' : ''}`}
            onClick={() => setCurrentTab('cart')}
          >
            Cart
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>

          {user ? (
            <div className="user-menu">
              <span className="welcome-text">Hi, {user.fullName}</span>
              <button className="nav-link logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button 
              className={`nav-link login-btn-link ${currentTab === 'login' ? 'active' : ''}`}
              onClick={() => setCurrentTab('login')}
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Header;
