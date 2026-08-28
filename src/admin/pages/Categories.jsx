import { useState, useEffect } from 'react';
import { categoryAPI, collectionAPI, uploadAPI } from '../api/api.js';
import { Plus, Edit, Trash2, Layers3, X, UploadCloud, ImageIcon, Eye, EyeOff } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('categories');
  const [modal, setModal] = useState({ open: false, item: null, type: '' });
  const [form, setForm] = useState({ name: '', description: '', subtitle: '', isActive: true, imageFile: null, imagePreview: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [catRes, colRes] = await Promise.all([categoryAPI.getAll(), collectionAPI.getAll()]);
      setCategories(catRes.data);
      setCollections(colRes.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const openCreate = () => {
    setForm({ name: '', description: '', subtitle: '', isActive: true, imageFile: null, imagePreview: '' });
    setModal({ open: true, item: null, type: tab });
  };

  const openEdit = (item) => {
    setForm({ 
      name: item.name, 
      description: item.description || '', 
      subtitle: item.subtitle || '',
      isActive: item.isActive !== undefined ? item.isActive : true,
      imageFile: null,
      imagePreview: item.image?.url || ''
    });
    setModal({ open: true, item, type: tab });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const api = modal.type === 'categories' ? categoryAPI : collectionAPI;
      let body = { ...form };

      if (form.imageFile) {
        try {
          const folder = modal.type === 'categories' ? 'mazhaivaanam/categories' : 'mazhaivaanam/collections';
          const uploadRes = await uploadAPI.upload(form.imageFile, folder);
          body.image = { url: uploadRes.url || uploadRes.data?.url, publicId: uploadRes.publicId || uploadRes.data?.publicId };
        } catch (uploadErr) {
          console.warn('Image upload failed, saving without image', uploadErr);
        }
      }

      if (modal.item) {
        await api.update(modal.item._id, body);
      } else {
        await api.create(body);
      }
      setModal({ open: false, item: null, type: '' });
      load();
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const handleDelete = async (id, name, type) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      const api = type === 'categories' ? categoryAPI : collectionAPI;
      await api.delete(id);
      load();
    } catch (err) { alert(err.message); }
  };

  const handleToggleActive = async (item, type) => {
    try {
      const api = type === 'categories' ? categoryAPI : collectionAPI;
      await api.update(item._id, { isActive: !item.isActive });
      load();
    } catch (err) { alert(err.message); }
  };

  const items = tab === 'categories' ? categories : collections;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories & Collections</h1>
          <p className="page-subtitle">Organize your product catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add {tab === 'categories' ? 'Category' : 'Collection'}</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 3, marginBottom: 24, width: 'fit-content' }}>
        <button className={`period-btn ${tab === 'categories' ? 'active' : ''}`} onClick={() => setTab('categories')}>Categories ({categories.length})</button>
        <button className={`period-btn ${tab === 'collections' ? 'active' : ''}`} onClick={() => setTab('collections')}>Collections ({collections.length})</button>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {items.map(item => (
            <div key={item._id} className="card" style={{ display: 'flex', gap: 16, padding: 20 }}>
              {/* Image Thumbnail */}
              <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-hover)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.image?.url ? (
                  <img src={item.image.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</h3>
                  {item.subtitle && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.1em' }}>{item.subtitle}</span>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button 
                    className="btn-ghost btn-icon" 
                    onClick={() => handleToggleActive(item, tab)} 
                    style={{ color: item.isActive ? 'var(--primary)' : 'var(--text-muted)' }}
                    title={item.isActive ? "Deactivate" : "Activate"}
                  >
                    {item.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button className="btn-ghost btn-icon" onClick={() => openEdit(item)}><Edit size={15} /></button>
                  <button className="btn-ghost btn-icon" onClick={() => handleDelete(item._id, item.name, tab)} style={{ color: 'var(--danger)' }}><Trash2 size={15} /></button>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.description || 'No description'}</p>
                <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slug: <span style={{ color: 'var(--text-secondary)' }}>{item.slug}</span></span>
                  <span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>{item.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, item: null, type: '' })}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.item ? 'Edit' : 'Add'} {modal.type === 'categories' ? 'Category' : 'Collection'}</h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false, item: null, type: '' })}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                {/* Image Upload */}
                <div className="form-group" style={{ display: 'flex', gap: 20, alignItems: 'center', background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                    {form.imagePreview ? (
                      <img src={form.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Thumbnail Image</label>
                    <input type="file" id="cat-img" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <label htmlFor="cat-img" className="btn btn-sm btn-outline" style={{ display: 'inline-flex', cursor: 'pointer' }}>
                      <UploadCloud size={16} /> Choose Image
                    </label>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>Recommended: 600x600px square image</p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                {modal.type === 'categories' && (
                  <div className="form-group">
                    <label className="form-label">Subtitle</label>
                    <input className="form-input" placeholder="e.g. CASUAL & CHIC" value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} />
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div style={{ marginTop: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />
                    Active (Visible to customers)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false, item: null, type: '' })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
