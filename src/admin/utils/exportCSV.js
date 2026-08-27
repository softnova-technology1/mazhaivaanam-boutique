/**
 * Utility to convert JSON objects to a CSV file and trigger download
 * @param {Array<Object>} data Array of flat/nested row objects
 * @param {Array<{ key: string, label: string, formatter?: Function }>} columns Column definitions
 * @param {string} filename File name without extension
 */
export function exportToCSV(data, columns, filename = 'export') {
  if (!data || !data.length) {
    alert('No data available to export');
    return;
  }

  // 1. Generate Headers
  const headers = columns.map(c => `"${(c.label || c.key).replace(/"/g, '""')}"`).join(',');

  // 2. Generate Rows
  const rows = data.map((row, index) => {
    return columns.map(c => {
      let val;
      if (typeof c.formatter === 'function') {
        val = c.formatter(row, index);
      } else if (c.key.includes('.')) {
        // Nested property e.g. "user.email"
        val = c.key.split('.').reduce((obj, prop) => (obj ? obj[prop] : ''), row);
      } else {
        val = row[c.key];
      }

      if (val === null || val === undefined) val = '';
      if (val instanceof Date) val = val.toISOString().slice(0, 10);
      
      const stringVal = String(val).replace(/"/g, '""');
      return `"${stringVal}"`;
    }).join(',');
  });

  const csvContent = '\uFEFF' + [headers, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
