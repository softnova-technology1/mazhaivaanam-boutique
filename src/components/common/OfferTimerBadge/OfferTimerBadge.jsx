import React, { useState, useEffect } from 'react';
import { getBadgeClass } from '../../../utils/badgeHelper';

/**
 * OfferTimerBadge
 * Renders a live ticking countdown badge in 'XXH YYM' format if an endDate is active.
 * Otherwise, falls back to the static tag/label (e.g. 'NEW ONE', 'BESTSELLER').
 */
export const OfferTimerBadge = ({ endDate, fallbackLabel, className = '', style = {} }) => {
  const [timerText, setTimerText] = useState(null);

  useEffect(() => {
    if (!endDate) {
      setTimerText(null);
      return;
    }

    const calculateTimer = () => {
      const targetTime = new Date(endDate).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (isNaN(targetTime) || diff <= 0) {
        setTimerText(null);
        return;
      }

      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // User requirement: Display Hours (H) and Minutes (M) only, e.g. "23H 45M"
      setTimerText(`⏱ ${totalHours}H ${minutes}M`);
    };

    calculateTimer();
    const interval = setInterval(calculateTimer, 10000); // update every 10 seconds

    return () => clearInterval(interval);
  }, [endDate]);

  if (timerText) {
    return (
      <span 
        className={`${className} ${getBadgeClass('LIMITED EDITION')}`}
        style={{ 
          backgroundColor: '#dc2626', 
          color: '#ffffff', 
          fontWeight: 700,
          letterSpacing: '0.04em',
          boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)',
          ...style 
        }}
      >
        {timerText}
      </span>
    );
  }

  if (fallbackLabel) {
    return (
      <span className={`${className} ${getBadgeClass(fallbackLabel)}`} style={style}>
        {fallbackLabel}
      </span>
    );
  }

  return null;
};

export default OfferTimerBadge;
