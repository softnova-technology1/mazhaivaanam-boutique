import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ShoppingBag, PackageSearch, Layers3,
  ClipboardList, Users, Star, MessageSquare, Ticket, LogOut, Tags, Percent
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/products', icon: ShoppingBag, label: 'Products' },
  { path: '/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/inventory', icon: PackageSearch, label: 'Inventory' },
  { path: '/discounts', icon: Percent, label: 'Discounts' },
  { path: '/categories', icon: Layers3, label: 'Categories' },
  { path: '/users', icon: Users, label: 'Users' },
  { path: '/reviews', icon: Star, label: 'Reviews' },
  { path: '/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { path: '/coupons', icon: Ticket, label: 'Coupons' },
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
              `sidebar-link ${isActive && (item.path === '/' ? location.pathname === '/' : true) ? 'active' : ''}`
            }
            end={item.path === '/'}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
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
