import React from 'react';
import './IconSelector.css';

const presetIcons = [
  '💰', // money bag
  '🏠', // house
  '🏘️', // houses
  '📈', // chart increasing
  '💎', // gem
  '🚗', // car
  '✈️', // airplane
  '🏢', // office building
  '🏆', // trophy
  '💵', // dollar bill
  '📊'  // bar chart
];

function IconSelector({ selectedIcon, onIconSelect, onIconChange }) {
  return (
    <div className="icon-selector-container">
      <label>Select Icon</label>
      <div className="icon-selector">
        <div className="icon-buttons-container">
          {presetIcons.map(icon => (
            <button
              key={icon}
              type="button"
              className={`icon-button ${selectedIcon === icon ? 'selected' : ''}`}
              onClick={() => onIconSelect(icon)}
            >
              {icon}
            </button>
          ))}
        </div>
        <div>→</div>
        <div className="selected-icon">
          <input
            type="text"
            value={selectedIcon}
            onChange={(e) => onIconChange(e.target.value)}
            maxLength="2"
          />
        </div>
      </div>
    </div>
  );
}

export default IconSelector; 