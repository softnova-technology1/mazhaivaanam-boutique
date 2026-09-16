import { useState, useEffect } from 'react';
import { reviewAPI } from '../api/api.js';
import { Star, Check, Trash2, Edit2, X, Save } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ text: '', rating: 5 });

  useEffect(() => { loadReviews(); }, [activeTab]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const res = await reviewAPI.getPending();
        setReviews(res.data);
      } else {
        const res = await reviewAPI.getAll();
        // filter out only approved reviews for the approved tab
        setReviews(res.data.filter(r => r.isApproved === true));
      }
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

  const handleEditClick = (review) => {
    setEditingReviewId(review._id);
    setEditForm({ text: review.text, rating: review.rating });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await reviewAPI.edit(id, editForm);
      setReviews(prev => prev.map(r => r._id === id ? res.data : r));
      setEditingReviewId(null);
    } catch (err) { alert(err.message); }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Reviews</h1>
          <p className="page-subtitle">
            {activeTab === 'pending' ? `${reviews.length} pending reviews awaiting moderation` : `${reviews.length} approved reviews on client site`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 24, borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 24 }}>
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
          style={{ padding: '12px 4px', borderBottom: activeTab === 'pending' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'pending' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, background: 'none', cursor: 'pointer' }}
        >
          Pending
        </button>
        <button 
          className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
          style={{ padding: '12px 4px', borderBottom: activeTab === 'approved' ? '2px solid var(--primary)' : '2px solid transparent', color: activeTab === 'approved' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600, background: 'none', cursor: 'pointer' }}
        >
          Approved (Client Site)
        </button>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : reviews.length === 0 ? (
        <div className="card empty-state">
          <Star size={40} />
          <p>{activeTab === 'pending' ? 'No pending reviews — all caught up!' : 'No approved reviews yet.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {reviews.map(review => (
            <div key={review._id} className="card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                {editingReviewId === review._id ? (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <label>Rating:</label>
                      <select 
                        value={editForm.rating} 
                        onChange={(e) => setEditForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                        style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                      >
                        {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                      </select>
                    </div>
                    <textarea 
                      value={editForm.text}
                      onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
                      style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', marginBottom: '8px', fontFamily: 'inherit' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(review._id)}><Save size={16}/> Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}><X size={16}/> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
                
                <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Product: <strong style={{ color: 'var(--primary)' }}>{review.product?.name || 'Unknown'}</strong></span>
                  <span>By: {review.user?.email}</span>
                  <span>{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexDirection: 'column' }}>
                {activeTab === 'pending' && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleApprove(review._id)} title="Approve">
                    <Check size={16} /> Approve
                  </button>
                )}
                <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(review)} title="Edit">
                  <Edit2 size={16} /> Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(review._id)} title="Delete">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
