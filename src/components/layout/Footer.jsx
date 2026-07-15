import './Footer.css';

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <span className="footer-logo">✧</span>
          <h3>AARANYA LUXURY SAREE HOUSE</h3>
          <p>Handpicked heritage fabrics & luxury ensembles, tailored to perfection.</p>
        </div>
        <div className="footer-links">
          <div className="footer-link-group">
            <h4>Collections</h4>
            <a>Kanjeevaram</a>
            <a>Banarasi</a>
            <a>Lehengas</a>
          </div>
          <div className="footer-link-group">
            <h4>Services</h4>
            <a>Custom Tailoring</a>
            <a>Personal Styling</a>
            <a>Bridal Consultation</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Aaranya Luxury Saree House. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
