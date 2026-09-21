/**
 * Resolves the CSS class name for a badge based on its text content.
 * 
 * @param {string} text - The tag text (e.g., 'BESTSELLER', 'NEW ARRIVAL')
 * @returns {string} The CSS class defined in global.css
 */
export const getBadgeClass = (text) => {
  if (!text) return '';
  const val = text.toUpperCase().trim();
  
  if (val.includes('BEST') || val.includes('FAV') || val.includes('POPULAR')) {
    return 'badge-bestseller';
  }
  if (val.includes('FRESH') || val.includes('NEW') || val.includes('ARRIV')) {
    return 'badge-fresh-pick';
  }
  if (val.includes('LIMIT') || val.includes('EXCLUSIVE') || val.includes('EDITION') || val.includes('OFFER')) {
    return 'badge-limited-edition';
  }
  if (val.includes('FEST') || val.includes('CHOICE') || val.includes('CELEBR')) {
    return 'badge-festival-choice';
  }
  if (val.includes('TRADITIONAL') || val.includes('CHARM')) {
    return 'badge-traditional-charm';
  }
  if (val.includes('TRENDING')) {
    return 'badge-trending';
  }
  if (val.includes('ELEGANT') || val.includes('PICK')) {
    return 'badge-elegant-pick';
  }
  
  return 'badge-default';
};
