import { useState, useEffect } from 'react';
import { userAPI } from '../api/api.js';
import { Users as UsersIcon, Shield, User, Download, Trash2, UserX, UserCheck } from 'lucide-react';

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
      { key: 'status', label: 'Status', formatter: (u) => (u.isActive !== false ? 'Active' : 'Suspended') },
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

  const toggleStatus = async (user) => {
    const action = user.isActive !== false ? 'suspend' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${user.firstName}?`)) return;
    try {
      await userAPI.updateStatus(user._id);
      loadUsers();
    } catch (err) { alert(err.message); }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Are you sure you want to permanently delete ${user.firstName}? This action cannot be undone.`)) return;
    try {
      await userAPI.delete(user._id);
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
        <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 14, padding: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}><UserX size={20} /></div>
          <div><div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{users.filter(u => u.isActive === false).length}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Suspended</div></div>
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
                <th style={{ whiteSpace: 'nowrap' }}>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th style={{ whiteSpace: 'nowrap' }}>Joined</th>
                <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
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
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500, wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {user.firstName} {user.lastName}
                      </span>
                    </div>
                  </td>
                  <td style={{ wordBreak: 'break-all' }}>{user.email}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{user.phone || '—'}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-neutral'}`}>
                      {user.role === 'admin' ? <><Shield size={12} /> Admin</> : <><User size={12} /> Customer</>}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.isActive !== false ? 'badge-success' : 'badge-danger'}`} style={{ whiteSpace: 'nowrap' }}>
                      {user.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => toggleRole(user)}
                        title={user.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                      >
                        {user.role === 'admin' ? <User size={14} /> : <Shield size={14} />}
                      </button>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => toggleStatus(user)}
                        style={{ color: user.isActive !== false ? 'var(--warning)' : 'var(--success)' }}
                        title={user.isActive !== false ? 'Suspend User' : 'Activate User'}
                      >
                        {user.isActive !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button 
                        className="btn btn-outline btn-sm" 
                        onClick={() => deleteUser(user)}
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                        title="Delete User"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
