import { useState, useEffect } from 'react';
import { fabricAPI } from '../api/api.js';
import { Plus, Edit, Trash2, X, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function Categories() {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, item: null });
  const [form, setForm] = useState({ name: '', isActive: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const fabRes = await fabricAPI.getAll();
      setFabrics(fabRes.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const openCreate = () => {
    setForm({ name: '', isActive: true });
    setModal({ open: true, item: null });
  };

  const openEdit = (item) => {
    setForm({ 
      name: item.name, 
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setModal({ open: true, item });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const body = { 
        name: form.name.trim(), 
        isActive: form.isActive 
      };

      if (modal.item) {
        await fabricAPI.update(modal.item._id, body);
      } else {
        await fabricAPI.create(body);
      }
      setModal({ open: false, item: null });
      load();
    } catch (err) { alert(err.message || 'Failed to save fabric'); }
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await fabricAPI.delete(id);
      load();
    } catch (err) { alert(err.message || 'Failed to delete fabric'); }
  };

  const handleToggleActive = async (item) => {
    try {
      await fabricAPI.update(item._id, { isActive: !item.isActive });
      load();
    } catch (err) { alert(err.message || 'Failed to update status'); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Fabrics</h1>
          <p className="page-subtitle">Manage fabric options for product filters and catalog</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Fabric</button>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : fabrics.length === 0 ? (
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

                {/* Actions */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button 
                    className="btn-ghost btn-icon" 
                    onClick={() => handleToggleActive(item)} 
                    style={{ color: item.isActive ? 'var(--primary)' : 'var(--text-muted)' }}
                    title={item.isActive ? "Deactivate" : "Activate"}
                  >
                    {item.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button className="btn-ghost btn-icon" onClick={() => openEdit(item)} title="Edit Fabric">
                    <Edit size={15} />
                  </button>
                  <button className="btn-ghost btn-icon" onClick={() => handleDelete(item._id, item.name)} style={{ color: 'var(--danger)' }} title="Delete Fabric">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span className={`badge ${item.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clean Add / Edit Modal (No image, no description) */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, item: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.item ? 'Edit' : 'Add'} Fabric</h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false, item: null })}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Fabric Name *</label>
                  <input 
                    className="form-input" 
                    required 
                    autoFocus
                    placeholder="e.g. Cotton, Georgette, Linen..." 
                    value={form.name} 
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  />
                </div>

                <div style={{ marginTop: 4 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <input 
                      type="checkbox" 
                      checked={form.isActive} 
                      onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} 
                    />
                    Active (Visible in customer filters)
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false, item: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Fabric'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
