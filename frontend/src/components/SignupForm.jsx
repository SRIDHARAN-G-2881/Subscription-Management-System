import React, { useState } from 'react';
import { signupUser } from '../utils/api';
import GoogleAuthButton from './GoogleAuthButton';

const SignupForm = ({ onBack, onMessage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleAuth = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    onMessage("");
    setIsLoading(true);
    
    try {
      // Only send name, email and password for manual signup. Role is enforced server-side.
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      const response = await signupUser(payload);
      console.log("Signup success:", response.data);
      onMessage("✅ Account created! Please login.");
      
      // Reset form after successful signup
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      onMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-outer">
      <div className="auth-container">
        <div className="form-wrapper">
          <h2 className="form-title">Sign Up</h2>
          <form onSubmit={handleSignup} className="form-container">
            <input
              type="text"
              name="name"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <input
              type="email"
              name="email"
              className="w-full border rounded px-3 py-2"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />

            <input
              type="password"
              name="password"
              className="w-full border rounded px-3 py-2"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              disabled={isLoading}
            />

            {/* role selection removed — manual signups default to staff */}

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-secondary"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Sign Up"}
              </button>

              <button 
                type="button" 
                onClick={onBack} 
                className="btn-back"
                disabled={isLoading}
              >
                ← Back
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '1rem 0', color: '#64748b' }}>
              or
            </div>

            <div className="mt-2">
              <GoogleAuthButton 
                onClick={handleGoogleAuth}
                disabled={isLoading}
                text="Sign up with Google"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
