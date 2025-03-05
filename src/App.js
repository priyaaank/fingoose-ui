import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NewGoal from './pages/NewGoal';
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 