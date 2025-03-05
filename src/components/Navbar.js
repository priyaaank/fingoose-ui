import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="main-nav">
      <div className="nav-left">
        <Link to="/" className="brand">WealthTracker</Link>
        <Link to="/" className="nav-item">
          <span className="nav-icon">📊</span>
          Dashboard
        </Link>
        <Link to="/investments" className="nav-item">
          <span className="nav-icon">📈</span>
          Investments
        </Link>
        <Link to="/liabilities" className="nav-item">
          <span className="nav-icon">📝</span>
          Liabilities
        </Link>
        <Link to="/reports" className="nav-item">
          <span className="nav-icon">📊</span>
          Reports
        </Link>
      </div>
      <div className="nav-right">
        <button className="new-goal-btn">New Goal</button>
        <div className="user-profile">
          <img src="/profile-placeholder.png" alt="User Profile" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 