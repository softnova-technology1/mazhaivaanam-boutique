const fs = require('fs');

const cats = ['Blended South Cotton', 'Handloom Sarees', 'Linen Cotton', 'Chanderi Cotton', 'Kalyani Cotton Sarees', 'Khadi Cotton Saree', 'Mul Mul Cotton'];

function updateCategoriesInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const file = fs.readFileSync(filePath, 'utf8');
  let i = 0;
  const newFile = file.replace(/category:\s*"([^"]+)"/g, (match, p1) => {
    const cat = cats[i % cats.length];
    i++;
    return `category: "${cat}"`;
  });
  fs.writeFileSync(filePath, newFile);
  console.log('Updated categories in ' + filePath);
}

updateCategoriesInFile('src/pages/Catalog/Catalog.jsx');
updateCategoriesInFile('src/pages/PreBooking/PreBooking.jsx');
updateCategoriesInFile('src/services/api.js');
