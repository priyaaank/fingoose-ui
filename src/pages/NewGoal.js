import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { goalService } from '../services/goalService';
import './NewGoal.css';

function NewGoal() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  
  const [goalData, setGoalData] = useState({
    name: '',
    icon: '🎯',
    goal_creation_year: currentYear,
    target_year: currentYear + 1,
    projected_inflation: 5.0,
    initial_goal_value: ''
  });
  
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetIcons = ['🎯', '💰', '🏠', '🚗', '🎓', '✈️', '👶', '💍', '🏦', '📈'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'icon') {
      // Basic emoji validation - check if string contains at least one emoji
      if (value && /\p{Emoji}/u.test(value)) {
        setFieldErrors(prev => ({ ...prev, icon: null }));
      } else {
        setFieldErrors(prev => ({ ...prev, icon: 'Please enter a valid emoji' }));
      }
    }
    setGoalData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await goalService.createGoal(goalData);
      navigate('/');
    } catch (error) {
      if (error.response?.data?.details) {
        setFieldErrors(error.response.data.details);
      } else {
        setError(error.message || 'Failed to create goal. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-goal-page">
      <h1>Create New Goal</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="preset-emojis">
          <label>Preset Icons</label>
          <div className="icon-selector">
            {presetIcons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-option ${goalData.icon === icon ? 'selected' : ''}`}
                onClick={() => {
                  setGoalData(prev => ({ ...prev, icon }));
                  setFieldErrors(prev => ({ ...prev, icon: null }));
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row goal-basics">
          <div className="form-section emoji-input-section">
            <label htmlFor="icon">Goal Icon</label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={goalData.icon}
              onChange={handleChange}
              className="emoji-input"
              placeholder="😀"
              maxLength="2"
              required
            />
            {fieldErrors.icon && <div className="field-error">{fieldErrors.icon}</div>}
          </div>
          
          <div className="form-section goal-name-section">
            <label htmlFor="name">Goal Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={goalData.name}
              onChange={handleChange}
              placeholder="e.g., Retirement Fund"
              required
            />
            {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="initial_goal_value">Initial Goal Value ($)</label>
            <input
              type="number"
              id="initial_goal_value"
              name="initial_goal_value"
              value={goalData.initial_goal_value}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
            {fieldErrors.initial_goal_value && (
              <div className="field-error">{fieldErrors.initial_goal_value}</div>
            )}
          </div>

          <div className="form-section">
            <label htmlFor="projected_inflation">Projected Inflation (%)</label>
            <input
              type="number"
              id="projected_inflation"
              name="projected_inflation"
              value={goalData.projected_inflation}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
              required
            />
            {fieldErrors.projected_inflation && (
              <div className="field-error">{fieldErrors.projected_inflation}</div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="goal_creation_year">Start Year</label>
            <input
              type="number"
              id="goal_creation_year"
              name="goal_creation_year"
              value={goalData.goal_creation_year}
              onChange={handleChange}
              min={currentYear}
              required
            />
            {fieldErrors.goal_creation_year && (
              <div className="field-error">{fieldErrors.goal_creation_year}</div>
            )}
          </div>

          <div className="form-section">
            <label htmlFor="target_year">Target Year</label>
            <input
              type="number"
              id="target_year"
              name="target_year"
              value={goalData.target_year}
              onChange={handleChange}
              min={goalData.goal_creation_year + 1}
              required
            />
            {fieldErrors.target_year && (
              <div className="field-error">{fieldErrors.target_year}</div>
            )}
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