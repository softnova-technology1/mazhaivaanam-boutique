import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingBag, PackageSearch, Layers3,
  ClipboardList, Users, Star, MessageSquare, Ticket, LogOut, Tags, Percent, Store, Sparkles
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
  { path: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/admin/inventory', icon: PackageSearch, label: 'Inventory' },
  { path: '/admin/limited-offer', icon: Sparkles, label: 'Limited Offer' },
  { path: '/admin/discounts', icon: Percent, label: 'Discounts' },
  { path: '/admin/categories', icon: Layers3, label: 'Categories' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/reviews', icon: Star, label: 'Reviews' },
  { path: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { path: '/admin/coupons', icon: Ticket, label: 'Coupons' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Tags size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="sidebar-title">Mazhai Vaanam</h1>
          <span className="sidebar-badge">ADMIN</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">MENU</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive && (item.path === '/admin' ? location.pathname === '/admin' : true) ? 'active' : ''}`
            }
            end={item.path === '/admin'}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-label" style={{ marginTop: '1rem' }}>STORE</div>
        <Link to="/" className="sidebar-link">
          <Store size={18} />
          <span>View Customer Store</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.firstName?.charAt(0) || 'A'}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.firstName} {user?.lastName}</span>
            <span className="sidebar-user-role">Administrator</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={logout} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
