import { useState, useEffect } from 'react';
import { contactAPI } from '../api/api.js';
import {
  MessageSquare, Send, X, Mail, Clock, Phone, MessageCircle,
  ExternalLink, CheckCircle, Trash2, Eye, Download, Search, ZoomIn
} from 'lucide-react';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Lightbox Modal state
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    loadInquiries();
  }, [filter]);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getAll(filter);
      const data = res.data || [];
      setInquiries(data);

      // Auto-select first inquiry if none selected or current selected is gone
      if (data.length > 0) {
        setSelectedInquiry(prev => {
          if (!prev) return data[0];
          const exists = data.find(i => i._id === prev._id);
          return exists || data[0];
        });
      } else {
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    }
    setLoading(false);
  };

  const handleSelectInquiry = (inq) => {
    setSelectedInquiry(inq);
    setReplyText(inq.adminReply || '');
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedInquiry) return;
    setSending(true);
    try {
      await contactAPI.reply(selectedInquiry._id, replyText);
      alert('Reply sent successfully!');
      loadInquiries();
    } catch (err) {
      alert(err.message || 'Failed to send reply');
    }
    setSending(false);
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this customer inquiry? This action cannot be undone.')) {
      return;
    }
    setDeletingId(id);
    try {
      await contactAPI.delete(id);
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
      }
      await loadInquiries();
    } catch (err) {
      alert(err.message || 'Failed to delete inquiry');
    }
    setDeletingId(null);
  };

  const statusColor = {
    new: 'badge-info',
    read: 'badge-warning',
    replied: 'badge-success',
    closed: 'badge-neutral'
  };

  const filteredInquiries = inquiries.filter(inq => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      inq.name?.toLowerCase().includes(term) ||
      inq.email?.toLowerCase().includes(term) ||
      inq.phone?.includes(term) ||
      inq.subject?.toLowerCase().includes(term) ||
      inq.message?.toLowerCase().includes(term)
    );
  });

  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <h1 className="page-title">Customer Inquiries & Concierge</h1>
          <p className="page-subtitle">
            {inquiries.length} total inquiries {newCount > 0 && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>({newCount} new unread)</span>}
          </p>
        </div>
      </div>

      {/* 2-Column Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: 24, alignItems: 'start' }}>

        {/* LEFT COLUMN: Master List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Filters & Search */}
          <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search name, email, message..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: 36, fontSize: '0.85rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                className="form-select"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">All Statuses ({inquiries.length})</option>
                <option value="new">New / Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* List of Inquiry Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 'calc(100vh - 60px)', overflowY: 'auto', paddingRight: 4 }}>
            {loading ? (
              <div className="loader" style={{ padding: 40 }}><div className="spinner" /></div>
            ) : filteredInquiries.length === 0 ? (
              <div className="card empty-state" style={{ textAlign: 'center', padding: '36px 16px' }}>
                <MessageSquare size={36} style={{ color: 'var(--primary)', opacity: 0.5, margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '0.95rem', margin: '0 0 4px 0' }}>No inquiries found</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredInquiries.map(inq => {
                const isSelected = selectedInquiry?._id === inq._id;
                return (
                  <div
                    key={inq._id}
                    onClick={() => handleSelectInquiry(inq)}
                    className="card"
                    style={{
                      padding: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      borderLeft: inq.status === 'new' ? '4px solid var(--primary)' : isSelected ? '4px solid #2563eb' : '1px solid var(--border-color)',
                      background: isSelected
                        ? 'rgba(200, 163, 77, 0.12)'
                        : inq.status === 'new'
                          ? 'rgba(200, 163, 77, 0.04)'
                          : 'var(--bg-surface)',
                      boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                        {inq.name}
                      </h4>
                      <span className={`badge ${statusColor[inq.status] || 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                        {inq.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inq.subject || 'General Inquiry'}
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 10px 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>
                      {inq.message}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>
                        <Clock size={11} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} />
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>

                      {inq.attachments && inq.attachments.length > 0 && (
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          📎 {inq.attachments.length} attachment{inq.attachments.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Detail View & Actions */}
        <div>
          {!selectedInquiry ? (
            <div className="card" style={{ padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
              <MessageSquare size={54} style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: 16 }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 6 }}>Select an Inquiry</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 320 }}>
                Click on any message from the left list to view customer details, attached images, and respond.
              </p>
            </div>
          ) : (
            <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {selectedInquiry.subject || 'General Inquiry'}
                    </h2>
                    <span className={`badge ${statusColor[selectedInquiry.status] || 'badge-neutral'}`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Received on {new Date(selectedInquiry.createdAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(selectedInquiry._id, e)}
                  disabled={deletingId === selectedInquiry._id}
                  className="btn btn-sm btn-outline"
                  style={{ color: '#dc2626', borderColor: '#fca5a5', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
                  title="Delete this inquiry permanently"
                >
                  <Trash2 size={15} />
                  {deletingId === selectedInquiry._id ? 'Deleting...' : 'Delete Inquiry'}
                </button>
              </div>

              {/* Customer Contact & Quick Action Bar */}
              <div style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                    {selectedInquiry.name}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span><Mail size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} /> {selectedInquiry.email}</span>
                    {selectedInquiry.phone && (
                      <span><Phone size={13} style={{ display: 'inline', verticalAlign: -2, marginRight: 4 }} /> {selectedInquiry.phone}</span>
                    )}
                  </div>
                </div>

                {/* Direct Connect Buttons */}
                {(() => {
                  const cleanPhone = selectedInquiry.phone ? selectedInquiry.phone.replace(/[^0-9]/g, '') : '';
                  const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                  const waText = encodeURIComponent(`Vanakkam ${selectedInquiry.name}, thank you for contacting Mazhai Vaanam Boutique regarding "${selectedInquiry.subject}". How may our saree curators assist you today?`);

                  return (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${waNumber}?text=${waText}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm"
                          style={{ background: '#25D366', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '7px 14px', borderRadius: 6, textDecoration: 'none', fontWeight: 600 }}
                        >
                          <MessageCircle size={15} /> WhatsApp
                        </a>
                      )}
                      {cleanPhone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="btn btn-sm btn-outline"
                          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '7px 14px', borderRadius: 6, textDecoration: 'none' }}
                        >
                          <Phone size={15} /> Call
                        </a>
                      )}
                      <a
                        href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject || 'Mazhai Vaanam Inquiry')}`}
                        className="btn btn-sm btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '7px 14px', borderRadius: 6, textDecoration: 'none' }}
                      >
                        <Mail size={15} /> Email
                      </a>
                    </div>
                  );
                })()}
              </div>

              {/* Inquiry Message Box */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  Customer Message
                </h4>
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: 18, borderRadius: 10, lineHeight: 1.7, fontSize: '0.92rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                  {selectedInquiry.message}
                </div>
              </div>

              {/* ATTACHED REFERENCE STYLES (IMAGES & PDFS) */}
              {selectedInquiry.attachments && selectedInquiry.attachments.length > 0 && (
                <div style={{ marginTop: 6 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    📎 Attached Reference Styles ({selectedInquiry.attachments.length})
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
                    {selectedInquiry.attachments.map((att, idx) => {
                      const isPdf = att.fileType?.includes('pdf') || att.name?.toLowerCase().endsWith('.pdf');

                      if (isPdf) {
                        return (
                          <div
                            key={idx}
                            style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--border-color)',
                              borderRadius: 10,
                              padding: 14,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8,
                              alignItems: 'flex-start'
                            }}
                          >
                            <div style={{ fontSize: '2rem' }}>📄</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                              {att.name || 'Reference Document.pdf'}
                            </div>
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={att.name || 'reference_style.pdf'}
                              style={{ fontSize: '0.78rem', color: '#2563eb', textDecoration: 'underline', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              Open PDF <ExternalLink size={12} />
                            </a>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={idx}
                          style={{
                            position: 'relative',
                            borderRadius: 10,
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            background: '#000',
                            group: 'true',
                            cursor: 'pointer',
                          }}
                          onClick={() => setLightboxImage({ url: att.url, name: att.name })}
                        >
                          <img
                            src={att.url}
                            alt={att.name || `Reference ${idx + 1}`}
                            style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(0,0,0,0.45)',
                              display: 'flex',
                              flexDirection: 'column',
                              justify: 'center',
                              alignItems: 'center',
                              color: '#fff',
                              opacity: 0.9,
                              transition: 'opacity 0.2s ease',
                              padding: 8,
                              textAlign: 'center'
                            }}
                          >
                            <ZoomIn size={24} style={{ marginBottom: 4 }} />
                            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Click to View Full</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Past Reply Record */}
              {selectedInquiry.adminReply && (
                <div style={{ background: 'rgba(200, 163, 77, 0.08)', borderRadius: 10, padding: 16, borderLeft: '4px solid var(--primary)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={14} /> Replied on {new Date(selectedInquiry.repliedAt || selectedInquiry.updatedAt).toLocaleString('en-IN')}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    {selectedInquiry.adminReply}
                  </p>
                </div>
              )}

              {/* Reply Response Form */}
              <div style={{ marginTop: 10, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Send size={15} style={{ color: 'var(--primary)' }} /> Send Official Email Response
                </h4>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`Type your reply to ${selectedInquiry.email}...`}
                    style={{ fontSize: '0.9rem', lineHeight: 1.6 }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <button
                    onClick={handleReply}
                    disabled={sending || !replyText.trim()}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Send size={16} />
                    {sending ? 'Sending Email...' : 'Send Response'}
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX IMAGE MODAL */}
      {lightboxImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'center',
            alignItems: 'center',
            padding: 20,
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setLightboxImage(null)}
        >
          {/* Header Action Bar */}
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
            onClick={e => e.stopPropagation()}
          >
            <a
              href={lightboxImage.url}
              target="_blank"
              rel="noopener noreferrer"
              download={lightboxImage.name || 'reference_image.jpeg'}
              className="btn btn-sm"
              style={{ background: '#ffffff', color: '#111827', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
            >
              <Download size={16} /> Download
            </a>
            <button
              onClick={() => setLightboxImage(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                width: 38,
                height: 38,
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                transition: 'background 0.2s ease',
              }}
            >
              <X size={22} />
            </button>
          </div>

          {/* Image Container */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={lightboxImage.url}
              alt={lightboxImage.name || 'Full view'}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                border: '2px solid rgba(255,255,255,0.1)',
              }}
            />
            {lightboxImage.name && (
              <div style={{ color: '#e5e7eb', marginTop: 12, fontSize: '0.9rem', fontWeight: 500 }}>
                {lightboxImage.name}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
