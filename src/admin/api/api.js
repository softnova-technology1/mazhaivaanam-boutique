const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('mv_admin_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Remove Content-Type for FormData (file uploads)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

// ====== AUTH ======
export const authAPI = {
  login: (body) => request('/auth/login', { method: 'POST', body }),
  getMe: () => request('/auth/me'),
  refreshToken: (refreshToken) => request('/auth/refresh-token', { method: 'POST', body: { refreshToken } }),
};

// ====== ADMIN DASHBOARD ======
export const dashboardAPI = {
  getOverview: () => request('/admin/dashboard'),
  getSales: (period = 'daily') => request(`/admin/dashboard/sales?period=${period}`),
};

// ====== PRODUCTS ======
export const productAPI = {
  getAll: (params = '') => request(`/admin/products${params ? '?' + params : ''}`),
  getBySlug: (slug) => request(`/products/${slug}`),
  create: (body) => request('/admin/products', { method: 'POST', body }),
  update: (id, body) => request(`/admin/products/${id}`, { method: 'PUT', body }),
  delete: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  hardDelete: (id) => request(`/admin/products/${id}/hard`, { method: 'DELETE' }),
  bulkDelete: (productIds) => request('/admin/products/bulk/delete', { method: 'POST', body: { productIds } }),
  bulkHardDelete: (productIds) => request('/admin/products/bulk/hard-delete', { method: 'POST', body: { productIds } }),
};

// ====== CATEGORIES ======
export const categoryAPI = {
  getAll: () => request('/admin/categories'),
  create: (body) => request('/admin/categories', { method: 'POST', body }),
  update: (id, body) => request(`/admin/categories/${id}`, { method: 'PUT', body }),
  delete: (id) => request(`/admin/categories/${id}`, { method: 'DELETE' }),
};

// ====== COLLECTIONS ======
export const collectionAPI = {
  getAll: () => request('/admin/collections'),
  create: (body) => request('/admin/collections', { method: 'POST', body }),
  update: (id, body) => request(`/admin/collections/${id}`, { method: 'PUT', body }),
  delete: (id) => request(`/admin/collections/${id}`, { method: 'DELETE' }),
};

// ====== ORDERS ======
export const orderAPI = {
  getAll: (params = '') => request(`/admin/orders${params ? '?' + params : ''}`),
  updateStatus: (orderId, body) => request(`/admin/orders/${orderId}/status`, { method: 'PUT', body }),
  bulkUpdateStatus: (orderIds, status, note = '') => request('/admin/orders/bulk/status', { method: 'PUT', body: { orderIds, status, note } }),
};

// ====== INVENTORY ======
export const inventoryAPI = {
  getAll: () => request('/admin/inventory'),
  get: (productId) => request(`/admin/inventory/${productId}`),
  restock: (productId, body) => request(`/admin/inventory/${productId}/restock`, { method: 'PUT', body }),
  adjust: (productId, body) => request(`/admin/inventory/${productId}/adjust`, { method: 'PUT', body }),
  getLowStock: () => request('/admin/inventory/low-stock'),
  getOutOfStock: () => request('/admin/inventory/out-of-stock'),
};

// ====== USERS ======
export const userAPI = {
  getAll: () => request('/admin/users'),
  updateRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: { role } }),
  updateStatus: (id) => request(`/admin/users/${id}/status`, { method: 'PUT' }),
  delete: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
};

// ====== REVIEWS ======
export const reviewAPI = {
  getPending: () => request('/admin/reviews'),
  getAll: () => request('/admin/reviews/all'),
  approve: (id) => request(`/admin/reviews/${id}/approve`, { method: 'PUT' }),
  delete: (id) => request(`/admin/reviews/${id}`, { method: 'DELETE' }),
};

// ====== CONTACT ======
export const contactAPI = {
  getAll: (status = '') => request(`/admin/inquiries${status ? '?status=' + status : ''}`),
  reply: (id, reply) => request(`/admin/inquiries/${id}/reply`, { method: 'PUT', body: { reply } }),
};

// ====== UPLOAD ======
export const uploadAPI = {
  upload: (file, folder = 'mazhaivaanam/products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    return request('/admin/upload', { method: 'POST', body: formData });
  },
};

// ====== DISCOUNTS ======
export const discountAPI = {
  getAll: (params) => request(`/admin/discounts?${params}`),
  update: (id, body) => request(`/admin/discounts/${id}`, { method: 'PUT', body }),
  remove: (id) => request(`/admin/discounts/${id}`, { method: 'DELETE' }),
  bulkUpdate: (body) => request('/admin/discounts/bulk', { method: 'PUT', body }),
  bulkRemove: (body) => request('/admin/discounts/bulk-remove', { method: 'POST', body }),
};

// ====== LIMITED OFFER ======
export const offerAPI = {
  getConfig: () => request('/admin/limited-offer/config'),
  updateConfig: (body) => request('/admin/limited-offer', { method: 'PUT', body }),
};
