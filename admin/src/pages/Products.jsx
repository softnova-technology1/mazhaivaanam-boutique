import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../api/api.js';
import { Plus, Search, Edit, Trash2, Eye, Star, X } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 15, category: '', tag: '', search: '' });
  const [modal, setModal] = useState({ open: false, product: null });
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters.page, filters.category, filters.tag]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', filters.page);
      params.set('limit', filters.limit);
      if (filters.category) params.set('category', filters.category);
      if (filters.tag) params.set('tag', filters.tag);
      if (filters.search) params.set('search', filters.search);
      const res = await productAPI.getAll(params.toString());
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
    loadProducts();
  };

  const openCreate = () => {
    setForm({ name: '', description: '', category: categories[0]?._id || '', fabric: 'Pure Silk', price: '', mrpPrice: '', occasion: 'Traditional', tag: '', isFeatured: false, isActive: true });
    setModal({ open: true, product: null });
  };

  const openEdit = (product) => {
    setForm({ name: product.name, description: product.description, category: product.category?._id || '', fabric: product.fabric, price: product.price, mrpPrice: product.mrpPrice, occasion: product.occasion, tag: product.tag || '', isFeatured: product.isFeatured, isActive: product.isActive });
    setModal({ open: true, product });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, price: Number(form.price), mrpPrice: Number(form.mrpPrice) || 0, tag: form.tag || null };
      if (modal.product) {
        await productAPI.update(modal.product._id, body);
      } else {
        await productAPI.create(body);
      }
      setModal({ open: false, product: null });
      loadProducts();
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await productAPI.delete(id);
      loadProducts();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{pagination.total || 0} products in catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSearch} className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={16} />
          <input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </form>
        <select className="form-select" value={filters.category} onChange={(e) => setFilters(f => ({ ...f, category: e.target.value, page: 1 }))}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c.slug}>{c.name}</option>)}
        </select>
        <select className="form-select" value={filters.tag} onChange={(e) => setFilters(f => ({ ...f, tag: e.target.value, page: 1 }))}>
          <option value="">All Tags</option>
          <option value="BESTSELLER">Bestseller</option>
          <option value="NEW ARRIVAL">New Arrival</option>
          <option value="LIMITED EDITION">Limited Edition</option>
          <option value="FESTIVAL CHOICE">Festival Choice</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Fabric</th>
                  <th>Price</th>
                  <th>Tag</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0 }}>
                          {p.images?.[0]?.url && <img src={p.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>{p.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category?.name || '—'}</td>
                    <td>{p.fabric}</td>
                    <td>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{p.price?.toLocaleString('en-IN')}</span>
                      {p.mrpPrice > p.price && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'line-through' }}>₹{p.mrpPrice?.toLocaleString('en-IN')}</div>}
                    </td>
                    <td>{p.tag ? <span className={`badge badge-${p.tag === 'BESTSELLER' ? 'primary' : p.tag === 'NEW ARRIVAL' ? 'info' : 'warning'}`}>{p.tag}</span> : '—'}</td>
                    <td>
                      {p.averageRating > 0 ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={14} fill="#C8A34D" stroke="#C8A34D" /> {p.averageRating}
                        </span>
                      ) : '—'}
                    </td>
                    <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn-ghost btn-icon" onClick={() => openEdit(p)} title="Edit"><Edit size={16} /></button>
                        <button className="btn-ghost btn-icon" onClick={() => handleDelete(p._id, p.name)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${filters.page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, product: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.product ? 'Edit Product' : 'Add Product'}</h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false, product: null })}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fabric</label>
                    <select className="form-select" required value={form.fabric} onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))}>
                      {['Pure Silk', 'Cotton', 'Tussar', 'Organza', 'Linen', 'Georgette', 'Chiffon', 'Chanderi'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input className="form-input" type="number" required min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">MRP Price (₹)</label>
                    <input className="form-input" type="number" min="0" value={form.mrpPrice} onChange={e => setForm(f => ({ ...f, mrpPrice: e.target.value }))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Occasion</label>
                    <select className="form-select" value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}>
                      {['Wedding', 'Festival', 'Party Wear', 'Reception', 'Traditional', 'Casual', 'Bridal'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tag</label>
                    <select className="form-select" value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))}>
                      <option value="">None</option>
                      <option value="BESTSELLER">Bestseller</option>
                      <option value="NEW ARRIVAL">New Arrival</option>
                      <option value="LIMITED EDITION">Limited Edition</option>
                      <option value="FESTIVAL CHOICE">Festival Choice</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20, marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} /> Featured
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} /> Active
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false, product: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
