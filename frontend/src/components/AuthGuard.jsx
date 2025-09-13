import React from 'react';
import { isAuthenticated, getUserRole } from '../utils/api';
import { USER_ROLES } from '../utils/constants';

const AuthGuard = ({ children, requiredRole = null }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    return (
      <div className="auth-error">
        <h2>🔒 Access Denied</h2>
        <p>You need to be logged in to access this page.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Check role-based access if required
  if (requiredRole) {
    const userRole = getUserRole();
    
    if (userRole !== requiredRole) {
      return (
        <div className="auth-error">
          <h2>🚫 Insufficient Permissions</h2>
          <p>
            You need <strong>{requiredRole}</strong> role to access this page.
            <br />
            Your current role: <strong>{userRole}</strong>
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Go Back
          </button>
        </div>
      );
    }
  }

  // If all checks pass, render the protected content
  return children;
};

export default AuthGuard;
