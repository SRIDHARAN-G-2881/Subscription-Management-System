import React, { useState } from 'react';
import { loginUser } from '../utils/api';
import { USER_ROLES, APP_MODES } from '../utils/constants';

const LoginForm = ({ onBack, onMessage, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    <form onSubmit={handleLogin} className="form-container">
      <h2 className="form-title">Login</h2>

      <label className="form-label">Email</label>
      <input
        type="email"
        className="form-input"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
      />

      <label className="form-label">Password</label>
      <input
        type="password"
        className="form-input"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>
      
      <button 
        type="button" 
        onClick={onBack} 
        className="btn btn-back"
        disabled={isLoading}
      >
        ← Back
      </button>
    </form>
  );
};

export default LoginForm;
