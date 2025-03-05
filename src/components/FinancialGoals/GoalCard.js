import React from 'react';

function GoalCard({ icon, target, title, projectedDate, progress }) {
  return (
    <div className="goal-card">
      <div className="goal-icon">{icon}</div>
      <div className="goal-details">
        <h3>Target: ${target.toLocaleString()}</h3>
        <h2>{title}</h2>
        <p>Projected completion: {projectedDate}</p>
        <p>{progress}% complete</p>
      </div>
      <div className="goal-actions">
        <button className="btn-add">Add Funds</button>
        <button className="btn-details">Details</button>
      </div>
    </div>
  );
}

export default GoalCard; 