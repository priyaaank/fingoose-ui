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
    <div className="goal-mappings">
      <h2>Goal Allocations</h2>
      
      <div className="goal-selector">
        <select 
          value={selectedGoal} 
          onChange={(e) => onGoalSelect(e.target.value)}
        >
          <option value="">Select a goal</option>
          {goals.map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
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

      {goalMappings.length > 0 && (
        <div className="mappings-list">
          {goalMappings.map(mapping => (
            <div key={mapping.goal_id} className="mapping-item">
              <div className="mapping-header">
                <span>{mapping.goal_name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveGoal(mapping.goal_id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
              <div className="allocation-input">
                <label>Allocation (%)</label>
                <input
                  type="number"
                  value={mapping.allocation_percentage}
                  onChange={(e) => onAllocationChange(mapping.goal_id, e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GoalMappings; 