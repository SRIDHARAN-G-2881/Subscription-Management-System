import { useState, useEffect } from "react";
import "./App.css";
import { APP_MODES, USER_ROLES } from "./utils/constants";
import { isAuthenticated, getUserRole } from "./utils/api";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import AdminDashboard from "./components/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";
import AuthGuard from "./components/AuthGuard";

export default function App() {
  const [mode, setMode] = useState(APP_MODES.HOME);
  const [message, setMessage] = useState("");

  // Check authentication status on app load
  useEffect(() => {
    if (isAuthenticated()) {
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
            <AdminDashboard onLogout={handleLogout} />
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
      <div className="auth-container">
        <div className="fade-slide">
          {renderCurrentMode()}
          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
