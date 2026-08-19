import { useState, useEffect } from 'react';
import { reviewAPI } from '../api/api.js';
import { Star, Check, Trash2 } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewAPI.getPending();
      setReviews(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    try {
      await reviewAPI.approve(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await reviewAPI.delete(id);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reviews</h1>
          <p className="page-subtitle">{reviews.length} pending reviews awaiting moderation</p>
        </div>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : reviews.length === 0 ? (
        <div className="card empty-state">
          <Star size={40} />
          <p>No pending reviews — all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {reviews.map(review => (
            <div key={review._id} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={16} fill={i < review.rating ? '#C8A34D' : 'transparent'} stroke={i < review.rating ? '#C8A34D' : 'var(--text-muted)'} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{review.name}</span>
                  {review.isVerified && <span className="badge badge-success">Verified Purchase</span>}
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{review.text}</p>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Product: <strong style={{ color: 'var(--primary)' }}>{review.product?.name || 'Unknown'}</strong></span>
                  <span>By: {review.user?.email}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button className="btn btn-primary btn-sm" onClick={() => handleApprove(review._id)} title="Approve">
                  <Check size={16} /> Approve
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(review._id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
