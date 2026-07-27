import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { Heart, Star, ChevronDown, Search } from 'lucide-react';
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-hN0onELnDgdOswyfAzJdw98YnefT7Zi-Dt0g7IxzqYuKK0TaBE4ZTit86sthNhhHWaETP5U6EPkJdQ2TF8NiA7csqXaXCMDhY3VfyoT7yodibzxkenJWfVDdPFIj9YQwTe_B2qlA3e4Sg8KUXPv4QX9GkevPmAgmVVpnY1xGSJkIONEBGz60tPRpNkxygpulKi7xC5gVJ_NCnFJG5nHKVTU98HQAfzC7nM8QYjmgbIyBBYSsnJFz",
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
    tag: "ON THE LOOM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1gzWEB9tKWsjoudWNb3uApBhCDiPTe9M1N6lnbt5UlryqNZaDDCJ8tb4LpOZS3_Q_f3ai28aCck4TTiRvoW6rCLqG9z1MjEjojxWwCDsU5oehBjjZEL6UZBCOtrTrsrJT3cZGJ3rrgRrbu1lbSKpbMJ5GHQ2uffEq5JqZ_7clzRy6vknPvSSzVkFqaC08HUPLxpQbswti0TkQQCUl6LopJnDFIkxphZNhU5XYWEa2AjlwakWy0rtm",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF4Gjm9ZQy_Uo8x8iFNdXcHWVbQYj7RFZy8iHoTa9vqETSoS0ARIitWgDX2BAgU5h9s6Fim9rxkLSx0iOmVfYMDI3x_TllHFpCL_M2VHJn9-nWBsoGA4QyzxeXqQGHq6nTPl0ixsA7yhWUAxcbIYEfUwsz0KYDdPC07CdWJcQVB2-pRVeVC-YZWYz0m7-wRD-IdZdnILIfySa0mOQTk9RmzUgbCvZfHUbUrrdPXzADP522ac3h7lO_",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99n9r4dbP7WA7__f11wrB_Ipn6Q7GJSe8zMy54tocsgng5Z1Lpt40VzWbYoU1eR2drwe6bdmrWtZUkRPdbQGsUCWo1IBvdJJwiiQ4Sv9ncSwDIKofKTG8qx4YEiYlvuIv_XgQ6B2Z4xVVVvquVHEiV4BznQPCbp8fgL9DgvHqKdq45bT_Yy_gbfOWsdfybCeY0bzHqWfgyJH519MupLNrDTaOzaeGV9f5ckgTYE_FLmrqEByj3pLr",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4EfBPaPdPDqLR-Rynn0CdBpWEu5GnScNJ0P7TcAJMUlneT5ULxMjW7no9g7oggZiGPQ_3RDBuC6F4hB30FN4kRf8Ixqc9AcAwCWKHDSAiow5UiSsA23QSTL1nh_7CTPoHcZfJS1Fs-mg4CnhazB4V0JNBiMxr9oWd4za5pzvZpMWiQfGSJcLGgPTOGhCh0zcpjE_-fuCyNYUOU9a8sTqqdjJVFqG_TVvJInGjJ0cNzraqo3w3JOGR",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-hN0onELnDgdOswyfAzJdw98YnefT7Zi-Dt0g7IxzqYuKK0TaBE4ZTit86sthNhhHWaETP5U6EPkJdQ2TF8NiA7csqXaXCMDhY3VfyoT7yodibzxkenJWfVDdPFIj9YQwTe_B2qlA3e4Sg8KUXPv4QX9GkevPmAgmVVpnY1xGSJkIONEBGz60tPRpNkxygpulKi7xC5gVJ_NCnFJG5nHKVTU98HQAfzC7nM8QYjmgbIyBBYSsnJFz",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1gzWEB9tKWsjoudWNb3uApBhCDiPTe9M1N6lnbt5UlryqNZaDDCJ8tb4LpOZS3_Q_f3ai28aCck4TTiRvoW6rCLqG9z1MjEjojxWwCDsU5oehBjjZEL6UZBCOtrTrsrJT3cZGJ3rrgRrbu1lbSKpbMJ5GHQ2uffEq5JqZ_7clzRy6vknPvSSzVkFqaC08HUPLxpQbswti0TkQQCUl6LopJnDFIkxphZNhU5XYWEa2AjlwakWy0rtm",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF4Gjm9ZQy_Uo8x8iFNdXcHWVbQYj7RFZy8iHoTa9vqETSoS0ARIitWgDX2BAgU5h9s6Fim9rxkLSx0iOmVfYMDI3x_TllHFpCL_M2VHJn9-nWBsoGA4QyzxeXqQGHq6nTPl0ixsA7yhWUAxcbIYEfUwsz0KYDdPC07CdWJcQVB2-pRVeVC-YZWYz0m7-wRD-IdZdnILIfySa0mOQTk9RmzUgbCvZfHUbUrrdPXzADP522ac3h7lO_",
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
    tag: "ON THE LOOM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99n9r4dbP7WA7__f11wrB_Ipn6Q7GJSe8zMy54tocsgng5Z1Lpt40VzWbYoU1eR2drwe6bdmrWtZUkRPdbQGsUCWo1IBvdJJwiiQ4Sv9ncSwDIKofKTG8qx4YEiYlvuIv_XgQ6B2Z4xVVVvquVHEiV4BznQPCbp8fgL9DgvHqKdq45bT_Yy_gbfOWsdfybCeY0bzHqWfgyJH519MupLNrDTaOzaeGV9f5ckgTYE_FLmrqEByj3pLr",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkRuajLDcBWPazr6lv5c906qF0pGWB4-Ke1cY7Qc8LFWNUDGlM9MNsyuVAK0B81OaDi7a3eX5PWLvar4UFlcXzFx4T6i9mYoZh8zFPHjbz_jJt7XkBwKgO4LVbEI45hkE3Fu4G8IBh2ls5xV7ThxPW06QCHp43P2GvOXaFJW2FNHZJr5sQFJbSWWX1qSMsS7YGQGCMc-VawrfXqWOQwiXMpM7C4tbBmlD5coSua7GF66oDsIY1_ASD",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99n9r4dbP7WA7__f11wrB_Ipn6Q7GJSe8zMy54tocsgng5Z1Lpt40VzWbYoU1eR2drwe6bdmrWtZUkRPdbQGsUCWo1IBvdJJwiiQ4Sv9ncSwDIKofKTG8qx4YEiYlvuIv_XgQ6B2Z4xVVVvquVHEiV4BznQPCbp8fgL9DgvHqKdq45bT_Yy_gbfOWsdfybCeY0bzHqWfgyJH519MupLNrDTaOzaeGV9f5ckgTYE_FLmrqEByj3pLr",
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
    tag: "ON THE LOOM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF4Gjm9ZQy_Uo8x8iFNdXcHWVbQYj7RFZy8iHoTa9vqETSoS0ARIitWgDX2BAgU5h9s6Fim9rxkLSx0iOmVfYMDI3x_TllHFpCL_M2VHJn9-nWBsoGA4QyzxeXqQGHq6nTPl0ixsA7yhWUAxcbIYEfUwsz0KYDdPC07CdWJcQVB2-pRVeVC-YZWYz0m7-wRD-IdZdnILIfySa0mOQTk9RmzUgbCvZfHUbUrrdPXzADP522ac3h7lO_",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1gzWEB9tKWsjoudWNb3uApBhCDiPTe9M1N6lnbt5UlryqNZaDDCJ8tb4LpOZS3_Q_f3ai28aCck4TTiRvoW6rCLqG9z1MjEjojxWwCDsU5oehBjjZEL6UZBCOtrTrsrJT3cZGJ3rrgRrbu1lbSKpbMJ5GHQ2uffEq5JqZ_7clzRy6vknPvSSzVkFqaC08HUPLxpQbswti0TkQQCUl6LopJnDFIkxphZNhU5XYWEa2AjlwakWy0rtm",
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
    tag: "ON THE LOOM",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkRuajLDcBWPazr6lv5c906qF0pGWB4-Ke1cY7Qc8LFWNUDGlM9MNsyuVAK0B81OaDi7a3eX5PWLvar4UFlcXzFx4T6i9mYoZh8zFPHjbz_jJt7XkBwKgO4LVbEI45hkE3Fu4G8IBh2ls5xV7ThxPW06QCHp43P2GvOXaFJW2FNHZJr5sQFJbSWWX1qSMsS7YGQGCMc-VawrfXqWOQwiXMpM7C4tbBmlD5coSua7GF66oDsIY1_ASD",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1gzWEB9tKWsjoudWNb3uApBhCDiPTe9M1N6lnbt5UlryqNZaDDCJ8tb4LpOZS3_Q_f3ai28aCck4TTiRvoW6rCLqG9z1MjEjojxWwCDsU5oehBjjZEL6UZBCOtrTrsrJT3cZGJ3rrgRrbu1lbSKpbMJ5GHQ2uffEq5JqZ_7clzRy6vknPvSSzVkFqaC08HUPLxpQbswti0TkQQCUl6LopJnDFIkxphZNhU5XYWEa2AjlwakWy0rtm",
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
    tag: "NEW ARRIVAL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-hN0onELnDgdOswyfAzJdw98YnefT7Zi-Dt0g7IxzqYuKK0TaBE4ZTit86sthNhhHWaETP5U6EPkJdQ2TF8NiA7csqXaXCMDhY3VfyoT7yodibzxkenJWfVDdPFIj9YQwTe_B2qlA3e4Sg8KUXPv4QX9GkevPmAgmVVpnY1xGSJkIONEBGz60tPRpNkxygpulKi7xC5gVJ_NCnFJG5nHKVTU98HQAfzC7nM8QYjmgbIyBBYSsnJFz",
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
    tag: "NEW ARRIVAL",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF4Gjm9ZQy_Uo8x8iFNdXcHWVbQYj7RFZy8iHoTa9vqETSoS0ARIitWgDX2BAgU5h9s6Fim9rxkLSx0iOmVfYMDI3x_TllHFpCL_M2VHJn9-nWBsoGA4QyzxeXqQGHq6nTPl0ixsA7yhWUAxcbIYEfUwsz0KYDdPC07CdWJcQVB2-pRVeVC-YZWYz0m7-wRD-IdZdnILIfySa0mOQTk9RmzUgbCvZfHUbUrrdPXzADP522ac3h7lO_",
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB99n9r4dbP7WA7__f11wrB_Ipn6Q7GJSe8zMy54tocsgng5Z1Lpt40VzWbYoU1eR2drwe6bdmrWtZUkRPdbQGsUCWo1IBvdJJwiiQ4Sv9ncSwDIKofKTG8qx4YEiYlvuIv_XgQ6B2Z4xVVVvquVHEiV4BznQPCbp8fgL9DgvHqKdq45bT_Yy_gbfOWsdfybCeY0bzHqWfgyJH519MupLNrDTaOzaeGV9f5ckgTYE_FLmrqEByj3pLr",
    description: "Premium orchid organza drape detailed with gold border lines and thread work."
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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const checkWishlist = () => {
      const saved = localStorage.getItem('boutique_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
    };
    window.addEventListener('storage', checkWishlist);
    return () => window.removeEventListener('storage', checkWishlist);
  }, []);

  useEffect(() => {
    if (!isSortOpen) return;
    const closeDropdown = () => setIsSortOpen(false);
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, [isSortOpen]);

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
  }, [selectedCategory, selectedFabric, selectedAvailability, maxPrice, selectedSort, searchQuery]);

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
  };

  return (
    <div className={styles['catalog-page-container']}>
      
      {/* Breadcrumb Section */}
      <div className={styles['breadcrumb-container']}>
        <span className={styles['breadcrumb-link']} onClick={() => window.location.href='/'}>Home</span>
        <span className={styles['breadcrumb-separator']}>/</span>
        <span className={selectedCategory === 'All' ? styles['breadcrumb-current'] : styles['breadcrumb-link']} onClick={handleResetFilters}>Shop</span>
        {selectedCategory !== 'All' && (
          <>
            <span className={styles['breadcrumb-separator']}>/</span>
            <span className={styles['breadcrumb-current']}>{selectedCategory}</span>
          </>
        )}
      </div>

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
      <main className={styles['main-layout']}>
        <aside className={styles['filters-sidebar']}>
          <div className={styles['sticky-sidebar-content']}>
            <h2 className={styles['sidebar-title']}>Refine Selection</h2>
            <p className={styles['sidebar-subtitle']}>Curated for elegance</p>

            <div className={styles['space-y-6']}>
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
                <div style={{ padding: '8px 0' }}>
                  <select 
                    value={selectedAvailability} 
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'transparent',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: '14px',
                      color: 'var(--text-main)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="All">All Status</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
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
                      onClick={() => setSelectedSort('featured')}
                      type="button"
                    >
                      Featured
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'relevant' ? styles['active'] : ''}`}
                      onClick={() => setSelectedSort('relevant')}
                      type="button"
                    >
                      Most relevant
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'best-selling' ? styles['active'] : ''}`}
                      onClick={() => setSelectedSort('best-selling')}
                      type="button"
                    >
                      Best selling
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'alpha-asc' ? styles['active'] : ''}`}
                      onClick={() => setSelectedSort('alpha-asc')}
                      type="button"
                    >
                      Alphabetically, A-Z
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'alpha-desc' ? styles['active'] : ''}`}
                      onClick={() => setSelectedSort('alpha-desc')}
                      type="button"
                    >
                      Alphabetically, Z-A
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'price-low' ? styles['active'] : ''}`}
                      onClick={() => setSelectedSort('price-low')}
                      type="button"
                    >
                      Price, low to high
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'price-high' ? styles['active'] : ''}`}
                      onClick={() => setSelectedSort('price-high')}
                      type="button"
                    >
                      Price, high to low
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'date-old' ? styles['active'] : ''}`}
                      onClick={() => setSelectedSort('date-old')}
                      type="button"
                    >
                      Date, old to new
                    </button>
                    <button
                      className={`${styles['dropdown-option-item']} ${selectedSort === 'date-new' ? styles['active'] : ''}`}
                      onClick={() => setSelectedSort('date-new')}
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
                {products.map((product) => {
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
                          <span className={styles['badge-tag']}>{product.tag}</span>
                        )}
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
                            fill={isWishlisted ? "var(--primary-dark)" : "none"} 
                            stroke="var(--primary-dark)" 
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
                          {product.isPreorder ? (
                            <span className={styles['preorder-badge-pill']}>Deposit: {formatCurrency(product.deposit)}</span>
                          ) : (
                            product.oldPrice && (
                              <>
                                <span className={styles['old-price']}>{formatCurrency(product.oldPrice)}</span>
                                <span className={styles['discount-pill']}>
                                  {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
                                </span>
                              </>
                            )
                          )}
                        </div>
                        <button 
                          className={product.isPreorder ? styles['preorder-btn'] : styles['add-cart-btn']}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (product.isPreorder) {
                              handleProductClick(product);
                            } else {
                              addToCart(product, 1);
                              window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: `Added "${product.name}" to Cart!` } }));
                            }
                          }}
                        >
                          {product.isPreorder ? 'PRE-BOOK NOW' : 'ADD TO CART'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className={styles['pagination']}>
                <button className={styles['pagination-arrow']} disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className={styles['pagination-pages']}>
                  <span className={`${styles['page-num']} ${styles['active-page']}`}>01</span>
                  <span className={styles['page-num']}>02</span>
                  <span className={styles['page-num']}>03</span>
                  <span className={styles['page-num']}>...</span>
                  <span className={styles['page-num']}>12</span>
                </div>
                <button className={styles['pagination-arrow']}>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      {/* 4. Curated Edit Section */}
      <section className={styles['curated-edit-section']}>
        <img 
          src="/Images/shop1.png" 
          alt="Curated Edit Background" 
          className={styles['curated-bg-image']}
        />
        <div className={styles['curated-container']}>
          <div className={styles['curated-image-box']}>
            <div className={styles['curated-image-frame']}>
              <img 
                src="/Images/shop2.png" 
                alt="Editorial Craftsmanship weaver loom closeup" 
              />
            </div>
          </div>
          <div className={styles['curated-info-box']}>
            <h2 className={styles['curated-label']}>THE CURATED EDIT</h2>
            <h3 className={styles['curated-heading']}>Masterpieces of the Monsoon Season</h3>
            <p className={styles['curated-desc']}>
              Each piece in our Curated Edit represents the pinnacle of artisanal skill. From the selection of the finest mulberry silk to the weeks of meticulous hand-weaving, these are more than sarees—they are heritage heirlooms crafted to last generations.
            </p>
            <div className={styles['curated-bullets']}>
              <p className={styles['bullet-item']}>✓ 100% AUTHENTIC HANDLOOM</p>
              <p className={styles['bullet-item']}>✓ SUSTAINABLY SOURCED FIBERS</p>
              <p className={styles['bullet-item']}>✓ CERTIFIED SILK MARK</p>
            </div>
            <button className={styles['story-btn']}>DISCOVER THE STORY →</button>
          </div>
        </div>
      </section>

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
