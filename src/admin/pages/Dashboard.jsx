import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/api.js';
import {
  DollarSign, ShoppingCart, Package, Users, AlertTriangle, MessageSquare,
  TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3,
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
  const [data, setData] = useState(null);
  const [sales, setSales] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    dashboardAPI.getSales(period).then(res => setSales(res.data)).catch(() => {});
  }, [period]);

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
    { label: 'Total Revenue', value: `₹${(o.totalRevenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'gold', change: '+12.5%', up: true },
    { label: 'Total Orders', value: o.totalOrders || 0, icon: ShoppingCart, color: 'blue', change: `${o.paidOrders || 0} paid`, up: true },
    { label: 'Products', value: o.totalProducts || 0, icon: Package, color: 'green' },
    { label: 'Customers', value: o.totalUsers || 0, icon: Users, color: 'purple' },
    { label: 'Low Stock', value: o.lowStockCount || 0, icon: AlertTriangle, color: o.lowStockCount > 0 ? 'red' : 'green' },
    { label: 'Inquiries', value: o.pendingInquiries || 0, icon: MessageSquare, color: o.pendingInquiries > 0 ? 'orange' : 'green' },
  ];

  // Revenue chart data
  const revenueChart = {
    labels: sales?.sales?.map(s => s._id) || [],
    datasets: [{
      label: 'Revenue (₹)',
      data: sales?.sales?.map(s => s.revenue) || [],
      backgroundColor: 'rgba(200, 163, 77, 0.3)',
      borderColor: '#C8A34D',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A24',
        borderColor: '#2A2A36',
        borderWidth: 1,
        titleColor: '#FAFAFA',
        bodyColor: '#A0A0B2',
        padding: 12,
        callbacks: {
          label: (ctx) => `₹${ctx.raw?.toLocaleString('en-IN') || 0}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(42,42,54,0.5)' },
        ticks: { color: '#6B6B80', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(42,42,54,0.5)' },
        ticks: {
          color: '#6B6B80',
          font: { size: 11 },
          callback: (v) => `₹${v >= 1000 ? (v/1000).toFixed(0) + 'K' : v}`,
        },
      },
    },
  };

  // Order status doughnut
  const statusMap = {};
  (data?.statusBreakdown || []).forEach(s => { statusMap[s._id] = s.count; });
  const statusColors = {
    CONFIRMED: '#3B82F6', SHIPPING: '#8B5CF6', DELIVERED: '#22C55E'
  };

  const doughnutData = {
    labels: Object.keys(statusMap),
    datasets: [{
      data: Object.values(statusMap),
      backgroundColor: Object.keys(statusMap).map(k => statusColors[k] || '#6B7280'),
      borderWidth: 0,
      spacing: 2,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#A0A0B2', font: { size: 11 }, padding: 12, usePointStyle: true, pointStyleWidth: 8 },
      },
    },
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your store overview.</p>
        </div>
        <div className="dash-date">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {statCards.map((card, i) => (
          <div key={i} className={`stat-card stat-${card.color}`}>
            <div className="stat-icon-wrap">
              <card.icon size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{card.label}</span>
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
            <div>
              <h3 className="chart-title"><BarChart3 size={18} /> Revenue Overview</h3>
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
            <h3 className="chart-title"><TrendingUp size={18} /> Order Status</h3>
          </div>
          <div className="chart-body">
            {Object.keys(statusMap).length > 0 ? (
              <Doughnut data={doughnutData} options={doughnutOptions} />
            ) : (
              <div className="empty-state"><p>No orders yet</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="chart-row">
        <div className="card chart-card" style={{ flex: 2 }}>
          <div className="chart-header">
            <h3 className="chart-title">Recent Orders</h3>
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
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders || []).length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No orders yet</td></tr>
                ) : (
                  data.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{order.orderId}</td>
                      <td>{order.user?.firstName} {order.user?.lastName}</td>
                      <td>₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                      <td><span className={`badge badge-${getStatusColor(order.status)}`}>{order.status}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Top Products</h3>
          </div>
          <div className="top-products-list">
            {(sales?.topProducts || []).length === 0 ? (
              <div className="empty-state"><p>No sales data yet</p></div>
            ) : (
              sales.topProducts.slice(0, 5).map((prod, i) => (
                <div key={i} className="top-product-item">
                  <span className="top-product-rank">{i + 1}</span>
                  <div className="top-product-info">
                    <span className="top-product-name">{prod._id}</span>
                    <span className="top-product-meta">{prod.totalSold} sold · ₹{prod.totalRevenue?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const map = {
    CONFIRMED: 'info', SHIPPING: 'primary', DELIVERED: 'success'
  };
  return map[status] || 'neutral';
}
