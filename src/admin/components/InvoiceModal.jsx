import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, Download, X, CheckCircle, Package } from 'lucide-react';

function InvoiceItemImage({ item }) {
  const getSafeImage = () => {
    const raw = item?.image 
      || item?.images?.[0]?.url 
      || (typeof item?.images?.[0] === 'string' ? item?.images[0] : null)
      || item?.product?.image 
      || item?.product?.images?.[0]?.url 
      || (typeof item?.product?.images?.[0] === 'string' ? item?.product?.images[0] : null);

    if (raw && typeof raw === 'string' && !raw.startsWith('blob:') && !raw.includes('placeholder')) {
      if (raw.startsWith('http') || raw.startsWith('/Images') || raw.startsWith('data:')) {
        return raw;
      }
    }
    return '/Images/saree12.png';
  };

  const [imgSrc, setImgSrc] = useState(getSafeImage());

  return (
    <img 
      src={imgSrc} 
      alt="" 
      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, display: 'block', margin: '0 auto', border: '1px solid #cbd5e1', background: '#f8fafc' }}
      onError={() => {
        if (imgSrc !== '/Images/saree12.png') {
          setImgSrc('/Images/saree12.png');
        }
      }}
    />
  );
}

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

  const subtotal = order.subtotal || order.items?.reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 1)), 0) || order.totalAmount || 0;
  const couponDiscount = order.couponDiscount || 0;
  let giftPackCharge = order.giftPackCharge !== undefined && order.giftPackCharge !== null && order.giftPackCharge > 0
    ? order.giftPackCharge
    : order.giftPackAddon !== undefined && order.giftPackAddon !== null && order.giftPackAddon > 0
    ? order.giftPackAddon
    : (order.giftPackaging ? 60 : 0);
  const convenienceFee = order.convenienceFee !== undefined && order.convenienceFee !== null
    ? order.convenienceFee
    : 2;

  let baseBreakdownSum = subtotal - couponDiscount + giftPackCharge + convenienceFee;
  const grandTotal = order.finalAmount || order.totalAmount || baseBreakdownSum;
  let shippingFee = (order.shippingFee !== undefined && order.shippingFee !== null && order.shippingFee > 0) ? order.shippingFee : 0;

  if (grandTotal > baseBreakdownSum && order.deliveryMode !== 'pickup') {
    const diff = grandTotal - baseBreakdownSum;
    if (giftPackCharge === 0 && diff >= 120) {
      giftPackCharge = 60;
      shippingFee = diff - 60;
    } else if (shippingFee === 0) {
      shippingFee = diff;
    }
  }
  
  // Saree standard GST rate in India is 5% (2.5% CGST + 2.5% SGST)
  const taxableAmount = Math.round(grandTotal / 1.05);
  const totalTax = grandTotal - taxableAmount;
  const cgst = Math.round(totalTax / 2);
  const sgst = totalTax - cgst;

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
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
                ANA Complex- 1st Floor, Sethu Road, <br />
                Peravurani, Thanjavur, Tamil Nadu, India 614804<br />
                GSTIN: <strong>33ANYPN4388D1ZH</strong> | State Code: 33<br />
                📞 +91 8807959179 | ✉️ mazhaivaanampvi@gmail.com
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
                <div>Payment Mode: <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod ? order.paymentMethod.toUpperCase() : 'PREPAID / ONLINE'}</strong></div>
                <div>Status: <strong style={{ color: (order.paymentStatus === 'paid' || order.status === 'CONFIRMED' || order.status === 'IN TRANSIT' || order.status === 'DELIVERED') ? '#16a34a' : '#ea580c' }}>{(order.paymentStatus || order.status || 'PAID').toUpperCase()}</strong></div>
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
                {order.fullName || order.shippingAddress?.fullName || (order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : '') || 'Valued Customer'}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginTop: 4 }}>
                Email: {order.email || order.shippingAddress?.email || order.user?.email || 'N/A'}<br />
                Phone: {order.phone || order.shippingAddress?.phone || order.user?.phone || 'N/A'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C8A34D', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                SHIPPED TO / DELIVERY ADDRESS
              </div>
              <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                {order.deliveryMode === 'pickup' || !order.shippingAddress?.addressLine || order.shippingAddress?.addressLine === '-' || order.shippingAddress?.addressLine1 === '-' ? (
                  <>
                    Self Store Pickup (In-Store Pickup)
                  </>
                ) : (
                  <>
                    {order.shippingAddress.addressLine1 || order.shippingAddress.addressLine}<br />
                    {order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}
                    {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}, `}
                    {order.shippingAddress.city && `${order.shippingAddress.city}, `}
                    {order.shippingAddress.state && `${order.shippingAddress.state} `}
                    {(order.shippingAddress.postalCode || order.shippingAddress.pinCode) && `- ${order.shippingAddress.postalCode || order.shippingAddress.pinCode}`}<br />
                    Country: India
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#ffffff', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: 40 }}>#</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: 50 }}>Image</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Item Description</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: 140 }}>SKU</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: 20 }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', width: 100 }}>Rate</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', width: 110 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <InvoiceItemImage item={item} />
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Fabric: {item.fabric || 'Pure Handloom Silk'}</div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#000000ff', fontSize: '0.75rem' }}>{item.product?.sku || item.sku || '-'}</td>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 16 }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Convenience Fee:</span>
                <span style={{ fontWeight: 600 }}>₹{convenienceFee.toLocaleString('en-IN')}</span>
              </div>
              {(order.giftPackaging || giftPackCharge > 0) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ color: '#64748b' }}>🎁 Gift Packaging:</span>
                  <span style={{ fontWeight: 600 }}>₹{giftPackCharge.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #0f172a', marginTop: 8, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#6B102A' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Full Width Gift Card Message */}
          {order.giftMessage && (
            <div style={{ padding: '12px 16px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a', marginBottom: 20, width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontWeight: 700, color: '#b45309', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                <span>🎁</span> GIFT CARD MESSAGE:
              </div>
              <div style={{ color: '#78350f', fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                "{order.giftMessage.replace(/^["']+|["']+$/g, '')}"
              </div>
            </div>
          )}

          {/* Footer & Signature */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: 20, marginTop: 30, fontSize: '0.75rem', color: '#64748b' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: 0 }}>Terms & Conditions:</strong>
              <div style={{ marginBottom: 0 }}>1. We take utmost care to offer quality products; Returns/Exchanges are subject to our Return Policy and applicable conditions.</div>
              <div style={{ marginBottom: 0 }}>2. Please follow the recommended Wash & Care instructions to maintain the quality and appearance of the product.</div>
              <div>3. This is a computer-generated invoice and does not require a physical signature.</div>
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
    </div>,
    document.body
  );
}
