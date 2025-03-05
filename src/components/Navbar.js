import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <nav className={`main-nav ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="nav-left">
        <div className="nav-header">
          <Link to="/" className="brand">
            {isCollapsed ? "WT" : "WealthTracker"}
          </Link>
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
        <Link 
          to="/preferences" 
          className={`nav-item ${location.pathname === '/preferences' ? 'active' : ''}`}
          title={isCollapsed ? "Preferences" : ""}
        >
          <span className="nav-icon">⚙️</span>
          {!isCollapsed && <span>Preferences</span>}
        </Link>
      </div>
      <div className="nav-right">
        {!isCollapsed && (
          <button 
            className="new-goal-btn"
            onClick={() => navigate('/new-goal')}
          >
            New Goal
          </button>
        )}
        <div className="user-profile" title={isCollapsed ? "John Doe" : ""}>
          <img src="/profile-placeholder.png" alt="User Profile" />
          {!isCollapsed && <span>John Doe</span>}
        </div>
      </div>
      <button 
        className="collapse-btn"
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expand" : "Collapse"}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d={isCollapsed 
              ? "M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"  // Right arrow
              : "M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" // Left arrow
            }
            fill="currentColor"
          />
        </svg>
      </button>
    </nav>
  );
}

export default Navbar; 