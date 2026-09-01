import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingBag, Clock, PackageSearch, Layers3,
  ClipboardList, Users, Star, MessageSquare, Ticket, LogOut, Percent, Store, Sparkles, Settings, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/mazhaivaanam-sn2026', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/mazhaivaanam-sn2026/products', icon: ShoppingBag, label: 'Products' },
  { path: '/mazhaivaanam-sn2026/pre-booking', icon: Clock, label: 'Pre-Booking' },
  { path: '/mazhaivaanam-sn2026/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/mazhaivaanam-sn2026/inventory', icon: PackageSearch, label: 'Inventory' },
  { path: '/mazhaivaanam-sn2026/limited-offer', icon: Sparkles, label: 'Limited Offer' },
  { path: '/mazhaivaanam-sn2026/discounts', icon: Percent, label: 'Discounts' },
  { path: '/mazhaivaanam-sn2026/categories', icon: Layers3, label: 'Fabrics' },
  { path: '/mazhaivaanam-sn2026/users', icon: Users, label: 'Users' },
  { path: '/mazhaivaanam-sn2026/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { path: '/mazhaivaanam-sn2026/coupons', icon: Ticket, label: 'Coupons' },
  { path: '/mazhaivaanam-sn2026/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
            <h1 className="sidebar-title">Mazhai Vaanam</h1>
            <span className="sidebar-badge">ADMIN</span>
          </div>
        )}
        <button 
          className="sidebar-toggle" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {!isCollapsed && <div className="sidebar-section-label">MENU</div>}
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive && (item.path === '/mazhaivaanam-sn2026' ? location.pathname === '/mazhaivaanam-sn2026' : true) ? 'active' : ''}`
            }
            end={item.path === '/mazhaivaanam-sn2026'}
            title={isCollapsed ? item.label : ""}
          >
            <item.icon size={18} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}

        {!isCollapsed && <div className="sidebar-section-label" style={{ marginTop: '1rem' }}>STORE</div>}
        <Link to="/" className="sidebar-link" title={isCollapsed ? "View Customer Store" : ""}>
          <Store size={18} />
          {!isCollapsed && <span>View Customer Store</span>}
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar" title={isCollapsed ? `${user?.firstName} ${user?.lastName}` : ""}>
            {user?.firstName?.charAt(0) || 'A'}
          </div>
          {!isCollapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.firstName} {user?.lastName}</span>
              <span className="sidebar-user-role">Administrator</span>
            </div>
          )}
        </div>
        <button className="sidebar-logout" onClick={logout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
