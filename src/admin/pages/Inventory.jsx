import { useState, useEffect } from 'react';
import { inventoryAPI, productAPI, uploadAPI, fabricAPI } from '../api/api.js';

const PERMANENT_CATEGORIES = ['Everyday Elegance', 'Black Magic', 'Festive Glow', 'Style Studio'];
import { exportToCSV } from '../utils/exportCSV.js';
import { PackageSearch, AlertTriangle, PackageX, RotateCcw, X, Search, Trash2, Plus, UploadCloud, Download, EyeOff, Eye, ArrowLeft } from 'lucide-react';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [fabricsList, setFabricsList] = useState([]);
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
    fabricAPI.getAll().then(res => setFabricsList(res.data || [])).catch(() => { });
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
      name: '', description: '', category: PERMANENT_CATEGORIES[0] || '',
      occasion: 'Traditional', tag: '', imageUrl: '', isFeatured: false,
      isActive: true, imageFile: null, imagePreview: '',
      sec1File: null, sec1Preview: '', sec2File: null, sec2Preview: ''
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

      if (!form.imageFile && !form.imagePreview) {
        alert('Please upload or provide a primary product image');
        setSaving(false);
        return;
      }

      const prepareImage = async (file, preview) => {
        if (file) {
          try {
            const res = await uploadAPI.upload(file);
            return { url: res.data.url, publicId: res.data.publicId || '' };
          } catch (e) {
            console.warn('Upload failed:', e);
            return { url: (preview && !preview.startsWith('blob:')) ? preview : '', publicId: '' };
          }
        } else if (preview && !preview.startsWith('blob:')) {
          return { url: preview, publicId: '' };
        }
        return null;
      };

      const res1 = await prepareImage(form.imageFile, form.imagePreview);
      const res2 = await prepareImage(form.sec1File, form.sec1Preview);
      const res3 = await prepareImage(form.sec2File, form.sec2Preview);

      body.images = [res1, res2, res3]
        .filter(img => img && img.url)
        .map(({ _id, ...rest }) => rest);

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
      {!modal.open ? (
        <>
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
          {PERMANENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                          {(() => {
                            const rawUrl = inv.product?.images?.[0]?.url;
                            const safeUrl = (rawUrl && typeof rawUrl === 'string' && !rawUrl.startsWith('blob:')) ? rawUrl : '/Images/placeholder.svg';
                            return (
                              <img 
                                src={safeUrl} 
                                alt={inv.product?.name || ''} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/Images/placeholder.svg';
                                }}
                              />
                            );
                          })()}
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
      </>
    ) : (
      /* Create Form Page */
      <div className="form-page-container">
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <button className="btn btn-outline" onClick={() => setModal({ open: false })} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={16} /> Back to Inventory
          </button>
          <h2 className="page-title">Add New Product</h2>
        </div>
        <form onSubmit={handleSaveProduct} style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 32, border: '1px solid var(--border-color)' }}>
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
                      onClick={() => document.getElementById('inventory-product-image-upload').click()}
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
                        id="inventory-product-image-upload"
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
                        onClick={() => document.getElementById('inventory-sec1-upload').click()}
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
                        <input id="inventory-sec1-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
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
                        onClick={() => document.getElementById('inventory-sec2-upload').click()}
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
                        <input id="inventory-sec2-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
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
                        {PERMANENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Fabric</label>
                      <select className="form-select" required value={form.fabric} onChange={e => setForm(f => ({ ...f, fabric: e.target.value }))}>
                        <option value="">Select Fabric</option>
                        {fabricsList.map(f => <option key={f._id} value={f.name}>{f.name}</option>)}
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

              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Product'}</button>
              </div>
            </form>
        </div>
      )}
    </div>
  );
}
