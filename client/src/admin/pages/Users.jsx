import { useState, useEffect } from 'react';
import { userAPI } from '../api/api.js';
import { Users as UsersIcon, Shield, User } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userAPI.getAll();
      setUsers(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
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

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
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
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
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
      )}
    </div>
  );
}
