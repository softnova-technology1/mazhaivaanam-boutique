import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import styles from './Header.module.css';

export const Header = ({ currentTab, setCurrentTab }) => {
  const { cartItemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className={`${styles['main-header']} glass-card`}>
      <div className={`container ${styles['header-container']}`}>
        <div className={styles.logo} onClick={() => setCurrentTab('shop')}>
          <span className={styles['logo-icon']}>✧</span>
          <span className={styles['logo-text']}>MAZHAI VAANAM</span>
        </div>
        
        <nav className={styles['nav-links']}>
          <button 
            className={`${styles['nav-link']} ${currentTab === 'shop' ? styles.active : ''}`}
            onClick={() => setCurrentTab('shop')}
          >
            Shop
          </button>
          
          <button 
            className={`${styles['nav-link']} ${styles['cart-nav-link']} ${currentTab === 'cart' ? styles.active : ''}`}
            onClick={() => setCurrentTab('cart')}
          >
            Cart
            {cartItemCount > 0 && <span className={styles['cart-badge']}>{cartItemCount}</span>}
          </button>

          {user ? (
            <div className={styles['user-menu']}>
              <span className={styles['welcome-text']}>Hi, {user.fullName}</span>
              <button className={`${styles['nav-link']} ${styles['logout-btn']}`} onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button 
              className={`${styles['nav-link']} ${styles['login-btn-link']} ${currentTab === 'login' ? styles.active : ''}`}
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
