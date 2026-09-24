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
    return 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/saree12.png';
  };

  const [imgSrc, setImgSrc] = useState(getSafeImage());

  return (
    <img 
      src={imgSrc} 
      alt="" 
      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, display: 'block', margin: '0 auto', border: '1px solid #cbd5e1', background: '#f8fafc' }}
      onError={() => {
        if (imgSrc !== 'https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/saree12.png') {
          setImgSrc('https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/saree12.png');
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
  const mrpTotal = Number(
    order.mrpTotal || 
    (order.items?.reduce((sum, it) => sum + ((it.mrpPrice || it.oldPrice || it.product?.mrpPrice || it.price || 0) * (it.quantity || 1)), 0)) ||
    ((order.totalSavings && order.totalSavings > 0) ? (subtotal + order.totalSavings) : 0) ||
    subtotal
  );
  const totalSavings = Number(order.totalSavings || (mrpTotal > subtotal ? mrpTotal - subtotal : 0));
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

  const getPaymentModeLabel = (pm) => {
    if (!pm) return 'ONLINE';
    const val = String(pm).toLowerCase().trim();
    if (val === 'cod') return 'COD';
    return 'ONLINE';
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
        <div className="no-print invoice-action-bar" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '14px 24px', 
          background: '#0f172a', 
          color: '#ffffff',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}>
          <div className="invoice-action-left" style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <Package size={20} color="#C8A34D" style={{ flexShrink: 0 }} />
            <span className="invoice-action-title" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Tax Invoice: {invoiceNumber}</span>
          </div>
          <div className="invoice-action-right" style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <button 
              className="invoice-print-btn"
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
              className="invoice-close-btn"
              onClick={onClose} 
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 4
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Content */}
        <div id="printable-invoice" className="invoice-printable-content" style={{ padding: '36px 40px', background: '#ffffff', color: '#1e293b', fontFamily: "'Inter', sans-serif" }}>
          {/* Header */}
          <div className="invoice-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #C8A34D', paddingBottom: 20 }}>
            <div className="invoice-boutique-info">
              <h1 className="invoice-boutique-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', color: '#6B102A', margin: 0, fontWeight: 700 }}>
                MAZHAI VAANAM
              </h1>
              <div className="invoice-boutique-tagline" style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#C8A34D', fontWeight: 600, marginTop: 2 }}>
                LUXURY HANDLOOM BOUTIQUE
              </div>
              <div className="invoice-boutique-address" style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 8, lineHeight: 1.5 }}>
                ANA Complex, Sethu Road, <br />
                Peravurani, Thanjavur, Tamil Nadu, India 614804<br />
                GSTIN: <strong>33ANYPN4388D1ZH</strong> | State Code: 33<br />
                📞 +91 8807959179 | ✉️ mazhaivaanampvi@gmail.com
              </div>
            </div>
            <div className="invoice-meta-info" style={{ textAlign: 'right' }}>
              <div className="invoice-meta-badge-wrap" style={{ display: 'inline-block', background: '#f8fafc', padding: '6px 14px', border: '1px solid #e2e8f0', borderRadius: 6, marginBottom: 8 }}>
                <span className="invoice-meta-badge" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>TAX INVOICE</span>
              </div>
              <div className="invoice-meta-details" style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                <div>Invoice No: <strong>{invoiceNumber}</strong></div>
                <div>Invoice Date: <strong>{invoiceDate}</strong></div>
                <div>Order ID: <strong>{order.orderId || order._id}</strong></div>
                <div>Payment Mode: <strong style={{ textTransform: 'uppercase' }}>{getPaymentModeLabel(order.paymentMethod)}</strong></div>
                <div>Status: <strong style={{ color: (order.paymentStatus === 'paid' || order.status === 'CONFIRMED' || order.status === 'IN TRANSIT' || order.status === 'DELIVERED') ? '#16a34a' : '#ea580c' }}>{(order.paymentStatus || order.status || 'PAID').toUpperCase()}</strong></div>
              </div>
            </div>
          </div>

          {/* Billing & Shipping Details */}
          <div className="invoice-addresses-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, margin: '24px 0', padding: '16px 20px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div className="invoice-address-col invoice-address-col-billed">
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

            <div className="invoice-address-col invoice-address-col-shipping">
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
          <div className="invoice-table-wrapper">
            <table className="invoice-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
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
          </div>

          {/* Tax Breakdown & Totals */}
          <div className="invoice-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, marginBottom: 16 }}>
            {/* GST Summary & Amount in Words */}
            <div className="invoice-gst-box" style={{ padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
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
            <div className="invoice-calc-box" style={{ fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Product MRP:</span>
                <span style={{ fontWeight: 600, color: mrpTotal > subtotal ? '#94a3b8' : '#0f172a', textDecoration: mrpTotal > subtotal ? 'line-through' : 'none' }}>
                  ₹{mrpTotal.toLocaleString('en-IN')}
                </span>
              </div>
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
            <div className="invoice-gift-message-box" style={{ padding: '12px 16px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a', marginBottom: 20, width: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontWeight: 700, color: '#b45309', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}>
                <span>🎁</span> GIFT CARD MESSAGE:
              </div>
              <div style={{ color: '#78350f', fontStyle: 'italic', fontSize: '0.88rem', lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                "{order.giftMessage.replace(/^["']+|["']+$/g, '')}"
              </div>
            </div>
          )}

          {/* Footer & Signature */}
          <div className="invoice-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: 20, marginTop: 30, fontSize: '0.75rem', color: '#64748b' }}>
            <div className="invoice-terms-box">
              <strong style={{ display: 'block', marginBottom: 0 }}>Terms & Conditions:</strong>
              <div style={{ marginBottom: 0 }}>1. We take utmost care to offer quality products; Returns/Exchanges are subject to our Return Policy and applicable conditions.</div>
              <div style={{ marginBottom: 0 }}>2. Please follow the recommended Wash & Care instructions to maintain the quality and appearance of the product.</div>
              <div>3. This is a computer-generated invoice and does not require a physical signature.</div>
            </div>
            <div className="invoice-signatory-box" style={{ textAlign: 'center', minWidth: 180 }}>
              <div style={{ fontFamily: "'Kaushan Script', cursive", fontSize: '1.2rem', color: '#6B102A', marginBottom: 4 }}>Mazhai Vaanam</div>
              <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 4, fontWeight: 600, color: '#334155' }}>Authorized Signatory</div>
            </div>
          </div>
        </div>

        {/* CSS for print and mobile modes */}
        <style>{`
          @media screen and (max-width: 768px) {
            .modal-content.invoice-modal-container {
              width: 95% !important;
              max-height: 94vh !important;
              margin: 10px auto !important;
              border-radius: 10px !important;
            }

            .invoice-action-bar {
              padding: 10px 14px !important;
              gap: 8px !important;
            }

            .invoice-action-title {
              font-size: 0.8rem !important;
              max-width: 170px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .invoice-print-btn {
              padding: 6px 10px !important;
              font-size: 0.76rem !important;
              white-space: nowrap !important;
            }

            #printable-invoice.invoice-printable-content {
              padding: 16px 14px !important;
            }

            .invoice-header {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 14px !important;
              padding-bottom: 16px !important;
            }

            .invoice-boutique-title {
              font-size: 1.45rem !important;
            }

            .invoice-boutique-tagline {
              font-size: 0.68rem !important;
            }

            .invoice-boutique-address {
              font-size: 0.74rem !important;
              line-height: 1.45 !important;
            }

            .invoice-meta-info {
              text-align: left !important;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px 14px !important;
            }

            .invoice-meta-badge-wrap {
              margin-bottom: 6px !important;
            }

            .invoice-meta-badge {
              font-size: 0.8rem !important;
            }

            .invoice-meta-details {
              font-size: 0.8rem !important;
              line-height: 1.6 !important;
            }

            .invoice-addresses-grid {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
              margin: 16px 0 !important;
              padding: 14px 12px !important;
            }

            .invoice-address-col-shipping {
              border-top: 1px dashed #cbd5e1;
              padding-top: 12px;
            }

            .invoice-table-wrapper {
              width: 100% !important;
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch !important;
              margin-bottom: 18px !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 8px !important;
            }

            .invoice-table-wrapper::-webkit-scrollbar {
              height: 4px;
            }

            .invoice-table-wrapper::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 4px;
            }

            .invoice-table {
              min-width: 580px !important;
              margin-bottom: 0 !important;
            }

            .invoice-table th,
            .invoice-table td {
              padding: 8px 10px !important;
              font-size: 0.78rem !important;
            }

            .invoice-summary-grid {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
              margin-bottom: 14px !important;
            }

            .invoice-calc-box {
              order: 1;
              font-size: 0.82rem !important;
            }

            .invoice-gst-box {
              order: 2;
              font-size: 0.76rem !important;
              padding: 12px !important;
            }

            .invoice-gift-message-box {
              padding: 10px 12px !important;
              margin-bottom: 16px !important;
              font-size: 0.8rem !important;
            }

            .invoice-footer {
              flex-direction: column !important;
              align-items: stretch !important;
              gap: 16px !important;
              margin-top: 20px !important;
              padding-top: 14px !important;
              font-size: 0.72rem !important;
            }

            .invoice-signatory-box {
              text-align: right !important;
            }
          }

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
