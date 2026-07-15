// Mock data representing items in a premium boutique
const PRODUCTS = [
  {
    id: 1,
    name: 'Kanjeevaram Silk Saree',
    category: 'Saree',
    price: 18500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'Exquisite handwoven Kanjeevaram pure silk saree with intricate gold zari work, traditional borders and rich pallu.',
    featured: true,
  },
  {
    id: 2,
    name: 'Royal Banarasi Saree',
    category: 'Saree',
    price: 24000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    description: 'Timeless Banarasi silk saree adorned with classic floral motifs and a grand gold border, perfect for wedding seasons.',
    featured: true,
  },
  {
    id: 3,
    name: 'Designer Silk Lehenga',
    category: 'Lehenga',
    price: 32000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    description: 'Elegant contemporary designer lehenga in dusty pink silk, featuring hand-embroidered sequin details and a soft net dupatta.',
    featured: true,
  },
  {
    id: 4,
    name: 'Anarkali Salwar Suit',
    category: 'Suits',
    price: 9500,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    description: 'Georgette Anarkali suit set with elaborate mirror embroidery, paired with a matching churidar and block-printed dupatta.',
    featured: false,
  },
  {
    id: 5,
    name: 'Handloom Cotton Saree',
    category: 'Saree',
    price: 4200,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80',
    description: 'Lightweight, breathable pure handloom cotton saree with minimalist borders and classic block patterns, ideal for daily elegance.',
    featured: false,
  },
  {
    id: 6,
    name: 'Pastel Embroidered Kurti',
    category: 'Kurti',
    price: 3500,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=600&q=80',
    description: 'Elegant cotton-silk blend kurti featuring intricate hand-embroidery around the neckline and sleeves.',
    featured: false,
  }
];

export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PRODUCTS);
    }, 400); // Simulate network latency
  });
};

export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = PRODUCTS.find((p) => p.id === parseInt(id));
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 300);
  });
};
