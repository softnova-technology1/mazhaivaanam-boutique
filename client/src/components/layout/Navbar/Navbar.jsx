import { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingBag, Menu, X, Trash2, Plus, Minus, MapPin, Gift, LogOut, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { getProducts } from '../../../services/api';
import { formatCurrency } from '../../../utils/formatters';
import styles from './Navbar.module.css';

export const Navbar = ({ currentTab, setCurrentTab, setCatalogFilter, setSelectedProduct }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount, addToCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Drawer/Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  // Mobile accordion states
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  
  // Search input state & live search results
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Wishlist state (with mock items fallback)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('boutique_wishlist');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'wish-1',
        name: "Golden Temple Kanjeevaram",
        price: 18500,
        image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=300&q=80",
        category: "Silk Sarees",
        isLimited: true
      },
      {
        id: 'wish-2',
        name: "Crimson Banarasi Brocade",
        price: 24000,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80",
        category: "Banarasi",
        isLimited: true
      }
    ];
  });

  // Keep wishlist updated in local storage
  useEffect(() => {
    localStorage.setItem('boutique_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync wishlist from global triggers (like product card adds)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('boutique_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Monitor scroll to trigger sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(`.${styles.accountDropdownWrapper}`)) {
        setIsAccountOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Prevent background scrolling when drawers/modals are open
  useEffect(() => {
    if (isCartOpen || isMobileMenuOpen || isSearchOpen || isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, isMobileMenuOpen, isSearchOpen, isWishlistOpen]);

  const popularSearches = ['Pure Silk Sarees', 'Bridal Kanjeevaram', 'Organza Silk', 'Banarasi Brocade', 'Black Magic'];

  const collectionsList = [
    { label: 'Everyday Elegance', link: 'everyday-elegance' },
    { label: 'Festive Glow', link: 'festive-glow' },
    { label: 'Style Studio', link: 'style-studio' },
    { label: 'Black Magic', link: 'black-magic' }
  ];



  const handleWishlistToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      rating: 4.8
    }, 1);
    
    // Remove from wishlist
    setWishlist(prev => prev.filter(w => w.id !== item.id));
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
  };

  const handleTabChange = (tabValue) => {
    setCurrentTab(tabValue);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCatalogClick = (category = '', occasion = '') => {
    if (setCatalogFilter) {
      setCatalogFilter({ category, occasion, label: category || occasion || 'All Collections' });
    }
    handleTabChange('catalog');
    
    if (category || occasion) {
      setTimeout(() => {
        document.getElementById('catalog-products-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSearchSubmit = (query) => {
    if (!query.trim()) return;
    if (setCatalogFilter) {
      setCatalogFilter({ category: '', occasion: '', label: `Search: ${query}` });
    }
    // Set matching search terms indirectly or reset category filters
    handleTabChange('catalog');
    setIsSearchOpen(false);
  };

  const handleSearchTagClick = (tag) => {
    setSearchQuery(tag);
    if (setCatalogFilter) {
      setCatalogFilter({ category: '', occasion: '', label: `Search: ${tag}` });
    }
    handleTabChange('catalog');
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* 1. announcement banner */}
      <div className={styles.announcementBar}>
        <div className={styles.sliderContainer}>
          <div className={styles.slider}>
            <div className={styles.slide}>✨ Handwoven Luxury, Delivered Worldwide.</div>
            <div className={styles.slide}>🥻 Unveiling Authentic Kanjeevaram Heritage.</div>
            <div className={styles.slide}>📞 Book a Personalized Video Shopping Experience.</div>
            {/* Duplicate first slide for smooth infinite loop */}
            <div className={styles.slide}>✨ Handwoven Luxury, Delivered Worldwide.</div>
          </div>
        </div>
      </div>

      <header className={`${styles.navbarWrapper} ${isSticky ? styles.sticky : ''}`}>
        {/* 2. Main Middle Section */}
        <div className={styles.topSection}>
          <div className={`${styles.container} ${styles.topContainer}`}>
            {/* Mobile Hamburger Menu icon */}
            <button 
              className={styles.hamburgerBtn} 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>

            {/* Left Search Icon */}
            <div className={styles.leftSide}>
              <button 
                className={styles.searchTriggerBtn} 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open Search"
              >
                <Search size={20} strokeWidth={1.2} />
              </button>
            </div>

            {/* Logo perfectly centered */}
            <div className={styles.centerLogo} onClick={() => handleTabChange('shop')}>
              <h1 className={styles.brandTitle}>
                <img src="/logo.png" alt="logo" className={styles.brandLogoIcon} />
                MAZHAI VAANAM
              </h1>
              <span className={styles.brandSubtitle}>HANDLOOM LUXURY</span>
            </div>

            {/* Right Side Icons */}
            <div className={styles.rightSide}>
              {/* Wishlist Icon */}
              <button 
                className={styles.iconCircle} 
                onClick={() => handleTabChange('wishlist')}
                aria-label="Wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
                {wishlist.length > 0 && <span className={styles.dotBadge}></span>}
              </button>
              
              {/* Account Dropdown Trigger */}
              <div 
                className={styles.accountDropdownWrapper}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setIsAccountOpen(true)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setIsAccountOpen(false)}
              >
                <button 
                  className={styles.iconCircle} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAccountOpen(prev => !prev);
                  }}
                  aria-label="Account"
                >
                  <User size={18} strokeWidth={1.5} />
                </button>
                
                {/* Account dropdown */}
                {isAccountOpen && (
                  <div className={styles.accountDropdown}>
                    {isAuthenticated ? (
                      <>
                        <button onClick={() => { handleTabChange('my-profile'); setIsAccountOpen(false); }} className={styles.dropdownLink}>
                          <User size={14} className={styles.dropdownIcon} /> My Profile
                        </button>
                        <button onClick={() => { handleTabChange('my-orders'); setIsAccountOpen(false); }} className={styles.dropdownLink}>
                          <ShoppingBag size={14} className={styles.dropdownIcon} /> My Orders
                        </button>
                        <button onClick={() => { handleTabChange('wishlist'); setIsAccountOpen(false); }} className={styles.dropdownLink}>
                          <Heart size={14} className={styles.dropdownIcon} /> Wishlist
                        </button>
                        <button onClick={() => { handleTabChange('saved-address'); setIsAccountOpen(false); }} className={styles.dropdownLink}>
                          <MapPin size={14} className={styles.dropdownIcon} /> Saved Address
                        </button>
                        <div className={styles.dropdownDivider}></div>
                        <button onClick={() => { logout(); handleTabChange('shop'); setIsAccountOpen(false); }} className={`${styles.dropdownLink} ${styles.logoutBtn}`}>
                          <LogOut size={14} className={styles.dropdownIcon} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { handleTabChange('login'); setIsAccountOpen(false); }} className={styles.dropdownLink}>Login</button>
                        <button onClick={() => { handleTabChange('register'); setIsAccountOpen(false); }} className={styles.dropdownLink}>Register</button>
                        <div className={styles.dropdownDivider}></div>
                        <button onClick={() => { handleTabChange('wishlist'); setIsAccountOpen(false); }} className={styles.dropdownLink}>Wishlist</button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Cart Drawer Trigger */}
              <button 
                className={`${styles.iconCircle} ${styles.bagBtn}`} 
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Bag"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className={styles.badge}>{cartItemCount}</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Bottom Navigation Section with dropdowns / mega menu */}
        <nav className={styles.bottomSection}>
          <div className={`${styles.container} ${styles.bottomContainer}`}>
            <ul className={styles.menuList}>
              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('shop')} className={`${styles.menuLink} ${currentTab === 'shop' ? styles.active : ''}`}>Home</button>
              </li>

              {/* Collections Mega Menu hover trigger */}
              <li className={`${styles.menuItem} ${styles.hasMegaMenu}`}>
                <button onClick={() => handleTabChange('collections')} className={`${styles.menuLink} ${currentTab === 'collections' ? styles.active : ''}`}>Collections ▼</button>
                <div className={styles.megaMenuPanel}>
                  <div className={styles.megaMenuContainer}>
                    <div className={styles.megaMenuColumn}>
                      <button onClick={() => handleCatalogClick('Everyday Elegance')} className={styles.megaMenuHeadingBtn}>
                        <h4>Everyday Elegance</h4>
                      </button>
                      <button onClick={() => handleCatalogClick('Festive Glow')} className={styles.megaMenuHeadingBtn}>
                        <h4>Festive Glow</h4>
                      </button>
                      <button onClick={() => handleCatalogClick('Style Studio')} className={styles.megaMenuHeadingBtn}>
                        <h4>Style Studio</h4>
                      </button>
                      <button onClick={() => handleCatalogClick('Black Magic')} className={styles.megaMenuHeadingBtn}>
                        <h4>Black Magic</h4>
                      </button>
                    </div>
                  </div>
                </div>
              </li>

              <li className={styles.menuItem}>
                <button onClick={() => handleCatalogClick()} className={`${styles.menuLink} ${currentTab === 'catalog' ? styles.active : ''}`}>Shop</button>
              </li>

              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('best-sellers')} className={`${styles.menuLink} ${currentTab === 'best-sellers' ? styles.active : ''}`}>Best Sellers</button>
              </li>

              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('new-arrivals')} className={`${styles.menuLink} ${currentTab === 'new-arrivals' ? styles.active : ''}`}>New Arrivals</button>
              </li>
              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('limited-offer')} className={`${styles.menuLink} ${styles.limitedOfferLink} ${currentTab === 'limited-offer' ? styles.active : ''}`}>Limited Offer</button>
              </li>
              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('pre-booking')} className={`${styles.menuLink} ${styles.preBookingLink} ${currentTab === 'pre-booking' ? styles.active : ''}`}>Pre-Booking</button>
              </li>
              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('track-order')} className={`${styles.menuLink} ${currentTab === 'track-order' ? styles.active : ''}`}>Track Order</button>
              </li>
              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('about')} className={`${styles.menuLink} ${currentTab === 'about' ? styles.active : ''}`}>About</button>
              </li>
              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('contact')} className={`${styles.menuLink} ${currentTab === 'contact' ? styles.active : ''}`}>Contact</button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* 4. Fullscreen Search Overlay with Live Visual Cards */}
      {isSearchOpen && (
        <div className={styles.searchOverlay} onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}>
          <button 
            className={styles.closeSearchBtn} 
            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
            aria-label="Close search"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          
          <div className={styles.searchOverlayContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: 860, width: '92%' }}>
            <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(searchQuery); }} className={styles.searchInputWrapper}>
              <input 
                type="text" 
                placeholder="Search Silk Sarees, Kanjeevaram, Bridal..." 
                className={styles.searchBigInput} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Search className={styles.searchBigIcon} size={28} />
              </button>
            </form>
            
            {/* Live Search Results View */}
            {searchQuery.trim().length >= 2 ? (
              <div style={{ marginTop: 24, textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {isSearching ? 'Searching handloom catalog...' : `${searchResults.length} Sarees Found for "${searchQuery}"`}
                  </span>
                  {searchResults.length > 0 && (
                    <button 
                      onClick={() => handleSearchSubmit(searchQuery)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                    >
                      View All in Catalog <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {isSearching ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <div style={{ width: 32, height: 32, border: '3px solid rgba(200, 163, 77, 0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  </div>
                ) : searchResults.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: 8 }}>No matching sarees found for "{searchQuery}"</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Try searching by fabric like <em>"Kanjeevaram"</em>, <em>"Pure Silk"</em>, or color like <em>"Pink"</em>, <em>"Gold"</em>.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, maxHeight: '55vh', overflowY: 'auto', paddingRight: 6 }}>
                    {searchResults.map((product) => (
                      <div 
                        key={product.id}
                        onClick={() => handleSelectSearchResult(product)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(200, 163, 77, 0.25)',
                          borderRadius: 10,
                          padding: 10,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(200, 163, 77, 0.15)';
                          e.currentTarget.style.borderColor = 'var(--primary)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                          e.currentTarget.style.borderColor = 'rgba(200, 163, 77, 0.25)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#1a1a1a' }}>
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 2 }}>
                            {product.fabric || product.category}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.88rem' }}>
                              {formatCurrency(product.price)}
                            </span>
                            {product.oldPrice > product.price && (
                              <span style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through', fontSize: '0.75rem' }}>
                                {formatCurrency(product.oldPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.searchSuggestionsBlock}>
                <h3>Popular Searches</h3>
                <div className={styles.suggestionsList}>
                  {popularSearches.map((tag) => (
                    <button 
                      key={tag} 
                      className={styles.tagBtn}
                      onClick={() => handleSearchTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Cart Side Drawer (Slides from Right) */}
      <div className={`${styles.cartDrawerOverlay} ${isCartOpen ? styles.open : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className={styles.cartDrawer} onClick={(e) => e.stopPropagation()}>
          <div className={styles.drawerHeader}>
            <h3>Shopping Bag ({cartItemCount})</h3>
            <button className={styles.closeDrawerBtn} onClick={() => setIsCartOpen(false)}>
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className={styles.drawerContent}>
            {cart.length === 0 ? (
              <div className={styles.emptyCartMessage}>
                <ShoppingBag size={48} strokeWidth={1.2} />
                <p>Your shopping bag is currently empty.</p>
                <button onClick={() => { setIsCartOpen(false); handleTabChange('shop'); }} className={styles.primaryCartBtn}>Shop Our Collections</button>
              </div>
            ) : (
              <>
                <div className={styles.cartItemsList}>
                  {cart.map((item) => (
                    <div key={item.id} className={styles.cartItemRow}>
                      <img src={item.image} alt={item.name} className={styles.cartItemImg} />
                      <div className={styles.cartItemInfo}>
                        <h4>{item.name}</h4>
                        <span className={styles.cartItemPrice}>{formatCurrency(item.price)}</span>
                        
                        <div className={styles.quantityControls}>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button 
                        className={styles.deleteCartItemBtn} 
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className={styles.cartSummaryBlock}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span className={styles.summaryTotal}>{formatCurrency(cartTotal)}</span>
                  </div>
                  <p className={styles.summaryNotice}>Shipping and taxes calculated at checkout.</p>
                  
                  <div className={styles.cartDrawerActions}>
                    <button 
                      onClick={() => { setIsCartOpen(false); handleTabChange('cart'); }} 
                      className={styles.viewCartBtn}
                    >
                      View Cart
                    </button>
                    <button 
                      onClick={() => { setIsCartOpen(false); handleTabChange('cart'); }} 
                      className={styles.checkoutBtn}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 6. Wishlist Drawer (Slides from Right) */}
      <div className={`${styles.cartDrawerOverlay} ${isWishlistOpen ? styles.open : ''}`} onClick={() => setIsWishlistOpen(false)}>
        <div className={styles.cartDrawer} onClick={(e) => e.stopPropagation()}>
          <div className={styles.drawerHeader}>
            <h3>Wishlist ({wishlist.length})</h3>
            <button className={styles.closeDrawerBtn} onClick={() => setIsWishlistOpen(false)}>
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className={styles.drawerContent}>
            {wishlist.length === 0 ? (
              <div className={styles.emptyCartMessage}>
                <Heart size={48} strokeWidth={1.2} />
                <p>Your wishlist is currently empty.</p>
                <button onClick={() => { setIsWishlistOpen(false); handleTabChange('shop'); }} className={styles.primaryCartBtn}>Add Saved Sarees</button>
              </div>
            ) : (
              <div className={styles.cartItemsList}>
                <span className={styles.wishlistHeaderLabel}>Saved Items</span>
                {wishlist.map((item) => (
                  <div key={item.id} className={styles.cartItemRow}>
                    <img src={item.image} alt={item.name} className={styles.cartItemImg} />
                    <div className={styles.cartItemInfo}>
                      <h4>{item.name}</h4>
                      <span className={styles.cartItemPrice}>{formatCurrency(item.price)}</span>
                      <button 
                        onClick={() => handleWishlistToCart(item)} 
                        className={styles.wishlistMoveBtn}
                      >
                        Move to Cart
                      </button>
                    </div>
                    <button 
                      className={styles.deleteCartItemBtn} 
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerLogo}>MAZHAI VAANAM</span>
              <button 
                className={styles.closeBtn} 
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>
            
            <ul className={styles.drawerList}>
              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('shop')} className={styles.drawerLink}>Home</button>
              </li>
              <li className={styles.drawerItem}>
                <button onClick={() => handleCatalogClick()} className={styles.drawerLink}>Shop</button>
              </li>
              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('new-arrivals')} className={styles.drawerLink}>New Arrivals</button>
              </li>
              
              {/* Accordion Collections */}
              <li className={styles.drawerItem}>
                <button 
                  className={`${styles.drawerLink} ${styles.accordionTrigger}`}
                  onClick={() => setMobileCollectionsOpen(!mobileCollectionsOpen)}
                >
                  Collections {mobileCollectionsOpen ? '▲' : '▼'}
                </button>
                {mobileCollectionsOpen && (
                  <ul className={styles.drawerSubList}>
                    {collectionsList.map(item => (
                      <li key={item.link}>
                        <button onClick={() => handleCatalogClick(item.label)} className={styles.drawerSubLink}>{item.label}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              


              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('best-sellers')} className={styles.drawerLink}>Best Sellers</button>
              </li>
              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('limited-offer')} className={`${styles.drawerLink} ${styles.limitedOfferLink} ${currentTab === 'limited-offer' ? styles.active : ''}`}>Limited Offer</button>
              </li>
              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('pre-booking')} className={`${styles.drawerLink} ${styles.preBookingLink} ${currentTab === 'pre-booking' ? styles.active : ''}`}>Pre-Booking</button>
              </li>

              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('wishlist')} className={styles.drawerLink}>Wishlist</button>
              </li>
              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('about')} className={styles.drawerLink}>About</button>
              </li>
              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('contact')} className={styles.drawerLink}>Contact</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
