import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import styles from './ScrollToTopButton.module.css';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle button visibility based on scroll depth
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    // Initial check in case page is loaded already scrolled down
    toggleVisibility();
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={scrollToTop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          scrollToTop();
        }
      }}
      className={`${styles.scrollToTop} ${isVisible ? styles.visible : ''}`}
      aria-label="Scroll to top of the page"
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </div>
  );
};

export default ScrollToTopButton;
