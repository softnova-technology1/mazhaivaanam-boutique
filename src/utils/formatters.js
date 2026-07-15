/**
 * Formats a numeric price into a currency string (INR / ₹)
 * @param {number} price 
 * @returns {string}
 */
export const formatCurrency = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Truncates text to a specified length
 * @param {string} text 
 * @param {number} limit 
 * @returns {string}
 */
export const truncateText = (text, limit = 100) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
};
