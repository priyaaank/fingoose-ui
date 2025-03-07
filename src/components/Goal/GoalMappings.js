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
          className="goal-dropdown"
        >
          <option value="">Select a goal</option>
          {goals
            .filter(goal => !goalMappings.some(m => m.goal_id === goal.id))
            .map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.name}
              </option>
            ))
          }
        </select>
        <button 
          type="button" 
          className="add-goal-button"
          onClick={onAddGoal}
          disabled={!selectedGoal}
        >
          Add Goal
        </button>
      </div>

      <div className="selected-goals">
        {goalMappings.map(mapping => (
          <div key={mapping.goal_id} className="allocation-row">
            <span className="allocation-name">{mapping.goal_name}</span>
            <div className="allocation-controls">
              <div className="allocation-input">
                <input
                  type="number"
                  value={mapping.allocation_percentage}
                  onChange={(e) => onAllocationChange(mapping.goal_id, e.target.value)}
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="percentage">%</span>
              </div>
              <button
                type="button"
                className="remove-button"
                onClick={() => onRemoveGoal(mapping.goal_id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalMappings; 