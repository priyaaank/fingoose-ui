import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userProfileService } from '../../services/userProfileService';
import './GoalSummary.css';

function GoalSummary({ goal }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/edit-goal/${goal.id}`);
  };

  // Calculate months remaining
  const calculateMonthsRemaining = () => {
    const today = new Date();
    const targetYear = parseInt(goal.target_year);
    const monthsRemaining = ((targetYear - today.getFullYear()) * 12) - today.getMonth();
    return monthsRemaining > 0 ? monthsRemaining : 0;
  };

  return (
    <div className="goal-summary" onClick={handleClick}>
      <div className="goal-header">
        <div className="goal-title">
          <span className="goal-icon">{goal.icon}</span>
          <h3 className="goal-name">{goal.name}</h3>
        </div>
        <div className="goal-target">
          Target: {userProfileService.formatCurrency(goal.projected_value)} by {goal.target_year}
        </div>
      </div>

      <div className="goal-metrics">
        <div className="metric">
          <div className="metric-label">INITIAL VALUE</div>
          <div className="metric-value">
            {userProfileService.formatCurrency(goal.initial_goal_value)}
          </div>
        </div>
        <div className="metric">
          <div className="metric-label">CREATION YEAR</div>
          <div className="metric-value">{goal.goal_creation_year || '-'}</div>
        </div>
        <div className="metric">
          <div className="metric-label">MONTHS LEFT</div>
          <div className="metric-value">{calculateMonthsRemaining()} months</div>
        </div>
        <div className="metric">
          <div className="metric-label">INFLATION RATE</div>
          <div className="metric-value">{goal.projected_inflation || 0}%</div>
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
            Saved: {userProfileService.formatCurrency((goal.projected_value * (goal.progress || 35)) / 100)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoalSummary; 