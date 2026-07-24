import styles from './Footer.module.css';

export const Footer = ({ setCurrentTab }) => {
  const handleTabChange = (tab) => {
    window.history.pushState(null, '', `/${tab}`);
    setCurrentTab(tab);
  };

  return (
    <footer className={styles['main-footer']}>
      <div className={`container ${styles['footer-container']}`}>
        <div className={styles['footer-brand']}>
          <img src="/logo.png" alt="Mazhai Vaanam Logo" className={styles['footer-logo-img']} />
          <h3 onClick={() => handleTabChange('shop')} style={{ cursor: 'pointer' }}>MAZHAI VAANAM</h3>
          <p>Handpicked heritage fabrics & luxury ensembles, tailored to perfection.</p>
        </div>
        <div className={styles['footer-links']}>
          <div className={styles['footer-link-group']}>
            <h4>Collections</h4>
            <a onClick={() => handleTabChange('catalog')} style={{ cursor: 'pointer' }}>Blended South Cotton</a>
            <a onClick={() => handleTabChange('catalog')} style={{ cursor: 'pointer' }}>Handloom Sarees</a>
            <a onClick={() => handleTabChange('catalog')} style={{ cursor: 'pointer' }}>Linen Cotton</a>
          </div>
          <div className={styles['footer-link-group']}>
            <h4>Services</h4>
            <a onClick={() => handleTabChange('about')} style={{ cursor: 'pointer' }}>Our Story</a>
            <a onClick={() => handleTabChange('support')} style={{ cursor: 'pointer' }}>Customer Support</a>
          </div>
          <div className={styles['footer-link-group']}>
            <h4>Legal</h4>
            <a onClick={() => handleTabChange('privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</a>
            <a onClick={() => handleTabChange('terms')} style={{ cursor: 'pointer' }}>Terms &amp; Conditions</a>
            <a onClick={() => handleTabChange('shipping-policy')} style={{ cursor: 'pointer' }}>Shipping Charges</a>
            <a onClick={() => handleTabChange('returns')} style={{ cursor: 'pointer' }}>Return & Refund Policy</a>
            <a onClick={() => handleTabChange('contact')} style={{ cursor: 'pointer' }}>Contact Us</a>
          </div>
        </div>
      </div>
      <div className={styles['footer-bottom']}>
        <p>&copy; {new Date().getFullYear()} Mazhai Vaanam. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
