import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GoalSummary.css';

function GoalSummary({ goal }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/edit-goal/${goal.id}`);
  };

  return (
    <div className="goal-summary" onClick={handleClick}>
      <div className="goal-header">
        <div className="goal-icon">{goal.icon}</div>
        <h3 className="goal-name">{goal.name}</h3>
        <div className="goal-target">
          Target: ${goal.projected_value?.toLocaleString()} by {goal.target_year}
        </div>
      </div>

      <div className="goal-metrics">
        <div className="metric">
          <div className="metric-label">TARGET YEAR</div>
          <div className="metric-value">{goal.target_year}</div>
        </div>
        <div className="metric">
          <div className="metric-label">INFLATION RATE</div>
          <div className="metric-value">{goal.projected_inflation}%</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${goal.progress || 35}%` }}
          />
        </div>
        <div className="progress-details">
          <span>{goal.progress || 35}% complete</span>
          <span className="saved-amount">
            Saved: ${((goal.projected_value * (goal.progress || 35)) / 100).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoalSummary; 