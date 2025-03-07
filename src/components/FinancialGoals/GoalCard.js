import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GoalCard.css';

function GoalCard({ goal }) {
  const navigate = useNavigate();

  if (!goal) {
    return null;
  }

  // Hardcoded progress for now
  const progress = 35; // 35% complete
  const savedAmount = (goal.projected_value * (progress/100));

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return '#4caf50';
    if (percentage >= 40) return '#ff9800';
    return '#ff5722';
  };

  return (
    <div 
      className="goal-card"
      onClick={() => navigate(`/edit-goal/${goal.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="goal-icon">{goal.icon}</div>
      <div className="goal-details">
        <div className="goal-header">
          <h2>{goal.name}</h2>
          <div className="goal-target">
            <h3>Target: ${goal.projected_value?.toLocaleString()}</h3>
            <span className="target-year">by {goal.target_year}</span>
          </div>
        </div>
        
        <div className="goal-metrics">
          <div className="metrics-row">
            <div className="metric">
              <label>Target Year</label>
              <span>{goal.target_year}</span>
            </div>
            <div className="metric">
              <label>Inflation Rate</label>
              <span>{goal.projected_inflation}%</span>
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
              <span className="saved-amount">
                Saved: ${savedAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalCard; 