import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NewGoal from './pages/NewGoal';
import NewAsset from './pages/NewAsset';
import NewLiability from './pages/NewLiability';
import EditAsset from './pages/EditAsset';
import EditGoal from './pages/EditGoal';
import EditLiability from './pages/EditLiability';
import UserPreferences from './pages/UserPreferences';
import Auth from './pages/Auth';
import './App.css';
import './styles/Dashboard.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/auth', '/login', '/signup'].includes(location.pathname);
  
  return (
    <div className={`App ${isAuthPage ? 'auth-page' : ''}`}>
      {!isAuthPage && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/new-goal" element={<NewGoal />} />
          <Route path="/new-asset" element={<NewAsset />} />
          <Route path="/new-liability" element={<NewLiability />} />
          <Route path="/edit-asset/:id" element={<EditAsset />} />
          <Route path="/edit-liability/:id" element={<EditLiability />} />
          <Route path="/edit-goal/:id" element={<EditGoal />} />
          <Route path="/preferences" element={<UserPreferences />} />
          <Route path="/liabilities/:id/edit" element={<EditLiability />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App; 