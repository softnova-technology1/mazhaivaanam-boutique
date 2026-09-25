const fs = require('fs');
const path = require('path');

function processFile(filePath, depth) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('getOptimizedImageUrl')) {
    const importStatement = `import { getOptimizedImageUrl } from '${depth}utils/imageUtils';\n`;
    content = importStatement + content;
  }
  
  // Apply to common image patterns
  content = content.replace(/<img\s+src=\{([^}]+)\}/g, (match, p1) => {
    if (p1.includes('getOptimizedImageUrl')) return match;
    return `<img src={getOptimizedImageUrl(${p1})}`;
  });

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed:', filePath);
}

const files = [
  { path: 'src/pages/ProductDetail/ProductDetail.jsx', depth: '../../' },
  { path: 'src/pages/Cart/Cart.jsx', depth: '../../' },
  { path: 'src/pages/Wishlist/Wishlist.jsx', depth: '../../' },
  { path: 'src/pages/Checkout/Checkout.jsx', depth: '../../' },
  { path: 'src/pages/PreBooking/PreBooking.jsx', depth: '../../' },
  { path: 'src/pages/MyOrders/MyOrders.jsx', depth: '../../' },
  { path: 'src/pages/NewArrivals/NewArrivals.jsx', depth: '../../' },
  { path: 'src/pages/Collections/Collections.jsx', depth: '../../' },
  { path: 'src/pages/BestSellers/BestSellers.jsx', depth: '../../' }
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  if (fs.existsSync(fullPath)) {
    processFile(fullPath, file.depth);
  }
});
