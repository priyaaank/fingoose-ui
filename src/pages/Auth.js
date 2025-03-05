import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Auth() {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // Here you would implement Google OAuth
    console.log('Signing in with Google...');
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>WealthTracker</h1>
          <p>Track your financial journey</p>
        </div>

        <div className="auth-content">
          <button 
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
          >
            <img 
              src="/google-icon.svg" 
              alt="Google" 
              className="google-icon"
            />
            <span>Continue with Google</span>
          </button>

          <div className="auth-footer">
            <p>By continuing, you agree to our</p>
            <div className="auth-links">
              <a href="/terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
              <span>&</span>
              <a href="/privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth; 