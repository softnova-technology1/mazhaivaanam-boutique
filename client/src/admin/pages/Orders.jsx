import { useState, useEffect } from 'react';
import { orderAPI, dashboardAPI } from '../api/api.js';
import { Search, ChevronDown, ChevronUp, Truck, MapPin, ShoppingBag, Clock, CheckCircle, Check, Navigation, XCircle } from 'lucide-react';

const STATUSES = ['', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'IN TRANSIT', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS = { PROCESSING: 'warning', CONFIRMED: 'info', SHIPPED: 'primary', 'IN TRANSIT': 'info', 'OUT FOR DELIVERY': 'primary', DELIVERED: 'success', CANCELLED: 'danger', RETURNED: 'neutral' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [updateForm, setUpdateForm] = useState({ status: '', trackingNumber: '', courier: '', note: '' });

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { loadOrders(); }, [page, statusFilter]);

  const loadStats = async () => {
    try {
      const res = await dashboardAPI.getOverview();
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = `page=${page}&limit=15${statusFilter ? '&status=' + statusFilter : ''}`;
      const res = await orderAPI.getAll(params);
      setOrders(res.data);
      setPagination(res.pagination);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const toggleExpand = (id, order) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    setUpdateForm({ status: order.status, trackingNumber: order.trackingNumber || '', courier: order.courier || '', note: '' });
  };

  const handleStatusUpdate = async (orderId) => {
    try {
      await orderAPI.updateStatus(orderId, updateForm);
      setExpanded(null);
      loadOrders();
      loadStats();
    } catch (err) { alert(err.message); }
  };

  const totalOrders = stats?.overview?.totalOrders || 0;
  const getCount = (status) => stats?.statusBreakdown?.find(s => s._id === status)?.count || 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-subtitle">{totalOrders} total orders</p>
        </div>
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === '' ? '1px solid var(--primary)' : undefined }} onClick={() => { setStatusFilter(''); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', flexShrink: 0 }}><ShoppingBag size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{totalOrders}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Orders</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'PROCESSING' ? '1px solid var(--warning)' : undefined }} onClick={() => { setStatusFilter('PROCESSING'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', flexShrink: 0 }}><Clock size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getCount('PROCESSING')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Processing</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'CONFIRMED' ? '1px solid var(--info)' : undefined }} onClick={() => { setStatusFilter('CONFIRMED'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', flexShrink: 0 }}><Check size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getCount('CONFIRMED')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Confirmed</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'SHIPPED' ? '1px solid var(--primary)' : undefined }} onClick={() => { setStatusFilter('SHIPPED'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6', flexShrink: 0 }}><Truck size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getCount('SHIPPED')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shipped</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'IN TRANSIT' ? '1px solid var(--info)' : undefined }} onClick={() => { setStatusFilter('IN TRANSIT'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06B6D4', flexShrink: 0 }}><Navigation size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getCount('IN TRANSIT')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>In Transit</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'OUT FOR DELIVERY' ? '1px solid var(--primary)' : undefined }} onClick={() => { setStatusFilter('OUT FOR DELIVERY'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F97316', flexShrink: 0 }}><MapPin size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getCount('OUT FOR DELIVERY')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Out For Delivery</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'DELIVERED' ? '1px solid var(--success)' : undefined }} onClick={() => { setStatusFilter('DELIVERED'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}><CheckCircle size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getCount('DELIVERED')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivered</div></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, cursor: 'pointer', border: statusFilter === 'CANCELLED' ? '1px solid var(--danger)' : undefined }} onClick={() => { setStatusFilter('CANCELLED'); setPage(1); }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', flexShrink: 0 }}><XCircle size={20} /></div>
          <div><div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{getCount('CANCELLED')}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cancelled</div></div>
        </div>
      </div>

      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <select className="form-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
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
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <>
                  <tr key={order._id} style={{ cursor: 'pointer' }} onClick={() => toggleExpand(order._id, order)}>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{order.orderId}</td>
                    <td>{order.user?.firstName} {order.user?.lastName}<br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</span></td>
                    <td>{order.items?.length} item{order.items?.length > 1 ? 's' : ''}</td>
                    <td style={{ fontWeight: 600 }}>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : order.paymentStatus === 'failed' ? 'badge-danger' : 'badge-warning'}`}>{order.paymentStatus}</span></td>
                    <td><span className={`badge badge-${STATUS_COLORS[order.status] || 'neutral'}`}>{order.status}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>{expanded === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</td>
                  </tr>
                  {expanded === order._id && (
                    <tr key={order._id + '-detail'}>
                      <td colSpan="8" style={{ padding: 0 }}>
                        <div style={{ background: 'var(--bg-secondary)', padding: 24, borderTop: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 20 }}>
                            {/* Items */}
                            <div>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Items</h4>
                              {order.items?.map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                                  <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 }}>
                                    {item.image && <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} · ₹{item.price?.toLocaleString('en-IN')}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* Address */}
                            <div>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                <MapPin size={14} style={{ display: 'inline', verticalAlign: -2 }} /> Shipping Address
                              </h4>
                              <div style={{ fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                {order.shippingAddress?.fullName}<br/>
                                {order.shippingAddress?.addressLine}<br/>
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}<br/>
                                📞 {order.shippingAddress?.phone}
                              </div>
                            </div>
                            {/* Update Status */}
                            <div>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                <Truck size={14} style={{ display: 'inline', verticalAlign: -2 }} /> Update Status
                              </h4>
                              <select className="form-select" style={{ marginBottom: 10 }} value={updateForm.status} onChange={e => setUpdateForm(f => ({ ...f, status: e.target.value }))}>
                                {STATUSES.filter(Boolean).map(s => <option key={s}>{s}</option>)}
                              </select>
                              <input className="form-input" placeholder="Tracking number" style={{ marginBottom: 8 }} value={updateForm.trackingNumber} onChange={e => setUpdateForm(f => ({ ...f, trackingNumber: e.target.value }))} />
                              <input className="form-input" placeholder="Courier name" style={{ marginBottom: 8 }} value={updateForm.courier} onChange={e => setUpdateForm(f => ({ ...f, courier: e.target.value }))} />
                              <input className="form-input" placeholder="Note (optional)" style={{ marginBottom: 12 }} value={updateForm.note} onChange={e => setUpdateForm(f => ({ ...f, note: e.target.value }))} />
                              <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(order.orderId)}>Update Status</button>
                            </div>
                          </div>
                          {/* Status History */}
                          {order.statusHistory?.length > 0 && (
                            <div>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Timeline</h4>
                              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {order.statusHistory.map((h, i) => (
                                  <div key={i} style={{ background: 'var(--bg-surface)', padding: '8px 14px', borderRadius: 8, fontSize: '0.8rem' }}>
                                    <span className={`badge badge-${STATUS_COLORS[h.status] || 'neutral'}`} style={{ marginRight: 8 }}>{h.status}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{new Date(h.timestamp).toLocaleString('en-IN')}</span>
                                    {h.note && <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>— {h.note}</span>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {Array.from({ length: pagination.totalPages }, (_, i) => (
            <button key={i} className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-outline'}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
