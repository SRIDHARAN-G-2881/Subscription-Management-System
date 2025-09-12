import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const ManageUsers = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
  // Call the admin users endpoint (use absolute URL to avoid baseURL mismatches)
  const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const res = await api.get(`${apiRoot}/api/admin/users?page=${page}&limit=${limit}`);
      setUsers(res.data.users);
      setTotal(res.data.meta.total || 0);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Failed to load users';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const changeRole = async (userId, newRole) => {
    if (!confirm('Change role?')) return;
    try {
  // Use admin endpoint for role updates (absolute URL)
  const apiRoot = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  await api.put(`${apiRoot}/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update role');
    }
  };

  return (
  <div className="manage-users" style={{ width: '100%' }}>
      <h2>Manage Users</h2>
      <button onClick={onBack} className="btn btn-back">← Back</button>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Provider</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id || u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.authProvider}</td>
                <td>
                  <select defaultValue={u.role} onChange={(e) => changeRole(u._id || u.id, e.target.value)}>
                    <option value="staff">staff</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={users.length < limit}>Next</button>
      </div>
    </div>
  );
};

export default ManageUsers;
