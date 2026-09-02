import React, { useRef } from 'react';
import { Printer, Download, X, CheckCircle, Package } from 'lucide-react';

function numberToWords(num) {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + ' ' : '';
  return str.trim() ? str.trim() + ' Rupees Only' : 'Zero Rupees';
}

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const invoiceNumber = `MV-INV-${order.orderId || (order._id ? order._id.slice(-6).toUpperCase() : '82001')}`;
  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const subtotal = order.items?.reduce((sum, it) => sum + (it.price * (it.quantity || 1)), 0) || order.totalAmount || 0;
  const couponDiscount = order.couponDiscount || 0;
  const shippingFee = order.shippingFee || 0;
  const giftPackCharge = order.giftPackaging ? (order.giftPackCharge || 499) : 0;
  const grandTotal = order.totalAmount || subtotal;
  
  // Saree standard GST rate in India is 5% (2.5% CGST + 2.5% SGST)
  const taxableAmount = Math.round(grandTotal / 1.05);
  const totalTax = grandTotal - taxableAmount;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content invoice-modal-container" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          maxWidth: 820, 
          width: '95%', 
          maxHeight: '92vh', 
          overflowY: 'auto',
          background: '#ffffff',
          color: '#1e293b',
          padding: 0,
          borderRadius: 12
        }}
      >
        {/* Modal Action Bar (Hidden on print) */}
        <div className="no-print" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '14px 24px', 
          background: '#0f172a', 
          color: '#ffffff',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Package size={20} color="#C8A34D" />
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>Tax Invoice: {invoiceNumber}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 16px',
                background: '#C8A34D',
                color: '#000',
                border: 'none',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Printer size={16} /> Print / Save PDF
            </button>
            <button 
              onClick={onClose} 
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Content */}
        <div id="printable-invoice" style={{ padding: '36px 40px', background: '#ffffff', color: '#1e293b', fontFamily: "'Inter', sans-serif" }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #C8A34D', paddingBottom: 20 }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#6B102A', margin: 0, fontWeight: 700 }}>
                MAZHAI VAANAM
              </h1>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#C8A34D', fontWeight: 600, marginTop: 2 }}>
                LUXURY HANDLOOM BOUTIQUE
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 8, lineHeight: 1.5 }}>
                124, Silk Weaver Street, Gandhi Nagar<br />
                Coimbatore, Tamil Nadu - 641001<br />
                GSTIN: <strong>33AAAAA0000A1Z5</strong> | State Code: 33<br />
                📞 +91 98765 43210 | ✉️ support@mazhaivaanam.com
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-block', background: '#f8fafc', padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 8 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>TAX INVOICE</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                <div>Invoice No: <strong>{invoiceNumber}</strong></div>
                <div>Invoice Date: <strong>{invoiceDate}</strong></div>
                <div>Order ID: <strong>{order.orderId || order._id}</strong></div>
                <div>Payment Mode: <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod || 'Prepaid / Online'}</strong></div>
                <div>Status: <strong style={{ color: order.paymentStatus === 'paid' ? '#16a34a' : '#ea580c' }}>{order.paymentStatus?.toUpperCase()}</strong></div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '24px 0', padding: '16px 20px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8A34D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                BILLED TO / CUSTOMER
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>
                {order.shippingAddress?.fullName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Valued Customer'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginTop: 4 }}>
                Email: {order.user?.email || order.shippingAddress?.email || 'N/A'}<br />
                Phone: {order.shippingAddress?.phone || order.user?.phone || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8A34D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                SHIPPED TO / DELIVERY ADDRESS
              </div>
              <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                {order.shippingAddress?.addressLine1 || 'Store Pickup'}<br />
                {order.shippingAddress?.addressLine2 && `${order.shippingAddress.addressLine2}, `}
                {order.shippingAddress?.city && `${order.shippingAddress.city}, `}
                {order.shippingAddress?.state && `${order.shippingAddress.state} `}
                {order.shippingAddress?.postalCode && `- ${order.shippingAddress.postalCode}`}<br />
                Country: India
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: 40 }}>#</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Item Description</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: 80 }}>HSN</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: 60 }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', width: 100 }}>Rate</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', width: 110 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fabric: {item.fabric || 'Pure Handloom Silk'}</div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>5007</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 600 }}>{item.quantity || 1}</td>
                  <td style={{ padding: '12px', textAlign: 'right', color: '#334155' }}>₹{Number(item.price).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                    ₹{Number(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tax Breakdown & Totals */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* GST Summary & Amount in Words */}
            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>GST Tax Breakdown (5% Apparel Rate):</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 3 }}>
                <span>Taxable Value:</span>
                <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 3 }}>
                <span>Central GST (CGST 2.5%):</span>
                <span>₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', marginBottom: 8 }}>
                <span>State GST (SGST 2.5%):</span>
                <span>₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: 8, marginTop: 6, color: '#334155' }}>
                <strong>Amount in Words:</strong><br />
                <span style={{ fontStyle: 'italic', color: '#6B102A' }}>{numberToWords(grandTotal)}</span>
              </div>
            </div>

            {/* Calculations Summary */}
            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Item Total (Subtotal):</span>
                <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', color: '#16a34a' }}>
                  <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                  <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Shipping & Handling:</span>
                <span style={{ fontWeight: 600 }}>
                  {shippingFee > 0 ? `₹${shippingFee.toLocaleString('en-IN')}` : 'FREE'}
                </span>
              </div>
              {giftPackCharge > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>🎁 Gift Packaging:</span>
                  <span style={{ fontWeight: 600 }}>₹{giftPackCharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              {order.giftMessage && (
                <div style={{ padding: '6px 0 6px', borderBottom: '1px solid #f1f5f9', fontSize: '0.78rem', color: '#6B102A', fontStyle: 'italic' }}>
                  🎁 Gift message: "{order.giftMessage}"
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #0f172a', marginTop: 8, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#6B102A' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: 20, marginTop: 30, fontSize: '0.75rem', color: '#64748b' }}>
            <div>
              <strong>Terms & Conditions:</strong><br />
              1. Goods once sold can be exchanged within 7 days in original condition.<br />
              2. Dry clean only recommended for pure silk and zari weaves.<br />
              3. This is a computer generated invoice and does not require physical signature.
            </div>
            <div style={{ textAlign: 'center', minWidth: 180 }}>
              <div style={{ fontFamily: "'Kaushan Script', cursive", fontSize: '1.2rem', color: '#6B102A', marginBottom: 4 }}>Mazhai Vaanam</div>
              <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 4, fontWeight: 600, color: '#334155' }}>Authorized Signatory</div>
            </div>
          </div>
        </div>

        {/* CSS for print mode */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
              visibility: visible;
            }
            #printable-invoice {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px !important;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
