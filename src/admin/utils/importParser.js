/**
 * Utility to parse CSV/Excel files into product objects & generate downloadable sample templates
 */

// Downloadable Sample Template Definition
export function downloadSampleImportTemplate() {
  const headers = [
    'Product Name',
    'Description',
    'Category',
    'Fabric',
    'Sale Price',
    'MRP Price',
    'Stock Quantity',
    'Tag',
    'Primary Image URL',
    'Weight',
    'Pattern',
    'Pallu',
    'Saree Length',
    'Height',
    'Wash Care',
    'Return Policy',
    'Note'
  ];

  const sampleRows = [
    [
      'Kanchipuram Red Silk Saree',
      'Exquisite handwoven pure Kanchipuram silk saree with golden zari weave.',
      'Festive Glow',
      'Pure Silk',
      '14999',
      '18000',
      '20',
      'BESTSELLER',
      'https://mazhaivaanam.s3.ap-south-1.amazonaws.com/sample1.jpg',
      '800g',
      'Temple Border',
      'Rich Zari Pallu',
      '5.5 meters',
      '45 inches',
      'Dry Clean Only',
      '7 Days Exchange',
      'Digital images may vary slightly due to lighting.'
    ],
    [
      'Organic Chanderi Cotton Saree',
      'Lightweight breathable organic cotton saree perfect for everyday elegance.',
      'Everyday Elegance',
      'Cotton',
      '4500',
      '5500',
      '35',
      'NEW ARRIVAL',
      'https://mazhaivaanam.s3.ap-south-1.amazonaws.com/sample2.jpg',
      '550g',
      'Floral Motifs',
      'Soft Threadwork',
      '5.5 meters',
      '44 inches',
      'Hand Wash Gentle',
      '7 Days Exchange',
      'Soft fabric comfort guaranteed.'
    ]
  ];

  const csvContent = '\uFEFF' + [
    headers.map(h => `"${h}"`).join(','),
    ...sampleRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `MazhaiVaanam_Products_Import_Template.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

import * as xlsx from 'xlsx';

/**
 * Main file parser accepting .csv, .xlsx, or .xls files using SheetJS (xlsx)
 */
export function parseImportFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file selected'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        // Parse workbook from array buffer
        const workbook = xlsx.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to array of objects
        const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawData || rawData.length === 0) {
          throw new Error('File is empty or missing data rows');
        }

        // Normalize header mapping
        const normalizeKey = (header) => {
          const h = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (h.includes('name') || h === 'product') return 'name';
          if (h.includes('desc')) return 'description';
          if (h.includes('cat')) return 'category';
          if (h.includes('fabric')) return 'fabric';
          if (h.includes('saleprice') || h === 'price' || h.includes('sale')) return 'price';
          if (h.includes('mrp') || h.includes('originalprice')) return 'mrpPrice';
          if (h.includes('stock') || h.includes('qty') || h.includes('quantity')) return 'stock';
          if (h.includes('tag') || h.includes('badge')) return 'tag';
          if (h.includes('image1') || h === 'image' || h.includes('primaryimage')) return 'image1';
          if (h.includes('image2')) return 'image2';
          if (h.includes('image3')) return 'image3';
          if (h.includes('image') || h.includes('img') || h.includes('url')) return 'image1';
          if (h.includes('weight')) return 'weight';
          if (h.includes('pattern')) return 'pattern';
          if (h.includes('border')) return 'border';
          if (h.includes('pallu')) return 'pallu';
          if (h.includes('sareelength') || h.includes('length')) return 'sareeLength';
          if (h.includes('blouselength')) return 'blouseLength';
          if (h.includes('blouse')) return 'blouse';
          if (h.includes('height')) return 'height';
          if (h.includes('style')) return 'style';
          if (h.includes('wash')) return 'washCare';
          if (h.includes('return')) return 'returnPolicy';
          if (h.includes('note')) return 'note';
          return header;
        };

        const products = [];
        
        for (const row of rawData) {
          const rowObj = {};
          const rowImages = [];

          for (const key of Object.keys(row)) {
            const normKey = normalizeKey(key);
            const val = row[key];
            if (normKey === 'image1') {
              if (val) rowImages[0] = { url: val, publicId: '' };
            } else if (normKey === 'image2') {
              if (val) rowImages[1] = { url: val, publicId: '' };
            } else if (normKey === 'image3') {
              if (val) rowImages[2] = { url: val, publicId: '' };
            } else {
              rowObj[normKey] = val;
            }
          }

          if (rowImages.length > 0) {
            rowObj.images = rowImages.filter(Boolean);
          }

          if (rowObj.name) {
            products.push(rowObj);
          }
        }

        resolve(products);
      } catch (err) {
        reject(new Error('Failed to parse file. Ensure it is a valid Excel or CSV file.'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
