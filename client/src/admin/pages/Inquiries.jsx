import { useState, useEffect } from 'react';
import { contactAPI } from '../api/api.js';
import { MessageSquare, Send, X, Mail, Clock, Phone, MessageCircle, ExternalLink, CheckCircle } from 'lucide-react';

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
      setInquiries(res.data || []);
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

  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Inquiries & Concierge</h1>
          <p className="page-subtitle">
            {inquiries.length} inquiries received {newCount > 0 && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>({newCount} new messages)</span>}
          </p>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 200 }}>
          <option value="">All Statuses ({inquiries.length})</option>
          <option value="new">New / Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : inquiries.length === 0 ? (
        <div className="card empty-state" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <MessageSquare size={44} style={{ color: 'var(--primary)', margin: '0 auto 12px auto', opacity: 0.6 }} />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 6 }}>No inquiries found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Customer submissions from your contact form will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {inquiries.map(inq => {
            const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '';
            const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
            const waText = encodeURIComponent(`Vanakkam ${inq.name}, thank you for contacting Mazhai Vaanam Boutique regarding "${inq.subject}". How may our saree curators assist you today?`);

            return (
              <div 
                key={inq._id} 
                className="card" 
                style={{ 
                  padding: 22, 
                  borderLeft: inq.status === 'new' ? '4px solid var(--primary)' : '1px solid var(--border-color)',
                  background: inq.status === 'new' ? 'rgba(200, 163, 77, 0.04)' : 'var(--bg-surface)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                        {inq.subject || 'General Inquiry'}
                      </h3>
                      <span className={`badge ${statusColor[inq.status] || 'badge-neutral'}`}>{inq.status}</span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 6 }}>
                      <span><strong>{inq.name}</strong></span>
                      <span><Mail size={12} style={{ display: 'inline', verticalAlign: -2 }} /> {inq.email}</span>
                      {inq.phone && (
                        <span><Phone size={12} style={{ display: 'inline', verticalAlign: -2 }} /> {inq.phone}</span>
                      )}
                      <span><Clock size={12} style={{ display: 'inline', verticalAlign: -2 }} /> {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {cleanPhone && (
                      <a 
                        href={`https://wa.me/${waNumber}?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm"
                        style={{ background: '#25D366', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '6px 12px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </a>
                    )}
                    {cleanPhone && (
                      <a 
                        href={`tel:${cleanPhone}`}
                        className="btn btn-sm btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '6px 12px', borderRadius: 6, textDecoration: 'none' }}
                      >
                        <Phone size={14} /> Call
                      </a>
                    )}
                    <a 
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Mazhai Vaanam Inquiry')}`}
                      className="btn btn-sm btn-outline"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '6px 12px', borderRadius: 6, textDecoration: 'none' }}
                    >
                      <Mail size={14} /> Email
                    </a>
                    <button 
                      onClick={() => { setSelected(inq); setReply(inq.adminReply || ''); }}
                      className="btn btn-sm btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '6px 12px', borderRadius: 6 }}
                    >
                      <Send size={14} /> Reply
                    </button>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '14px 16px', borderRadius: 8, marginTop: 8 }}>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{inq.message}</p>
                </div>

                {inq.adminReply && (
                  <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(200, 163, 77, 0.08)', borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Reply ({new Date(inq.repliedAt || inq.updatedAt).toLocaleDateString('en-IN')})</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>{inq.adminReply}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <h3 className="modal-title">Reply to {selected.name}</h3>
              <button className="btn-ghost btn-icon" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>Original Message — {selected.subject}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{selected.message}</p>
              </div>
              <div className="form-group">
                <label className="form-label">Your Email Reply to {selected.email}</label>
                <textarea 
                  className="form-textarea" 
                  rows={5} 
                  value={reply} 
                  onChange={e => setReply(e.target.value)} 
                  placeholder="Type your official response..." 
                  autoFocus 
                />
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
