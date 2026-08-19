import { useState, useEffect } from 'react';
import { categoryAPI, collectionAPI } from '../api/api.js';
import { Plus, Edit, Trash2, Layers3, X } from 'lucide-react';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('categories');
  const [modal, setModal] = useState({ open: false, item: null, type: '' });
  const [form, setForm] = useState({ name: '', description: '', subtitle: '' });
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
    setForm({ name: '', description: '', subtitle: '' });
    setModal({ open: true, item: null, type: tab });
  };

  const openEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', subtitle: item.subtitle || '' });
    setModal({ open: true, item, type: tab });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const api = modal.type === 'categories' ? categoryAPI : collectionAPI;
      if (modal.item) {
        await api.update(modal.item._id, form);
      } else {
        await api.create(form);
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {items.map(item => (
            <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</h3>
                  {item.subtitle && <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, letterSpacing: '0.1em' }}>{item.subtitle}</span>}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn-ghost btn-icon" onClick={() => openEdit(item)}><Edit size={15} /></button>
                  <button className="btn-ghost btn-icon" onClick={() => handleDelete(item._id, item.name, tab)} style={{ color: 'var(--danger)' }}><Trash2 size={15} /></button>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.description || 'No description'}</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slug: <span style={{ color: 'var(--text-secondary)' }}>{item.slug}</span></span>
                <span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>{item.isActive ? 'Active' : 'Inactive'}</span>
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
