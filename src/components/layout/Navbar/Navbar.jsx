import { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingBag, Menu, X, Trash2, Plus, Minus, MapPin, Gift, LogOut } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { formatCurrency } from '../../../utils/formatters';
import styles from './Navbar.module.css';

export const Navbar = ({ currentTab, setCurrentTab, setCatalogFilter }) => {
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

  
  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  
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
        category: "Silk Sarees"
      },
      {
        id: 'wish-2',
        name: "Crimson Banarasi Brocade",
        price: 24000,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80",
        category: "Banarasi"
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

  const popularSearches = ['Handloom Sarees', 'Linen Cotton', 'Chanderi Cotton', 'Kalyani Cotton', 'Mul Mul Cotton'];

  const collectionsList = [
    { label: 'Blended South Cotton', link: 'blended-south-cotton' },
    { label: 'Handloom Sarees', link: 'handloom-sarees' },
    { label: 'Linen Cotton', link: 'linen-cotton' },
    { label: 'Chanderi Cotton', link: 'chanderi-cotton' },
    { label: 'Kalyani Cotton Sarees', link: 'kalyani-cotton-sarees' },
    { label: 'Khadi Cotton Saree', link: 'khadi-cotton-saree' },
    { label: 'Mul Mul Cotton', link: 'mul-mul-cotton' }
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
  };

  const handleCatalogClick = (category = '', occasion = '') => {
    if (setCatalogFilter) {
      setCatalogFilter({ category, occasion, label: category || occasion || 'All Collections' });
    }
    handleTabChange('catalog');
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
                onMouseEnter={() => setIsAccountOpen(true)}
                onMouseLeave={() => setIsAccountOpen(false)}
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
                        <button onClick={() => { handleTabChange('login'); setIsAccountOpen(false); }} className={styles.dropdownLink}>Sign In</button>
                        <button onClick={() => { handleTabChange('login'); setIsAccountOpen(false); }} className={styles.dropdownLink}>Register</button>
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
                <button onClick={() => handleTabChange('about')} className={styles.menuLink}>About</button>
              </li>
              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('contact')} className={styles.menuLink}>Contact</button>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* 4. Fullscreen Search Overlay */}
      {isSearchOpen && (
        <div className={styles.searchOverlay}>
          <button 
            className={styles.closeSearchBtn} 
            onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
            aria-label="Close search"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          
          <div className={styles.searchOverlayContent}>
            <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(searchQuery); }} className={styles.searchInputWrapper}>
              <input 
                type="text" 
                placeholder="Search Sarees..." 
                className={styles.searchBigInput} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Search className={styles.searchBigIcon} size={28} />
              </button>
            </form>
            
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
                <button onClick={() => handleCatalogClick('Bridal Collection')} className={styles.drawerLink}>New Arrivals</button>
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
                <button onClick={() => handleCatalogClick('Handloom Collection')} className={styles.drawerLink}>Best Sellers</button>
              </li>
              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('limited-offer')} className={`${styles.drawerLink} ${styles.limitedOfferLink} ${currentTab === 'limited-offer' ? styles.active : ''}`}>Limited Offer</button>
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
