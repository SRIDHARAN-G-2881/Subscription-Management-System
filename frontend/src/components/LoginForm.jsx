import React, { useState } from 'react';
import { loginUser } from '../utils/api';
import { USER_ROLES, APP_MODES } from '../utils/constants';
import GoogleAuthButton from './GoogleAuthButton';

const LoginForm = ({ onBack, onMessage, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    onMessage("");
    setIsLoading(true);
    
    try {
      const response = await loginUser(email, password);
      const { token, user } = response.data;
      
      // Store authentication data
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      
      console.log("Login success:", response.data);
      onMessage(`✅ Logged in as ${user.role}`);
      
      // Redirect to appropriate dashboard
      if (onLoginSuccess) {
        onLoginSuccess(user.role);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      onMessage(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-outer">
      <div className="auth-container">
        <div className="form-wrapper">
          <h2 className="form-title">Sign in</h2>
          <form onSubmit={handleLogin} className="form-container">
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />

            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Sign in"}
              </button>

              <button
                type="button"
                className="btn-back"
                onClick={onBack}
                disabled={isLoading}
              >
                ← Back
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">Or sign in with</p>
              <div className="mt-2">
                <GoogleAuthButton 
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  text="Continue with Google"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

};

export default LoginForm;
