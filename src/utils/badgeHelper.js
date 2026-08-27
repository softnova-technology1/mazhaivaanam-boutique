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
  if (val.includes('NEW') || val.includes('FRESH') || val.includes('ARRIV')) {
    return 'badge-new-arrival';
  }
  if (val.includes('LIMIT') || val.includes('EXCLUSIVE') || val.includes('EDITION') || val.includes('OFFER')) {
    return 'badge-limited-edition';
  }
  if (val.includes('FEST') || val.includes('CHOICE') || val.includes('CELEBR')) {
    return 'badge-festival-choice';
  }
  
  return 'badge-default';
};
