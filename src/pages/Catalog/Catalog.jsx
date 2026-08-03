import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
<<<<<<< HEAD
import { getBadgeClass } from '../../utils/badgeHelper';
import { Heart, Star, ChevronDown, Search, ArrowRight, Share2 } from 'lucide-react';
=======
import { Heart, Star, ChevronDown, Search, ArrowRight, Share2, Filter, X } from 'lucide-react';
>>>>>>> a3c3c69533917a57d00556d4fa6c2a82f261a013
import styles from './Catalog.module.css';

// Premium Master Saree Collection (as defined in user's design)
export const ALL_PRODUCTS = [
  {
    id: 'prod-catalog-1',
    name: "Ruby Petal",
    category: "Everyday Elegance",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Wedding",
    price: 13000,
    oldPrice: 15000,
    rating: 4.9,
    tag: "BESTSELLER",
    image: "/Images/cotton saree/0515ac1b-a928-4af5-a71c-7f5e033614e0_3aa.jpg",
    description: "Elegant ruby red handwoven pure silk saree adorned with heritage gold zari borders and temple motifs."
  },
  {
    id: 'prod-catalog-2',
    name: "Sunset Glow",
    category: "Festive Glow",
    fabric: "Cotton",
    color: "#C8A34D",
    occasion: "Festival",
    price: 28599,
    oldPrice: 32000,
    rating: 4.8,
    tag: "NEW ARRIVAL",
    image: "/Images/silk sarees/00812878-32a4-41c6-81ee-a66b8ca8275b_1.jpg",
    description: "Warm yellow and gold handloom cotton saree woven with traditional patterns, ideal for festive elegance.",
    isPreorder: true,
    deposit: 5000
  },
  {
    id: 'prod-catalog-3',
    name: "Snow Elegance",
    category: "Style Studio",
    fabric: "Pure Silk",
    color: "#C8A34D",
    occasion: "Wedding",
    price: 23799,
    oldPrice: 27500,
    rating: 5.0,
    tag: "BESTSELLER",
    image: "/Images/Fancy Sarees/17f37732-5f2a-4c83-8505-8f115aa31f16_2.jpg",
    description: "Glistening white-gold Banarasi brocade saree featuring intricate gold jaal patterns."
  },
  {
    id: 'prod-catalog-4',
    name: "Night Veil",
    category: "Black Magic",
    fabric: "Tussar",
    color: "#1A237E",
    occasion: "Party Wear",
    price: 6149,
    oldPrice: 7500,
    rating: 4.5,
    tag: "NEW ARRIVAL",
    image: "/Images/black magic collection/00960db2-0dce-4f77-adb1-53eaeaabf610_black lichi.webp",
    description: "Deep, mysterious indigo designer drape featuring delicate silver borders."
  },
  {
    id: 'prod-catalog-5',
    name: "Azure Dream",
    category: "Everyday Elegance",
    fabric: "Pure Silk",
    color: "#1A237E",
    occasion: "Wedding",
    price: 11769,
    oldPrice: 14000,
    rating: 4.7,
    tag: "BESTSELLER",
    image: "/Images/cotton saree/070b3e79-f495-49e2-845a-97bf42bf31c0_6A.jpg",
    description: "Vibrant royal blue silk masterwork with gold border details, curated for bridal elegance."
  },
  {
    id: 'prod-catalog-6',
    name: "Royal Orchid",
    category: "Festive Glow",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Reception",
    price: 9000,
    oldPrice: 11000,
    rating: 4.6,
    tag: "BESTSELLER",
    image: "/Images/silk sarees/019afd9a-0bf9-49be-adde-9006ac3c2157_4.jpg",
    description: "Deep orchid purple silk saree with intricate floral vines woven in heavy gold thread work."
  },
  {
    id: 'prod-catalog-7',
    name: "Golden Harvest",
    category: "Style Studio",
    fabric: "Cotton",
    color: "#C8A34D",
    occasion: "Traditional",
    price: 30849,
    oldPrice: 35000,
    rating: 4.8,
    tag: "NEW ARRIVAL",
    image: "/Images/Fancy Sarees/1cc478b0-d027-42a5-9a05-660a74cb2cee_4.jpg",
    description: "Rich handloom cotton-silk blend in warm golden sand with delicate temple-motif borders."
  },
  {
    id: 'prod-catalog-8',
    name: "Mystic Forest",
    category: "Black Magic",
    fabric: "Pure Silk",
    color: "#004D40",
    occasion: "Festival",
    price: 13769,
    oldPrice: 16500,
    rating: 4.9,
    tag: "BESTSELLER",
    image: "/Images/black magic collection/dc8f7413-52de-45df-ae2b-f583cd625a37_Black.webp",
    description: "Deep emerald green silk brocade woven with intricate floral creepers and gold zari."
  },
  {
    id: 'prod-catalog-9',
    name: "Ebony Scarlet",
    category: "Black Magic",
    fabric: "Tussar",
    color: "#6B102A",
    occasion: "Reception",
    price: 43769,
    oldPrice: 49999,
    rating: 5.0,
    tag: "BESTSELLER",
    image: "/Images/black magic collection/449a74ba-b1da-4dd6-8944-8c2abd5fabe0_1.webp",
    description: "Modern designer drape featuring rich scarlet highlights on an ebony dark background.",
    isPreorder: true,
    deposit: 5000
  },
  {
    id: 'prod-catalog-10',
    name: "Sienna Bloom",
    category: "Festive Glow",
    fabric: "Tussar",
    color: "#C8A34D",
    occasion: "Festival",
    price: 14500,
    oldPrice: 17000,
    rating: 4.8,
    tag: "NEW ARRIVAL",
    image: "/Images/silk sarees/1546f1f8-5935-4aaf-b254-aa03321c05d8_love2.jpg",
    description: "Sienna golden-orange silk drape featuring fine floral zari border details and traditional design."
  },
  {
    id: 'prod-catalog-11',
    name: "Lavender Mist",
    category: "Style Studio",
    fabric: "Organza",
    color: "#6B102A",
    occasion: "Party Wear",
    price: 8999,
    oldPrice: 11000,
    rating: 4.7,
    tag: "NEW ARRIVAL",
    image: "/Images/Fancy Sarees/362972a8-7932-4b84-b81a-070deec393c8_5.jpg",
    description: "Lightweight lavender organza saree detailed with silver thread borders and embroidery."
  },
  {
    id: 'prod-catalog-12',
    name: "Crimson Heritage",
    category: "Festive Glow",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Wedding",
    price: 29500,
    oldPrice: 34000,
    rating: 4.9,
    tag: "BESTSELLER",
    image: "/Images/silk sarees/42243c06-83ff-4105-9e2b-8326c2cb82fd_1aa.jpg",
    description: "Deep crimson Banarasi silk saree handwoven with dense gold zari and floral scroll patterns.",
    isPreorder: true,
    deposit: 5000
  },
  {
    id: 'prod-catalog-13',
    name: "Mint Charm",
    category: "Everyday Elegance",
    fabric: "Cotton",
    color: "#004D40",
    occasion: "Festival",
    price: 4200,
    oldPrice: 5500,
    rating: 4.6,
    tag: "NEW ARRIVAL",
    image: "/Images/cotton saree/13f0796b-f293-4f56-b952-a68ff4103e74_5aaa.jpg",
    description: "Cool mint green handloom cotton saree with fine striped pallu and borders."
  },
  {
    id: 'prod-catalog-14',
    name: "Ivory Symphony",
    category: "Festive Glow",
    fabric: "Pure Silk",
    color: "#C8A34D",
    occasion: "Wedding",
    price: 48000,
    oldPrice: 55000,
    rating: 5.0,
    tag: "BESTSELLER",
    image: "/Images/silk sarees/843110c7-a279-42ef-aa3d-7e3d2db55af9_3.jpg",
    description: "Premium ivory Kanchipuram silk saree featuring exquisite double-warp gold zari and floral patterns.",
    isPreorder: true,
    deposit: 5000
  },
  {
    id: 'prod-catalog-15',
    name: "Marigold Breeze",
    category: "Everyday Elegance",
    fabric: "Cotton",
    color: "#C8A34D",
    occasion: "Traditional",
    price: 6500,
    oldPrice: 7800,
    rating: 4.5,
    tag: "NEW ARRIVAL",
    image: "/Images/cotton saree/27370253-a11c-48e4-a346-4490675619f9_lg1.jpg",
    description: "Vibrant yellow handloom cotton drape, breathable and light with traditional motif details."
  },
  {
    id: 'prod-catalog-16',
    name: "Coral Petals",
    category: "Style Studio",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Reception",
    price: 15200,
    oldPrice: 18000,
    rating: 4.8,
    tag: "BESTSELLER",
    image: "/Images/Fancy Sarees/3a4308ae-3fba-4f36-9e14-a674ded902d0_4.jpg",
    description: "Stunning coral pink handloom pure silk saree with silver-gold borders and modern elements."
  },
  {
    id: 'prod-catalog-17',
    name: "Indigo Weave",
    category: "Black Magic",
    fabric: "Pure Silk",
    color: "#1A237E",
    occasion: "Festival",
    price: 18900,
    oldPrice: 22000,
    rating: 4.9,
    tag: "BESTSELLER",
    image: "/Images/black magic collection/8020f4c5-a121-45dc-b191-92d8291154e5_2.webp",
    description: "Deep indigo blue Banarasi silk saree with silver butis and elegant brocade border."
  },
  {
    id: 'prod-catalog-18',
    name: "Orchid Glow",
    category: "Everyday Elegance",
    fabric: "Organza",
    color: "#6B102A",
    occasion: "Party Wear",
    price: 9800,
    oldPrice: 12000,
    rating: 4.7,
    tag: "NEW ARRIVAL",
    image: "/Images/cotton saree/3235bee8-b44b-420a-959a-85f821aca634_1.jpg",
    description: "Premium orchid organza drape detailed with gold border lines and thread work."
  },
  {
    id: 'prod-catalog-19',
    name: "Golden Azure",
    category: "Festive Glow",
    fabric: "Pure Silk",
    color: "#C8A34D",
    occasion: "Wedding",
    price: 34500,
    oldPrice: 38000,
    rating: 4.8,
    tag: "BESTSELLER",
    image: "/Images/silk sarees/42243c06-83ff-4105-9e2b-8326c2cb82fd_1aa.jpg",
    description: "Exquisite blue and gold pure silk saree, perfect for grand wedding celebrations."
  },
  {
    id: 'prod-catalog-20',
    name: "Emerald Night",
    category: "Black Magic",
    fabric: "Tussar",
    color: "#004D40",
    occasion: "Reception",
    price: 18500,
    oldPrice: 21000,
    rating: 4.9,
    tag: "BESTSELLER",
    image: "/Images/black magic collection/dc8f7413-52de-45df-ae2b-f583cd625a37_Black.webp",
    description: "Deep dark emerald green silk with striking silver motifs for a bold look."
  },
  {
    id: 'prod-catalog-21',
    name: "Ruby Charm",
    category: "Everyday Elegance",
    fabric: "Cotton",
    color: "#6B102A",
    occasion: "Traditional",
    price: 5200,
    oldPrice: 6500,
    rating: 4.6,
    tag: "NEW ARRIVAL",
    image: "/Images/cotton saree/0515ac1b-a928-4af5-a71c-7f5e033614e0_3aa.jpg",
    description: "Lightweight ruby red cotton handloom saree with delicate temple borders."
  },
  {
    id: 'prod-catalog-22',
    name: "Silver Mist",
    category: "Style Studio",
    fabric: "Organza",
    color: "#1A237E",
    occasion: "Party Wear",
    price: 11200,
    oldPrice: 14000,
    rating: 4.7,
    tag: "NEW ARRIVAL",
    image: "/Images/Fancy Sarees/362972a8-7932-4b84-b81a-070deec393c8_5.jpg",
    description: "Ethereal silver and grey organza saree with minimal modern designs."
  },
  {
    id: 'prod-catalog-23',
    name: "Autumn Leaves",
    category: "Festive Glow",
    fabric: "Tussar",
    color: "#C8A34D",
    occasion: "Festival",
    price: 13500,
    oldPrice: 16000,
    rating: 4.5,
    tag: "BESTSELLER",
    image: "/Images/silk sarees/1546f1f8-5935-4aaf-b254-aa03321c05d8_love2.jpg",
    description: "Warm rustic orange tussar silk saree with earthy leaf motifs."
  },
  {
    id: 'prod-catalog-24',
    name: "Midnight Sparkle",
    category: "Black Magic",
    fabric: "Pure Silk",
    color: "#1A237E",
    occasion: "Party Wear",
    price: 21500,
    oldPrice: 24000,
    rating: 4.9,
    tag: "BESTSELLER",
    image: "/Images/black magic collection/8020f4c5-a121-45dc-b191-92d8291154e5_2.webp",
    description: "Midnight black silk adorned with sparkling gold zari for a mesmerizing effect.",
    isPreorder: true,
    deposit: 5000
  },
  {
    id: 'prod-catalog-25',
    name: "Rose Blush",
    category: "Style Studio",
    fabric: "Organza",
    color: "#6B102A",
    occasion: "Reception",
    price: 9500,
    oldPrice: 12000,
    rating: 4.8,
    image: "/Images/Fancy Sarees/3a4308ae-3fba-4f36-9e14-a674ded902d0_4.jpg",
    description: "Delicate blush pink organza saree perfect for modern celebrations."
  },
  {
    id: 'prod-catalog-26',
    name: "Ocean Breeze",
    category: "Everyday Elegance",
    fabric: "Cotton",
    color: "#1A237E",
    occasion: "Traditional",
    price: 4800,
    oldPrice: 5500,
    rating: 4.6,
    tag: "NEW ARRIVAL",
    image: "/Images/cotton saree/27370253-a11c-48e4-a346-4490675619f9_lg1.jpg",
    description: "Cool blue handloom cotton saree that offers comfort and style all day long."
  },
  {
    id: 'prod-catalog-27',
    name: "Royal Heritage",
    category: "Festive Glow",
    fabric: "Pure Silk",
    color: "#6B102A",
    occasion: "Wedding",
    price: 45000,
    oldPrice: 50000,
    rating: 5.0,
    tag: "BESTSELLER",
    image: "/Images/silk sarees/843110c7-a279-42ef-aa3d-7e3d2db55af9_3.jpg",
    description: "Heavily woven Kanchipuram silk saree with rich red and gold royal patterns."
  },
  {
    id: 'prod-catalog-28',
    name: "Mint Magic",
    category: "Everyday Elegance",
    fabric: "Cotton",
    color: "#004D40",
    occasion: "Festival",
    price: 4200,
    oldPrice: 5000,
    rating: 4.5,
    image: "/Images/cotton saree/13f0796b-f293-4f56-b952-a68ff4103e74_5aaa.jpg",
    description: "Soothing mint green cotton drape ideal for festive daytime events."
  },
  {
    id: 'prod-catalog-29',
    name: "Obsidian Charm",
    category: "Black Magic",
    fabric: "Tussar",
    color: "#1A237E",
    occasion: "Reception",
    price: 15600,
    oldPrice: 18000,
    rating: 4.8,
    tag: "BESTSELLER",
    image: "/Images/black magic collection/449a74ba-b1da-4dd6-8944-8c2abd5fabe0_1.webp",
    description: "Sleek black tussar saree with subtle sheen and elegant drape."
  },
  {
    id: 'prod-catalog-30',
    name: "Pearl White",
    category: "Style Studio",
    fabric: "Pure Silk",
    color: "#C8A34D",
    occasion: "Wedding",
    price: 25000,
    oldPrice: 28000,
    rating: 4.9,
    tag: "NEW ARRIVAL",
    image: "/Images/Fancy Sarees/17f37732-5f2a-4c83-8505-8f115aa31f16_2.jpg",
    description: "Pristine white silk combined with subtle golden highlights for a classic finish."
  }
];

const CATEGORY_CONTENT = {
  'All': {
    title: 'The Masterpiece Collection',
    description: 'Explore our curated anthology of premium handloom luxury. From breathless cottons for daily grace to majestic silks for your grandest moments, discover drapes that speak your style.'
  },
  'Everyday Elegance': {
    title: 'Pure Cotton Elegance',
    description: 'Breathe easy in our meticulously handwoven cotton sarees designed for seamless day-to-night transitions. Experience unmatched comfort without ever compromising on your sophisticated everyday style.'
  },
  'Festive Glow': {
    title: 'Heritage Silk Weaves',
    description: 'Illuminate your celebrations with our exquisite collection of pure silk sarees. Woven with rich traditional zari motifs, these radiant drapes are destined to make you the center of attention.'
  },
  'Style Studio': {
    title: 'Fancy Drapes',
    description: 'Step into the spotlight with our trending, fashion-forward saree silhouettes. Featuring modern patterns and unique textures, this collection is crafted for the bold, contemporary woman.'
  },
  'Black Magic': {
    title: 'The Black Magic Edit',
    description: 'Embrace the midnight allure with our exclusive range of stunning black sarees. Dark, sophisticated, and deeply glamorous—these masterpieces are tailored for your most unforgettable evening events.'
  }
};

export const Catalog = ({ activeFilter, setActiveFilter, setCurrentTab, setSelectedProduct }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(ALL_PRODUCTS);
  
  // States matching filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50000);
  const [selectedSort, setSelectedSort] = useState('featured');
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('boutique_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const checkWishlist = () => {
      const saved = localStorage.getItem('boutique_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    };
    window.addEventListener('storage', checkWishlist);
    return () => window.removeEventListener('storage', checkWishlist);
  }, []);

  useEffect(() => {
    if (!isSortOpen && !isAvailabilityOpen) return;
    const closeDropdown = () => {
      setIsSortOpen(false);
      setIsAvailabilityOpen(false);
    };
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [isSortOpen, isAvailabilityOpen]);

  const handleProductClick = (product) => {
    if (setSelectedProduct && setCurrentTab) {
      setSelectedProduct(product);
      setCurrentTab('product-detail');
    }
  };

  // Sync state with activeFilter props (from Navbar links)
  useEffect(() => {
    if (activeFilter.category) {
      setSelectedCategory(activeFilter.category);
    } else {
      setSelectedCategory('All');
    }
    

  }, [activeFilter]);

  // Handle product filtering & sorting logic
  useEffect(() => {
    let filtered = [...ALL_PRODUCTS];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.fabric.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Fabric
    if (selectedFabric && selectedFabric !== 'All') {
      filtered = filtered.filter(p => p.fabric.toLowerCase() === selectedFabric.toLowerCase());
    }

    // Filter by Availability
    if (selectedAvailability !== 'All') {
      if (selectedAvailability === 'In Stock') {
        filtered = filtered.filter(p => p.inStock !== false);
      } else if (selectedAvailability === 'Out of Stock') {
        filtered = filtered.filter(p => p.inStock === false);
      }
    }

    // Filter by Max Price
    filtered = filtered.filter(p => p.price <= maxPrice);

    // Sort Logic
    if (selectedSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'alpha-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'alpha-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (selectedSort === 'best-selling') {
      filtered.sort((a, b) => b.rating - a.rating); // using rating as a proxy for best selling
    } else if (selectedSort === 'date-old') {
      filtered.sort((a, b) => ALL_PRODUCTS.indexOf(a) - ALL_PRODUCTS.indexOf(b));
    } else if (selectedSort === 'date-new') {
      filtered.sort((a, b) => ALL_PRODUCTS.indexOf(b) - ALL_PRODUCTS.indexOf(a));
    } else if (selectedSort === 'featured' || selectedSort === 'relevant') {
      filtered.sort((a, b) => ALL_PRODUCTS.indexOf(a) - ALL_PRODUCTS.indexOf(b));
    }

    setProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, selectedFabric, selectedAvailability, maxPrice, selectedSort, searchQuery]);

  // Calculate paginated products for rendering
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      document.getElementById('catalog-products-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleShareClick = (e, product) => {
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${product.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description || `Check out ${product.name} at Mazhai Vaanam!`,
        url: productUrl,
      })
      .catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(productUrl)
        .then(() => {
          window.dispatchEvent(new CustomEvent('show-toast', { 
            detail: { message: `Link to "${product.name}" copied to clipboard!` } 
          }));
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  const handleAddToWishlist = (product) => {
    const saved = localStorage.getItem('boutique_wishlist');
    let wishlistItems = saved ? JSON.parse(saved) : [];
    const isWishlisted = wishlistItems.some(w => w.id === product.id);
    
    if (isWishlisted) {
      // Toggle off
      wishlistItems = wishlistItems.filter(w => w.id !== product.id);
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Removed "${product.name}" from Wishlist` } }));
    } else {
      // Toggle on
      wishlistItems.push(product);
      localStorage.setItem('boutique_wishlist', JSON.stringify(wishlistItems));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Saved "${product.name}" to Wishlist!` } }));
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedFabric('All');
    setSelectedAvailability('All');
    setMaxPrice(50000);
    setSelectedSort('featured');
    setSearchQuery('');
    if (setActiveFilter) {
      setActiveFilter({ category: '', occasion: '', label: 'All Collections' });
    }
  };

  const handleWeaveClick = (cat) => {
    setSelectedFabric('All');
    setSelectedAvailability('All');
    setMaxPrice(50000);
    setSelectedSort('featured');
    setSearchQuery('');
    if (setActiveFilter) {
      setActiveFilter({ category: cat, occasion: '', label: cat });
    } else {
      setSelectedCategory(cat);
    }
    
    setTimeout(() => {
      document.getElementById('catalog-products-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className={styles['catalog-page-container']}>
      


      {/* 2. Signature Weaves Section */}
      <section className={styles['signature-weaves-section']} id="catalog-explore-anchor">
        <div className={styles['section-header']}>
          <h2>Our Signature Weaves</h2>
        </div>
        <div className={styles['weave-cards-container']}>
          <div className={styles['weave-card']} onClick={() => handleWeaveClick('Everyday Elegance')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-silk']}`}>
              <img src="/Images/cotton3.jpg" alt="Everyday Elegance" />
            </div>
            <p>EVERYDAY ELEGANCE</p>
          </div>

          <div className={styles['weave-card']} onClick={() => handleWeaveClick('Festive Glow')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-cotton']}`}>
              <img src="/Images/silk.webp" alt="Festive Glow" />
            </div>
            <p>FESTIVE GLOW</p>
          </div>

          <div className={styles['weave-card']} onClick={() => handleWeaveClick('Style Studio')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-banarasi']}`}>
              <img src="/Images/fancy.jpg" alt="Style Studio" />
            </div>
            <p>STYLE STUDIO</p>
          </div>

          <div className={styles['weave-card']} onClick={() => handleWeaveClick('Black Magic')}>
            <div className={`${styles['weave-image-frame']} ${styles['frame-organza']}`}>
              <img src="/Images/black.jpg" alt="Black Magic" />
            </div>
            <p>BLACK MAGIC</p>
          </div>
        </div>
      </section>

      {/* 3. Sidebar Filters + Product Grid Layout */}
      <main id="catalog-products-section" className={styles['main-layout']}>
        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div 
            className={styles['mobile-filter-overlay']} 
            onClick={() => setIsMobileFilterOpen(false)} 
          />
        )}

        <aside className={`${styles['filters-sidebar']} ${isMobileFilterOpen ? styles['mobile-filter-open'] : ''}`}>
          <div className={styles['sticky-sidebar-content']}>
            <div className={styles['sidebar-header-mobile']}>
              <h2 className={styles['sidebar-title']}>Refine Selection</h2>
              <button 
                className={styles['close-filter-btn']}
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <p className={styles['sidebar-subtitle']}>Curated for elegance</p>

            <div className={styles['space-y-6']}>
              {/* Quick Discover Links */}
              <div className={styles['quick-links-menu']}>
                <div role="button" className={styles['quick-link-item']} onClick={() => setCurrentTab && setCurrentTab('best-sellers')}>
                  <span>Best Sellers</span>
                  <ArrowRight size={16} className={styles['quick-link-icon']} />
                </div>
                <div role="button" className={styles['quick-link-item']} onClick={() => setCurrentTab && setCurrentTab('new-arrivals')}>
                  <span>New Arrivals</span>
                  <ArrowRight size={16} className={styles['quick-link-icon']} />
                </div>
                <div role="button" className={styles['quick-link-item']} onClick={() => setCurrentTab && setCurrentTab('limited-offer')}>
                  <span>Limited Offer</span>
                  <ArrowRight size={16} className={styles['quick-link-icon']} />
                </div>
                <div role="button" className={styles['quick-link-item']} onClick={() => setCurrentTab && setCurrentTab('pre-booking')}>
                  <span>Pre-Booking</span>
                  <ArrowRight size={16} className={styles['quick-link-icon']} />
                </div>
              </div>

              {/* Collection Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">texture</span>
                    <h4>Collection</h4>
                  </div>
                </div>
                <div className={styles['fabric-tags']}>
                  {['All', 'Everyday Elegance', 'Festive Glow', 'Style Studio', 'Black Magic'].map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setSelectedCategory(cat)}
                      className={`${styles['tag-btn']} ${selectedCategory === cat ? styles['active-tag'] : ''}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">inventory_2</span>
                    <h4>Availability</h4>
                  </div>
                </div>
                <div style={{ padding: '8px 0', position: 'relative' }}>
                  <button
                    className={styles['dropdown-trigger-btn']}
                    style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px', border: '1px solid var(--border-color)', backgroundColor: 'transparent' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAvailabilityOpen(!isAvailabilityOpen);
                    }}
                    type="button"
                  >
                    <span>
                      {selectedAvailability === 'All' && 'All Status'}
                      {selectedAvailability === 'In Stock' && 'In Stock'}
                      {selectedAvailability === 'Out of Stock' && 'Out of Stock'}
                    </span>
                    <ChevronDown size={14} className={`${styles['chevron-icon']} ${isAvailabilityOpen ? styles['open'] : ''}`} />
                  </button>
                  {isAvailabilityOpen && (
                    <div className={styles['dropdown-options-menu']} style={{ width: '100%', top: '100%', marginTop: '4px', left: 0 }}>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedAvailability === 'All' ? styles['active'] : ''}`}
                        onClick={() => setSelectedAvailability('All')}
                        type="button"
                      >
                        All Status
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedAvailability === 'In Stock' ? styles['active'] : ''}`}
                        onClick={() => setSelectedAvailability('In Stock')}
                        type="button"
                      >
                        In Stock
                      </button>
                      <button
                        className={`${styles['dropdown-option-item']} ${selectedAvailability === 'Out of Stock' ? styles['active'] : ''}`}
                        onClick={() => setSelectedAvailability('Out of Stock')}
                        type="button"
                      >
                        Out of Stock
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Range Filter Widget */}
              <div className={styles['filter-widget']}>
                <div className={styles['filter-widget-header']}>
                  <div className={styles['widget-title-box']}>
                    <span className="material-symbols-outlined">payments</span>
                    <h4>Price Range</h4>
                  </div>
                </div>
                <div style={{ padding: '16px 0 8px 0' }}>
                  <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    step="1000" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--primary)' }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '12px', 
                    fontSize: '13px', 
                    color: 'var(--text-muted)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: '500'
                  }}>
                    <span>₹0</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Up to ₹{maxPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            <button className={styles['reset-all-btn']} onClick={handleResetFilters}>
              RESET ALL
            </button>
          </div>
        </aside>

        {/* Right side: Product Grid */}
        <section className={styles['products-panel']}>
          {/* Dynamic Category Content Banner */}
          <div className={styles['category-content-banner']}>
            <h2 className={styles['category-content-title']}>
              {CATEGORY_CONTENT[selectedCategory]?.title || selectedCategory}
            </h2>
            <div className={styles['category-divider']}></div>
            <p className={styles['category-content-description']}>
              {CATEGORY_CONTENT[selectedCategory]?.description || ''}
            </p>
          </div>

          <div className={styles['products-header']}>
            <div className={styles['products-header-left']}>
              <p>Showing {products.length} of {ALL_PRODUCTS.length} Masterpieces</p>
              <button 
                className={styles['mobile-filter-toggle']} 
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <Filter size={16} /> Filter & Sort
              </button>
            </div>
            
            <div className={styles['header-search-box']}>
              <Search size={16} className={styles['search-icon']} />
              <input 
                type="text" 
                placeholder="Search masterpieces..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles['search-input']}
              />
              {searchQuery && (
                <div 
                  onClick={() => setSearchQuery('')}
                  className={styles['search-clear-icon']}
                  role="button"
                >
                  ✕
                </div>
              )}
            </div>

            <div className={styles['sort-selector']}>
              <span>SORT BY:</span>
              <div className={styles['custom-dropdown-container']}>
                <button 
                  className={styles['dropdown-trigger-btn']} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSortOpen(!isSortOpen);
                  }}
                  type="button"
                >
                  {selectedSort === 'featured' && 'Featured'}
                  {selectedSort === 'relevant' && 'Most relevant'}
                  {selectedSort === 'best-selling' && 'Best selling'}
                  {selectedSort === 'alpha-asc' && 'Alphabetically, A-Z'}
                  {selectedSort === 'alpha-desc' && 'Alphabetically, Z-A'}
                  {selectedSort === 'price-low' && 'Price, low to high'}
                  {selectedSort === 'price-high' && 'Price, high to low'}
                  {selectedSort === 'date-old' && 'Date, old to new'}
                  {selectedSort === 'date-new' && 'Date, new to old'}
                  <ChevronDown size={14} className={`${styles['chevron-icon']} ${isSortOpen ? styles['open'] : ''}`} />
                </button>
                {isSortOpen && (
                  <div className={styles['dropdown-options-menu']}>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'featured' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('featured');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Featured
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'relevant' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('relevant');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Most relevant
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'best-selling' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('best-selling');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Best selling
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'alpha-asc' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('alpha-asc');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Alphabetically, A-Z
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'alpha-desc' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('alpha-desc');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Alphabetically, Z-A
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'price-low' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('price-low');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Price, low to high
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'price-high' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('price-high');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Price, high to low
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'date-old' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('date-old');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Date, old to new
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'date-new' ? styles['active'] : ''}`}
                      onClick={() => {
                        setSelectedSort('date-new');
                        setIsSortOpen(false);
                      }}
                      type="button"
                    >
                      Date, new to old
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'Inter, sans-serif' }}>
              <h3 style={{ color: 'var(--primary)', fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px' }}>No masterpieces match your filters.</h3>
              <p style={{ color: '#7D756D', margin: '10px 0 20px 0' }}>Try adjusting your sidebar criteria or click Reset All.</p>
              <button className={styles['reset-all-btn']} style={{ width: 'auto', padding: '12px 30px' }} onClick={handleResetFilters}>
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className={styles['products-grid']}>
                {currentProducts.map((product) => {
                  const isWishlisted = wishlist.some(w => w.id === product.id);
                  return (
                    <div key={product.id} className={styles['product-card']}>
                      {product.oldPrice && (
                        <span className={styles['offer-badge']}>
                          <span className={styles['offer-value']}>{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</span>
                          <span className={styles['offer-text']}>OFF</span>
                        </span>
                      )}
                      <div 
                        className={styles['image-container']} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleProductClick(product)}
                      >
                        <img src={product.image} alt={product.name} loading="lazy" />
                        {product.tag && (
                          <span className={`${styles['badge-tag']} ${getBadgeClass(product.tag)}`}>{product.tag}</span>
                        )}
                        <div 
                          className={styles['share-btn']}
                          onClick={(e) => handleShareClick(e, product)}
                          role="button"
                          title="Share Product"
                        >
                          <Share2 
                            size={16} 
                            stroke="var(--primary-dark)" 
                          />
                        </div>

                        <div 
                          className={styles['wishlist-btn']} 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(product);
                          }}
                          role="button"
                          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart 
                            size={16} 
                            fill={isWishlisted ? "#e63946" : "none"} 
                            stroke={isWishlisted ? "#e63946" : "var(--primary-dark)"} 
                          />
                        </div>
                      </div>
                      <div className={styles['card-details']}>
                        <div className={styles['title-row']}>
                          <h4 
                            style={{ cursor: 'pointer' }} 
                            onClick={() => handleProductClick(product)}
                          >
                            {product.name}
                          </h4>
                          {product.rating && (
                            <div className={styles['rating-badge-inline']}>
                              <Star size={10} fill="#B38A4A" stroke="#B38A4A" />
                              <span>{product.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>

                        {/* Product Description */}
                        {product.description && (
                          <p className={styles['product-description']}>
                            {product.description}
                          </p>
                        )}

                        <div className={styles['price-row']}>
                          <span className={styles['current-price']}>{formatCurrency(product.price)}</span>
                          {product.oldPrice && (
                            <span className={styles['old-price']}>{formatCurrency(product.oldPrice)}</span>
                          )}
                        </div>
                        <button 
                          className={styles['add-cart-btn']}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles['pagination']}>
                  <button 
                    className={styles['pagination-arrow']} 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <div className={styles['pagination-pages']}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <span 
                        key={idx} 
                        className={`${styles['page-num']} ${currentPage === idx + 1 ? styles['active-page'] : ''}`}
                        onClick={() => handlePageChange(idx + 1)}
                        style={{ cursor: 'pointer' }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                  <button 
                    className={styles['pagination-arrow']} 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* 5. Newsletter Section */}
      <section className={styles['newsletter-section']}>
        <div className={styles['newsletter-box']}>
          <h3>Join the Family</h3>
          <p>Subscribe to receive updates on new collections, private events, and the stories behind our weaves.</p>
          <form className={styles['newsletter-form']} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="YOUR EMAIL ADDRESS" required />
            <button type="submit" className={styles['newsletter-submit-btn']}>SUBSCRIBE</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Catalog;
