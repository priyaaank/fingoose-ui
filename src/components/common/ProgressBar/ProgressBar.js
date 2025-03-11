import React from 'react';
import './ProgressBar.css';

function ProgressBar({ percentage, height = '8px', backgroundColor = '#e9ecef', fillColor = '#0d6efd' }) {
  return (
    <div 
      className="progress-container"
      style={{ 
        height,
        backgroundColor
      }}
    >
      <div 
        className="progress-fill"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: fillColor
        }}
      />
    </div>
  );
}

export default ProgressBar; 