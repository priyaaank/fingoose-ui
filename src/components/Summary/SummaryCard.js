import React from 'react';

function SummaryCard({ title, amount, change, period, icon }) {
  const isPositive = change > 0;
  
  return (
    <div className="summary-card">
      <div className="summary-icon">{icon}</div>
      <div className="summary-details">
        <h3>{title}</h3>
        <h2>${amount.toLocaleString()}</h2>
        <p className={`change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% from {period}
        </p>
      </div>
    </div>
  );
}

export default SummaryCard; 