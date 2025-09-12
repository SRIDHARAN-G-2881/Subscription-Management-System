import React from 'react';
import { logout, getUserRole } from '../utils/api';

const AdminDashboard = ({ onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🔐 Admin Dashboard</h1>
        <p className="dashboard-subtitle">Welcome, Admin! You have full access.</p>
        <div className="user-info">
          <span className="role-badge admin">Role: {getUserRole()}</span>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="feature-grid">
          <div className="feature-card admin-only">
            <h3>👥 User Management</h3>
            <p>Manage all users, roles, and permissions</p>
            <button className="feature-btn">Manage Users</button>
          </div>

          <div className="feature-card admin-only">
            <h3>⚙️ System Settings</h3>
            <p>Configure system-wide settings and preferences</p>
            <button className="feature-btn">System Settings</button>
          </div>

          <div className="feature-card admin-only">
            <h3>📊 Analytics</h3>
            <p>View detailed analytics and reports</p>
            <button className="feature-btn">View Analytics</button>
          </div>

          <div className="feature-card admin-only">
            <h3>🔒 Security</h3>
            <p>Monitor security logs and access controls</p>
            <button className="feature-btn">Security Center</button>
          </div>

          <div className="feature-card">
            <h3>📝 Reports</h3>
            <p>Generate and view various reports</p>
            <button className="feature-btn">Generate Report</button>
          </div>

          <div className="feature-card">
            <h3>📧 Notifications</h3>
            <p>Send notifications to users</p>
            <button className="feature-btn">Send Notification</button>
          </div>
        </div>

        <div className="dashboard-actions">
          <button onClick={handleLogout} className="btn btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
