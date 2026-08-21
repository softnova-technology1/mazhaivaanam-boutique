import { useState, useEffect } from 'react';
import { userAPI } from '../api/api.js';
import { exportToCSV } from '../utils/exportCSV.js';
import { Users as UsersIcon, Shield, User, Download } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 15;

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleExportCSV = () => {
    if (!users.length) {
      alert('No user data to export');
      return;
    }

    const columns = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'role', label: 'User Role' },
      { key: 'createdAt', label: 'Registration Date', formatter: (u) => new Date(u.createdAt).toLocaleDateString('en-IN') },
    ];

    exportToCSV(users, columns, 'MazhaiVaanam_Customers_Users');
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Change ${user.firstName} to ${newRole}?`)) return;
    try {
      await userAPI.updateRole(user._id, newRole);
      loadUsers();
    } catch (err) { alert(err.message); }
  };

  const admins = users.filter(u => u.role === 'admin');
  const customers = users.filter(u => u.role === 'customer');
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = users.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">User Accounts</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
        <button 
          className="btn btn-outline" 
          onClick={handleExportCSV}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Download size={16} /> Export Users to CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}><UsersIcon size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{customers.length}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Customers</div></div>
        </div>
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(200,163,77,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8A34D' }}><Shield size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{admins.length}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admins</div></div>
        </div>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner" /></div>
      ) : (
        <>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 50, textAlign: 'center' }}>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user, idx) => (
                <tr key={user._id}>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>
                    {(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: user.role === 'admin' ? 'var(--accent)' : 'var(--bg-surface-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem', fontWeight: 600, flexShrink: 0 }}>
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone || '—'}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                      {user.role === 'admin' ? <><Shield size={12} /> Admin</> : <><User size={12} /> Customer</>}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleRole(user)}>
                      {user.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 24 }}>
            <button
              className="btn btn-sm btn-outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-sm btn-outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
