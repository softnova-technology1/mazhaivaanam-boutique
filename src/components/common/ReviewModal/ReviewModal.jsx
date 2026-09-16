import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Star } from 'lucide-react';
import { reviewAPI } from '../../../services/api';
import styles from './ReviewModal.module.css';

export default function ReviewModal({ isOpen, onClose, productId, productName, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    text: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name.trim() || !formData.text.trim()) {
      setError('Please provide your name and a review message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewAPI.createReview(productId, {
        name: formData.name,
        location: formData.location || 'Verified Patron',
        rating: formData.rating,
        text: formData.text
      });
      onSuccess('Thank you! Your review has been submitted and is awaiting approval.');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Review {productName}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {error && <div style={{ color: '#e63946', marginBottom: '16px', fontSize: '0.9rem', padding: '10px', background: 'rgba(230, 57, 70, 0.1)', borderRadius: '6px' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Your Name</label>
              <input 
                type="text" 
                className={styles.formInput} 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="How should we address you?"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Location (Optional)</label>
              <input 
                type="text" 
                className={styles.formInput} 
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Chennai, India"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Rating</label>
              <div className={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    fill={star <= formData.rating ? '#C8A34D' : 'transparent'}
                    stroke={star <= formData.rating ? '#C8A34D' : '#666'}
                    style={{ transition: 'all 0.2s ease' }}
                  />
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Your Review</label>
              <textarea 
                className={styles.formTextarea} 
                value={formData.text}
                onChange={e => setFormData({ ...formData, text: e.target.value })}
                placeholder="Share your experience with this beautiful weave..."
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Appraisal'}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
