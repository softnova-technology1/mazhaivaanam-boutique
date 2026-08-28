import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  MapPin, 
  LogOut, 
  HelpCircle, 
  Phone, 
  Mail, 
  Plus, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp,
  ShoppingBag,
  Heart,
  Truck,
  FileText,
  Trash2,
  ExternalLink,
  Package,
  Clock,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { orderAPI, authAPI } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import InvoiceModal from '../../admin/components/InvoiceModal';
import styles from './MyProfile.module.css';

export const MyProfile = ({ setCurrentTab, initialSection = 'personal' }) => {
  const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const [activeSection, setActiveSection] = useState(initialSection);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('boutique_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Load live orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const liveOrders = await orderAPI.getMyOrders();
        if (liveOrders && liveOrders.length > 0) {
          setOrders(liveOrders);
        } else {
          // fallback to localStorage
          const saved = localStorage.getItem('boutique_orders');
          if (saved) setOrders(JSON.parse(saved));
        }
      } catch (err) {
        const saved = localStorage.getItem('boutique_orders');
        if (saved) setOrders(JSON.parse(saved));
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, []);

  // 1. Personal Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('boutique_profile');
    if (saved) return JSON.parse(saved);
    
    return {
      firstName: user?.fullName?.split(' ')[0] || '',
      lastName: user?.fullName?.split(' ')[1] || '',
      email: user?.email || 'jane.doe@example.com',
      phone: '+91 98765 43210',
      birthday: '1995-10-15',
      anniversary: '2022-11-23'
    };
  });

  // 2. Password Form State
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // 3. Saved Addresses State
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('boutique_addresses');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'addr-1',
        fullName: 'Jane Doe',
        addressLine: '108 Silk Loom Enclave, Khader Nawaz Khan   Road',
        city: 'Chennai',
        stateName: 'Tamil Nadu',
        pinCode: '600006',
        country: 'India',
        phone: '+91 98765 43210',
        isDefault: true
      },
      {
        id: 'addr-2',
        fullName: 'Jane Doe',
        addressLine: 'Apt 4B, Heritage Heights, Indiranagar 100ft Rd',
        city: 'Bangalore',
        stateName: 'Karnataka',
        pinCode: '560038',
        country: 'India',
        phone: '+91 98765 43210',
        isDefault: false
      }
    ];
  });

  // Modal State for Address
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    addressLine: '',
    city: '',
    stateName: '',
    pinCode: '',
    country: 'India',
    phone: '',
    isDefault: false
  });

  // Help & Support state
  const [supportMessage, setSupportMessage] = useState({
    topic: 'fitting',
    subject: '',
    message: ''
  });
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('boutique_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('boutique_addresses', JSON.stringify(addresses));
  }, [addresses]);



  // Global Toast trigger
  const triggerToast = (message) => {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message } }));
  };

  // Actions
  const handleProfileSave = (e) => {
    e.preventDefault();
    triggerToast('Profile updated successfully! ✨');
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      triggerToast('Please fill all password fields.');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      triggerToast('New passwords do not match!');
      return;
    }
    if (security.newPassword.length < 6) {
      triggerToast('New password must be at least 6 characters.');
      return;
    }
    
    try {
      await authAPI.changePassword({
        currentPassword: security.currentPassword,
        newPassword: security.newPassword,
        confirmPassword: security.confirmPassword
      });
      triggerToast('Password updated securely! 🔒');
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      triggerToast(err.message || 'Failed to update password. Please check your current password.');
    }
  };

  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updated);
    triggerToast('Default shipping address updated.');
  };

  const handleDeleteAddress = (id) => {
    const target = addresses.find(addr => addr.id === id);
    if (target?.isDefault && addresses.length > 1) {
      triggerToast('Cannot delete default address. Set another default first.');
      return;
    }
    setAddresses(addresses.filter(addr => addr.id !== id));
    triggerToast('Address deleted successfully.');
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.addressLine || !newAddress.city || !newAddress.stateName || !newAddress.pinCode || !newAddress.phone) {
      triggerToast('Please fill out all address details.');
      return;
    }

    const createdAddress = {
      ...newAddress,
      id: `addr-${Date.now()}`
    };

    let updatedAddresses = [...addresses];
    if (createdAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
    }
    
    if (updatedAddresses.length === 0) {
      createdAddress.isDefault = true;
    }

    setAddresses([...updatedAddresses, createdAddress]);
    setIsAddAddressOpen(false);
    setNewAddress({
      fullName: '',
      addressLine: '',
      city: '',
      stateName: '',
      pinCode: '',
      country: 'India',
      phone: '',
      isDefault: false
    });
    triggerToast('New address saved to your notebook! 🏡');
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.subject || !supportMessage.message) {
      triggerToast('Please fill out the subject and description.');
      return;
    }
    setSupportSubmitted(true);
    triggerToast('Message sent! Our bridal stylist will reach out soon. 💌');
    setTimeout(() => {
      setSupportMessage({ topic: 'fitting', subject: '', message: '' });
      setSupportSubmitted(false);
    }, 4000);
  };

  const handleLogoutClick = () => {
    logout();
    triggerToast('Logged out of your Atelier account.');
    setCurrentTab('shop');
  };

  const faqs = [
    {
      q: "How does pre-booking work for new collections?",
      a: "Atelier account holders get 48 hours early access to our pre-orders. When a new campaign drops, you will receive an SMS and email invite allowing you to secure your favorite silk pieces before they are available in the public catalog."
    },
    {
      q: "Can I request style alterations for my orders?",
      a: "Yes. For custom sizing adjustments, fall/edging additions, or specific blouse modifications, please reach out via our WhatsApp Stylist hotline within 24 hours of placing your order."
    },
    {
      q: "What packaging is used for silk shipments?",
      a: "All heritage handloom sarees are carefully folded and shipped in premium, moisture-controlled luxury cases. This protects the pure mulberry silk fibers and the gold-woven zari elements from environmental humidity during transit."
    },
    {
      q: "Who should I contact for custom bridal orders?",
      a: "For bespoke bridal loom scheduling and personalized styling advice, please submit a query ticket under the support tab or contact our concierge care line directly."
    }
  ];

      const menuItems = [
    { id: 'personal', label: 'Personal Info', icon: <User size={18} /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={18} /> },
    { id: 'security', label: 'Security Settings', icon: <Lock size={18} /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={18} /> }
  ];

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileWrapper}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Customer Account Hub</h1>
        </header>

        <div className={styles.layoutGrid}>
          {/* Sidebar */}
          <aside className={styles.sidebarCard}>
            <div className={styles.profileSummary}>
              <div className={styles.avatarCircle}>
                <span className={styles.avatarInitials}>
                  {profile.firstName[0]?.toUpperCase()}{profile.lastName[0]?.toUpperCase() || 'P'}
                </span>
              </div>
              <h2 className={styles.userName}>{profile.firstName} {profile.lastName}</h2>
              <p className={styles.userEmail}>{profile.email}</p>
            </div>

            <nav className={styles.navigationList}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`${styles.menuButton} menuLink ${activeSection === item.id ? styles.menuButtonActive : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              <button 
                onClick={handleLogoutClick}
                className={`${styles.logoutButton} menuLink`}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className={styles.contentCard}>
            
            {/* TAB 1: PERSONAL INFO */}
            {activeSection === 'personal' && (
              <section className={styles.tabSection}>
                <h3 className={styles.sectionHeader}>Personal Profile</h3>
                <p className={styles.sectionSubtitle}>Manage your contact details and celebration reminders.</p>
                <div className={styles.sectionDivider}></div>
                
                <form onSubmit={handleProfileSave} className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name</label>
                    <input 
                      type="text" 
                      value={profile.firstName} 
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} 
                      className={styles.formInput} 
                      required 
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name</label>
                    <input 
                      type="text" 
                      value={profile.lastName} 
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} 
                      className={styles.formInput} 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                      className={styles.formInput} 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input 
                      type="tel" 
                      value={profile.phone} 
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                      className={styles.formInput} 
                      required 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Birthday</label>
                    <input 
                      type="date" 
                      value={profile.birthday} 
                      onChange={(e) => setProfile({ ...profile, birthday: e.target.value })} 
                      className={styles.formInput} 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Anniversary / Wedding Date</label>
                    <input 
                      type="date" 
                      value={profile.anniversary} 
                      onChange={(e) => setProfile({ ...profile, anniversary: e.target.value })} 
                      className={styles.formInput} 
                    />
                  </div>

                  <div className={`${styles.buttonRow} md:col-span-2`}>
                    <button type="submit" className={`${styles.submitBtn} menuLink`}>
                      Save Changes
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* TAB: MY ORDERS */}
            {activeSection === 'orders' && (
              <section className={styles.tabSection}>
                <h3 className={styles.sectionHeader}>My Order History</h3>
                <p className={styles.sectionSubtitle}>View, track, and download tax invoices for your saree acquisitions.</p>
                <div className={styles.sectionDivider}></div>

                {ordersLoading ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid rgba(200, 163, 77, 0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-surface)', borderRadius: 10, border: '1px dashed var(--border-color)' }}>
                    <ShoppingBag size={42} style={{ color: 'var(--primary)', margin: '0 auto 12px auto', opacity: 0.6 }} />
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: 6 }}>No orders found yet</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>Explore our handwoven saree atelier to place your first heirloom order.</p>
                    <button onClick={() => setCurrentTab('catalog')} className={`${styles.submitBtn} menuLink`}>
                      Explore Sarees
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {orders.map((order, idx) => (
                      <div 
                        key={order.orderId || order._id || idx}
                        style={{
                          background: 'var(--bg-surface)',
                          borderRadius: 12,
                          border: '1px solid var(--border-color)',
                          padding: '20px 24px'
                        }}
                      >
                        {/* Order Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, borderBottom: '1px solid var(--border-color)', paddingBottom: 14, marginBottom: 16 }}>
                          <div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)' }}>
                              Order #{order.orderId || order._id}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              Placed on {new Date(order.createdAt || order.placedOnDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: 20,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: order.status === 'DELIVERED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(200, 163, 77, 0.15)',
                              color: order.status === 'DELIVERED' ? '#16a34a' : 'var(--primary-dark)',
                              border: `1px solid ${order.status === 'DELIVERED' ? '#16a34a' : 'var(--primary)'}`
                            }}>
                              {order.status || 'CONFIRMED'}
                            </span>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              ₹{Number(order.totalAmount || order.finalAmount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        {/* Order Items List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                          {order.items?.map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                              <div style={{ width: 48, height: 48, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: '#111' }}>
                                <img src={item.image || '/Images/saree1.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>{item.name}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity || 1} · ₹{Number(item.price).toLocaleString('en-IN')}</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                          <button
                            onClick={() => {
                              window.history.pushState(null, '', `/track-order?orderId=${order.orderId || order._id}`);
                              setCurrentTab('track-order');
                            }}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '6px 14px',
                              background: 'transparent',
                              border: '1px solid var(--border-color)',
                              borderRadius: 6,
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: 'var(--text-main)',
                              cursor: 'pointer'
                            }}
                          >
                            <Truck size={14} /> Live Tracking
                          </button>
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '6px 14px',
                              background: 'rgba(200,163,77,0.12)',
                              border: '1px solid var(--primary)',
                              borderRadius: 6,
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              color: 'var(--primary-dark)',
                              cursor: 'pointer'
                            }}
                          >
                            <FileText size={14} /> View Tax Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 2: SAVED ADDRESSES */}
            {activeSection === 'addresses' && (
              <section className={styles.tabSection}>
                <h3 className={styles.sectionHeader}>Address Registry</h3>
                <p className={styles.sectionSubtitle}>Manage shipping and billing addresses for your handloom deliveries.</p>
                <div className={styles.sectionDivider}></div>

                <div className={styles.addressGrid}>
                  {addresses.map((addr) => (
                    <article 
                      key={addr.id} 
                      className={`${styles.addressCard} ${addr.isDefault ? styles.addressCardDefault : ''}`}
                    >
                      {addr.isDefault && (
                        <span className={styles.defaultBadge}>DEFAULT SHIPPING</span>
                      )}
                      
                      <div>
                        <h4 className={styles.addressName}>{addr.fullName}</h4>
                        <p className={styles.addressDetails}>
                          {addr.addressLine}<br />
                          {addr.city}, {addr.stateName} - {addr.pinCode}<br />
                          {addr.country}<br />
                          Phone: {addr.phone}
                        </p>
                      </div>

                      <div className={styles.addressActions}>
                        {!addr.isDefault && (
                          <button 
                            onClick={() => handleSetDefaultAddress(addr.id)} 
                            className={`${styles.addressLinkBtn} menuLink`}
                          >
                            Set Default
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteAddress(addr.id)} 
                          className={`${styles.addressLinkBtn} ${styles.deleteBtn} menuLink`}
                        >
                          Delete Address
                        </button>
                      </div>
                    </article>
                  ))}

                  <button 
                    onClick={() => setIsAddAddressOpen(true)}
                    className={`${styles.addAddressBtn} menuLink`}
                  >
                    <Plus size={24} style={{ color: '#C8A34D' }} />
                    <span className={styles.addAddressTitle}>Add New Address</span>
                  </button>
                </div>
              </section>
            )}

            {/* TAB 3: SECURITY SETTINGS */}
            {activeSection === 'security' && (
              <section className={styles.tabSection}>
                <h3 className={styles.sectionHeader}>Security & Login</h3>
                <p className={styles.sectionSubtitle}>Manage your passwords and secure credentials settings.</p>
                <div className={styles.sectionDivider}></div>

                <form onSubmit={handlePasswordSave} className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Password</label>
                    <div className={styles.passwordInputContainer}>
                      <input 
                        type={showPasswords.current ? "text" : "password"}
                        placeholder="••••••••" 
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                        className={styles.formInput} 
                        required
                      />
                      <button 
                        type="button" 
                        className={styles.passwordToggleBtn}
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      >
                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>New Password</label>
                    <div className={styles.passwordInputContainer}>
                      <input 
                        type={showPasswords.new ? "text" : "password"}
                        placeholder="Minimum 6 characters" 
                        value={security.newPassword}
                        onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        className={styles.formInput} 
                        required
                      />
                      <button 
                        type="button" 
                        className={styles.passwordToggleBtn}
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      >
                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Confirm New Password</label>
                    <input 
                      type="password"
                      placeholder="Confirm new password" 
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                      className={styles.formInput} 
                      required
                    />
                  </div>

                  <div className={`${styles.buttonRow} md:col-span-2`}>
                    <button type="submit" className={`${styles.submitBtn} menuLink`}>
                      Update Password
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* TAB 4: HELP & SUPPORT */}
            {activeSection === 'help' && (
              <section className={styles.tabSection}>
                <h3 className={styles.sectionHeader}>Assistance</h3>
                <p className={styles.sectionSubtitle}>Get in touch with a boutique representative or check our guides.</p>
                <div className={styles.sectionDivider}></div>

                <div className={styles.supportWidgets}>
                  <div className={styles.supportWidget}>
                    <div className={styles.widgetIcon}>
                      <Phone size={18} />
                    </div>
                    <h4 className={styles.widgetTitle}>Styling Call</h4>
                    <p className={styles.widgetDesc}>Book a call with our curators.</p>
                    <span onClick={() => setCurrentTab('contact')} className={styles.widgetLink}>Schedule Call</span>
                  </div>

                  <div className={styles.supportWidget}>
                    <div className={styles.widgetIcon}>
                      <Mail size={18} />
                    </div>
                    <h4 className={styles.widgetTitle}>Email Desk</h4>
                    <p className={styles.widgetDesc}>Ask our care team about shipping and fabric cleaning tips.</p>
                    <a href="mailto:concierge@mazhaivaanam.com" className={styles.widgetLink}>Send Email</a>
                  </div>

             </div>

                <div className={styles.supportSplitGrid}>
                  {/* Styling Ticket Form */}
                  <div>
                    <h4 className={styles.subSectionTitle} style={{ marginTop: 0 }}>Submit styling query</h4>
                    
                    {supportSubmitted ? (
                      <div className={styles.successMessage}>
                        <Check size={16} />
                        <span>Ticket created! A representative will connect with you shortly.</span>
                      </div>
                    ) : (
                      <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Topic</label>
                          <select 
                            value={supportMessage.topic} 
                            onChange={(e) => setSupportMessage({ ...supportMessage, topic: e.target.value })} 
                            className={styles.formInput}
                            style={{ border: 'none', borderBottom: '1px solid rgba(200, 163, 77, 0.4)', borderRadius: 0, padding: '10px 0', fontSize: '0.9rem' }}
                          >
                            <option value="fitting">Alterations & Fitting Details</option>
                            <option value="shipping">Logistics & Custom Duties</option>
                            <option value="bridal">Bespoke Bridal Inquiries</option>
                            <option value="general">General Fabric Care</option>
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Subject</label>
                          <input 
                            type="text" 
                            placeholder="Brief summary of your query"
                            value={supportMessage.subject} 
                            onChange={(e) => setSupportMessage({ ...supportMessage, subject: e.target.value })} 
                            className={styles.formInput}
                            required
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Message details</label>
                          <textarea 
                            rows="4" 
                            placeholder="Describe your request..."
                            value={supportMessage.message} 
                            onChange={(e) => setSupportMessage({ ...supportMessage, message: e.target.value })} 
                            className={styles.formInput}
                            style={{ resize: 'none' }}
                            required
                          ></textarea>
                        </div>

                        <div className={styles.buttonRow} style={{ marginTop: '8px' }}>
                          <button type="submit" className={`${styles.submitBtn} menuLink`}>
                            Send Query
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  {/* FAQs list */}
                  <div>
                    <h4 className={styles.subSectionTitle} style={{ marginTop: 0 }}>Fabric & Loom FAQs</h4>
                    
                    <div className={styles.faqSection}>
                      {faqs.map((faq, index) => {
                        const isOpen = activeFaq === index;
                        return (
                          <div key={index} className={styles.faqItem}>
                            <button 
                              type="button" 
                              onClick={() => setActiveFaq(isOpen ? null : index)}
                              className={`${styles.faqQuestion} menuLink`}
                            >
                              <span>{faq.q}</span>
                              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            {isOpen && (
                              <div className={styles.faqAnswer}>
                                <p>{faq.a}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

          </main>
        </div>
      </div>

      {/* New Address Modal Overlay */}
      {isAddAddressOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.sectionHeader} style={{ margin: 0, fontSize: '1.4rem' }}>Add Delivery Address</h3>
              <button 
                onClick={() => setIsAddAddressOpen(false)}
                className={`${styles.modalCloseBtn} menuLink`}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input 
                  type="text" 
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                  placeholder="e.g. Jane Doe"
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Street Address / Suite / Apartment</label>
                <input 
                  type="text" 
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  placeholder="Avenue details, block number"
                  className={styles.formInput}
                  required
                />
              </div>

              <div className={styles.formGrid} style={{ gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>City</label>
                  <input 
                    type="text" 
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    placeholder="e.g. Chennai"
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>State</label>
                  <input 
                    type="text" 
                    value={newAddress.stateName}
                    onChange={(e) => setNewAddress({ ...newAddress, stateName: e.target.value })}
                    placeholder="e.g. Tamil Nadu"
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGrid} style={{ gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Postal / Pin Code</label>
                  <input 
                    type="text" 
                    value={newAddress.pinCode}
                    onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                    placeholder="e.g. 600006"
                    className={styles.formInput}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Country</label>
                  <input 
                    type="text" 
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number for Delivery</label>
                <input 
                  type="tel" 
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className={styles.formInput}
                  required
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  Set as default shipping address
                </label>
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  onClick={() => setIsAddAddressOpen(false)}
                  className={`${styles.cancelBtn} menuLink`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`${styles.submitBtn} menuLink`}
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Tax Invoice Modal View */}
      {invoiceOrder && (
        <InvoiceModal 
          order={invoiceOrder} 
          onClose={() => setInvoiceOrder(null)} 
        />
      )}
    </div>
  );
};

export default MyProfile;
