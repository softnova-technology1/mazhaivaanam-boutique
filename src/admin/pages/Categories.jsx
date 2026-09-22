import { useState, useEffect, useRef } from 'react';
import { fabricAPI, categoryAPI, uploadAPI } from '../api/api.js';
import { Plus, Edit, Trash2, X, Eye, EyeOff, Sparkles, FolderTree, Upload, Image as ImageIcon } from 'lucide-react';

export default function Categories() {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'fabrics'

  // Data States
  const [categories, setCategories] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal States
  const [modal, setModal] = useState({ open: false, type: null, item: null });

  // Category Form State
  const [catForm, setCatForm] = useState({ name: '', subtitle: '', description: '', isActive: true });
  const [catImage, setCatImage] = useState(null);
  const [catImagePreview, setCatImagePreview] = useState('');
  const fileInputRef = useRef(null);

  // Fabric Form State
  const [fabForm, setFabForm] = useState({ name: '', isActive: true });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'categories') {
        const res = await categoryAPI.getAll(); // GET /api/admin/categories
        setCategories(res.data || []);
      } else {
        const res = await fabricAPI.getAll(); // GET /api/admin/fabrics
        setFabrics(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // ================= FABRIC LOGIC =================
  const openFabricCreate = () => {
    setFabForm({ name: '', isActive: true });
    setModal({ open: true, type: 'fabric', item: null });
  };

  const openFabricEdit = (item) => {
    setFabForm({ name: item.name, isActive: item.isActive !== undefined ? item.isActive : true });
    setModal({ open: true, type: 'fabric', item });
  };

  const handleFabricSave = async (e) => {
    e.preventDefault();
    if (!fabForm.name.trim()) return;
    setSaving(true);
    try {
      const body = { name: fabForm.name.trim(), isActive: fabForm.isActive };
      if (modal.item) {
        await fabricAPI.update(modal.item._id, body);
      } else {
        await fabricAPI.create(body);
      }
      setModal({ open: false, type: null, item: null });
      loadData();
    } catch (err) { alert(err.message || 'Failed to save fabric'); }
    setSaving(false);
  };

  const handleFabricDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await fabricAPI.delete(id);
      loadData();
    } catch (err) { alert(err.message || 'Failed to delete fabric'); }
  };

  const handleFabricToggle = async (item) => {
    try {
      await fabricAPI.update(item._id, { isActive: !item.isActive });
      loadData();
    } catch (err) { alert(err.message || 'Failed to update status'); }
  };

  // ================= CATEGORY LOGIC =================
  const openCategoryCreate = () => {
    setCatForm({ name: '', subtitle: '', description: '', isActive: true });
    setCatImage(null);
    setCatImagePreview('');
    setModal({ open: true, type: 'category', item: null });
  };

  const openCategoryEdit = (item) => {
    setCatForm({
      name: item.name || '',
      subtitle: item.subtitle || '',
      description: item.description || '',
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setCatImage(null);
    setCatImagePreview(item.image?.url || '');
    setModal({ open: true, type: 'category', item });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      setCatImage(file);
      setCatImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCategorySave = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    setSaving(true);
    try {
      let finalImage = modal.item?.image || { url: '', publicId: '' };

      // Upload new image if selected
      if (catImage) {
        const uploadRes = await uploadAPI.upload(catImage, 'mazhaivaanam/categories');
        finalImage = {
          url: uploadRes.data.url,
          publicId: uploadRes.data.publicId
        };
      }

      const body = {
        name: catForm.name.trim(),
        subtitle: catForm.subtitle.trim(),
        description: catForm.description.trim(),
        isActive: catForm.isActive,
        image: finalImage
      };

      if (modal.item) {
        await categoryAPI.update(modal.item._id, body);
      } else {
        await categoryAPI.create(body);
      }
      setModal({ open: false, type: null, item: null });
      loadData();
    } catch (err) { alert(err.message || 'Failed to save category'); }
    setSaving(false);
  };

  const handleCategoryDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? This will only work if no products are attached to it.`)) return;
    try {
      await categoryAPI.delete(id);
      loadData();
    } catch (err) { alert(err.message || 'Failed to delete category'); }
  };

  const handleCategoryToggle = async (item) => {
    try {
      await categoryAPI.update(item._id, { isActive: !item.isActive });
      loadData();
    } catch (err) { alert(err.message || 'Failed to update status'); }
  };


  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: 12 }}>
        <div>
          <h1 className="page-title">Categories & Fabrics</h1>
          <p className="page-subtitle">Manage taxonomy, fabric filters, and menu navigation items</p>
        </div>
        {activeTab === 'categories' ? (
          <button className="btn btn-primary" onClick={openCategoryCreate}><Plus size={18} /> Add Category</button>
        ) : (
          <button className="btn btn-primary" onClick={openFabricCreate}><Plus size={18} /> Add Fabric</button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border-light)' }}>
        <button
          onClick={() => setActiveTab('categories')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'categories' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'categories' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'categories' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.95rem'
          }}
        >
          <FolderTree size={18} /> Product Categories
        </button>
        <button
          onClick={() => setActiveTab('fabrics')}
          style={{
            padding: '12px 24px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'fabrics' ? '2px solid var(--primary)' : '2px solid transparent',
            color: activeTab === 'fabrics' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'fabrics' ? 600 : 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.95rem'
          }}
        >
          <Sparkles size={18} /> Fabrics Library
        </button>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : activeTab === 'categories' ? (
        // CATEGORIES VIEW
        categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No categories added yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Click "+ Add Category" to create your first category.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {categories.map(item => (
              <div
                key={item._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  border: item.isActive ? '1px solid var(--border-light)' : '1px dashed var(--border-light)',
                  opacity: item.isActive ? 1 : 0.75,
                  overflow: 'hidden'
                }}
              >
                <div style={{ height: 120, backgroundColor: '#f3f4f6', position: 'relative' }}>
                  {item.image?.url ? (
                    <img src={item.image.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 4, background: 'rgba(255,255,255,0.9)', padding: 4, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <button className="btn-ghost btn-icon" onClick={() => handleCategoryToggle(item)} style={{ color: item.isActive ? 'var(--primary)' : 'var(--text-muted)', width: 28, height: 28 }} title={item.isActive ? "Deactivate" : "Activate"}>
                      {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button className="btn-ghost btn-icon" onClick={() => openCategoryEdit(item)} title="Edit" style={{ width: 28, height: 28 }}>
                      <Edit size={14} />
                    </button>
                    <button className="btn-ghost btn-icon" onClick={() => handleCategoryDelete(item._id, item.name)} style={{ color: 'var(--danger)', width: 28, height: 28 }} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>{item.name}</h3>
                  {item.subtitle && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', margin: '0 0 8px 0', fontWeight: 500 }}>{item.subtitle}</p>}
                  {item.description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // FABRICS VIEW
        fabrics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>No fabrics added yet.</p>
            <p style={{ fontSize: '0.85rem' }}>Click "+ Add Fabric" to create your first fabric option.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {fabrics.map(item => (
              <div
                key={item._id}
                className="card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'all 0.2s ease',
                  border: item.isActive ? '1px solid var(--border-light)' : '1px dashed var(--border-light)',
                  opacity: item.isActive ? 1 : 0.75
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={16} style={{ color: 'var(--primary)', opacity: 0.8 }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {item.name}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn-ghost btn-icon" onClick={() => handleFabricToggle(item)} style={{ color: item.isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {item.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                    <button className="btn-ghost btn-icon" onClick={() => openFabricEdit(item)}><Edit size={15} /></button>
                    <button className="btn-ghost btn-icon" onClick={() => handleFabricDelete(item._id, item.name)} style={{ color: 'var(--danger)' }}><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* MODALS */}
      {modal.open && modal.type === 'fabric' && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, type: null, item: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.item ? 'Edit' : 'Add'} Fabric</h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false, type: null, item: null })}><X size={20} /></button>
            </div>
            <form onSubmit={handleFabricSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label">Fabric Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="text" className="form-input" value={fabForm.name} onChange={e => setFabForm({ ...fabForm, name: e.target.value })} placeholder="e.g. Pure Silk" autoFocus required />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" id="fab-active" checked={fabForm.isActive} onChange={e => setFabForm({ ...fabForm, isActive: e.target.checked })} style={{ width: 16, height: 16 }} />
                  <label htmlFor="fab-active" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>Active (Visible on website)</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false, type: null, item: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || !fabForm.name.trim()}>
                  {saving ? 'Saving...' : 'Save Fabric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal.open && modal.type === 'category' && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, type: null, item: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.item ? 'Edit' : 'Add'} Category</h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false, type: null, item: null })}><X size={20} /></button>
            </div>
            <form onSubmit={handleCategorySave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '60vh', overflowY: 'auto' }}>
                <div>
                  <label className="form-label">Category Image</label>
                  <div
                    style={{ border: '2px dashed var(--border-light)', borderRadius: 8, padding: 20, textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden', height: 160, backgroundColor: '#f9fafb' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {catImagePreview ? (
                      <img src={catImagePreview} alt="Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)', height: '100%', justifyContent: 'center' }}>
                        <Upload size={24} />
                        <span style={{ fontSize: '0.85rem' }}>Click to upload category cover</span>
                      </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Category Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input type="text" className="form-input" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} placeholder="e.g. Silk Sarees" required />
                </div>
                <div>
                  <label className="form-label">Subtitle (Optional)</label>
                  <input type="text" className="form-input" value={catForm.subtitle} onChange={e => setCatForm({ ...catForm, subtitle: e.target.value })} placeholder="e.g. Handwoven Masterpieces" />
                </div>
                <div>
                  <label className="form-label">Description (Optional)</label>
                  <textarea className="form-input" value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} placeholder="Write a short description..." rows={3} style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" id="cat-active" checked={catForm.isActive} onChange={e => setCatForm({ ...catForm, isActive: e.target.checked })} style={{ width: 16, height: 16 }} />
                  <label htmlFor="cat-active" style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>Active (Visible on menus & shop)</label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false, type: null, item: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving || !catForm.name.trim()}>
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
