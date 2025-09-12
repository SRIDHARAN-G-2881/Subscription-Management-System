import React, { useState } from 'react';
import { signupUser } from '../utils/api';

const SignupForm = ({ onBack, onMessage }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await signupUser(formData);
      console.log("Signup success:", response.data);
      onMessage("✅ Account created! Please login.");
      
      // Reset form after successful signup
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "staff"
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      onMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="form-container">
      <h2 className="form-title">Sign Up</h2>

      <label className="form-label">Name</label>
      <input
        type="text"
        name="name"
        className="form-input"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleInputChange}
        required
        disabled={isLoading}
      />

      <label className="form-label">Email</label>
      <input
        type="email"
        name="email"
        className="form-input"
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleInputChange}
        required
        disabled={isLoading}
      />

      <label className="form-label">Password</label>
      <input
        type="password"
        name="password"
        className="form-input"
        placeholder="Create a password"
        value={formData.password}
        onChange={handleInputChange}
        required
        minLength={6}
        disabled={isLoading}
      />

      <label className="form-label">Role</label>
      <select
        name="role"
        className="form-input"
        value={formData.role}
        onChange={handleInputChange}
        disabled={isLoading}
      >
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
      </select>

      <button 
        type="submit" 
        className="btn btn-secondary"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
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

export default SignupForm;
