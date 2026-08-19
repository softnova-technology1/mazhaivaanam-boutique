import { useState, useEffect } from 'react';
import { inventoryAPI } from '../api/api.js';
import { PackageSearch, AlertTriangle, PackageX, RotateCcw, X } from 'lucide-react';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [restockModal, setRestockModal] = useState(null);
  const [restockQty, setRestockQty] = useState('');
  const [restockNote, setRestockNote] = useState('');

  useEffect(() => { loadInventory(); }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await inventoryAPI.getAll();
      setInventory(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
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

  const filtered = inventory.filter(inv => {
    if (filter === 'low') return inv.isLowStock && !inv.isOutOfStock;
    if (filter === 'out') return inv.isOutOfStock;
    return true;
  });

  const lowCount = inventory.filter(i => i.isLowStock && !i.isOutOfStock).length;
  const outCount = inventory.filter(i => i.isOutOfStock).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">{inventory.length} products tracked</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filter === 'all' ? '1px solid var(--primary)' : undefined }} onClick={() => setFilter('all')}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}><PackageSearch size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{inventory.length}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Products</div></div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filter === 'low' ? '1px solid var(--warning)' : undefined }} onClick={() => setFilter('low')}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}><AlertTriangle size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700, color: lowCount > 0 ? 'var(--warning)' : undefined }}>{lowCount}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Low Stock</div></div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18, cursor: 'pointer', border: filter === 'out' ? '1px solid var(--danger)' : undefined }} onClick={() => setFilter('out')}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><PackageX size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700, color: outCount > 0 ? 'var(--danger)' : undefined }}>{outCount}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Out of Stock</div></div>
        </div>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
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
              {filtered.map(inv => {
                const avail = inv.availableStock;
                const total = inv.totalStock || 1;
                const pct = Math.min(100, (avail / total) * 100);
                const barColor = inv.isOutOfStock ? 'var(--danger)' : inv.isLowStock ? 'var(--warning)' : 'var(--success)';
                return (
                  <tr key={inv._id}>
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
                      <span className={`badge ${inv.isOutOfStock ? 'badge-danger' : inv.isLowStock ? 'badge-warning' : 'badge-success'}`}>
                        {inv.isOutOfStock ? 'Out of Stock' : inv.isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setRestockModal(inv)}><RotateCcw size={14} /> Restock</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
    </div>
  );
}
