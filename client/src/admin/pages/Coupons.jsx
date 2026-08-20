import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Ticket, X, ToggleLeft, ToggleRight } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const getToken = () => localStorage.getItem('mv_admin_token');

// Direct API calls since coupons aren't in admin routes yet — we'll hit admin endpoints
async function req(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
  const res = await fetch(`${API}${url}`, { ...options, headers, body: options.body ? JSON.stringify(options.body) : undefined });
  return res.json();
}

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, coupon: null });
  const [form, setForm] = useState({ code: '', description: '', type: 'percentage', value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', validUntil: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await req('/admin/coupons');
      if (res.success) setCoupons(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const openCreate = () => {
    setForm({ code: '', description: '', type: 'percentage', value: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', validUntil: '' });
    setModal({ open: true, coupon: null });
  };

  const openEdit = (c) => {
    setForm({
      code: c.code, description: c.description || '', type: c.type, value: c.value,
      minOrderAmount: c.minOrderAmount || '', maxDiscount: c.maxDiscount || '',
      usageLimit: c.usageLimit || '', validUntil: c.validUntil?.slice(0, 10) || '',
    });
    setModal({ open: true, coupon: c });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...form,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      };
      if (modal.coupon) {
        await req(`/admin/coupons/${modal.coupon._id}`, { method: 'PUT', body });
      } else {
        await req('/admin/coupons', { method: 'POST', body });
      }
      setModal({ open: false, coupon: null });
      loadCoupons();
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const handleDelete = async (id, code) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await req(`/admin/coupons/${id}`, { method: 'DELETE' });
      loadCoupons();
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Coupons</h1>
          <p className="page-subtitle">{coupons.length} discount codes</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Create Coupon</button>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : coupons.length === 0 ? (
        <div className="card empty-state">
          <Ticket size={40} />
          <p>No coupons yet. Create your first discount code!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Value</th>
                <th>Min Order</th>
                <th>Usage</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.05em' }}>{c.code}</td>
                  <td>{c.type === 'percentage' ? 'Percentage' : 'Fixed'}</td>
                  <td style={{ fontWeight: 600 }}>{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}{c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ''}</td>
                  <td>{c.minOrderAmount ? `₹${c.minOrderAmount.toLocaleString('en-IN')}` : '—'}</td>
                  <td>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ' / ∞'}</td>
                  <td style={{ color: new Date(c.validUntil) < new Date() ? 'var(--danger)' : 'var(--text-muted)' }}>{new Date(c.validUntil).toLocaleDateString('en-IN')}</td>
                  <td><span className={`badge ${c.isActive && new Date(c.validUntil) > new Date() ? 'badge-success' : 'badge-danger'}`}>{c.isActive && new Date(c.validUntil) > new Date() ? 'Active' : 'Expired'}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button className="btn-ghost btn-icon" onClick={() => openEdit(c)}><Edit size={16} /></button>
                      <button className="btn-ghost btn-icon" onClick={() => handleDelete(c._id, c.code)} style={{ color: 'var(--danger)' }}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal.open && (
        <div className="modal-overlay" onClick={() => setModal({ open: false, coupon: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.coupon ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button className="btn-ghost btn-icon" onClick={() => setModal({ open: false, coupon: null })}><X size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Coupon Code</label>
                    <input className="form-input" required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="e.g. MAZHAI20" style={{ textTransform: 'uppercase' }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Festival discount" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Discount Value</label>
                    <input className="form-input" type="number" min="0" required value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Discount (₹)</label>
                    <input className="form-input" type="number" min="0" value={form.maxDiscount} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} placeholder="No limit" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Min Order Amount (₹)</label>
                    <input className="form-input" type="number" min="0" value={form.minOrderAmount} onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} placeholder="No minimum" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Usage Limit</label>
                    <input className="form-input" type="number" min="0" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} placeholder="Unlimited" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Valid Until</label>
                  <input className="form-input" type="date" required value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setModal({ open: false, coupon: null })}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Coupon'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
