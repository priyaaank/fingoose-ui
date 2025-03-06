import React from 'react';

function SummaryCard({ title, value, change, trend }) {
  const isPositive = change > 0;
  const showGraph = title === 'Net Worth';
  
  // Mock data for the mini bar graph
  const barData = [65, 75, 70, 80, 85, 100].map(percent => ({
    height: percent,
    value: (value * percent) / 100
  }));
  
  return (
    <div className={`summary-card ${trend}`}>
      <div className="summary-icon">{trend === 'up' ? '↑' : '↓'}</div>
      <div className="summary-details">
        <h3>{title}</h3>
        <div className="value">${(value || 0).toLocaleString()}</div>
        <p className={`change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </p>
        {showGraph && (
          <div className="mini-graph">
            {barData.map((bar, index) => (
              <div 
                key={index} 
                className="bar-column"
                title={`$${bar.value.toLocaleString()}`}
              >
                <div 
                  className="bar" 
                  style={{ height: `${bar.height}%` }} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SummaryCard; 