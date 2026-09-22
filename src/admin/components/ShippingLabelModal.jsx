import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, Package, Heart } from 'lucide-react';
import styles from './ShippingLabelModal.module.css';

export default function ShippingLabelModal({ order, onClose }) {
  const [printSize, setPrintSize] = useState('A4');

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const orderId = order.orderId || (order._id ? `ORD-${order._id.slice(-5).toUpperCase()}` : 'ORD-00000');
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).toUpperCase().replace(/ /g, ' ');

  const customerName = order.shippingAddress?.fullName || 'Customer';
  const addressLine = order.shippingAddress?.addressLine1 || order.shippingAddress?.addressLine || '';
  const landmark = order.shippingAddress?.landmark || '';
  const city = order.shippingAddress?.city || '';
  const state = order.shippingAddress?.state || '';
  const pincode = order.shippingAddress?.postalCode || order.shippingAddress?.pinCode || '';
  const phone = order.shippingAddress?.phone || '';

  return createPortal(
    <>
      <style>
        {`
          @media print {
            @page {
              size: ${printSize === 'A4' ? 'A4 portrait' : printSize === 'A5' ? 'A5 portrait' : '4in 6in'};
              margin: 0;
            }
          }
        `}
      </style>
      <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Action Bar (Hidden on print) */}
        <div className={`${styles.modalHeader} no-print`}>
          <div className={styles.modalTitle}>
            <Package size={20} color="#C8A34D" />
            <span>Shipping Label: {orderId}</span>
          </div>
          <div className={styles.headerActions}>
            <select 
              value={printSize} 
              onChange={(e) => setPrintSize(e.target.value)}
              className={styles.sizeSelect}
            >
              <option value="A4">A4 Size</option>
              <option value="A5">A5 Size</option>
              <option value="4in 6in">Thermal (4x6)</option>
            </select>
            <button onClick={handlePrint} className={styles.printBtn}>
              <Printer size={16} /> Print Label
            </button>
            <button onClick={onClose} className={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className={`${styles.printableArea} ${printSize === 'A5' ? styles.a5Print : printSize !== 'A4' ? styles.smallPrint : ''}`}>
          <div className={styles.labelContainer}>
            
            <div className={styles.topBadge}>M V</div>

            {/* Top Row: Logo, Barcode & Meta (QR + Date) */}
            <div className={styles.topRow}>
              <div className={styles.leftCol}>
                <div className={styles.brandBlock}>
                  <img src="https://mazhaivaanam2026pvi.s3.ap-southeast-1.amazonaws.com/Images/logo/logo.png" alt="Logo" className={styles.logoImage} />
                  <div className={styles.brandText}>
                    <div className={styles.shopBrandName}>MAZHAI VAANAM</div>
                  </div>
                </div>
                
                <div className={styles.barcodeImageWrapper}>
                  <img 
                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${orderId.replace(/-/g, '')}&scale=2&height=10&includetext`} 
                    alt="Barcode"
                    className={styles.barcodeImage}
                  />
                </div>
              </div>
              
              <div className={styles.metaBlock}>
                <div className={styles.qrCodeWrapper}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https://mazhaivaanam.com&color=111111`} 
                    alt="Website QR Code" 
                    className={styles.qrCode} 
                  />
                  <div className={styles.qrText}>VISIT WEBSITE</div>
                </div>
              </div>
            </div>

            {/* Address Row (Side by side) */}
            <div className={styles.addressSection}>
              {/* To Address */}
              <div className={styles.addressCol}>
                <div className={styles.sectionTitle}>To:</div>
                <div className={styles.addressText}>
                  <div className={styles.customerName}>{customerName}</div>
                  {order.deliveryMode === 'pickup' || !addressLine || addressLine === '-' ? (
                    <>
                      Self Store Pickup (In-Store Pickup)<br />
                    </>
                  ) : (
                    <>
                      {addressLine}<br />
                      {landmark && <>{landmark}<br /></>}
                      {city}, {state} {pincode}<br />
                      India<br />
                    </>
                  )}
                  T: +91 {phone}
                </div>
              </div>

              {/* From Address */}
              <div className={styles.addressCol}>
                <div className={styles.sectionTitle}>From:</div>
                <div className={styles.addressText}>
                  <div className={styles.customerName}>Mazhai Vaanam</div>
                  ANA Complex, Sethu Road, Peravurani, Thanjavur, Tamil Nadu, India 614804<br />
                  T: +91 8807959179
                </div>
              </div>
            </div>


            {/* Personal Care Tag */}
            <div className={styles.careTag}>
              <Heart size={18} color="#C8A34D" fill="#C8A34D" />
              <span>Specially packed with care for <strong>{customerName}</strong></span>
            </div>
            {/* Order Details */}
            <div className={styles.detailsSection}>
              <div className={styles.detailsTitle}>Order Details</div>
              <div className={styles.detailsRow}>
                <strong>ORDER ID:</strong> {orderId}
              </div>
              <div className={styles.detailsRow}>
                <strong>DATE:</strong> {orderDate}
              </div>
            </div>

            {/* Footer */}
            <div className={styles.footerBadge}>
              <div className={styles.thankYouNote}>Thank you for shopping with Mazhai Vaanam!</div>
              <span className={styles.premiumBadgeText}>M V</span>
            </div>

          </div>
        </div>
      </div>
      </div>
    </>,
    document.body
  );
}
