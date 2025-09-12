import { useState, useEffect } from "react";
import "./App.css";
import { APP_MODES, USER_ROLES } from "./utils/constants";
import { isAuthenticated, getUserRole } from "./utils/api";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AdminDashboard from "./components/AdminDashboard";
import ManageUsers from "./components/ManageUsers";
import StaffDashboard from "./components/StaffDashboard";
import AuthGuard from "./components/AuthGuard";

export default function App() {
  const [mode, setMode] = useState(APP_MODES.HOME);
  const [message, setMessage] = useState("");

  // Check authentication status on app load
  useEffect(() => {
    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const googleAuth = urlParams.get('googleAuth');
    const role = urlParams.get('role');
    
    if (googleAuth === 'success' && role) {
      // Store the role from Google OAuth
      localStorage.setItem('role', role);
      localStorage.setItem('token', 'google-auth-token'); // Placeholder
      
      if (role === USER_ROLES.ADMIN) {
        setMode(APP_MODES.ADMIN_DASHBOARD);
      } else if (role === USER_ROLES.STAFF) {
        setMode(APP_MODES.STAFF_DASHBOARD);
      }
      
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (googleAuth === 'error') {
      setMessage('❌ Google authentication failed. Please try again.');
      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (isAuthenticated()) {
      const userRole = getUserRole();
      if (userRole === USER_ROLES.ADMIN) {
        setMode(APP_MODES.ADMIN_DASHBOARD);
      } else if (userRole === USER_ROLES.STAFF) {
        setMode(APP_MODES.STAFF_DASHBOARD);
      }
    }
  }, []);

  const switchTo = (newMode) => {
    setMessage("");
    setMode(newMode);
  };

  const goBack = () => switchTo(APP_MODES.HOME);

  const handleLogout = () => {
    setMode(APP_MODES.HOME);
    setMessage("✅ Successfully logged out!");
  };

  const handleLoginSuccess = (userRole) => {
    if (userRole === USER_ROLES.ADMIN) {
      setMode(APP_MODES.ADMIN_DASHBOARD);
    } else if (userRole === USER_ROLES.STAFF) {
      setMode(APP_MODES.STAFF_DASHBOARD);
    }
  };

  const renderCurrentMode = () => {
    switch (mode) {
      case APP_MODES.HOME:
        return <Home key="home" onNavigate={switchTo} />;
      case APP_MODES.LOGIN:
        return (
          <div key="login" className="auth-panel">
            <LoginForm onBack={goBack} onMessage={setMessage} onLoginSuccess={handleLoginSuccess} />
          </div>
        );
      case APP_MODES.SIGNUP:
        return (
          <div key="signup" className="auth-panel">
            <SignupForm onBack={goBack} onMessage={setMessage} />
          </div>
        );
      case APP_MODES.ADMIN_DASHBOARD:
        return (
          <AuthGuard key="admin-dashboard" requiredRole={USER_ROLES.ADMIN}>
            <AdminDashboard onLogout={handleLogout} onNavigate={switchTo} />
          </AuthGuard>
        );
      case APP_MODES.MANAGE_USERS:
        return (
          <AuthGuard key="manage-users" requiredRole={USER_ROLES.ADMIN}>
            <ManageUsers onBack={() => setMode(APP_MODES.ADMIN_DASHBOARD)} />
          </AuthGuard>
        );
      case APP_MODES.STAFF_DASHBOARD:
        return (
          <AuthGuard key="staff-dashboard" requiredRole={USER_ROLES.STAFF}>
            <StaffDashboard onLogout={handleLogout} />
          </AuthGuard>
        );
      default:
        return <Home key="home" onNavigate={switchTo} />;
    }
  };

  return (
    <div className="page-container">
      {([APP_MODES.HOME, APP_MODES.LOGIN, APP_MODES.SIGNUP].includes(mode)) ? (
        <div className="auth-container">
          <div className="fade-slide">
            {renderCurrentMode()}
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      ) : (
        <div className="app-container">
          <div className="fade-slide">
            {renderCurrentMode()}
            {message && <p className="message">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
