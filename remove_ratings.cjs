const fs = require('fs');
const path = require('path');

const filesToEdit = [
  'd:/Full Stack/mazhaivaanam-boutique/src/services/api.js',
  'd:/Full Stack/mazhaivaanam-boutique/src/pages/Wishlist/Wishlist.jsx',
  'd:/Full Stack/mazhaivaanam-boutique/src/pages/PreBooking/PreBooking.jsx',
  'd:/Full Stack/mazhaivaanam-boutique/src/pages/BestSellers/BestSellers.jsx',
  'd:/Full Stack/mazhaivaanam-boutique/src/pages/ProductDetail/ProductDetail.jsx',
  'd:/Full Stack/mazhaivaanam-boutique/src/pages/MyOrders/MyOrders.jsx'
];

filesToEdit.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Remove rating property from JS objects
  if (content.match(/rating:\s*Number\(p\.averageRating\s*\|\|\s*p\.rating\s*\|\|\s*4\.8\),/)) {
    content = content.replace(/rating:\s*Number\(p\.averageRating\s*\|\|\s*p\.rating\s*\|\|\s*4\.8\),/g, '');
    changed = true;
  }
  if (content.match(/rating:\s*4\.8,?\s*/g)) {
    content = content.replace(/rating:\s*4\.8,?\s*/g, '');
    changed = true;
  }
  if (content.match(/rating:\s*activeProduct\.rating\s*\|\|\s*4\.8,?\s*/g)) {
    content = content.replace(/rating:\s*activeProduct\.rating\s*\|\|\s*4\.8,?\s*/g, '');
    changed = true;
  }

  // Remove product-rating div block
  const productRatingRegex = /<div\s+className=\{styles\['product-rating'\]\}>[\s\S]*?<\/div>/g;
  if (content.match(productRatingRegex)) {
    content = content.replace(productRatingRegex, '');
    changed = true;
  }

  // Remove rating-badge-inline div block (used conditionally usually like {product.rating && ( ... )})
  const ratingBadgeRegex = /\{[^}]*rating\s*&&\s*\([\s\S]*?<div\s+className=\{styles\['rating-badge-inline'\]\}>[\s\S]*?<\/div>[\s\S]*?\)\}/g;
  if (content.match(ratingBadgeRegex)) {
    content = content.replace(ratingBadgeRegex, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
