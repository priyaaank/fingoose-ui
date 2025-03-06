import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GoalCard.css';

function GoalCard({ 
  id,
  icon, 
  target, 
  title, 
  projectedDate, 
  progress, 
  inflation, 
  currentValue 
}) {
  const navigate = useNavigate();

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return '#4caf50';
    if (percentage >= 40) return '#ff9800';
    return '#ff5722';
  };

  const formatDate = (dateString) => {
    const [year, month] = dateString.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div 
      className="goal-card"
      onClick={() => navigate(`/edit-goal/${id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="goal-icon">{icon}</div>
      <div className="goal-details">
        <div className="goal-header">
          <h2>{title}</h2>
          <div className="goal-target">
            <h3>Target: ${target.toLocaleString()}</h3>
            <span className="target-year">by {formatDate(projectedDate)}</span>
          </div>
        </div>
        
        <div className="goal-metrics">
          <div className="metric">
            <label>Today's Value</label>
            <span className="value">${currentValue.toLocaleString()}</span>
          </div>
          <div className="metric">
            <label>Assumed Inflation</label>
            <span className="value">{inflation}%</span>
          </div>
          <div className="metric">
            <label>Target Date</label>
            <span className="value">{formatDate(projectedDate)}</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ 
                width: `${progress}%`,
                backgroundColor: getProgressColor(progress)
              }}
            />
          </div>
          <div className="progress-details">
            <span className="progress-text">{progress}% complete</span>
            <span className="saved-amount">Saved: ${(target * (progress/100)).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalCard; 