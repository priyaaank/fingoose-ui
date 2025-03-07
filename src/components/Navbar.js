import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    try {
      authService.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-brand">
          FinFox
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Dashboard
          </Link>
          <Link to="/preferences" className="nav-link">
            Preferences
          </Link>
          <button 
            onClick={handleSignOut} 
            className="nav-link sign-out-button"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 