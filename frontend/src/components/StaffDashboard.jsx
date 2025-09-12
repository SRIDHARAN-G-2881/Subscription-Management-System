import React from 'react';
import { logout, getUserRole } from '../utils/api';

const StaffDashboard = ({ onLogout }) => {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👨‍💼 Staff Dashboard</h1>
        <p className="dashboard-subtitle">Welcome, Staff Member! Here's your workspace.</p>
        <div className="user-info">
          <span className="role-badge staff">Role: {getUserRole()}</span>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📋 My Tasks</h3>
            <p>View and manage your assigned tasks</p>
            <button className="feature-btn">View Tasks</button>
          </div>

          <div className="feature-card">
            <h3>📊 My Reports</h3>
            <p>Access your personal reports and data</p>
            <button className="feature-btn">View Reports</button>
          </div>

          <div className="feature-card">
            <h3>📅 Schedule</h3>
            <p>Check your schedule and upcoming events</p>
            <button className="feature-btn">View Schedule</button>
          </div>

          <div className="feature-card">
            <h3>💬 Messages</h3>
            <p>Communicate with team members</p>
            <button className="feature-btn">Open Messages</button>
          </div>

          <div className="feature-card">
            <h3>📁 Documents</h3>
            <p>Access your documents and files</p>
            <button className="feature-btn">Open Documents</button>
          </div>

          <div className="feature-card">
            <h3>⚙️ Profile</h3>
            <p>Update your profile and preferences</p>
            <button className="feature-btn">Edit Profile</button>
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

export default StaffDashboard;
