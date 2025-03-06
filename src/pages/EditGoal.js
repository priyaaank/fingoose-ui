import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { goalService } from '../services/goalService';
import './EditGoal.css';

function EditGoal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [goalData, setGoalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const icons = ['🏠', '🚗', '🎓', '💰', '✈️', '👴', '🏥', '💍', '👶', '🎯'];

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const goal = await goalService.fetchGoalById(parseInt(id));
        setGoalData(goal);
      } catch (error) {
        console.error('Error fetching goal:', error);
        setError(error.message === 'Failed to fetch goal' 
          ? 'Goal not found. Please check the URL and try again.'
          : 'Failed to load goal details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

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
    setIsSaving(true);
    
    try {
      await goalService.updateGoal(id, goalData);
      navigate('/');
    } catch (error) {
      setError('Failed to update goal. Please try again.');
      console.error('Error updating goal:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      // Here you would typically delete the goal
      console.log('Deleting goal:', id);
      navigate('/');
    }
  };

  if (isLoading || !goalData) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="edit-goal-page">
      <div className="page-header">
        <h1>Edit Goal</h1>
        <button 
          className="delete-button"
          onClick={handleDelete}
          title="Delete goal"
          disabled={isSaving}
        >
          Delete
        </button>
      </div>
      
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
          <label htmlFor="title">Goal Title</label>
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
            <label htmlFor="currentValue">Current Value ($)</label>
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
            <label htmlFor="projectedDate">Target Date</label>
            <input
              type="month"
              id="projectedDate"
              name="projectedDate"
              value={goalData.projectedDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().substring(0, 7)}
              pattern="\d{4}-\d{2}"
            />
          </div>

          <div className="form-section">
            <label htmlFor="inflation">Expected Inflation Rate (%)</label>
            <input
              type="number"
              id="inflation"
              name="inflation"
              value={goalData.inflation}
              onChange={handleChange}
              required
              step="0.1"
              min="0"
              placeholder="0.0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => navigate('/')}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditGoal; 