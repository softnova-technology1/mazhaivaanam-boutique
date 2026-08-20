import { useState, useEffect } from 'react';
import { contactAPI } from '../api/api.js';
import { MessageSquare, Send, X, Mail, Clock } from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { loadInquiries(); }, [filter]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getAll(filter);
      setInquiries(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await contactAPI.reply(selected._id, reply);
      setReply('');
      setSelected(null);
      loadInquiries();
    } catch (err) { alert(err.message); }
    setSending(false);
  };

  const statusColor = { new: 'badge-info', read: 'badge-warning', replied: 'badge-success', closed: 'badge-neutral' };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Inquiries</h1>
          <p className="page-subtitle">{inquiries.length} inquiries</p>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : inquiries.length === 0 ? (
        <div className="card empty-state">
          <MessageSquare size={40} />
          <p>No inquiries yet</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {inquiries.map(inq => (
            <div key={inq._id} className="card" style={{ cursor: 'pointer', padding: 20 }} onClick={() => { setSelected(inq); setReply(''); }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{inq.subject}</h3>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span><Mail size={12} style={{ display: 'inline', verticalAlign: -2 }} /> {inq.name} ({inq.email})</span>
                    <span><Clock size={12} style={{ display: 'inline', verticalAlign: -2 }} /> {new Date(inq.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <span className={`badge ${statusColor[inq.status] || 'badge-neutral'}`}>{inq.status}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{inq.message}</p>
              {inq.adminReply && (
                <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Reply</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{inq.adminReply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Reply to {selected.name}</h3>
              <button className="btn-ghost btn-icon" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>Original Message — {selected.subject}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{selected.message}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Your Reply</label>
                <textarea className="form-textarea" rows={5} value={reply} onChange={e => setReply(e.target.value)} placeholder="Type your reply..." autoFocus />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setSelected(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleReply} disabled={sending || !reply.trim()}>
                <Send size={16} /> {sending ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
