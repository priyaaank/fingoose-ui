import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">FinGoose</Link>
      </div>
      <div className="nav-links">
        <Link to="/" className={isActive('/')}>
          Dashboard
        </Link>
        <Link to="/new-goal" className={isActive('/new-goal')}>
          Add Goal
        </Link>
        <Link to="/new-asset" className={isActive('/new-asset')}>
          Add Asset
        </Link>
        <Link to="/new-liability" className={isActive('/new-liability')}>
          Add Liability
        </Link>
        <Link to="/preferences" className={isActive('/preferences')}>
          Preferences
        </Link>
        <Link to="/about" className={isActive('/about')}>
          About
        </Link>
      </div>
    </nav>
  );
}

export default Navbar; 