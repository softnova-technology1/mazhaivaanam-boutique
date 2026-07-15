import React, { useState, useEffect } from 'react';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/formatters';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import './Pages.css';

// Master luxury product collection
const ALL_PRODUCTS = [
  {
    id: 'prod-1',
    name: "Golden Temple Kanjeevaram",
    category: "Kanchipuram Silk",
    occasion: "Wedding",
    price: 18500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=80",
    description: "Pure mulberry Kanchipuram silk featuring high-density gold zari work, traditional paisley motifs, and a rich crimson contrast pallu."
  },
  {
    id: 'prod-2',
    name: "Crimson Banarasi Brocade",
    category: "Banarasi",
    occasion: "Wedding",
    price: 24000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    description: "Authentic Varanasi handloom silk brocade woven with intricate floral vines (Jaal pattern) in heavy gold thread work."
  },
  {
    id: 'prod-3',
    name: "Emerald Forest Silk",
    category: "Silk Sarees",
    occasion: "Traditional",
    price: 14200,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80",
    description: "A rich emerald green silk saree with a traditional contrast korvai border and circular gold bootis scattered across the body."
  },
  {
    id: 'prod-4',
    name: "Blush Organza Grace",
    category: "Organza",
    occasion: "Party Wear",
    price: 8900,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    description: "Translucent premium organza with hand-painted pastel floral bouquets and delicate silver scalloped borders."
  },
  {
    id: 'prod-5',
    name: "Indigo Linen Weave",
    category: "Linen",
    occasion: "Office Wear",
    price: 6200,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    description: "Lightweight organic linen saree in deep indigo with solid silver borders and a clean tasselled pallu."
  },
  {
    id: 'prod-6',
    name: "Ivory Tissue Brocade",
    category: "Tissue Sarees",
    occasion: "Reception",
    price: 21500,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    description: "Shimmering gold-ivory silk tissue weave with detailed diagonal diamond lattices and a heavy handwoven brocade pallu."
  },
  {
    id: 'prod-7',
    name: "Midnight Designer Drape",
    category: "Designer Sarees",
    occasion: "Party Wear",
    price: 17800,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
    description: "Modern georgette pre-pleated designer saree with hand-stitched sequin borders and a matching high-neck blouse piece."
  },
  {
    id: 'prod-8',
    name: "Coral Handloom Classics",
    category: "Handloom Collection",
    occasion: "Festival",
    price: 9500,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=80",
    description: "Soft handloom cotton-silk blend in warm coral, featuring checks and a temple-motif border in red threadwork."
  },
  {
    id: 'prod-9',
    name: "Royal Bridal Trousseau",
    category: "Bridal Collection",
    occasion: "Wedding",
    price: 32000,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    description: "An heirloom Kanchipuram bridal masterwork featuring checks, heavy multi-tier border zari panels, and wedding scenes woven on the pallu."
  },
  {
    id: 'prod-10',
    name: "Peach Soft Silk Breeze",
    category: "Soft Silk",
    occasion: "Casual Wear",
    price: 7800,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    description: "Light, drape-friendly soft silk saree in pastel peach, designed for comfortable day-long wear."
  },
  {
    id: 'prod-11',
    name: "Mustard Handloom Linen",
    category: "Linen",
    occasion: "Festival",
    price: 6800,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    description: "Mustard yellow linen saree with silver zari pinstripes and geometric checks on the border."
  },
  {
    id: 'prod-12',
    name: "Turquoise Kanchipuram Weave",
    category: "Kanchipuram Silk",
    occasion: "Engagement",
    price: 19500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80",
    description: "Vibrant turquoise Kanchipuram silk with gold-silver double zari checks and traditional peacock borders."
  },
  {
    id: 'prod-13',
    name: "Scarlet Banarasi Heritage",
    category: "Banarasi",
    occasion: "Traditional",
    price: 26000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80",
    description: "Pure katan silk Banarasi in bright scarlet red with elaborate gold zari floral creepers across the body."
  },
  {
    id: 'prod-14',
    name: "Lemon Cotton Elegance",
    category: "Cotton Sarees",
    occasion: "Casual Wear",
    price: 4200,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=600&q=80",
    description: "Fine handloom cotton saree in pastel lemon yellow, highly breathable and styled with simple checks."
  },
  {
    id: 'prod-15',
    name: "Magenta Soft Silk Aura",
    category: "Soft Silk",
    occasion: "Engagement",
    price: 8500,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    description: "Deep magenta soft silk with silver zari motifs, offering a soft luxurious flow and simple weight."
  },
  {
    id: 'prod-16',
    name: "Lavender Organza Flora",
    category: "Organza",
    occasion: "Party Wear",
    price: 9200,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
    description: "Pastel lavender organza saree featuring screen-printed cherry blossom murals and a glass bead hand-worked trim."
  }
];

export const Catalog = ({ activeFilter, setActiveFilter }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(ALL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(activeFilter.category || 'All');
  const [selectedOccasion, setSelectedOccasion] = useState(activeFilter.occasion || 'All');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistMessage, setWishlistMessage] = useState('');

  // Update filters if props change (navbar search / mega-menu clicks)
  useEffect(() => {
    setSelectedCategory(activeFilter.category || 'All');
    setSelectedOccasion(activeFilter.occasion || 'All');
  }, [activeFilter]);

  // Handle product filtering & sorting logic
  useEffect(() => {
    let filtered = [...ALL_PRODUCTS];

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Occasion
    if (selectedOccasion && selectedOccasion !== 'All') {
      filtered = filtered.filter(p => p.occasion.toLowerCase() === selectedOccasion.toLowerCase());
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort Logic
    if (selectedSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setProducts(filtered);
  }, [selectedCategory, selectedOccasion, selectedSort, searchQuery]);

  const handleAddToWishlist = (product) => {
    const saved = localStorage.getItem('boutique_wishlist');
    let wishlistItems = saved ? JSON.parse(saved) : [];
    
    // Check if duplicate
    if (!wishlistItems.find(w => w.id === product.id)) {
      wishlistItems.push(product);
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
      
      // Trigger a window event so Navbar updates instantly
      window.dispatchEvent(new Event('storage'));
      
      setWishlistMessage(`"${product.name}" added to Wishlist!`);
      setTimeout(() => setWishlistMessage(''), 3000);
    } else {
      setWishlistMessage(`"${product.name}" is already in your Wishlist.`);
      setTimeout(() => setWishlistMessage(''), 3000);
    }
  };

  const categories = ['All', 'Kanchipuram Silk', 'Banarasi', 'Silk Sarees', 'Soft Silk', 'Cotton Sarees', 'Organza', 'Linen', 'Tissue Sarees', 'Designer Sarees', 'Handloom Collection', 'Bridal Collection'];
  const occasions = ['All', 'Wedding', 'Reception', 'Engagement', 'Festival', 'Office Wear', 'Casual Wear', 'Party Wear', 'Traditional'];

  return (
    <div className="catalog-page-container container">
      {/* Toast Feedback */}
      {wishlistMessage && (
        <div className="wishlist-toast-banner">
          <span>{wishlistMessage}</span>
        </div>
      )}

      {/* Catalog Title */}
      <header className="catalog-header">
        <span className="section-label">AARANYA CATALOGUE</span>
        <h1>Our Handloom Masterpieces</h1>
        <p className="catalog-lead">Drape yourself in decades of heritage, pure mulberry silk, and gold zari.</p>
      </header>

      {/* Search & Sort Panel */}
      <section className="catalog-controls-panel">
        <div className="catalog-search-box">
          <input 
            type="text" 
            placeholder="Search our sarees..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="catalog-sort-box">
          <label htmlFor="sortBy">Sort By: </label>
          <select 
            id="sortBy" 
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
          >
            <option value="featured">Featured Collection</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Patron Rating</option>
          </select>
        </div>
      </section>

      {/* Sidebar Filters + Product Grid Layout */}
      <div className="catalog-main-layout">
        {/* Left Sidebar Filters */}
        <aside className="catalog-filters-sidebar">
          <div className="filter-group">
            <h3>By Category</h3>
            <ul className="filter-links-list">
              {categories.map(cat => (
                <li key={cat}>
                  <button 
                    className={selectedCategory === cat ? 'active-filter' : ''}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setActiveFilter(prev => ({ ...prev, category: cat }));
                    }}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h3>By Occasion</h3>
            <ul className="filter-links-list">
              {occasions.map(occ => (
                <li key={occ}>
                  <button 
                    className={selectedOccasion === occ ? 'active-filter' : ''}
                    onClick={() => {
                      setSelectedOccasion(occ);
                      setActiveFilter(prev => ({ ...prev, occasion: occ }));
                    }}
                  >
                    {occ}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right: Product Grid */}
        <main className="catalog-products-main">
          {products.length === 0 ? (
            <div className="no-products-found">
              <h3>No sarees found matching your criteria.</h3>
              <p>Try broadening your category filters or typing a different search term.</p>
              <button 
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedOccasion('All');
                  setSearchQuery('');
                  setActiveFilter({ category: '', occasion: '', label: 'All Collections' });
                }} 
                className="reset-catalog-btn"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="catalog-products-grid">
              {products.map((product) => (
                <div key={product.id} className="catalog-product-card glass-card">
                  <div className="card-image-box">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="card-tag">{product.category}</span>
                    <div className="card-overlay-actions">
                      <button 
                        onClick={() => handleAddToWishlist(product)} 
                        title="Add to Wishlist"
                        className="circle-action-btn"
                      >
                        <Heart size={16} />
                      </button>
                      <button 
                        onClick={() => addToCart(product, 1)} 
                        title="Add to Cart"
                        className="circle-action-btn"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="card-info-box">
                    <div className="card-info-header">
                      <h3>{product.name}</h3>
                      <span className="card-star-rating">
                        <Star size={13} fill="#B88A44" stroke="#B88A44" /> {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="card-desc">{product.description}</p>
                    <div className="card-footer-box">
                      <span className="card-price">{formatCurrency(product.price)}</span>
                      <button 
                        onClick={() => addToCart(product, 1)} 
                        className="card-buy-btn"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
