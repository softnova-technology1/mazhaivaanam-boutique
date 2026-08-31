import { useState, useEffect } from 'react';
import { productAPI, categoryAPI, uploadAPI } from '../api/api.js';
import { exportToCSV } from '../utils/exportCSV.js';
import { Plus, Search, Edit, Trash2, X, UploadCloud, Download } from 'lucide-react';

export default function PreBooking() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ page: 1, limit: 15, category: '', tag: '', search: '' });
  const [modal, setModal] = useState({ open: false, product: null });
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data)).catch(() => { });
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
      params.set('preorder', 'true'); // Filter only preorder products
      if (filters.category) params.set('category', filters.category);
      if (filters.tag) params.set('tag', filters.tag);
      if (filters.search) params.set('search', filters.search);
      const res = await productAPI.getAll(params.toString());
      setProducts(res.data);
      setPagination(res.pagination);
      setSelectedProducts([]);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, page: 1 }));
    loadProducts();
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p._id));
    }
  };

  const handleSelectProduct = (id, e) => {
    e.stopPropagation();
    if (selectedProducts.includes(id)) {
      setSelectedProducts(prev => prev.filter(item => item !== id));
    } else {
      setSelectedProducts(prev => [...prev, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedProducts.length) return;
    if (!window.confirm(`Are you sure you want to permanently remove ${selectedProducts.length} selected pre-booking products from the database?`)) return;

    setBulkLoading(true);
    try {
      await productAPI.bulkHardDelete(selectedProducts);
      setSelectedProducts([]);
      loadProducts();
    } catch (err) {
      alert(err.message || 'Error deleting products');
    }
    setBulkLoading(false);
  };

  const handleExportCSV = (exportSelected = false) => {
    const listToExport = exportSelected
      ? products.filter(p => selectedProducts.includes(p._id))
      : products;

    if (!listToExport.length) {
      alert('No products to export');
      return;
    }

    const columns = [
      { key: 'name', label: 'Product Name' },
      { key: 'category', label: 'Category', formatter: (p) => p.category?.name || '' },
      { key: 'fabric', label: 'Fabric' },
      { key: 'price', label: 'Sale Price (INR)' },
      { key: 'mrpPrice', label: 'MRP Price (INR)' },
      { key: 'preorderDeposit', label: 'Preorder Deposit (INR)' },
      { key: 'preorderEstimatedDays', label: 'Estimated Days' },
      { key: 'preorderWeaver', label: 'Weaver' },
      { key: 'preorderProgress', label: 'Weaving Progress (%)' },
      { key: 'preorderDiscount', label: 'Preorder Discount Label' },
      { key: 'tag', label: 'Tag Badge', formatter: (p) => p.tag || 'None' },
      { key: 'occasion', label: 'Occasion' },
      { key: 'averageRating', label: 'Rating' },
      { key: 'isActive', label: 'Status', formatter: (p) => p.isActive ? 'Active' : 'Inactive' },
      { key: 'image', label: 'Primary Image URL', formatter: (p) => p.images?.[0]?.url || '' },
    ];

    exportToCSV(listToExport, columns, 'MazhaiVaanam_PreBooking_Catalog');
  };

  const openCreate = () => {
    setForm({
      name: '',
      description: '',
      category: categories[0]?._id || '',
      fabric: 'Pure Silk',
      price: '',
      mrpPrice: '',
      stock: 1,
      occasion: 'Traditional',
      tag: '',
      imageUrl: '',
      isFeatured: false,
      isActive: true,
      imageFile: null,
      imagePreview: '/Images/saree1.png',
      // Preorder fields
      preorderDeposit: 5000,
      preorderProgress: 70,
      preorderWeaver: 'Master Weaver',
      preorderEstimatedDays: 14,
      preorderDiscount: '10%'
    });
    setModal({ open: true, product: null });
  };

  const openEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category?._id || product.category || '',
      fabric: product.fabric,
      price: product.price,
      mrpPrice: product.mrpPrice,
      stock: product.stock?.available ?? 1,
      occasion: product.occasion,
      tag: product.tag || '',
      imageUrl: product.images?.[0]?.url || '',
      isFeatured: Boolean(product.isFeatured),
      isActive: product.isActive !== false,
      imageFile: null,
      imagePreview: product.images?.[0]?.url || '',
      // Preorder fields
      preorderDeposit: product.preorderDeposit ?? 5000,
      preorderProgress: product.preorderProgress ?? 70,
      preorderWeaver: product.preorderWeaver || 'Master Weaver',
      preorderEstimatedDays: product.preorderEstimatedDays ?? 14,
      preorderDiscount: product.preorderDiscount || '10%'
    });
    setModal({ open: true, product });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        category: form.category,
        fabric: form.fabric,
        price: Number(form.price),
        mrpPrice: Number(form.mrpPrice) || 0,
        stock: Number(form.stock) || 1,
        occasion: form.occasion,
        tag: form.tag || null,
        isFeatured: Boolean(form.isFeatured),
        isActive: Boolean(form.isActive),
        isPreorder: true, // Always true for Pre-Booking page
        preorderDeposit: Number(form.preorderDeposit) || 0,
        preorderProgress: Number(form.preorderProgress) || 0,
        preorderWeaver: form.preorderWeaver || '',
        preorderEstimatedDays: Number(form.preorderEstimatedDays) || 0,
        preorderDiscount: form.preorderDiscount || ''
      };

      if (!modal.product && !form.imageFile && !form.imageUrl?.trim() && !form.imagePreview) {
        alert('Please upload or provide a product image');
        setSaving(false);
        return;
      }

      const safeFallback = (form.imageUrl && !form.imageUrl.startsWith('blob:')) 
        ? form.imageUrl.trim() 
        : (form.imagePreview && !form.imagePreview.startsWith('blob:')) 
          ? form.imagePreview 
          : '/Images/saree1.png';

      if (form.imageFile) {
        try {
          const res = await uploadAPI.upload(form.imageFile);
          body.images = [{ url: res.data.url, publicId: res.data.publicId || '' }];
        } catch (uploadErr) {
          console.warn('Upload API fallback:', uploadErr);
          body.images = [{ url: safeFallback, publicId: '' }];
        }
      } else if (form.imageUrl && form.imageUrl.trim() && !form.imageUrl.startsWith('blob:')) {
        body.images = [{ url: form.imageUrl.trim(), publicId: '' }];
      } else if (modal.product?.images?.length && !modal.product.images[0]?.url?.startsWith('blob:')) {
        body.images = modal.product.images;
      } else {
        body.images = [{ url: safeFallback, publicId: '' }];
      }

      if (modal.product) {
        await productAPI.update(modal.product._id, body);
      } else {
        await productAPI.create(body);
      }
      setModal({ open: false, product: null });
      loadProducts();
    } catch (err) {
      alert(err.message || 'Error saving product');
    }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" permanently from MongoDB database?`)) return;
    try {
      await productAPI.hardDelete(id);
      loadProducts();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Pre-Booking Catalog</h1>
          <p className="page-subtitle">{pagination.total || 0} preorder products in catalog</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-outline"
            onClick={() => handleExportCSV(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={16} /> Export to CSV
          </button>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={18} /> Add Pre-Booking Product
          </button>
        </div>
      </div>

      {/* Filters and Bulk Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <form onSubmit={handleSearch} className="search-bar" style={{ flex: 1, maxWidth: 300 }}>
            <Search size={16} />
            <input
              placeholder="Search preorders..."
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

        {/* Selected Products Actions */}
        {selectedProducts.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg-secondary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary)'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              {selectedProducts.length} selected
            </span>
            <button
              className="btn btn-sm btn-outline"
              disabled={bulkLoading}
              onClick={handleBulkDelete}
              style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
            >
              <Trash2 size={14} /> Delete Selected
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => handleExportCSV(true)}
            >
              <Download size={14} /> Export Selected
            </button>
          </div>
        )}
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
                  <th style={{ width: 40, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={products.length > 0 && selectedProducts.length === products.length}
                      onChange={handleSelectAll}
                      style={{ cursor: 'pointer' }}
                    />
                  </th>
                  <th style={{ width: 45, textAlign: 'center' }}>#</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Fabric</th>
                  <th>Full Price</th>
                  <th>Deposit</th>
                  <th>Weaver / Progress</th>
                  <th>Est. Days</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, idx) => {
                  const isSelected = selectedProducts.includes(p._id);
                  return (
                    <tr key={p._id} style={{ background: isSelected ? 'rgba(200, 163, 77, 0.08)' : undefined }}>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectProduct(p._id, e)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                        {(filters.page - 1) * filters.limit + idx + 1}
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
                      <td>
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{(p.preorderDeposit || 5000).toLocaleString('en-IN')}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{p.preorderWeaver || 'Master Weaver'}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Progress: {p.preorderProgress || 70}%</div>
                      </td>
                      <td>{p.preorderEstimatedDays || 14} days</td>
                      <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button className="btn-ghost btn-icon" onClick={() => openEdit(p)} title="Edit"><Edit size={16} /></button>
                          <button className="btn-ghost btn-icon" onClick={() => handleDelete(p._id, p.name)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
              <button
                className="btn btn-sm btn-outline"
                disabled={filters.page <= 1}
                onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${filters.page === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-sm btn-outline"
                disabled={filters.page >= pagination.totalPages}
                onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, product: null })}>
          <div className="modal-content" style={{ maxWidth: 850, width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.product ? 'Edit Pre-Booking Product' : 'Add Pre-Booking Product'}</h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false, product: null })}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32 }}>

                {/* Left Column: Image Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label className="form-label">Product Image</label>
                  <div
                    style={{
                      border: '2px dashed var(--border-color)',
                      borderRadius: 12,
                      flex: 1,
                      minHeight: 350,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--bg-secondary)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    onClick={() => document.getElementById('preorder-image-upload').click()}
                  >
                    {form.imagePreview ? (
                      <>
                        <img src={form.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 1}
                          onMouseLeave={e => e.currentTarget.style.opacity = 0}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'white' }}>
                            <UploadCloud size={32} />
                            <span style={{ fontWeight: 500 }}>Change Image</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <UploadCloud size={48} style={{ marginBottom: 16, opacity: 0.6 }} />
                        <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>Click to upload</div>
                        <div style={{ fontSize: '0.8rem', marginTop: 8 }}>Supports PNG, JPG, WEBP</div>
                      </div>
                    )}
                    <input
                      id="preorder-image-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          setForm(f => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }));
                        }
                      }}
                    />
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Or Direct Image Path / URL</label>
                    <input
                      className="form-input"
                      placeholder="/Images/saree1.png or https://..."
                      value={form.imageUrl || ''}
                      onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value, imagePreview: e.target.value || f.imagePreview }))}
                    />
                  </div>
                </div>

                {/* Right Column: Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Product Name</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Category</label>
                      <select className="form-select" required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Fabric</label>
                      <select className="form-select" required value={form.fabric} onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))}>
                        {['Pure Silk', 'Cotton', 'Tussar', 'Organza', 'Linen', 'Georgette', 'Chiffon', 'Chanderi'].map(f => <option key={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Price (₹) *</label>
                      <input className="form-input" type="number" required min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">MRP Price (₹) *</label>
                      <input className="form-input" type="number" required min="0" value={form.mrpPrice} onChange={e => setForm(f => ({ ...f, mrpPrice: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Stock Quantity *</label>
                      <input className="form-input" type="number" required min="0" value={form.stock ?? 1} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Occasion *</label>
                      <select className="form-select" required value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}>
                        {['Wedding', 'Festival', 'Party Wear', 'Reception', 'Traditional', 'Casual', 'Bridal'].map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
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

                  {/* Pre-order Specific Inputs */}
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Preorder Deposit (₹) *</label>
                      <input className="form-input" type="number" required min="0" value={form.preorderDeposit} onChange={e => setForm(f => ({ ...f, preorderDeposit: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Weaver Name *</label>
                      <input className="form-input" required value={form.preorderWeaver} onChange={e => setForm(f => ({ ...f, preorderWeaver: e.target.value }))} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Estimated Days *</label>
                      <input className="form-input" type="number" required min="0" value={form.preorderEstimatedDays} onChange={e => setForm(f => ({ ...f, preorderEstimatedDays: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Progress Percentage (%) *</label>
                      <input className="form-input" type="number" required min="0" max="100" value={form.preorderProgress} onChange={e => setForm(f => ({ ...f, preorderProgress: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Preorder Discount Label</label>
                      <input className="form-input" placeholder="e.g. 10% OFF" value={form.preorderDiscount} onChange={e => setForm(f => ({ ...f, preorderDiscount: e.target.value }))} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 24, marginTop: 8, padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                      Featured Product
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 500 }}>
                      <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--primary)' }} />
                      Active Status
                    </label>
                  </div>
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
