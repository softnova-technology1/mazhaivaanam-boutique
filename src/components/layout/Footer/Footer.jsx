import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles['main-footer']}>
      <div className={`container ${styles['footer-container']}`}>
        <div className={styles['footer-brand']}>
          <span className={styles['footer-logo']}>✧</span>
          <h3>MAZHAI VAANAM</h3>
          <p>Handpicked heritage fabrics & luxury ensembles, tailored to perfection.</p>
        </div>
        <div className={styles['footer-links']}>
          <div className={styles['footer-link-group']}>
            <h4>Collections</h4>
            <a>Kanjeevaram</a>
            <a>Banarasi</a>
            <a>Lehengas</a>
          </div>
          <div className={styles['footer-link-group']}>
            <h4>Services</h4>
            <a>Custom Tailoring</a>
            <a>Personal Styling</a>
            <a>Bridal Consultation</a>
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
