import React from 'react';
import './GoalMappings.css';

function GoalMappings({ 
  goals, 
  selectedGoal, 
  goalMappings, 
  onGoalSelect, 
  onAddGoal, 
  onAllocationChange, 
  onRemoveGoal 
}) {
  return (
    <div className="goal-mappings-section">
      <h2>Goal Allocations</h2>
      
      <div className="goal-selector">
        <select 
          value={selectedGoal} 
          onChange={(e) => onGoalSelect(e.target.value)}
          className="goal-select"
        >
          <option value="">Select a goal</option>
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
          ))}
        </select>
        <button 
          type="button" 
          onClick={onAddGoal}
          disabled={!selectedGoal}
          className="add-goal-button"
        >
          Add Goal
        </button>
      </div>

      <div className="goal-mappings-list">
        {goalMappings.map(mapping => (
          <div key={mapping.goal_id} className="goal-mapping-item">
            <div className="mapping-header">
              <span className="goal-name">{mapping.goal_name}</span>
              <button
                type="button"
                onClick={() => onRemoveGoal(mapping.goal_id)}
                className="remove-goal-button"
              >
                ×
              </button>
            </div>
            <div className="allocation-input">
              <input
                type="number"
                value={mapping.allocation_percentage}
                onChange={(e) => onAllocationChange(mapping.goal_id, e.target.value)}
                min="0"
                max="100"
                step="1"
              />
              <span className="percentage-symbol">%</span>
            </div>
            <div className="allocation-bar">
              <div 
                className="allocation-progress"
                style={{ width: `${mapping.allocation_percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalMappings; 