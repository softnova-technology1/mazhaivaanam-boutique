import { useState, useEffect, Fragment, useRef } from 'react';
import { orderAPI, dashboardAPI } from '../api/api.js';
import { exportToCSV } from '../utils/exportCSV.js';
import InvoiceModal from '../components/InvoiceModal.jsx';
import {
  Search, ChevronDown, ChevronUp, Truck, MapPin, ShoppingBag, Clock,
  CheckCircle, Check, Navigation, XCircle, Download, FileText, CheckSquare,
  Square, RefreshCw, Send, Printer, Gift
} from 'lucide-react';

const STATUSES = ['', 'CONFIRMED', 'SHIPPING', 'DELIVERED'];
const STATUS_COLORS = { CONFIRMED: 'info', SHIPPING: 'primary', DELIVERED: 'success' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('paid');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', trackingNumber: '', courier: '', note: '' });

  // Multi-select state
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null); // { message, type: 'error'|'success'|'warning' }
  const toastTimerRef = useRef(null);

  // Confirm dialog state
  const [confirm, setConfirm] = useState(null); // { message, onConfirm }

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  };

  const showConfirm = (message, onConfirm) => {
    setConfirm({ message, onConfirm });
  };

  // Invoice Modal state
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadOrders(); }, [page, statusFilter, paymentStatusFilter, dateFilter, sortOrder]);

  const loadStats = async () => {
    try {
      const res = await dashboardAPI.getOverview();
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      let params = `page=${page}&limit=15&sort=${sortOrder}`;
      if (statusFilter) params += `&status=${statusFilter}`;
      if (paymentStatusFilter) params += `&paymentStatus=${paymentStatusFilter}`;
      if (dateFilter) params += `&dateRange=${dateFilter}`;
      const res = await orderAPI.getAll(params);
      setOrders(res.data);
      setPagination(res.pagination);
      setSelectedOrders([]);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const toggleExpand = (id, order) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    setUpdateForm({ status: order.status, trackingNumber: order.trackingNumber || '', courier: order.courier || '', note: '' });
  };

  const handleStatusUpdate = async (orderId) => {
    if (updateForm.status === 'SHIPPING') {
      if (!updateForm.trackingNumber.trim()) {
        showToast('Tracking number is required when marking as SHIPPING.', 'warning');
        return;
      }
      if (!updateForm.courier.trim()) {
        showToast('Courier partner is required when marking as SHIPPING.', 'warning');
        return;
      }
    }
    try {
      await orderAPI.updateStatus(orderId, updateForm);
      showToast('Order status updated successfully!', 'success');
      setExpanded(null);
      loadOrders();
      loadStats();
    } catch (err) { showToast(err.message || 'Failed to update order status.', 'error'); }
  };

  // Multi-select handlers
  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o._id));
    }
  };

  const handleSelectOrder = (id, e) => {
    e.stopPropagation();
    if (selectedOrders.includes(id)) {
      setSelectedOrders(prev => prev.filter(item => item !== id));
    } else {
      setSelectedOrders(prev => [...prev, id]);
    }
  };

  // Bulk Status Update
  const handleBulkStatus = async (targetStatus) => {
    if (!selectedOrders.length) return;
    showConfirm(
      `Update status of ${selectedOrders.length} selected order(s) to "${targetStatus}"?`,
      async () => {
        setBulkLoading(true);
        try {
          await orderAPI.bulkUpdateStatus(selectedOrders, targetStatus);
          setSelectedOrders([]);
          loadOrders();
          loadStats();
          showToast(`${selectedOrders.length} order(s) updated to ${targetStatus}.`, 'success');
        } catch (err) {
          showToast(err.message || 'Error updating orders in bulk', 'error');
        }
        setBulkLoading(false);
      }
    );
  };

  // Export CSV
  const handleExportCSV = (exportSelected = false) => {
    const listToExport = exportSelected
      ? orders.filter(o => selectedOrders.includes(o._id))
      : orders;

    if (!listToExport.length) {
      showToast('No orders to export.', 'warning');
      return;
    }

    const columns = [
      { key: 'orderId', label: 'Order ID' },
      { key: 'createdAt', label: 'Order Date', formatter: (o) => new Date(o.createdAt).toLocaleDateString('en-IN') },
      { key: 'customer', label: 'Customer Name', formatter: (o) => o.shippingAddress?.fullName || `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() },
      { key: 'email', label: 'Customer Email', formatter: (o) => o.user?.email || o.shippingAddress?.email || '' },
      { key: 'phone', label: 'Customer Phone', formatter: (o) => o.shippingAddress?.phone || o.user?.phone || '' },
      { key: 'itemCount', label: 'Total Items', formatter: (o) => o.items?.length || 1 },
      { key: 'totalAmount', label: 'Total Amount (INR)' },
      { key: 'paymentStatus', label: 'Payment Status' },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'status', label: 'Order Status' },
      { key: 'courier', label: 'Courier Partner' },
      { key: 'trackingNumber', label: 'Tracking Number' },
      { key: 'city', label: 'Delivery City', formatter: (o) => o.shippingAddress?.city || '' },
      { key: 'state', label: 'Delivery State', formatter: (o) => o.shippingAddress?.state || '' },
      { key: 'pincode', label: 'Delivery Pincode', formatter: (o) => o.shippingAddress?.pinCode || o.shippingAddress?.postalCode || '' },
    ];

    exportToCSV(listToExport, columns, `MazhaiVaanam_Orders${statusFilter ? '_' + statusFilter : ''}`);
  };

  const totalOrdersCount = pagination?.total !== undefined ? pagination.total : (stats?.overview?.totalOrders || 0);
  
  // Calculate dynamic status counts based on current loaded filtered orders list
  const getFilteredCount = (status) => {
    if (statusFilter && statusFilter !== status) return 0;
    return orders.filter(o => o.status === status).length;
  };

  const getQueueLabel = () => {
    if (paymentStatusFilter === 'paid') return 'Verified Paid Queue';
    if (paymentStatusFilter === 'pending') return 'Abandoned / Pending Queue';
    if (paymentStatusFilter === 'failed') return 'Failed Payments Queue';
    return 'All Total Orders';
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Orders Management</h1>
          <p className="page-subtitle">{totalOrdersCount} {getQueueLabel().toLowerCase()} listed</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            className="btn btn-outline" 
            onClick={() => handleExportCSV(false)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Download size={16} /> Export Filtered to CSV
          </button>
        </div>
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === '' ? '1px solid var(--primary)' : undefined }} onClick={() => { setStatusFilter(''); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', flexShrink: 0 }}><ShoppingBag size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{totalOrdersCount}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{getQueueLabel()}</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'CONFIRMED' ? '1px solid var(--info)' : undefined }} onClick={() => { setStatusFilter('CONFIRMED'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}><Check size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getFilteredCount('CONFIRMED')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confirmed</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'SHIPPING' ? '1px solid var(--primary)' : undefined }} onClick={() => { setStatusFilter('SHIPPING'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', flexShrink: 0 }}><Truck size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getFilteredCount('SHIPPING')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shipping</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'DELIVERED' ? '1px solid var(--success)' : undefined }} onClick={() => { setStatusFilter('DELIVERED'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(22,163,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', flexShrink: 0 }}><CheckCircle size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getFilteredCount('DELIVERED')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivered</div></div>
        </div>
      </div>

      {/* Filter and Bulk Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div className="filter-bar" style={{ margin: 0, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select className="form-select" value={paymentStatusFilter} onChange={e => { setPaymentStatusFilter(e.target.value); setPage(1); }} style={{ fontWeight: 600, borderColor: paymentStatusFilter === 'paid' ? '#16a34a' : paymentStatusFilter === 'pending' ? '#eab308' : undefined }}>
            <option value="paid">✅ Verified Paid (Fulfillment Queue)</option>
            <option value="pending">⏳ Abandoned / Payment Pending</option>
            <option value="failed">❌ Payment Failed</option>
            <option value="">All Payment Statuses</option>
          </select>
          <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Fulfillment Statuses</option>
            {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input 
              type="date" 
              className="form-input" 
              value={dateFilter} 
              onChange={e => { setDateFilter(e.target.value); setPage(1); }} 
              style={{ width: 'auto', padding: '6px 12px' }}
              title="Filter by specific date"
            />
            {dateFilter && (
              <button className="btn btn-sm btn-outline" onClick={() => { setDateFilter(''); setPage(1); }} title="Clear Date Filter">
                Clear
              </button>
            )}
          </div>
          <select className="form-select" value={sortOrder} onChange={e => { setSortOrder(e.target.value); setPage(1); }}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Selected Orders Actions Bar */}
        {selectedOrders.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg-secondary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--primary)'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)' }}>
              {selectedOrders.length} selected
            </span>
            <button 
              className="btn btn-sm btn-primary"
              disabled={bulkLoading}
              onClick={() => handleBulkStatus('SHIPPING')}
            >
              <Truck size={14} /> Mark as Shipping
            </button>
            <button 
              className="btn btn-sm btn-primary"
              disabled={bulkLoading}
              onClick={() => handleBulkStatus('DELIVERED')}
              style={{ background: '#16a34a', borderColor: '#16a34a' }}
            >
              <CheckCircle size={14} /> Mark as Delivered
            </button>

            <button 
              className="btn btn-sm btn-outline"
              onClick={() => handleExportCSV(true)}
            >
              <Download size={14} /> Export Selected
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div className="card empty-state"><p>No orders found</p></div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={orders.length > 0 && selectedOrders.length === orders.length}
                    onChange={handleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ width: 45, textAlign: 'center' }}>#</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Invoice</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => {
                const isSelected = selectedOrders.includes(order._id);
                return (
                  <Fragment key={order._id || order.id || idx}>
                    <tr 
                      style={{ cursor: 'pointer', background: isSelected ? 'rgba(200, 163, 77, 0.08)' : undefined }} 
                      onClick={() => toggleExpand(order._id, order)}
                    >
                      <td style={{ textAlign: 'center' }} onClick={e => handleSelectOrder(order._id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                        {(page - 1) * 15 + idx + 1}
                      </td>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{order.orderId}</td>
                      <td>
                        {order.shippingAddress?.fullName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim() || 'Customer'}
                        <br/>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email || order.shippingAddress?.phone}</span>
                      </td>
                      <td>
                        {order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                        {order.giftPackaging && (
                          <span title="Gift Packaging Requested" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 3,
                            marginLeft: 6, padding: '1px 7px', borderRadius: 10,
                            background: 'rgba(200,163,77,0.18)', border: '1px solid rgba(200,163,77,0.5)',
                            fontSize: '0.68rem', fontWeight: 700, color: '#C8A34D', verticalAlign: 'middle'
                          }}>
                            <Gift size={10} /> GIFT
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                      <td><span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : order.paymentStatus === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{order.paymentStatus}</span></td>
                      <td><span className={`badge badge-${STATUS_COLORS[order.status] || 'neutral'}`}>{order.status}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInvoiceOrder(order);
                          }}
                          title="Generate Tax Invoice"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                          <FileText size={14} /> Bill
                        </button>
                      </td>
                      <td>{expanded === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</td>
                    </tr>
                    {expanded === order._id && (
                      <tr key={(order._id || idx) + '-detail'}>
                        <td colSpan="11" style={{ padding: 0 }}>
                          <div style={{ background: 'var(--bg-secondary)', padding: 24, borderTop: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.2fr', gap: 24, marginBottom: 20 }}>
                              {/* Items */}
                              <div>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Items in Order</h4>
                                {order.items?.map((item, i) => (
                                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 6, background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 }}>
                                      {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                    </div>
                                    <div>
                                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item.name}</div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} · ₹{item.price?.toLocaleString('en-IN')}</div>
                                    </div>
                                  </div>
                                ))}

                                {/* Gift Packaging — shown directly under items */}
                                {order.giftPackaging && (
                                  <div style={{
                                    marginTop: 12,
                                    padding: '10px 14px',
                                    background: 'rgba(200, 163, 77, 0.12)',
                                    border: '1px solid rgba(200, 163, 77, 0.5)',
                                    borderRadius: 8,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 10
                                  }}>
                                    <Gift size={18} color="#C8A34D" style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div>
                                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#C8A34D', marginBottom: 2 }}>
                                        🎁 GIFT PACKAGING REQUESTED
                                      </div>
                                      {order.giftMessage ? (
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                          "{order.giftMessage}"
                                        </div>
                                      ) : (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                          No message provided
                                        </div>
                                      )}
                                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                                        Packaging charge: ₹{order.giftPackCharge || 499}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Address */}
                              <div>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                  <MapPin size={14} style={{ display: 'inline', verticalAlign: -2 }} /> Shipping Address
                                </h4>
                                <div style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                  <strong>{order.shippingAddress?.fullName}</strong><br/>
                                  {order.shippingAddress?.addressLine1 || order.shippingAddress?.addressLine}<br/>
                                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode || order.shippingAddress?.pinCode}<br/>
                                  📞 {order.shippingAddress?.phone}
                                </div>
                              </div>

                              {/* Update Status & Invoice */}
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                                    <Truck size={14} style={{ display: 'inline', verticalAlign: -2 }} /> Update Logistics
                                  </h4>
                                  <button 
                                    className="btn btn-sm btn-primary"
                                    onClick={() => setInvoiceOrder(order)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                                  >
                                    <Printer size={14} /> Print Invoice
                                  </button>
                                </div>
                                <select className="form-select" style={{ marginBottom: 8 }} value={updateForm.status} onChange={e => setUpdateForm(f => ({ ...f, status: e.target.value }))}>
                                  {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>

                                {/* Tracking & Courier — visible & required only when SHIPPING */}
                                {updateForm.status === 'SHIPPING' && (
                                  <>
                                    <div style={{ position: 'relative', marginBottom: 8 }}>
                                      <input
                                        className="form-input"
                                        placeholder="Tracking number (e.g. BD98765432)"
                                        value={updateForm.trackingNumber}
                                        onChange={e => setUpdateForm(f => ({ ...f, trackingNumber: e.target.value }))}
                                        required
                                        style={{ borderColor: !updateForm.trackingNumber.trim() ? '#e53e3e' : undefined }}
                                      />
                                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: '#e53e3e', fontWeight: 600, pointerEvents: 'none' }}>REQUIRED</span>
                                    </div>
                                    <div style={{ position: 'relative', marginBottom: 8 }}>
                                      <input
                                        className="form-input"
                                        placeholder="Courier partner (e.g. BlueDart)"
                                        value={updateForm.courier}
                                        onChange={e => setUpdateForm(f => ({ ...f, courier: e.target.value }))}
                                        required
                                        style={{ borderColor: !updateForm.courier.trim() ? '#e53e3e' : undefined }}
                                      />
                                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: '#e53e3e', fontWeight: 600, pointerEvents: 'none' }}>REQUIRED</span>
                                    </div>
                                  </>
                                )}

                                <input className="form-input" placeholder="Status note (optional)" style={{ marginBottom: 10 }} value={updateForm.note} onChange={e => setUpdateForm(f => ({ ...f, note: e.target.value }))} />
                                <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(order.orderId || order._id)}>Save Updates</button>
                              </div>
                            </div>

                            {/* Status History */}
                            {order.statusHistory?.length > 0 && (
                              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
                                <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status History Timeline</h4>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                  {order.statusHistory.map((h, i) => (
                                    <div key={i} style={{ background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 6, fontSize: '0.78rem' }}>
                                      <span className={`badge badge-${STATUS_COLORS[h.status] || 'neutral'}`} style={{ marginRight: 6 }}>{h.status}</span>
                                      <span style={{ color: 'var(--text-muted)' }}>{new Date(h.timestamp).toLocaleString('en-IN')}</span>
                                      {h.note && <span style={{ color: 'var(--text-secondary)', marginLeft: 6 }}>({h.note})</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
          <button
            className="btn btn-sm btn-outline"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button
            className="btn btn-sm btn-outline"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* ── Toast Notification ── */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 99999,
          minWidth: 280,
          maxWidth: 420,
          background: toast.type === 'success' ? '#166534' : toast.type === 'warning' ? '#92400e' : '#7f1d1d',
          color: '#fff',
          borderRadius: 10,
          padding: '14px 20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          animation: 'slideInRight 0.3s ease',
        }}>
          <span style={{ fontSize: 20 }}>
            {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : '❌'}
          </span>
          <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 }}>
            {toast.message}
          </span>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Confirm Dialog Modal ── */}
      {confirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99998,
          background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'var(--bg-card, #1e1e2e)',
            border: '1px solid var(--border-color, #2a2a36)',
            borderRadius: 14,
            padding: '32px 28px',
            maxWidth: 400,
            width: '90%',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔄</div>
            <h3 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary, #fff)' }}>Bulk Status Update</h3>
            <p style={{ margin: '0 0 24px', fontSize: '0.875rem', color: 'var(--text-secondary, #a0a0b2)', lineHeight: 1.5 }}>
              {confirm.message}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setConfirm(null)}
                style={{ minWidth: 90 }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => { confirm.onConfirm(); setConfirm(null); }}
                style={{ minWidth: 90 }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
