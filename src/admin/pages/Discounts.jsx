import { useState, useEffect } from 'react';
import { discountAPI, categoryAPI } from '../api/api.js';
import { Search, Percent, X, Zap, Tag, Calendar, Trash2, Edit, Filter, Clock, Sparkles, Layers } from 'lucide-react';

const formatCurrency = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const STATUS_STYLES = {
  active: { className: 'badge-success', label: 'Active' },
  scheduled: { className: 'badge-warning', label: 'Scheduled' },
  expired: { className: 'badge-danger', label: 'Expired' },
  inactive: { className: 'badge-neutral', label: 'Inactive' },
  none: { className: 'badge-neutral', label: 'No Discount' },
};

export default function Discounts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', category: '', search: '' });
  const [modal, setModal] = useState({ open: false, product: null });
  const [bulkModal, setBulkModal] = useState(false);
  const [bulkRemoveModal, setBulkRemoveModal] = useState(false);
  const [form, setForm] = useState({ type: 'percentage', value: '', startDate: '', endDate: '', isActive: true, label: '' });
  const [bulkForm, setBulkForm] = useState({ category: '', tag: '', type: 'percentage', value: '', startDate: '', endDate: '', isActive: true, label: '' });
  const [bulkRemoveForm, setBulkRemoveForm] = useState({ category: '', tag: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [saving, setSaving] = useState(false);

  // Stats
  const activeCount = products.filter((p) => p.discountStatus === 'active').length;
  const scheduledCount = products.filter((p) => p.discountStatus === 'scheduled').length;
  const expiredCount = products.filter((p) => p.discountStatus === 'expired').length;

  useEffect(() => {
    categoryAPI.getAll().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters.status, filters.category]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.set('status', filters.status);
      if (filters.category) params.set('category', filters.category);
      if (filters.search) params.set('search', filters.search);
      const res = await discountAPI.getAll(params.toString());
      if (res.success) setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const openEdit = (product) => {
    const d = product.discount || {};
    setForm({
      type: d.type || 'percentage',
      value: d.value || '',
      startDate: d.startDate ? new Date(d.startDate).toISOString().slice(0, 16) : '',
      endDate: d.endDate ? new Date(d.endDate).toISOString().slice(0, 16) : '',
      isActive: d.isActive !== undefined ? d.isActive : true,
      label: d.label || '',
    });
    setModal({ open: true, product });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedItems(products.map(p => p._id));
    else setSelectedItems([]);
  };

  const handleSelect = (id) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await discountAPI.update(modal.product._id, {
        ...form,
        value: Number(form.value),
      });
      setModal({ open: false, product: null });
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleRemove = async (productId, productName) => {
    if (!confirm(`Remove discount from "${productName}"?`)) return;
    try {
      await discountAPI.remove(productId);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...bulkForm,
        value: Number(bulkForm.value),
      };
      if (selectedItems.length > 0) payload.productIds = selectedItems;
      await discountAPI.bulkUpdate(payload);
      setBulkModal(false);
      setSelectedItems([]);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  const handleBulkRemoveSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...bulkRemoveForm };
      if (selectedItems.length > 0) payload.productIds = selectedItems;
      await discountAPI.bulkRemove(payload);
      setBulkRemoveModal(false);
      setSelectedItems([]);
      loadProducts();
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  // Compute preview
  const previewPrice = modal.product
    ? form.type === 'percentage'
      ? Math.round(modal.product.price * (1 - Number(form.value || 0) / 100))
      : Math.max(0, modal.product.price - Number(form.value || 0))
    : 0;

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.status, filters.category, filters.search]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Discounts</h1>
          <p className="page-subtitle">Manage product discounts & offers</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }} onClick={() => { setBulkRemoveForm({ category: '', tag: '' }); setBulkRemoveModal(true); }}>
            <Trash2 size={18} /> Bulk Remove
          </button>
          <button className="btn btn-primary" onClick={() => { setBulkForm({ category: '', tag: '', type: 'percentage', value: '', startDate: '', endDate: '', isActive: true, label: '' }); setBulkModal(true); }}>
            <Zap size={18} /> Bulk Discount
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filters.status === 'active' ? '1px solid var(--primary)' : undefined }} onClick={() => setFilters((f) => ({ ...f, status: f.status === 'active' ? 'all' : 'active' }))}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <Tag size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{activeCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Discounts</div>
          </div>
        </div>

        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filters.status === 'scheduled' ? '1px solid var(--primary)' : undefined }} onClick={() => setFilters((f) => ({ ...f, status: f.status === 'scheduled' ? 'all' : 'scheduled' }))}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
            <Calendar size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{scheduledCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scheduled</div>
          </div>
        </div>

        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filters.status === 'expired' ? '1px solid var(--primary)' : undefined }} onClick={() => setFilters((f) => ({ ...f, status: f.status === 'expired' ? 'all' : 'expired' }))}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{expiredCount}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Expired</div>
          </div>
        </div>

        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filters.status === 'all' ? '1px solid var(--primary)' : undefined }} onClick={() => setFilters((f) => ({ ...f, status: 'all' }))}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(200,163,77,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{products.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Products</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <form onSubmit={handleSearch} className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={16} />
          <input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
        </form>
        <select className="form-select" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="all">All Discounts</option>
          <option value="active">Active Discounts</option>
          <option value="scheduled">Scheduled</option>
          <option value="expired">Expired</option>
          <option value="none">No Discount</option>
        </select>
        <select className="form-select" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <div className="card empty-state">
          <Percent size={40} />
          <p>No products found matching your filters.</p>
        </div>
      ) : (
        <>
        {selectedItems.length > 0 && (
          <div className="selected-actions" style={{ padding: '12px 20px', background: 'var(--primary-bg)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, border: '1px solid var(--primary-border)' }}>
            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedItems.length} product(s) selected</span>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => { setBulkRemoveForm({ category: '', tag: '' }); setBulkRemoveModal(true); }}>
                <Trash2 size={14} /> Remove Discounts
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => { setBulkForm({ category: '', tag: '', type: 'percentage', value: '', startDate: '', endDate: '', isActive: true, label: '' }); setBulkModal(true); }}>
                <Zap size={14} /> Apply Discount
              </button>
            </div>
          </div>
        )}
        
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>
                  <input type="checkbox" onChange={handleSelectAll} checked={products.length > 0 && selectedItems.length === products.length} />
                </th>
                <th style={{ width: 50, textAlign: 'center' }}>#</th>
                <th>Product</th>
                <th>Original Price</th>
                <th>Discount</th>
                <th>Sale Price</th>
                <th>Label</th>
                <th>Date Range</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p, idx) => {
                const st = STATUS_STYLES[p.discountStatus] || STATUS_STYLES.none;
                const hasDiscount = p.discountStatus !== 'none';
                return (
                  <tr key={p._id} className={selectedItems.includes(p._id) ? 'selected-row' : ''}>
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={selectedItems.includes(p._id)} onChange={() => handleSelect(p._id)} />
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0 }}>
                          {(() => {
                            const rawUrl = p.images?.[0]?.url;
                            const safeUrl = (rawUrl && typeof rawUrl === 'string' && !rawUrl.startsWith('blob:')) ? rawUrl : '/Images/saree1.png';
                            return (
                              <img 
                                src={safeUrl} 
                                alt={p.name || ''} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/Images/saree1.png';
                                }}
                              />
                            );
                          })()}
                        </div>
                        <div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem' }}>{p.name}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.category?.name || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{formatCurrency(p.price)}</td>
                    <td>
                      {hasDiscount ? (
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          {p.discount?.type === 'percentage' ? `${p.discount.value}%` : formatCurrency(p.discount?.value || 0)}
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 4 }}>
                            {p.discount?.type === 'percentage' ? 'OFF' : 'FLAT'}
                          </span>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, color: hasDiscount ? 'var(--accent)' : 'inherit' }}>
                      {formatCurrency(p.discountedPrice)}
                    </td>
                    <td>
                      {p.discount?.label ? (
                        <span className="badge badge-primary">{p.discount.label}</span>
                      ) : '—'}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {hasDiscount ? (
                        <div>
                          {p.discount?.startDate && <div>{new Date(p.discount.startDate).toLocaleString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</div>}
                          {p.discount?.endDate && <div style={{ color: new Date(p.discount.endDate) < new Date() ? 'var(--danger)' : 'inherit', marginTop: 2 }}>
                            to {new Date(p.discount.endDate).toLocaleString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                          </div>}
                          {!p.discount?.startDate && !p.discount?.endDate && 'No expiry'}
                        </div>
                      ) : '—'}
                    </td>
                    <td><span className={`badge ${st.className}`}>{st.label}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn-ghost btn-icon" onClick={() => openEdit(p)} title="Set Discount">
                          <Edit size={16} />
                        </button>
                        {hasDiscount && (
                          <button className="btn-ghost btn-icon" onClick={() => handleRemove(p._id, p.name)} title="Remove Discount" style={{ color: 'var(--danger)' }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
            <button
              className="btn btn-sm btn-outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-sm btn-outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}
        </>
      )}

      {/* Edit Discount Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, product: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Percent size={18} style={{ color: 'var(--primary)' }} /> Set Discount
              </h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false, product: null })}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {/* Product Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, background: 'var(--bg-surface-hover)', overflow: 'hidden', flexShrink: 0 }}>
                    {modal.product.images?.[0]?.url && <img src={modal.product.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{modal.product.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      Original: {formatCurrency(modal.product.price)} | MRP: {formatCurrency(modal.product.mrpPrice)}
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Discount Type</label>
                    <select className="form-select" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Value</label>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      max={form.type === 'percentage' ? 100 : modal.product.price}
                      required
                      value={form.value}
                      onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
                      placeholder={form.type === 'percentage' ? 'e.g. 15' : 'e.g. 500'}
                    />
                  </div>
                </div>

                {/* Price Preview */}
                {form.value && (
                  <div style={{ padding: 16, background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sale Price Preview</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)', marginTop: 4 }}>{formatCurrency(previewPrice)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer Saves</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(modal.product.price - previewPrice)}</div>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Offer Label</label>
                  <input
                    className="form-input"
                    value={form.label}
                    onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                    placeholder="e.g. Summer Sale, Festival Offer"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date & Time</label>
                    <input className="form-input" type="datetime-local" value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date & Time</label>
                    <input className="form-input" type="datetime-local" value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                    Discount Active
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false, product: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Discount'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Discount Modal */}
      {bulkModal && (
        <div className="modal-overlay" onClick={() => setBulkModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Zap size={18} style={{ color: 'var(--primary)' }} /> Bulk Discount
              </h3>
              <button className="btn-ghost btn-icon" onClick={() => setBulkModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleBulkSave}>
              <div className="modal-body">
                {selectedItems.length > 0 ? (
                  <div style={{ padding: 14, background: 'var(--primary-bg)', borderRadius: 'var(--radius-md)', marginBottom: 20, color: 'var(--primary)', fontSize: '0.85rem' }}>
                    ⚡ Applying discount to {selectedItems.length} selected product(s).
                  </div>
                ) : (
                  <div style={{ padding: 14, background: 'var(--warning-bg)', borderRadius: 'var(--radius-md)', marginBottom: 20, color: 'var(--warning)', fontSize: '0.85rem' }}>
                    ⚡ This will apply the same discount to all products matching the selected category or tag. Existing discounts will be overwritten.
                  </div>
                )}

                {selectedItems.length === 0 && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={bulkForm.category} onChange={(e) => setBulkForm((f) => ({ ...f, category: e.target.value }))}>
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tag</label>
                      <select className="form-select" value={bulkForm.tag} onChange={(e) => setBulkForm((f) => ({ ...f, tag: e.target.value }))}>
                        <option value="">All Tags</option>
                        <option value="BESTSELLER">Bestseller</option>
                        <option value="NEW ARRIVAL">New Arrival</option>
                        <option value="LIMITED EDITION">Limited Edition</option>
                        <option value="FESTIVAL CHOICE">Festival Choice</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Discount Type</label>
                    <select className="form-select" value={bulkForm.type} onChange={(e) => setBulkForm((f) => ({ ...f, type: e.target.value }))}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Discount Value</label>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      max={bulkForm.type === 'percentage' ? 100 : undefined}
                      required
                      value={bulkForm.value}
                      onChange={(e) => setBulkForm((f) => ({ ...f, value: e.target.value }))}
                      placeholder={bulkForm.type === 'percentage' ? 'e.g. 15' : 'e.g. 500'}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Offer Label</label>
                  <input
                    className="form-input"
                    value={bulkForm.label}
                    onChange={(e) => setBulkForm((f) => ({ ...f, label: e.target.value }))}
                    placeholder="e.g. Mega Sale, Pongal Special"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date & Time</label>
                    <input className="form-input" type="datetime-local" value={bulkForm.startDate} onChange={(e) => setBulkForm((f) => ({ ...f, startDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date & Time</label>
                    <input className="form-input" type="datetime-local" value={bulkForm.endDate} onChange={(e) => setBulkForm((f) => ({ ...f, endDate: e.target.value }))} />
                  </div>
                </div>

                <div style={{ marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={bulkForm.isActive} onChange={(e) => setBulkForm((f) => ({ ...f, isActive: e.target.checked }))} />
                    Activate Immediately
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setBulkModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Applying...' : 'Apply Bulk Discount'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Remove Modal */}
      {bulkRemoveModal && (
        <div className="modal-overlay" onClick={() => setBulkRemoveModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: 'var(--danger)' }}>
                <Trash2 size={18} /> Remove Discounts in Bulk
              </h3>
              <button className="btn-ghost btn-icon" onClick={() => setBulkRemoveModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleBulkRemoveSave}>
              <div className="modal-body">
                {selectedItems.length > 0 ? (
                  <div style={{ padding: 14, background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', marginBottom: 20, color: 'var(--danger)', fontSize: '0.85rem' }}>
                    ⚠️ This will permanently remove discounts from {selectedItems.length} selected product(s).
                  </div>
                ) : (
                  <div style={{ padding: 14, background: 'var(--danger-bg)', borderRadius: 'var(--radius-md)', marginBottom: 20, color: 'var(--danger)', fontSize: '0.85rem' }}>
                    ⚠️ This will permanently remove discounts from all products matching the selected category or tag.
                  </div>
                )}

                {selectedItems.length === 0 && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-select" value={bulkRemoveForm.category} onChange={(e) => setBulkRemoveForm((f) => ({ ...f, category: e.target.value }))}>
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tag</label>
                      <select className="form-select" value={bulkRemoveForm.tag} onChange={(e) => setBulkRemoveForm((f) => ({ ...f, tag: e.target.value }))}>
                        <option value="">All Tags</option>
                        <option value="BESTSELLER">Bestseller</option>
                        <option value="NEW ARRIVAL">New Arrival</option>
                        <option value="LIMITED EDITION">Limited Edition</option>
                        <option value="FESTIVAL CHOICE">Festival Choice</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setBulkRemoveModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'var(--danger)', borderColor: 'var(--danger)' }} disabled={saving}>{saving ? 'Removing...' : 'Remove Discounts'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
