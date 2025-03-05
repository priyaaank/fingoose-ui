import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  return (
    <nav className={`main-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-left">
        <div className="nav-header">
          <Link to="/" className="brand">
            {isCollapsed ? "WT" : "WealthTracker"}
          </Link>
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          title={isCollapsed ? "Dashboard" : ""}
        >
          <span className="nav-icon">📊</span>
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        <Link 
          to="/investments" 
          className={`nav-item ${location.pathname === '/investments' ? 'active' : ''}`}
          title={isCollapsed ? "Investments" : ""}
        >
          <span className="nav-icon">📈</span>
          {!isCollapsed && <span>Investments</span>}
        </Link>
        <Link 
          to="/liabilities" 
          className={`nav-item ${location.pathname === '/liabilities' ? 'active' : ''}`}
          title={isCollapsed ? "Liabilities" : ""}
        >
          <span className="nav-icon">📝</span>
          {!isCollapsed && <span>Liabilities</span>}
        </Link>
        <Link 
          to="/reports" 
          className={`nav-item ${location.pathname === '/reports' ? 'active' : ''}`}
          title={isCollapsed ? "Reports" : ""}
        >
          <span className="nav-icon">📊</span>
          {!isCollapsed && <span>Reports</span>}
        </Link>
      </div>
      <div className="nav-right">
        {!isCollapsed && <button className="new-goal-btn">New Goal</button>}
        <div className="user-profile" title={isCollapsed ? "John Doe" : ""}>
          <img src="/profile-placeholder.png" alt="User Profile" />
          {!isCollapsed && <span>John Doe</span>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 