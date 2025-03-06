import React from 'react';

function SummaryCard({ title, value, change, trend }) {
  const isPositive = change > 0;
  
  return (
    <div className={`summary-card ${trend}`}>
      <div className="summary-icon">{trend === 'up' ? '↑' : '↓'}</div>
      <div className="summary-details">
        <h3>{title}</h3>
        <div className="value">${(value || 0).toLocaleString()}</div>
        <p className={`change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </p>
      </div>
    </div>
  );
}

export default SummaryCard; 