import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../api/api.js';
import InvoiceModal from '../components/InvoiceModal';
import {
  DollarSign, ShoppingCart, Package, Users, AlertTriangle, MessageSquare,
  TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3, Plus, ChevronDown,
  ExternalLink, FileText, ArrowRight, ShieldAlert, Sparkles, Tag, Percent, Settings as SettingsIcon, Calendar,
  Activity, UserPlus, X, Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import '../styles/dashboard.css';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [sales, setSales] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);

  // Flow State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const quickActionRef = useRef(null);
  const [actionDrawerOpen, setActionDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState(null); // 'lowStock' | 'inquiries'

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    dashboardAPI.getSales(period).then(res => setSales(res.data)).catch(() => {});
  }, [period]);

  // Close Quick Action menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (quickActionRef.current && !quickActionRef.current.contains(e.target)) {
        setQuickActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadDashboard = async () => {
    try {
      const [overview, salesRes] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getSales(period),
      ]);
      setData(overview.data);
      setSales(salesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loader"><div className="spinner" /></div>;
  }

  const o = data?.overview || {};

  const statCards = [
    { label: 'Total Revenue', value: `₹${(o.totalRevenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'gold', change: '+12.5%', up: true, path: '/mazhaivaanam-sn2026/orders' },
    { label: 'Total Orders', value: o.totalOrders || 0, icon: ShoppingCart, color: 'blue', change: `${o.paidOrders || 0} paid`, up: true, path: '/mazhaivaanam-sn2026/orders' },
    { label: 'Products', value: o.totalProducts || 0, icon: Package, color: 'green', path: '/mazhaivaanam-sn2026/products' },
    { label: 'Customers', value: o.totalUsers || 0, icon: Users, color: 'purple', path: '/mazhaivaanam-sn2026/users' },
    { label: 'Low Stock', value: o.lowStockCount || 0, icon: AlertTriangle, color: o.lowStockCount > 0 ? 'red' : 'green', path: '/mazhaivaanam-sn2026/inventory' },
    { label: 'Inquiries', value: o.pendingInquiries || 0, icon: MessageSquare, color: o.pendingInquiries > 0 ? 'orange' : 'green', path: '/mazhaivaanam-sn2026/inquiries' },
  ];

  const recentOrdersList = data?.recentOrders || [];
  const recentUsersList = data?.recentUsers || [];
  const recentInquiriesList = data?.recentInquiries || [];

  const activities = [
    ...recentOrdersList.map(order => ({ type: 'order', data: order, date: new Date(order.createdAt) })),
    ...recentUsersList.map(user => ({ type: 'user', data: user, date: new Date(user.createdAt) })),
    ...recentInquiriesList.map(inquiry => ({ type: 'inquiry', data: inquiry, date: new Date(inquiry.createdAt) }))
  ].sort((a, b) => b.date - a.date).slice(0, 15);

  // Revenue chart data
  const revenueChart = {
    labels: sales?.sales?.map(s => s._id) || [],
    datasets: [{
      label: 'Revenue (₹)',
      data: sales?.sales?.map(s => s.revenue) || [],
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) return 'rgba(200, 163, 77, 0.75)';
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(200, 163, 77, 0.15)');
        gradient.addColorStop(1, 'rgba(200, 163, 77, 0.85)');
        return gradient;
      },
      borderColor: '#C8A34D',
      borderWidth: 1.5,
      borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 2, bottomRight: 2 },
      borderSkipped: false,
      hoverBackgroundColor: '#B08B35',
      maxBarThickness: 42,
    }],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleColor: '#94A3B8',
        titleFont: { size: 11, weight: '500' },
        bodyColor: '#C8A34D',
        bodyFont: { size: 13, weight: '700' },
        padding: 12,
        cornerRadius: 10,
        boxPadding: 4,
        displayColors: false,
        callbacks: {
          label: (ctx) => `Revenue: ₹${ctx.raw?.toLocaleString('en-IN') || 0}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748B', font: { size: 11, weight: '500' } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.7)', strokeDash: [4, 4] },
        ticks: {
          color: '#64748B',
          font: { size: 11, weight: '500' },
          padding: 8,
          callback: (v) => `₹${v >= 1000 ? (v/1000).toFixed(0) + 'K' : v}`,
        },
        border: { dash: [4, 4], display: false },
      },
    },
  };

  // Order status doughnut
  const statusMap = {};
  (data?.statusBreakdown || []).forEach(s => { statusMap[s._id] = s.count; });
  const statusColors = {
    DELIVERED: '#10B981',
    CONFIRMED: '#3B82F6',
    SHIPPING: '#8B5CF6',
    PACKING: '#F59E0B',
    CANCELLED: '#EF4444'
  };

  const doughnutData = {
    labels: Object.keys(statusMap),
    datasets: [{
      data: Object.values(statusMap),
      backgroundColor: Object.keys(statusMap).map(k => statusColors[k] || '#94A3B8'),
      borderColor: '#ffffff',
      borderWidth: 3,
      borderRadius: 4,
      spacing: 3,
      hoverOffset: 6,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#64748B',
          font: { size: 11, weight: '600' },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#0F172A',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleColor: '#F8FAFC',
        bodyColor: '#F8FAFC',
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="page-container">
      {/* Header Bar with Date & Quick Action Button */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your store overview.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="dash-date" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>

          {/* Quick Action Launcher Dropdown */}
          <div style={{ position: 'relative' }} ref={quickActionRef}>
            <button
              onClick={() => setQuickActionOpen(!quickActionOpen)}
              className="quick-action-trigger-btn"
            >
              <Plus size={16} />
              <span>Quick Action</span>
              <ChevronDown size={14} style={{ transform: quickActionOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>

            {quickActionOpen && (
              <div className="quick-action-dropdown">
                <div className="quick-action-header">FLOW SHORTCUTS</div>
                <button onClick={() => { setQuickActionOpen(false); navigate('/mazhaivaanam-sn2026/products'); }} className="quick-action-item">
                  <Package size={15} color="#C8A34D" />
                  <span>Add / Manage Products</span>
                </button>
                <button onClick={() => { setQuickActionOpen(false); navigate('/mazhaivaanam-sn2026/coupons'); }} className="quick-action-item">
                  <Tag size={15} color="#3B82F6" />
                  <span>Create Discount Coupon</span>
                </button>
                <button onClick={() => { setQuickActionOpen(false); navigate('/mazhaivaanam-sn2026/discounts'); }} className="quick-action-item">
                  <Percent size={15} color="#22C55E" />
                  <span>Configure Promotional Discounts</span>
                </button>
                <button onClick={() => { setQuickActionOpen(false); navigate('/mazhaivaanam-sn2026/pre-booking'); }} className="quick-action-item">
                  <Sparkles size={15} color="#8B5CF6" />
                  <span>Manage Pre-Booking Catalog</span>
                </button>
                <button onClick={() => { setQuickActionOpen(false); navigate('/mazhaivaanam-sn2026/settings'); }} className="quick-action-item">
                  <SettingsIcon size={15} color="#F59E0B" />
                  <span>Update Announcement & Fees</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Required Alert Strip */}
      {(o.lowStockCount > 0 || o.pendingInquiries > 0) && (
        <div className="action-required-banner">
          <div className="alert-content">
            <div className="alert-badge">
              <ShieldAlert size={16} />
              <span>Action Needed</span>
            </div>
            <div className="alert-messages">
              {o.lowStockCount > 0 && (
                <span className="alert-item">
                  ⚠️ <strong>{o.lowStockCount} sarees</strong> running low on stock
                </span>
              )}
              {o.pendingInquiries > 0 && (
                <span className="alert-item">
                  💬 <strong>{o.pendingInquiries} customer inquiries</strong> awaiting response
                </span>
              )}
            </div>
          </div>
          <div className="alert-actions">
            {o.lowStockCount > 0 && (
              <button onClick={() => { setDrawerContent('lowStock'); setActionDrawerOpen(true); }} className="btn-alert-action">
                Restock Inventory <ArrowRight size={13} />
              </button>
            )}
            {o.pendingInquiries > 0 && (
              <button onClick={() => { setDrawerContent('inquiries'); setActionDrawerOpen(true); }} className="btn-alert-action outline">
                View Inquiries <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Clickable Stat Cards Deep-Link Grid */}
      <div className="stat-grid">
        {statCards.map((card, i) => (
          <div 
            key={i} 
            className={`stat-card stat-${card.color} stat-clickable`}
            onClick={() => navigate(card.path)}
            title={`Click to view ${card.label}`}
          >
            <div className="stat-icon-wrap">
              <card.icon size={20} />
            </div>
            <div className="stat-info">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <span className="stat-label">{card.label}</span>
                <ExternalLink size={12} className="stat-link-icon" />
              </div>
              <span className="stat-value">{card.value}</span>
              {card.change && (
                <span className={`stat-change ${card.up ? 'up' : 'down'}`}>
                  {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {card.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="chart-row">
        <div className="card chart-card chart-revenue">
          <div className="chart-header">
            <div className="chart-title-wrap">
              <div className="chart-icon-badge">
                <BarChart3 size={18} />
              </div>
              <h3 className="chart-title">Revenue Overview</h3>
            </div>
            <div className="period-toggle">
              {['daily', 'weekly', 'monthly'].map(p => (
                <button
                  key={p}
                  className={`period-btn ${period === p ? 'active' : ''}`}
                  onClick={() => setPeriod(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-body">
            {sales?.sales?.length > 0 ? (
              <Bar data={revenueChart} options={revenueOptions} />
            ) : (
              <div className="empty-state"><p>No sales data yet</p></div>
            )}
          </div>
        </div>

        <div className="card chart-card chart-status">
          <div className="chart-header">
            <div className="chart-title-wrap">
              <div className="chart-icon-badge blue">
                <TrendingUp size={18} />
              </div>
              <h3 className="chart-title">Order Status</h3>
            </div>
            <button onClick={() => navigate('/mazhaivaanam-sn2026/orders')} className="link-action-btn">
              <span>View All</span> <ArrowRight size={13} />
            </button>
          </div>
          <div className="chart-body">
            {Object.keys(statusMap).length > 0 ? (
              <div className="doughnut-container">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="doughnut-center-info">
                  <span className="doughnut-center-value">{o.totalOrders || 0}</span>
                  <span className="doughnut-center-label">Total Orders</span>
                </div>
              </div>
            ) : (
              <div className="empty-state"><p>No orders yet</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="chart-row">
        {/* Recent Orders with In-Place Modal Preview */}
        <div className="card chart-card" style={{ flex: 2 }}>
          <div className="chart-header" style={{ justifyContent: 'space-between' }}>
            <h3 className="chart-title"><ShoppingCart size={18} /> Recent Orders</h3>
            <button onClick={() => navigate('/mazhaivaanam-sn2026/orders')} className="link-action-btn">
              Manage Orders <ArrowRight size={13} />
            </button>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders || []).length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No orders yet</td></tr>
                ) : (
                  data.recentOrders.map(order => (
                    <tr key={order._id} className="row-hoverable" onClick={() => setSelectedOrder(order)}>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{order.orderId}</td>
                      <td>{order.user?.firstName || order.fullName || 'Customer'} {order.user?.lastName || ''}</td>
                      <td style={{ fontWeight: 600 }}>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                      <td><span className={`badge badge-${getStatusColor(order.status)}`}>{order.status}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} 
                          className="table-action-icon-btn"
                          title="View Tax Invoice Modal"
                        >
                          <FileText size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card chart-card">
          <div className="chart-header" style={{ justifyContent: 'space-between' }}>
            <h3 className="chart-title"><Package size={18} /> Top Products</h3>
            <button onClick={() => navigate('/mazhaivaanam-sn2026/products')} className="link-action-btn">
              Catalog <ArrowRight size={13} />
            </button>
          </div>
          <div className="top-products-list">
            {(sales?.topProducts || []).length === 0 ? (
              <div className="empty-state"><p>No sales data yet</p></div>
            ) : (
              sales.topProducts.slice(0, 5).map((prod, i) => (
                <div 
                  key={i} 
                  className="top-product-item top-product-clickable"
                  onClick={() => navigate('/mazhaivaanam-sn2026/products')}
                  title="Click to manage catalog"
                >
                  <span className="top-product-rank">{i + 1}</span>
                  <div className="top-product-info" style={{ flex: 1 }}>
                    <span className="top-product-name">{prod._id}</span>
                    <span className="top-product-meta">{prod.totalSold} sold · ₹{prod.totalRevenue?.toLocaleString('en-IN')}</span>
                  </div>
                  <ExternalLink size={13} className="top-prod-link" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed Row */}
      <div className="chart-row">
        {/* Activity Feed */}
        <div className="card chart-card" style={{ flex: 1 }}>
          <div className="chart-header">
            <h3 className="chart-title"><Activity size={18} /> Live Activity</h3>
          </div>
          <div className="activity-feed-list">
            {activities.length === 0 ? (
              <div className="empty-state"><p>No recent activity</p></div>
            ) : (
              activities.map((act, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-icon">
                    {act.type === 'order' && <ShoppingCart size={15} color="#3B82F6" />}
                    {act.type === 'user' && <UserPlus size={15} color="#8B5CF6" />}
                    {act.type === 'inquiry' && <MessageSquare size={15} color="#F59E0B" />}
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">
                      {act.type === 'order' && <span>New order <strong>{act.data.orderId}</strong> placed for ₹{act.data.totalAmount?.toLocaleString('en-IN')}</span>}
                      {act.type === 'user' && <span>New user <strong>{act.data.firstName} {act.data.lastName}</strong> registered</span>}
                      {act.type === 'inquiry' && <span>New inquiry from <strong>{act.data.name}</strong></span>}
                    </div>
                    <div className="activity-time">
                      <Clock size={10} style={{ display: 'inline', marginRight: 4, transform: 'translateY(1px)' }} />
                      {act.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* In-Place Tax Invoice & Order Modal */}
      {selectedOrder && (
        <InvoiceModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Action Center Drawer */}
      {actionDrawerOpen && (
        <div className="action-drawer-overlay" onClick={() => setActionDrawerOpen(false)}>
          <div className="action-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="action-drawer-header">
              <h3 className="action-drawer-title">
                {drawerContent === 'lowStock' ? <AlertTriangle size={18} color="#F59E0B" /> : <MessageSquare size={18} color="#3B82F6" />}
                {drawerContent === 'lowStock' ? 'Action Center: Low Stock' : 'Action Center: Pending Inquiries'}
              </h3>
              <button className="action-drawer-close" onClick={() => setActionDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="action-drawer-body">
              {drawerContent === 'lowStock' ? (
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.5 }}>
                    Manage your low stock items directly from here. (Inline stock editor UI coming soon)
                  </p>
                  <button onClick={() => navigate('/mazhaivaanam-sn2026/inventory')} className="quick-action-trigger-btn" style={{ width: '100%', justifyContent: 'center' }}>
                    Go to Full Inventory
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16, lineHeight: 1.5 }}>
                    Reply to customer inquiries directly from this panel without switching context. (Inline messaging UI coming soon)
                  </p>
                  <button onClick={() => navigate('/mazhaivaanam-sn2026/inquiries')} className="quick-action-trigger-btn" style={{ width: '100%', justifyContent: 'center' }}>
                    Go to Inquiries Page
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getStatusColor(status) {
  const map = {
    CONFIRMED: 'info', SHIPPING: 'primary', DELIVERED: 'success', PACKING: 'warning', CANCELLED: 'danger'
  };
  return map[status] || 'neutral';
}
