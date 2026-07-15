import { useState, useEffect } from 'react';
import { Search, Heart, User, ShoppingBag, Menu, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import styles from './Navbar.module.css';

export const Navbar = ({ currentTab, setCurrentTab, setCatalogFilter }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartItemCount, addToCart } = useCart();
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Drawer/Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  
  // Mobile accordion states
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [mobileOccasionsOpen, setMobileOccasionsOpen] = useState(false);
  
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

  const popularSearches = ['Kanchipuram', 'Wedding Sarees', 'Organza', 'Cotton', 'Designer'];

  const collectionsList = [
    { label: 'Silk Sarees', link: 'silk' },
    { label: 'Kanchipuram Silk', link: 'kanchipuram' },
    { label: 'Banarasi', link: 'banarasi' },
    { label: 'Soft Silk', link: 'soft-silk' },
    { label: 'Cotton Sarees', link: 'cotton' },
    { label: 'Organza', link: 'organza' },
    { label: 'Linen', link: 'linen' },
    { label: 'Tissue Sarees', link: 'tissue' },
    { label: 'Designer Sarees', link: 'designer' },
    { label: 'Handloom Collection', link: 'handloom' },
    { label: 'Bridal Collection', link: 'bridal' }
  ];

  const occasionsList = [
    { label: 'Wedding', link: 'wedding' },
    { label: 'Reception', link: 'reception' },
    { label: 'Engagement', link: 'engagement' },
    { label: 'Festival', link: 'festival' },
    { label: 'Office Wear', link: 'office' },
    { label: 'Casual Wear', link: 'casual' },
    { label: 'Party Wear', link: 'party' },
    { label: 'Traditional', link: 'traditional' }
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
        <p>✨ Free Shipping Above ₹2,999 | Store Locator | Book Video Shopping</p>
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
              <h1 className={styles.brandTitle}>AARANYA</h1>
              <span className={styles.brandSubtitle}>LUXURY SAREE HOUSE</span>
            </div>

            {/* Right Side Icons */}
            <div className={styles.rightSide}>
              {/* Wishlist Icon */}
              <button 
                className={styles.iconCircle} 
                onClick={() => setIsWishlistOpen(true)}
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
                  onClick={() => handleTabChange('login')}
                  aria-label="Account"
                >
                  <User size={18} strokeWidth={1.5} />
                </button>
                
                {/* Account dropdown */}
                {isAccountOpen && (
                  <div className={styles.accountDropdown}>
                    <button onClick={() => handleTabChange('login')} className={styles.dropdownLink}>My Profile</button>
                    <button onClick={() => handleTabChange('login')} className={styles.dropdownLink}>My Orders</button>
                    <button onClick={() => { setIsWishlistOpen(true); setIsAccountOpen(false); }} className={styles.dropdownLink}>Wishlist</button>
                    <button onClick={() => handleTabChange('login')} className={styles.dropdownLink}>Saved Address</button>
                    <button onClick={() => handleTabChange('login')} className={styles.dropdownLink}>Gift Cards</button>
                    <div className={styles.dropdownDivider}></div>
                    <button onClick={() => handleTabChange('login')} className={`${styles.dropdownLink} ${styles.logoutBtn}`}>Logout</button>
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
                <button onClick={() => handleTabChange('shop')} className={styles.menuLink}>Home</button>
              </li>
              <li className={styles.menuItem}>
                <button onClick={() => handleCatalogClick('Bridal Collection')} className={styles.menuLink}>New Arrivals</button>
              </li>
              
              {/* Collections Mega Menu hover trigger */}
              <li className={`${styles.menuItem} ${styles.hasMegaMenu}`}>
                <button className={styles.menuLink}>Collections ▼</button>
                <div className={styles.megaMenuPanel}>
                  <div className={styles.megaMenuContainer}>
                    <div className={styles.megaMenuGrid}>
                      <div className={styles.megaMenuColumn}>
                        <h4>Heritage Silks</h4>
                        {collectionsList.slice(0, 4).map(item => (
                          <button key={item.link} onClick={() => handleCatalogClick(item.label)} className={styles.megaMenuLink}>{item.label}</button>
                        ))}
                      </div>
                      <div className={styles.megaMenuColumn}>
                        <h4>Modern Weaves</h4>
                        {collectionsList.slice(4, 8).map(item => (
                          <button key={item.link} onClick={() => handleCatalogClick(item.label)} className={styles.megaMenuLink}>{item.label}</button>
                        ))}
                      </div>
                      <div className={styles.megaMenuColumn}>
                        <h4>Exclusive Edits</h4>
                        {collectionsList.slice(8).map(item => (
                          <button key={item.link} onClick={() => handleCatalogClick(item.label)} className={styles.megaMenuLink}>{item.label}</button>
                        ))}
                      </div>
                      
                      {/* Image Banners */}
                      <div className={styles.megaMenuBanners}>
                        <div className={styles.megaBannerCard}>
                          <img src="https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=250&q=80" alt="Kanjeevaram Heritage" />
                          <div className={styles.bannerInfo}>
                            <span>Kanjeevaram</span>
                            <button onClick={() => handleCatalogClick('Kanchipuram Silk')}>Shop Bridal</button>
                          </div>
                        </div>
                        <div className={styles.megaBannerCard}>
                          <img src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=250&q=80" alt="Banarasi Legacy" />
                          <div className={styles.bannerInfo}>
                            <span>Banarasi</span>
                            <button onClick={() => handleCatalogClick('Banarasi')}>Explore Weaves</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              
              {/* Occasions dropdown */}
              <li className={`${styles.menuItem} ${styles.hasDropdown}`}>
                <button className={styles.menuLink}>Occasions ▼</button>
                <div className={styles.dropdownPanel}>
                  {occasionsList.map(item => (
                    <button key={item.link} onClick={() => handleCatalogClick('', item.label)} className={styles.dropdownPanelLink}>{item.label}</button>
                  ))}
                </div>
              </li>

              <li className={styles.menuItem}>
                <button onClick={() => handleCatalogClick('Handloom Collection')} className={styles.menuLink}>Best Sellers</button>
              </li>
              <li className={styles.menuItem}>
                <button onClick={() => handleTabChange('lookbook')} className={styles.menuLink}>Lookbook</button>
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
              <span className={styles.drawerLogo}>AARANYA</span>
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
              
              {/* Accordion Occasions */}
              <li className={styles.drawerItem}>
                <button 
                  className={`${styles.drawerLink} ${styles.accordionTrigger}`}
                  onClick={() => setMobileOccasionsOpen(!mobileOccasionsOpen)}
                >
                  Occasions {mobileOccasionsOpen ? '▲' : '▼'}
                </button>
                {mobileOccasionsOpen && (
                  <ul className={styles.drawerSubList}>
                    {occasionsList.map(item => (
                      <li key={item.link}>
                        <button onClick={() => handleCatalogClick('', item.label)} className={styles.drawerSubLink}>{item.label}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className={styles.drawerItem}>
                <button onClick={() => handleCatalogClick('Handloom Collection')} className={styles.drawerLink}>Best Sellers</button>
              </li>
              <li className={styles.drawerItem}>
                <button onClick={() => handleTabChange('lookbook')} className={styles.drawerLink}>Lookbook</button>
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
