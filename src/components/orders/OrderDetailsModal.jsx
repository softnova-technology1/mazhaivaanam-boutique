import React from 'react';
import { X, MapPin, Truck, Calendar, CreditCard, ShoppingBag, CheckCircle, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function OrderDetailsModal({ order, onClose, onOpenInvoice, onTrackOrder }) {
  if (!order) return null;

  const isDelivered = order.status === 'DELIVERED';
  const isCancelled = order.status === 'CANCELLED';

  const address = order.shippingAddress || {
    fullName: order.fullName || 'Connoisseur Client',
    addressLine: order.addressLine || '',
    city: order.city || '',
    state: order.stateName || order.state || '',
    pinCode: order.pinCode || order.postalCode || '',
    phone: order.phone || ''
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px'
      }}
    >
      <div 
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 680,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          color: '#1e293b',
          borderRadius: 12,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: '#490017',
          color: '#ffffff',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#C8A34D', fontWeight: 600 }}>
              ORDER SPECIFICATION DETAILS
            </div>
            <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: '1.25rem' }}>
              Order #{order.orderId}
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* Status & Quick Action Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: '#f8fafc',
            borderRadius: 8,
            border: '1px solid #e2e8f0'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Current Status: </span>
              <strong style={{
                color: isDelivered ? '#16a34a' : isCancelled ? '#dc2626' : '#C8A34D',
                fontSize: '0.9rem',
                marginLeft: 4
              }}>
                {order.status || 'PROCESSING'}
              </strong>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {onTrackOrder && !isDelivered && !isCancelled && (
                <button
                  onClick={() => { onClose(); onTrackOrder(order); }}
                  style={{
                    padding: '6px 12px',
                    background: '#490017',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Track Package
                </button>
              )}
              {onOpenInvoice && (
                <button
                  onClick={() => { onClose(); onOpenInvoice(order); }}
                  style={{
                    padding: '6px 12px',
                    background: '#C8A34D',
                    color: '#000000',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View Tax Invoice
                </button>
              )}
            </div>
          </div>

          {/* Logistics Tracking Info if Shipped */}
          {(order.courier || order.trackingNumber) && (
            <div style={{ padding: '12px 16px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 600, color: '#1e40af', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={16} /> Shipping Logistics Details
              </div>
              <div style={{ color: '#1e3a8a' }}>
                {order.courier && <div>Courier Partner: <strong>{order.courier}</strong></div>}
                {order.trackingNumber && <div>AWB / Tracking #: <strong>{order.trackingNumber}</strong></div>}
              </div>
            </div>
          )}

          {/* Items List */}
          <div>
            <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              Items in Order ({order.items?.length || 0})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {order.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 14, padding: 12, border: '1px solid #e2e8f0', borderRadius: 8, alignItems: 'center' }}>
                  <img 
                    src={item.image || '/Images/placeholder.svg'} 
                    alt={item.name} 
                    style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{item.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Qty: {item.quantity || 1} {item.fabric ? `• Fabric: ${item.fabric}` : ''}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#490017' }}>
                    {formatCurrency(item.price * (item.quantity || 1))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address & Payment Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, color: '#490017', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} /> Shipping Address
              </div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{address.fullName}</div>
              <div style={{ color: '#475569', lineHeight: 1.5, marginTop: 4 }}>
                {address.addressLine || address.addressLine1}<br />
                {address.city}{address.city && address.state ? ', ' : ''}{address.state || address.stateName} {address.pinCode || address.postalCode ? `- ${address.pinCode || address.postalCode}` : ''}<br />
                📞 Phone: {address.phone}
              </div>
            </div>

            <div style={{ padding: 14, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
              <div style={{ fontWeight: 700, color: '#490017', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CreditCard size={14} /> Payment & Billing
              </div>
              <div style={{ color: '#475569', lineHeight: 1.6 }}>
                <div>Payment Method: <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod || 'Online / Razorpay'}</strong></div>
                <div>Payment Status: <strong style={{ color: (order.paymentStatus === 'paid' || isDelivered) ? '#16a34a' : '#ea580c' }}>{(order.paymentStatus || 'PAID').toUpperCase()}</strong></div>
                <div>Placed Date: <strong>{order.placedOnDate || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'N/A')}</strong></div>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 14, fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#64748b' }}>
              <span>Subtotal (MRP):</span>
              <span>{formatCurrency(order.mrpTotal || order.subtotal || order.finalAmount)}</span>
            </div>
            {order.subtotal && order.mrpTotal && order.mrpTotal !== order.subtotal && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#64748b' }}>
                <span>Exclusive Price:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#16a34a' }}>
                <span>Festival Discount:</span>
                <span>- {formatCurrency(order.discount)}</span>
              </div>
            )}
            {order.couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#16a34a' }}>
                <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                <span>- {formatCurrency(order.couponDiscount)}</span>
              </div>
            )}
            {order.convenienceFee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#64748b' }}>
                <span>Convenience Fees:</span>
                <span>{formatCurrency(order.convenienceFee)}</span>
              </div>
            )}
            {order.giftPackCharge > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#64748b' }}>
                <span>Luxury Packaging Addon:</span>
                <span>{formatCurrency(order.giftPackCharge)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, color: '#64748b' }}>
              <span>{order.deliveryMode === 'pickup' ? 'Self Pickup' : 'Shipping'}:</span>
              <span>{order.shippingFee > 0 ? formatCurrency(order.shippingFee) : 'FREE'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid #cbd5e1', fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
              <span>Final Paid Amount:</span>
              <span style={{ color: '#490017' }}>{formatCurrency(order.finalAmount || order.totalAmount)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
