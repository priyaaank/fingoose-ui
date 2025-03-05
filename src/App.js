import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './App.css';
import './styles/Dashboard.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/new-goal" element={<NewGoal />} />
            <Route path="/new-asset" element={<NewAsset />} />
            <Route path="/new-liability" element={<NewLiability />} />
            <Route path="/edit-asset/:id" element={<EditAsset />} />
            <Route path="/edit-liability/:id" element={<EditLiability />} />
            <Route path="/edit-goal/:id" element={<EditGoal />} />
            <Route path="/preferences" element={<UserPreferences />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 