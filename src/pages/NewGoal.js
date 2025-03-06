import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { goalService } from '../services/goalService';
import './NewGoal.css';

function NewGoal() {
  const navigate = useNavigate();
  const [goalData, setGoalData] = useState({
    icon: '🎯',
    title: '',
    target: '',
    targetYear: '',
    currentValue: '',
    inflation: '3.5',
    projectedDate: ''
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const icons = ['🎯', '🏠', '🚗', '🎓', '👴', '✈️', '💍', '💰', '🏦', '📱'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await goalService.createGoal(goalData);
      navigate('/');
    } catch (error) {
      setError('Failed to create goal. Please try again.');
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-goal-page">
      <div className="page-header">
        <h1>Create New Goal</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-section">
          <label>Choose Icon</label>
          <div className="icon-selector">
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-option ${goalData.icon === icon ? 'selected' : ''}`}
                onClick={() => setGoalData(prev => ({ ...prev, icon }))}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="title">Goal Name</label>
          <input
            type="text"
            id="title"
            name="title"
            value={goalData.title}
            onChange={handleChange}
            required
            placeholder="e.g., Home Down Payment"
          />
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="target">Target Amount ($)</label>
            <input
              type="number"
              id="target"
              name="target"
              value={goalData.target}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-section">
            <label htmlFor="currentValue">Current Savings ($)</label>
            <input
              type="number"
              id="currentValue"
              name="currentValue"
              value={goalData.currentValue}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="targetYear">Target Year</label>
            <input
              type="number"
              id="targetYear"
              name="targetYear"
              value={goalData.targetYear}
              onChange={handleChange}
              required
              min={new Date().getFullYear()}
              placeholder={new Date().getFullYear()}
            />
          </div>

          <div className="form-section">
            <label htmlFor="inflation">Expected Inflation (%)</label>
            <input
              type="number"
              id="inflation"
              name="inflation"
              value={goalData.inflation}
              onChange={handleChange}
              required
              step="0.1"
              min="0"
              max="100"
              placeholder="3.5"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewGoal; 