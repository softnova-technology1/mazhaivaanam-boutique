import { useState, useEffect } from 'react';
import { inventoryAPI, productAPI, categoryAPI, uploadAPI } from '../api/api.js';
import { exportToCSV } from '../utils/exportCSV.js';
import { PackageSearch, AlertTriangle, PackageX, RotateCcw, X, Search, Trash2, Plus, UploadCloud, Download, EyeOff, Eye } from 'lucide-react';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [restockModal, setRestockModal] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  const [restockNote, setRestockNote] = useState('');
  
  // Create Product Modal State
  const [modal, setModal] = useState({ open: false });
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  // Multi-select State
  const [selectedItems, setSelectedItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => { 
    loadInventory();
    categoryAPI.getAll().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedItems([]);
  }, [searchQuery, categoryFilter, filter]);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await inventoryAPI.getAll();
      setInventory(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleExportCSV = (exportSelected = false) => {
    const listToExport = exportSelected
      ? filtered.filter(i => selectedItems.includes(i._id))
      : filtered;

    if (!listToExport.length) {
      alert('No inventory data to export');
      return;
    }

    const columns = [
      { key: 'product.name', label: 'Product Name' },
      { key: 'product.category.name', label: 'Category' },
      { key: 'product.price', label: 'Price (INR)' },
      { key: 'totalStock', label: 'Total Stock' },
      { key: 'reserved', label: 'Reserved Stock' },
      { key: 'sold', label: 'Sold Stock' },
      { key: 'availableStock', label: 'Available Stock' },
      { key: 'stockLevel', label: 'Stock Level %', formatter: (inv) => `${Math.round(Math.min(100, (inv.availableStock / (inv.totalStock || 1)) * 100))}%` },
      { key: 'status', label: 'Stock Status', formatter: (inv) => inv.isOutOfStock ? 'Out of Stock' : inv.isLowStock ? 'Low Stock' : 'In Stock' },
    ];

    exportToCSV(filtered, columns, 'MazhaiVaanam_Inventory_Stock');
  };

  const handleRestock = async () => {
    if (!restockQty || Number(restockQty) <= 0) return;
    try {
      await inventoryAPI.restock(restockModal.product?._id, { quantity: Number(restockQty), note: restockNote });
      setRestockModal(null);
      setRestockQty('');
      setRestockNote('');
      loadInventory();
    } catch (err) { alert(err.message); }
  };

  const handleHardDelete = async (product) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete "${product.name}"? This cannot be undone.`)) {
      try {
        await productAPI.hardDelete(product._id);
        loadInventory();
      } catch (err) { alert(err.message); }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete ${selectedItems.length} selected products?`)) {
      try {
        const productsToDelete = filtered.filter(i => selectedItems.includes(i._id)).map(i => i.product._id);
        await Promise.all(productsToDelete.map(id => productAPI.hardDelete(id)));
        setSelectedItems([]);
        loadInventory();
      } catch (err) { alert(err.message); }
    }
  };

  const handleBulkToggleActive = async (isActive) => {
    const action = isActive ? 'activate' : 'deactivate';
    if (window.confirm(`Are you sure you want to ${action} ${selectedItems.length} selected products?`)) {
      try {
        const productsToToggle = filtered.filter(i => selectedItems.includes(i._id)).map(i => i.product._id);
        await Promise.all(productsToToggle.map(id => productAPI.update(id, { isActive })));
        setSelectedItems([]);
        loadInventory();
      } catch (err) { alert(err.message); }
    }
  };

  const openCreate = () => {
    setForm({
      name: '', description: '', category: categories[0]?._id || '',
      fabric: 'Pure Silk', price: '', mrpPrice: '', stock: 25,
      occasion: 'Traditional', tag: '', imageUrl: '', isFeatured: false,
      isActive: true, imageFile: null, imagePreview: '/Images/saree1.png'
    });
    setModal({ open: true });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        name: form.name, description: form.description, category: form.category,
        fabric: form.fabric, price: Number(form.price), mrpPrice: Number(form.mrpPrice) || 0,
        stock: Number(form.stock) || 0, occasion: form.occasion, tag: form.tag || null,
        isFeatured: Boolean(form.isFeatured), isActive: Boolean(form.isActive),
      };

      if (form.imageFile) {
        try {
          const res = await uploadAPI.upload(form.imageFile);
          body.images = [{ url: res.data.url, publicId: res.data.publicId }];
        } catch (uploadErr) {
          console.warn('Upload API fallback:', uploadErr);
          body.images = [{ url: form.imagePreview || '/Images/saree1.png', publicId: '' }];
        }
      } else if (form.imageUrl && form.imageUrl.trim()) {
        body.images = [{ url: form.imageUrl.trim(), publicId: '' }];
      } else {
        body.images = [{ url: form.imagePreview || '/Images/saree1.png', publicId: '' }];
      }

      await productAPI.create(body);
      setModal({ open: false });
      loadInventory(); // Refresh inventory
    } catch (err) {
      alert(err.message || 'Error saving product');
    }
    setSaving(false);
  };

  // Base filter: Category and Search only
  const baseFiltered = inventory.filter(inv => {
    let match = true;
    if (categoryFilter) {
      match = inv.product?.category?._id === categoryFilter || inv.product?.category?.slug === categoryFilter;
    }
    if (match && searchQuery) {
      match = (inv.product?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    }
    return match;
  });

  // Final filter: applies the Status card filter on top of base
  const filtered = baseFiltered.filter(inv => {
    if (filter === 'low') return inv.isLowStock && !inv.isOutOfStock && inv.product?.isActive !== false;
    if (filter === 'out') return inv.isOutOfStock && inv.product?.isActive !== false;
    if (filter === 'deactivated') return inv.product?.isActive === false;
    return inv.product?.isActive !== false;
  });

  const totalCount = baseFiltered.filter(i => i.product?.isActive !== false).length;
  const lowCount = baseFiltered.filter(i => i.isLowStock && !i.isOutOfStock && i.product?.isActive !== false).length;
  const outCount = baseFiltered.filter(i => i.isOutOfStock && i.product?.isActive !== false).length;
  const inactiveCount = baseFiltered.filter(i => i.product?.isActive === false).length;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedInventory = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">{totalCount} products tracked</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-outline" 
            onClick={() => handleExportCSV(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={16} /> Export All to CSV
          </button>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
          <Search size={16} />
          <input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="form-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      {/* Selected Action Bar */}
      {selectedItems.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-secondary)',
          padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary)',
          marginBottom: 20
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
            {selectedItems.length} selected
          </span>
          <button className="btn btn-sm btn-outline" onClick={() => handleExportCSV(true)}>
            <Download size={14} /> Export Selected
          </button>
          <button className="btn btn-sm btn-outline" style={{ color: 'var(--warning)', borderColor: 'var(--warning)' }} onClick={() => handleBulkToggleActive(false)}>
            <EyeOff size={14} /> Deactivate
          </button>
          <button className="btn btn-sm btn-outline" style={{ color: 'var(--success)', borderColor: 'var(--success)' }} onClick={() => handleBulkToggleActive(true)}>
            <Eye size={14} /> Activate
          </button>
          <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={handleBulkDelete}>
            <Trash2 size={14} /> Delete Selected
          </button>
        </div>
      )}

      {/* Alert Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filter === 'all' ? '1px solid var(--primary)' : undefined }} onClick={() => setFilter('all')}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}><PackageSearch size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{totalCount}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Products</div></div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filter === 'low' ? '1px solid var(--warning)' : undefined }} onClick={() => setFilter('low')}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}><AlertTriangle size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700, color: lowCount > 0 ? 'var(--warning)' : undefined }}>{lowCount}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Low Stock</div></div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filter === 'out' ? '1px solid var(--danger)' : undefined }} onClick={() => setFilter('out')}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><PackageX size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700, color: outCount > 0 ? 'var(--danger)' : undefined }}>{outCount}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Out of Stock</div></div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filter === 'deactivated' ? '1px solid #6B7280' : undefined }} onClick={() => setFilter('deactivated')}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(107,114,128,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}><EyeOff size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700, color: inactiveCount > 0 ? '#6B7280' : undefined }}>{inactiveCount}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deactivated</div></div>
        </div>
      </div>

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
                    checked={paginatedInventory.length > 0 && selectedItems.length === paginatedInventory.length}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedItems(paginatedInventory.map(i => i._id));
                      else setSelectedItems([]);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ width: 50, textAlign: 'center' }}>#</th>
                <th>Product</th>
                <th>Total Stock</th>
                <th>Reserved</th>
                <th>Sold</th>
                <th>Available</th>
                <th>Stock Level</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInventory.map((inv, idx) => {
                const avail = inv.availableStock;
                const total = inv.totalStock || 1;
                const pct = Math.min(100, (avail / total) * 100);
                const barColor = inv.isOutOfStock ? 'var(--danger)' : inv.isLowStock ? 'var(--warning)' : 'var(--success)';
                const isSelected = selectedItems.includes(inv._id);
                return (
                  <tr key={inv._id} style={{ background: isSelected ? 'rgba(200, 163, 77, 0.08)' : undefined }}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => setSelectedItems(prev => prev.includes(inv._id) ? prev.filter(i => i !== inv._id) : [...prev, inv._id])}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                      {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 6, background: 'var(--bg-secondary)', overflow: 'hidden', flexShrink: 0 }}>
                          {inv.product?.images?.[0]?.url && <img src={inv.product.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{inv.product?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td>{inv.totalStock}</td>
                    <td>{inv.reserved}</td>
                    <td>{inv.sold}</td>
                    <td style={{ fontWeight: 600, color: barColor }}>{avail}</td>
                    <td>
                      <div className="stock-bar-wrap">
                        <div className="stock-bar-bg">
                          <div className="stock-bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                        </div>
                        <div className="stock-bar-label">{Math.round(pct)}%</div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${inv.product?.isActive === false ? 'badge-secondary' : inv.isOutOfStock ? 'badge-danger' : inv.isLowStock ? 'badge-warning' : 'badge-success'}`}>
                        {inv.product?.isActive === false ? 'Deactivated' : inv.isOutOfStock ? 'Out of Stock' : inv.isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setRestockModal(inv)}><RotateCcw size={14} /> Restock</button>
                      <button className="btn btn-outline btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => handleHardDelete(inv.product)}><Trash2 size={14} /></button>
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

      {/* Restock Modal */}
      {restockModal && (
        <div className="modal-overlay" onClick={() => setRestockModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3 className="modal-title">Restock: {restockModal.product?.name}</h3>
              <button className="btn-ghost btn-icon" onClick={() => setRestockModal(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 16, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Current: {restockModal.availableStock} available / {restockModal.totalStock} total
              </div>
              <div className="form-group">
                <label className="form-label">Quantity to Add</label>
                <input className="form-input" type="number" min="1" value={restockQty} onChange={e => setRestockQty(e.target.value)} autoFocus placeholder="e.g. 20" />
              </div>
              <div className="form-group">
                <label className="form-label">Note (optional)</label>
                <input className="form-input" value={restockNote} onChange={e => setRestockNote(e.target.value)} placeholder="e.g. Restock from supplier" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setRestockModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRestock}>Restock</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ open: false })}>
          <div className="modal-content" style={{ maxWidth: 850, width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Product</h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false })}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProduct}>
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
                    onClick={() => document.getElementById('inventory-product-image-upload').click()}
                  >
                    {form.imagePreview ? (
                      <>
                        <img src={form.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div 
                          style={{ 
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            opacity: 0, transition: 'opacity 0.2s' 
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
                      id="inventory-product-image-upload" 
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
                      <label className="form-label">Price (₹)</label>
                      <input className="form-input" type="number" required min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">MRP Price (₹)</label>
                      <input className="form-input" type="number" min="0" value={form.mrpPrice} onChange={e => setForm(f => ({ ...f, mrpPrice: e.target.value }))} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Initial Stock</label>
                      <input className="form-input" type="number" min="0" value={form.stock ?? 25} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Occasion</label>
                      <select className="form-select" value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value }))}>
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
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
