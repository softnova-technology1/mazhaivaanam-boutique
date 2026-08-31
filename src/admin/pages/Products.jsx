import { useState, useEffect } from 'react';
import { productAPI, categoryAPI, uploadAPI } from '../api/api.js';
import { exportToCSV } from '../utils/exportCSV.js';
import { Plus, Search, Edit, Trash2, Eye, Star, X, UploadCloud, Image as ImageIcon, Download, CheckSquare, ArrowLeft } from 'lucide-react';

export default function Products() {
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
  const [deleteAlert, setDeleteAlert] = useState({ open: false, type: 'single', id: null, name: '' });

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
    setDeleteAlert({ open: true, type: 'bulk', id: null, name: `${selectedProducts.length} selected products` });
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
      { key: 'tag', label: 'Tag Badge', formatter: (p) => p.tag || 'None' },
      { key: 'occasion', label: 'Occasion' },
      { key: 'averageRating', label: 'Rating' },
      { key: 'isActive', label: 'Status', formatter: (p) => p.isActive ? 'Active' : 'Inactive' },
      { key: 'image', label: 'Primary Image URL', formatter: (p) => p.images?.[0]?.url || '' },
    ];

    exportToCSV(listToExport, columns, 'MazhaiVaanam_Products_Catalog');
  };

  const openCreate = () => {
    setForm({
      name: '',
      description: '',
      category: categories[0]?._id || '',
      fabric: 'Pure Silk',
      price: '',
      mrpPrice: '',
      stock: 25,
      occasion: 'Traditional',
      tag: '',
      imageUrl: '',
      isFeatured: false,
      isActive: true,
      imageFile: null,
      imagePreview: '',
      sec1File: null,
      sec1Preview: '',
      sec2File: null,
      sec2Preview: '',
      weight: '', colorName: '', colorHex: '#000000', pattern: '', border: '', 
      pallu: '', sareeLength: '', blouseLength: '', style: '', returnPolicy: '', note: ''
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
      stock: product.stock?.available ?? 25,
      occasion: product.occasion,
      tag: product.tag || '',
      imageUrl: product.images?.[0]?.url || '',
      isFeatured: Boolean(product.isFeatured),
      isActive: product.isActive !== false,
      imageFile: null,
      imagePreview: product.images?.[0]?.url || '',
      sec1File: null,
      sec1Preview: product.images?.[1]?.url || '',
      sec2File: null,
      sec2Preview: product.images?.[2]?.url || '',
      weight: product.weight || '',
      colorName: product.color?.name || '',
      colorHex: product.color?.hex || '#000000',
      pattern: product.pattern || '',
      border: product.border || '',
      pallu: product.pallu || '',
      sareeLength: product.sareeLength || '',
      blouseLength: product.blouseLength || '',
      style: product.style || '',
      returnPolicy: product.returnPolicy || '',
      note: product.note || ''
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
        stock: Number(form.stock) || 0,
        occasion: form.occasion,
        tag: form.tag || null,
        isFeatured: Boolean(form.isFeatured),
        isActive: Boolean(form.isActive),
        color: { name: form.colorName, hex: form.colorHex },
        weight: form.weight,
        pattern: form.pattern,
        border: form.border,
        pallu: form.pallu,
        sareeLength: form.sareeLength,
        blouseLength: form.blouseLength,
        style: form.style,
        returnPolicy: form.returnPolicy,
        note: form.note,
      };

      if (!modal.product && !form.imageFile && !form.imagePreview) {
        alert('Please upload or provide a primary product image');
        setSaving(false);
        return;
      }

      const prepareImage = async (file, preview, existingObj) => {
        if (file) {
          try {
            const res = await uploadAPI.upload(file);
            return { url: res.data.url, publicId: res.data.publicId || '' };
          } catch (e) {
            console.warn('Upload failed:', e);
            return { url: (preview && !preview.startsWith('blob:')) ? preview : '', publicId: '' };
          }
        } else if (preview && !preview.startsWith('blob:')) {
          return existingObj || { url: preview, publicId: '' };
        }
        return null;
      };

      const res1 = await prepareImage(form.imageFile, form.imagePreview, modal.product?.images?.[0]);
      const res2 = await prepareImage(form.sec1File, form.sec1Preview, modal.product?.images?.[1]);
      const res3 = await prepareImage(form.sec2File, form.sec2Preview, modal.product?.images?.[2]);

      body.images = [res1, res2, res3].filter(img => img && img.url);

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

  const triggerDelete = (id, name) => {
    setDeleteAlert({ open: true, type: 'single', id, name });
  };

  const confirmDelete = async () => {
    if (deleteAlert.type === 'bulk') {
      setBulkLoading(true);
      try {
        await productAPI.bulkDelete(selectedProducts);
        setSelectedProducts([]);
        loadProducts();
      } catch (err) {
        alert(err.message || 'Error deleting products');
      }
      setBulkLoading(false);
    } else if (deleteAlert.type === 'single') {
      try {
        await productAPI.delete(deleteAlert.id);
        loadProducts();
      } catch (err) { alert(err.message); }
    }
    setDeleteAlert({ open: false, type: 'single', id: null, name: '' });
  };

  return (
    <div className="page-container">
      {!modal.open ? (
        <>
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Products Catalog</h1>
          <p className="page-subtitle">{pagination.total || 0} products in catalog</p>
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
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Filters and Bulk Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="filter-bar" style={{ margin: 0 }}>
          <form onSubmit={handleSearch} className="search-bar" style={{ flex: 1, maxWidth: 300 }}>
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
                  <th>Price</th>
                  <th>Tag</th>
                  <th>Rating</th>
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
                          <button className="btn-ghost btn-icon" onClick={() => triggerDelete(p._id, p.name)} title="Delete" style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
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
      </>
    ) : (
      /* Create/Edit Form Page */
      <div className="form-page-container">
          <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <button className="btn btn-outline" onClick={() => setModal({ open: false, product: null })} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowLeft size={16} /> Back to Products
            </button>
            <h2 className="page-title">{modal.product ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          <form onSubmit={handleSave} style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 32, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 32 }}>

                {/* Left Column: Image Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label className="form-label">Primary Image</label>
                    <div
                      style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: 12,
                        minHeight: 280,
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
                      onClick={() => document.getElementById('product-image-upload').click()}
                    >
                      {form.imagePreview ? (
                        <>
                          <img src={form.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
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
                              <span style={{ fontWeight: 500 }}>Change</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          <UploadCloud size={40} style={{ marginBottom: 12, opacity: 0.6 }} />
                          <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>Primary Image</div>
                        </div>
                      )}
                      <input
                        id="product-image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) setForm(f => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }));
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Secondary Images</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {/* Secondary 1 */}
                      <div
                        style={{
                          border: '2px dashed var(--border-color)',
                          borderRadius: 12,
                          height: 140,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--bg-secondary)',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('sec1-upload').click()}
                      >
                        {form.sec1Preview ? (
                          <>
                            <img src={form.sec1Preview} alt="Sec 1" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                            <div style={{ position: 'absolute', right: 4, top: 4, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', padding: 4 }} onClick={(e) => { e.stopPropagation(); setForm(f => ({ ...f, sec1File: null, sec1Preview: '' })); }}><X size={14}/></div>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Plus size={24} style={{ opacity: 0.6 }} />
                          </div>
                        )}
                        <input id="sec1-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                          const file = e.target.files[0];
                          if (file) setForm(f => ({ ...f, sec1File: file, sec1Preview: URL.createObjectURL(file) }));
                        }} />
                      </div>
                      
                      {/* Secondary 2 */}
                      <div
                        style={{
                          border: '2px dashed var(--border-color)',
                          borderRadius: 12,
                          height: 140,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--bg-secondary)',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                        onClick={() => document.getElementById('sec2-upload').click()}
                      >
                        {form.sec2Preview ? (
                          <>
                            <img src={form.sec2Preview} alt="Sec 2" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                            <div style={{ position: 'absolute', right: 4, top: 4, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', padding: 4 }} onClick={(e) => { e.stopPropagation(); setForm(f => ({ ...f, sec2File: null, sec2Preview: '' })); }}><X size={14}/></div>
                          </>
                        ) : (
                          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Plus size={24} style={{ opacity: 0.6 }} />
                          </div>
                        )}
                        <input id="sec2-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                          const file = e.target.files[0];
                          if (file) setForm(f => ({ ...f, sec2File: file, sec2Preview: URL.createObjectURL(file) }));
                        }} />
                      </div>
                    </div>
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
                      <input className="form-input" type="number" required min="0" value={form.stock ?? 25} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
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
                  
                  {/* --- Product Specifications --- */}
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12, marginBottom: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>Product Specifications</h4>
                  
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Color Name</label>
                      <input className="form-input" value={form.colorName} onChange={e => setForm(f => ({ ...f, colorName: e.target.value }))} placeholder="e.g. Royal Blue" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Color Hex</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="color" value={form.colorHex} onChange={e => setForm(f => ({ ...f, colorHex: e.target.value }))} style={{ width: 42, height: 42, padding: 0, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'transparent', flexShrink: 0 }} />
                        <input className="form-input" value={form.colorHex} onChange={e => setForm(f => ({ ...f, colorHex: e.target.value }))} placeholder="#000000" style={{ flex: 1, textTransform: 'uppercase' }} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Weight</label>
                      <input className="form-input" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="e.g. 500g" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Pattern</label>
                      <input className="form-input" value={form.pattern} onChange={e => setForm(f => ({ ...f, pattern: e.target.value }))} placeholder="e.g. Floral Motif" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Border</label>
                      <input className="form-input" value={form.border} onChange={e => setForm(f => ({ ...f, border: e.target.value }))} placeholder="e.g. Zari Border" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Pallu</label>
                      <input className="form-input" value={form.pallu} onChange={e => setForm(f => ({ ...f, pallu: e.target.value }))} placeholder="e.g. Rich Brocade" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Saree Length</label>
                      <input className="form-input" value={form.sareeLength} onChange={e => setForm(f => ({ ...f, sareeLength: e.target.value }))} placeholder="e.g. 5.5 meters" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Blouse Length</label>
                      <input className="form-input" value={form.blouseLength} onChange={e => setForm(f => ({ ...f, blouseLength: e.target.value }))} placeholder="e.g. 0.8 meters" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Style</label>
                      <input className="form-input" value={form.style} onChange={e => setForm(f => ({ ...f, style: e.target.value }))} placeholder="e.g. Kanjivaram" />
                    </div>
                  </div>

                  {/* --- Additional Info --- */}
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 12, marginBottom: 8, borderBottom: '1px solid var(--border-color)', paddingBottom: 8 }}>Additional Info</h4>
                  
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Return Policy</label>
                      <input className="form-input" value={form.returnPolicy} onChange={e => setForm(f => ({ ...f, returnPolicy: e.target.value }))} placeholder="e.g. 7 Days Return" />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Note</label>
                      <input className="form-input" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. Dry clean only" />
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

              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false, product: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Product'}</button>
              </div>
            </form>
        </div>
      )}

      {/* Delete Confirmation Alert */}
      {deleteAlert.open && (
        <div className="modal-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ maxWidth: 400, padding: 32, textAlign: 'center', borderRadius: 16 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1.25rem', fontWeight: 600 }}>Confirm Delete</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, lineHeight: 1.5 }}>
              Are you sure you want to delete <strong>{deleteAlert.name}</strong> from database? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <button className="btn btn-outline" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setDeleteAlert({ open: false, type: 'single', id: null, name: '' })}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--danger)', borderColor: 'var(--danger)', color: '#fff' }} onClick={confirmDelete}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
