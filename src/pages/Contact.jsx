import React, { useState } from 'react';
import './Pages.css';

export const Contact = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    appointmentType: 'Video Call Shopping'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '', appointmentType: 'Video Call Shopping' });
    }, 4000);
  };

  return (
    <div className="contact-page-container">
      {/* 1. Top Header */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-subtitle">GET IN TOUCH</span>
          <h1 className="contact-title">Visit or Consult Aaranya</h1>
          <p className="contact-desc">Book personal bridal consultations, coordinate custom loom orders, or schedule video calls.</p>
        </div>
      </section>

      {/* 2. Main Section */}
      <section className="contact-main container">
        <div className="contact-grid">
          {/* Left: Contact Form */}
          <div className="contact-form-block glass-card">
            <h2>Request Consultation</h2>
            
            {formSubmitted ? (
              <div className="form-success-banner">
                <h3>Thank you, {formData.name || 'valued patron'}!</h3>
                <p>Your request has been logged. Our concierge will contact you within 2 hours to confirm your {formData.appointmentType} slot.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="premium-contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="appointmentType">Service Required</label>
                  <select 
                    id="appointmentType"
                    value={formData.appointmentType}
                    onChange={(e) => setFormData({...formData, appointmentType: e.target.value})}
                  >
                    <option value="Video Call Shopping">Book Video Call Shopping Slot</option>
                    <option value="Bridal Consultation">In-Store Bridal Trousseau Styling</option>
                    <option value="Custom Loom Design">Custom Color Loom Dyeing Order</option>
                    <option value="General Query">General Customer Support</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message / Preferences</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Describe specific fabrics, colors, or wedding dates..."
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">SUBMIT REQUEST</button>
              </form>
            )}
          </div>

          {/* Right: Flagship store info */}
          <div className="flagship-stores-block">
            <span className="section-label">FLAGSHIP STORE LOCATOR</span>
            <h2>Our Boutiques</h2>
            
            <div className="store-list">
              <div className="store-card">
                <h3>Aaranya Chennai</h3>
                <p>No. 12, Khader Nawaz Khan Road, Nungambakkam, Chennai - 600006</p>
                <span className="store-phone">📞 +91 44 4920 1888</span>
                <span className="store-hours">🕒 Mon - Sun: 10:00 AM - 9:00 PM</span>
              </div>

              <div className="store-card">
                <h3>Aaranya Bangalore</h3>
                <p>Heirloom Arcade, Lavelle Road, Richmond Town, Bangalore - 560001</p>
                <span className="store-phone">📞 +91 80 4399 2277</span>
                <span className="store-hours">🕒 Mon - Sun: 10:30 AM - 8:30 PM</span>
              </div>

              <div className="store-card">
                <h3>Aaranya Coimbatore</h3>
                <p>Signature Heights, Race Course Road, Coimbatore - 641018</p>
                <span className="store-phone">📞 +91 422 4910 5500</span>
                <span className="store-hours">🕒 Mon - Sun: 10:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
