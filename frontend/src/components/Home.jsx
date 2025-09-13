import React from 'react';

const Home = ({ onNavigate }) => {
  return (
    <div className="auth-panel">
      <h1 className="title-main">Welcome 👋</h1>
      <p className="subtitle">
        Please login or create an account to continue
      </p>
      <button
        onClick={() => onNavigate("login")}
        className="btn btn-primary"
      >
        Login
      </button>
      <button
        onClick={() => onNavigate("signup")}
        className="btn btn-secondary"
      >
        Sign Up
      </button>
    </div>
  );
};

export default Home;
