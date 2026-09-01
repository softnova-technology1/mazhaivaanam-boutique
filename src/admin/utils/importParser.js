/**
 * Utility to parse CSV/Excel files into product objects & generate downloadable sample templates
 *
 * IMAGES SUPPORT:
 *   1. URL columns  - image1/image2/image3 columns with https:// links -> saved directly
 *   2. Embedded images - Excel Insert -> Picture -> Place in Cell
 *      -> Extracted from xlsx binary (via JSZip) -> uploaded to S3 -> URL attached to product
 *
 * BUG FIXED: 3 images for 1 product now correctly go to the same product (not 3 separate products)
 *   Root cause: fallback assigned each image to a separate row index.
 *   Fix: extract BOTH row AND column from XML anchor, group by row, slot by column order.
 */
import * as xlsx from 'xlsx';
import JSZip from 'jszip';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Upload a raw binary buffer as image to S3 / local
async function uploadBufferToS3(uint8Array, mimeType = 'image/jpeg', filename = 'product.jpg') {
  try {
    const blob = new Blob([uint8Array], { type: mimeType });
    const file = new File([blob], filename, { type: mimeType });
    const token = localStorage.getItem('mv_admin_token');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'mazhaivaanam/products');
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });
    if (!res.ok) throw new Error(`Upload HTTP ${res.status}`);
    const data = await res.json();
    return data.data?.url || null;
  } catch (err) {
    console.warn('[importParser] Image upload failed:', err.message);
    return null;
  }
}

function extToMime(ext = '') {
  const map = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' };
  return map[ext.toLowerCase()] || 'image/jpeg';
}

export function downloadSampleImportTemplate() {
  const headers = [
    'name', 'description', 'category', 'fabric', 'price', 'mrpPrice',
    'stock', 'weight', 'tag',
    'image1', 'image2', 'image3',
    'pattern', 'border', 'pallu', 'sareeLength', 'blouseLength',
    'style', 'washCare', 'returnPolicy', 'note',
  ];
  const sampleRows = [
    [
      'Kanchipuram Red Silk Saree',
      'Exquisite handwoven pure Kanchipuram silk saree with golden zari weave.',
      'Festive Glow', 'Pure Silk', 14999, 18000, 20, '650g', 'BESTSELLER',
      'https://mazhaivaanam.s3.ap-south-1.amazonaws.com/sample1.jpg', '', '',
      'Temple Border', 'Elegant Golden Zari Border', 'Rich Zari Pallu',
      '5.5 mtr', '80 to 90 cms', 'Traditional Bridal',
      'Dry Clean Only', 'Not Applicable',
      'Product colour may slightly vary due to photography lighting.',
    ],
    [
      'Organic Chanderi Cotton Saree',
      'Lightweight breathable organic cotton saree perfect for everyday elegance.',
      'Everyday Elegance', 'Cotton', 4500, 5500, 35, '420g', 'NEW ARRIVAL',
      'https://mazhaivaanam.s3.ap-south-1.amazonaws.com/sample2.jpg', '', '',
      'Floral Kalamkari Print', 'Plain Zari Border', 'Soft Threadwork',
      '5.5 mtr', '70 to 80 cms', 'Contemporary',
      'Hand Wash Gentle', 'Not Applicable',
      'Product colour may slightly vary due to photography lighting.',
    ],
  ];
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet([headers, ...sampleRows]);
  ws['!cols'] = headers.map(h => ({ wch: Math.max(String(h).length + 4, 16) }));
  xlsx.utils.book_append_sheet(wb, ws, 'Products');
  xlsx.writeFile(wb, 'MazhaiVaanam_Products_Import_Template.xlsx');
}

function normalizeKey(header) {
  const h = String(header).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (h === 'name' || h === 'productname') return 'name';
  if (h.includes('desc')) return 'description';
  if (h.includes('cat')) return 'category';
  if (h.includes('fabric')) return 'fabric';
  if (h === 'price' || h === 'saleprice' || h === 'sellingprice') return 'price';
  if (h.includes('mrp') || h === 'originalprice') return 'mrpPrice';
  if (h.includes('stock') || h === 'qty' || h.includes('quantity')) return 'stock';
  if (h.includes('weight')) return 'weight';
  if (h.includes('tag') || h.includes('badge')) return 'tag';
  if (h === 'image1' || h === 'img1' || h === 'primaryimage' || h === 'primaryimageurl') return 'image1';
  if (h === 'image2' || h === 'img2' || h === 'secondimage') return 'image2';
  if (h === 'image3' || h === 'img3' || h === 'thirdimage') return 'image3';
  if (h === 'image' || h === 'img' || h === 'imageurl' || h === 'url') return 'image1';
  if (h.includes('pattern')) return 'pattern';
  if (h.includes('border')) return 'border';
  if (h.includes('pallu')) return 'pallu';
  if (h === 'sareelength' || h === 'length') return 'sareeLength';
  if (h === 'blouselength') return 'blouseLength';
  if (h.includes('blouse')) return 'blouse';
  if (h.includes('height')) return 'height';
  if (h.includes('style')) return 'style';
  if (h.includes('wash')) return 'washCare';
  if (h.includes('return')) return 'returnPolicy';
  if (h.includes('note')) return 'note';
  return header;
}

export async function parseImportFile(file, onProgress = null) {
  if (!file) throw new Error('No file selected');

  const arrayBuffer = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });

  let workbook;
  try {
    workbook = xlsx.read(arrayBuffer, { type: 'array', cellDates: true });
  } catch {
    throw new Error('Failed to parse file. Please check it is a valid Excel (.xlsx/.xls) or CSV file.');
  }

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Read ALL rows including header as raw 2D array
  const allRows = xlsx.utils.sheet_to_json(worksheet, { defval: '', header: 1 });
  if (!allRows || allRows.length < 2) {
    throw new Error('File is empty or has no data rows.');
  }

  const headerRow = allRows[0];
  const dataRows = allRows.slice(1).filter(r => r.some(v => v !== '' && v !== null && v !== undefined));

  if (dataRows.length === 0) {
    throw new Error('File has no data rows.');
  }

  // Find which COLUMN INDEX (0-based) corresponds to image1/2/3
  // This is the KEY to fixing the 3-images-for-1-product bug!
  const imgColIdx = { image1: -1, image2: -1, image3: -1 };
  headerRow.forEach((header, colIdx) => {
    const normKey = normalizeKey(String(header));
    if (normKey === 'image1') imgColIdx.image1 = colIdx;
    else if (normKey === 'image2') imgColIdx.image2 = colIdx;
    else if (normKey === 'image3') imgColIdx.image3 = colIdx;
  });

  console.info('[importParser] Image column indices:', imgColIdx, '| Products:', dataRows.length);

  // Extract embedded images from xlsx ZIP structure
  // embeddedByRow[dataRowIdx][slot] = { data: Uint8Array, ext: 'jpg' }
  // slot 0 = image1, 1 = image2, 2 = image3 -- determined by COLUMN position
  const embeddedByRow = {};

  const isXlsx = file.name && file.name.toLowerCase().endsWith('.xlsx');
  if (isXlsx) {
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);

      const mediaPaths = Object.keys(zip.files)
        .filter(p => p.startsWith('xl/media/') && !zip.files[p].dir)
        .sort();

      const mediaBuffers = [];
      for (const mp of mediaPaths) {
        const ext = mp.split('.').pop().toLowerCase();
        const data = await zip.files[mp].async('uint8array');
        mediaBuffers.push({ data, ext });
      }

      if (mediaBuffers.length > 0) {
        console.info('[importParser] Found', mediaBuffers.length, 'embedded media files');

        const drawingPaths = Object.keys(zip.files)
          .filter(p => p.startsWith('xl/drawings/drawing') && p.endsWith('.xml') && !zip.files[p].dir)
          .sort();

        let totalAnchorsFound = 0;

        for (const drawPath of drawingPaths) {
          try {
            const drawXml = await zip.files[drawPath].async('string');

            const relPath = drawPath.replace('xl/drawings/', 'xl/drawings/_rels/') + '.rels';
            const rIdToMediaIdx = {};
            if (zip.files[relPath]) {
              const relXml = await zip.files[relPath].async('string');
              const relRe = /Id="(rId\d+)"[^>]*Target="[^"]*\/media\/([^"]+)"/g;
              let rm;
              while ((rm = relRe.exec(relXml)) !== null) {
                const idx = mediaPaths.findIndex(mp => mp.endsWith('/' + rm[2]));
                if (idx >= 0) rIdToMediaIdx[rm[1]] = idx;
              }
            }

            // Match all anchor blocks
            const anchorRe = /<xdr:(?:twoCellAnchor|oneCellAnchor)[^>]*>([\s\S]*?)<\/xdr:(?:twoCellAnchor|oneCellAnchor)>/g;
            let bm;
            while ((bm = anchorRe.exec(drawXml)) !== null) {
              const block = bm[1];

              // Extract from <xdr:from> section only
              const fromEndIdx = block.indexOf('</xdr:from>');
              if (fromEndIdx < 0) continue;
              const fromSection = block.substring(0, fromEndIdx);

              const colMatch = fromSection.match(/<xdr:col>(\d+)<\/xdr:col>/);
              const rowMatch = fromSection.match(/<xdr:row>(\d+)<\/xdr:row>/);
              const embedMatch = block.match(/r:embed="(rId\d+)"/);

              if (!colMatch || !rowMatch || !embedMatch) continue;

              const sheetCol = parseInt(colMatch[1], 10);
              const sheetRow = parseInt(rowMatch[1], 10);
              const dataRowIdx = sheetRow - 1;
              const mediaIdx = rIdToMediaIdx[embedMatch[1]] !== undefined ? rIdToMediaIdx[embedMatch[1]] : -1;

              if (dataRowIdx < 0 || mediaIdx < 0) continue;

              // SLOT DETERMINATION:
              // Use column index to assign image to the right slot (0=image1, 1=image2, 2=image3)
              // This ensures image1/image2/image3 of ONE product row all go to the SAME product
              let slot = 0;
              if (imgColIdx.image3 >= 0 && sheetCol >= imgColIdx.image3) {
                slot = 2;
              } else if (imgColIdx.image2 >= 0 && sheetCol >= imgColIdx.image2) {
                slot = 1;
              }

              if (!embeddedByRow[dataRowIdx]) embeddedByRow[dataRowIdx] = {};
              let finalSlot = slot;
              while (embeddedByRow[dataRowIdx][finalSlot] !== undefined && finalSlot < 3) finalSlot++;
              if (finalSlot < 3) {
                embeddedByRow[dataRowIdx][finalSlot] = mediaBuffers[mediaIdx];
                totalAnchorsFound++;
              }
            }
          } catch (de) {
            console.warn('[importParser] Drawing XML parse error:', de.message);
          }
        }

        console.info('[importParser] Anchors parsed:', totalAnchorsFound);

        // FIXED FALLBACK: distribute images evenly per product row
        // Old wrong fallback: image1->row0, image2->row1 (WRONG!)
        // New fix: if 3 products with 3 images each = 9 files, 3 per row
        if (totalAnchorsFound === 0) {
          const totalDataRows = dataRows.length;
          const imgsPerRow = Math.ceil(mediaBuffers.length / totalDataRows);
          console.info('[importParser] Fallback:', mediaBuffers.length, 'images /', totalDataRows, 'rows =', imgsPerRow, 'per row');

          mediaBuffers.forEach((buf, globalIdx) => {
            const rowIdx = Math.floor(globalIdx / imgsPerRow);
            const slot = globalIdx % imgsPerRow;
            if (rowIdx < totalDataRows && slot < 3) {
              if (!embeddedByRow[rowIdx]) embeddedByRow[rowIdx] = {};
              embeddedByRow[rowIdx][slot] = buf;
            }
          });
        }
      }
    } catch (zipErr) {
      console.warn('[importParser] JSZip extraction skipped:', zipErr.message);
    }
  }

  console.info('[importParser] Final embeddedByRow:', Object.fromEntries(
    Object.entries(embeddedByRow).map(([row, slots]) => [
      'row' + row, Object.keys(slots).map(s => 'img' + (parseInt(s) + 1))
    ])
  ));

  // Build product objects from data rows
  const products = [];
  const total = dataRows.length;

  for (let i = 0; i < total; i++) {
    const rawRow = dataRows[i];
    const rowObj = {};
    const urlImages = [null, null, null];

    headerRow.forEach((header, colIdx) => {
      const val = colIdx < rawRow.length ? rawRow[colIdx] : '';
      const normKey = normalizeKey(String(header));

      if (normKey === 'image1') {
        if (val && String(val).trim()) urlImages[0] = { url: String(val).trim(), publicId: '' };
      } else if (normKey === 'image2') {
        if (val && String(val).trim()) urlImages[1] = { url: String(val).trim(), publicId: '' };
      } else if (normKey === 'image3') {
        if (val && String(val).trim()) urlImages[2] = { url: String(val).trim(), publicId: '' };
      } else {
        if (val !== '' && val !== null && val !== undefined) {
          rowObj[normKey] = val;
        }
      }
    });

    // Upload embedded images for this row
    const embedSlots = embeddedByRow[i] || {};
    const embedCount = Object.keys(embedSlots).length;

    if (embedCount > 0) {
      if (onProgress) onProgress(i, total, 'Row ' + (i + 1) + ': Uploading ' + embedCount + ' image(s) to cloud...');

      for (let slot = 0; slot < 3; slot++) {
        const embed = embedSlots[slot];
        if (embed && !urlImages[slot]) {
          const mime = extToMime(embed.ext);
          const filename = 'product_r' + (i + 1) + '_img' + (slot + 1) + '.' + embed.ext;
          const url = await uploadBufferToS3(embed.data, mime, filename);
          if (url) {
            urlImages[slot] = { url: url, publicId: url };
          }
        }
      }
    } else if (onProgress && i % 5 === 0) {
      onProgress(i, total, 'Parsing row ' + (i + 1) + ' of ' + total + '...');
    }

    const finalImages = urlImages.filter(Boolean);
    if (finalImages.length > 0) rowObj.images = finalImages;

    if (rowObj.name && String(rowObj.name).trim()) {
      products.push(rowObj);
    }
  }

  if (onProgress) onProgress(total, total, 'Done!');
  return products;
}
