import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import UsersPage from './pages/Users';
import Reviews from './pages/Reviews';
import Inquiries from './pages/Inquiries';
import Coupons from './pages/Coupons';
import Discounts from './pages/Discounts';
import LimitedOfferAdmin from './pages/LimitedOfferAdmin';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader"><div className="spinner" /></div>;
  if (user) return <Navigate to="/admin" replace />;
  return children;
}

export default function AdminApp() {
  return (
    <div className="admin-app-root">
      <AuthProvider>
        <Routes>
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="limited-offer" element={<LimitedOfferAdmin />} />
            <Route path="categories" element={<Categories />} />
            <Route path="discounts" element={<Discounts />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="coupons" element={<Coupons />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}
