const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to normalize MongoDB product document to frontend UI format
 */
export function normalizeProduct(p) {
  if (!p) return null;
  const id = p._id || p.id;
  let image = p.images?.[0]?.url || p.image || '/Images/saree1.png';
  if (typeof image === 'string' && image.startsWith('blob:')) {
    image = '/Images/saree1.png';
  }
  const categoryName = typeof p.category === 'object' ? p.category?.name : (p.category || 'Handloom Sarees');
  const categorySlug = typeof p.category === 'object' ? p.category?.slug : (p.categorySlug || '');

  return {
    ...p,
    id: String(id),
    _id: String(id),
    image,
    category: categoryName,
    categoryName,
    categorySlug,
    price: Number(p.price || 0),
    oldPrice: Number(p.mrpPrice || p.oldPrice || p.price || 0),
    mrpPrice: Number(p.mrpPrice || p.oldPrice || p.price || 0),
    rating: Number(p.averageRating || p.rating || 4.8),
    fabric: p.fabric || 'Pure Silk',
    occasion: p.occasion || 'Traditional',
    color: typeof p.color === 'object' ? p.color?.hex || '#6B102A' : (p.color || '#6B102A'),
    colorName: typeof p.color === 'object' ? p.color?.name || '' : '',
    tag: p.tag || (p.isFeatured ? 'BESTSELLER' : ''),
    isPreorder: Boolean(p.isPreorder),
    deposit: p.preorderDeposit || 5000,
    progress: p.preorderProgress || 70,
    weaver: p.preorderWeaver || 'Master Weaver',
    estimatedDays: p.preorderEstimatedDays || 14,
    discount: p.preorderDiscount || (p.discountActive ? `${p.discount?.value}%` : ''),
  };
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('boutique_token') || localStorage.getItem('mv_admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({ success: false, message: 'Invalid response from server' }));

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('boutique_token');
      localStorage.removeItem('boutique_user');
    }

    let errorMsg = data.message || 'Request failed';
    if (data.errors && typeof data.errors === 'object') {
      const details = Object.values(data.errors).filter(Boolean).join('. ');
      if (details) {
        errorMsg = `${data.message ? data.message + ': ' : ''}${details}`;
      }
    }

    const err = new Error(errorMsg);
    err.status = res.status;
    err.errors = data.errors;
    throw err;
  }

  return data;
}

// ====== PRODUCTS API ======
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const res = await request(`/products${queryString}`);
  const rawList = res.data || [];
  return {
    products: rawList.map(normalizeProduct),
    pagination: res.pagination || { total: rawList.length, page: 1, limit: rawList.length, totalPages: 1 },
  };
};

export const getProductById = async (idOrSlug) => {
  const res = await request(`/products/${idOrSlug}`);
  return normalizeProduct(res.data);
};

export const getProductByIdOrSlug = getProductById;

export const getFeaturedProducts = async (limit = 8) => {
  const res = await request(`/products/featured?limit=${limit}`);
  return (res.data || []).map(normalizeProduct);
};

export const getNewArrivals = async (limit = 12) => {
  const res = await request(`/products/new-arrivals?limit=${limit}`);
  return (res.data || []).map(normalizeProduct);
};

export const getBestSellers = async (limit = 12) => {
  const res = await request(`/products/best-sellers?limit=${limit}`);
  return (res.data || []).map(normalizeProduct);
};

export const getPreorderProducts = async () => {
  const res = await request('/products/pre-orders');
  return (res.data || []).map(normalizeProduct);
};

export const searchProducts = async (q) => {
  const res = await request(`/products/search?q=${encodeURIComponent(q)}`);
  return (res.data || []).map(normalizeProduct);
};

// ====== CATEGORIES & COLLECTIONS API ======
export const getCategories = async () => {
  const res = await request('/categories');
  return res.data || [];
};

export const getCollections = async () => {
  const res = await request('/collections');
  return res.data || [];
};

// ====== AUTH API ======
export const authAPI = {
  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    const token = res.data?.accessToken || res.data?.tokens?.accessToken;
    if (token) {
      localStorage.setItem('boutique_token', token);
    }
    return res.data;
  },
  register: async (userData) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    const token = res.data?.accessToken || res.data?.tokens?.accessToken;
    if (token) {
      localStorage.setItem('boutique_token', token);
    }
    return res.data;
  },
  getMe: async () => {
    const res = await request('/auth/me');
    return res.data?.user || res.data;
  },
  changePassword: async (passwordData) => {
    const res = await request('/auth/change-password', {
      method: 'PUT',
      body: passwordData,
    });
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('boutique_token');
    localStorage.removeItem('boutique_user');
    localStorage.removeItem('mv_admin_token');
    localStorage.removeItem('mv_admin_refresh');
  },
};

// ====== ORDER API ======
export const orderAPI = {
  createOrder: async (orderData) => {
    const res = await request('/orders', {
      method: 'POST',
      body: orderData,
    });
    return res.data;
  },
  verifyPayment: async (paymentData) => {
    const res = await request('/orders/payments/verify', {
      method: 'POST',
      body: paymentData,
    });
    return res.data;
  },
  validateCoupon: async (code, subtotal) => {
    const res = await request('/orders/validate-coupon', {
      method: 'POST',
      body: { code, subtotal },
    });
    return res.data;
  },
  getMyOrders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/orders${query ? '?' + query : ''}`);
    return res.data || [];
  },
  getOrderById: async (id) => {
    const res = await request(`/orders/${id}`);
    return res.data;
  },
  trackOrder: async (orderNumber) => {
    const res = await request(`/orders/track/${orderNumber}`);
    return res.data;
  },
};

// ====== CONTACT API ======
export const contactAPI = {
  submitInquiry: async (inquiryData) => {
    const res = await request('/contact', {
      method: 'POST',
      body: inquiryData,
    });
    return res.data;
  },
};

// ====== REVIEW API ======
export const reviewAPI = {
  getByProduct: async (productId) => {
    const res = await request(`/reviews/product/${productId}`);
    return res.data || [];
  },
  createReview: async (productId, reviewData) => {
    const res = await request(`/reviews/product/${productId}`, {
      method: 'POST',
      body: reviewData,
    });
    return res.data;
  },
};

// ====== CART API ======
export const cartAPI = {
  getCart: async () => {
    const res = await request('/cart');
    return res.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const res = await request('/cart/add', {
      method: 'POST',
      body: { productId, quantity },
    });
    return res.data;
  },
  updateCartItem: async (productId, quantity) => {
    const res = await request('/cart/update', {
      method: 'PUT',
      body: { productId, quantity },
    });
    return res.data;
  },
  removeFromCart: async (productId) => {
    const res = await request(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
    return res.data;
  },
  clearCart: async () => {
    const res = await request('/cart/clear', {
      method: 'DELETE',
    });
    return res.data;
  },
  syncCart: async (items) => {
    const res = await request('/cart/sync', {
      method: 'POST',
      body: { items },
    });
    return res.data;
  },
};

// ====== WISHLIST API ======
export const wishlistAPI = {
  getWishlist: async () => {
    const res = await request('/wishlist');
    return res.data;
  },
  toggleWishlist: async (productId) => {
    const res = await request(`/wishlist/toggle/${productId}`, {
      method: 'POST',
    });
    return res.data;
  },
  removeFromWishlist: async (productId) => {
    const res = await request(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
    return res.data;
  },
  moveToCart: async (productId) => {
    const res = await request(`/wishlist/move-to-cart/${productId}`, {
      method: 'POST',
    });
    return res.data;
  },
  syncWishlist: async (items) => {
    const res = await request('/wishlist/sync', {
      method: 'POST',
      body: { items },
    });
    return res.data;
  },
};
