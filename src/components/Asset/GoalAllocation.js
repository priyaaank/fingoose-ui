import React from 'react';
import './GoalAllocation.css';

function GoalAllocation({ goals, goalMappings, onChange }) {
  const handleAllocationChange = (goalId, allocation) => {
    const newMappings = [...(goalMappings || [])];
    const existingIndex = newMappings.findIndex(m => m.goalId === goalId);
    
    if (allocation === '') {
      // Remove mapping if allocation is empty
      if (existingIndex !== -1) {
        newMappings.splice(existingIndex, 1);
      }
    } else {
      const allocationValue = parseFloat(allocation);
      if (existingIndex !== -1) {
        newMappings[existingIndex] = { goalId, allocation: allocationValue };
      } else {
        newMappings.push({ goalId, allocation: allocationValue });
      }
    }
    
    onChange(newMappings);
  };

  const getAllocation = (goalId) => {
    const mapping = goalMappings?.find(m => m.goalId === goalId);
    return mapping ? mapping.allocation : '';
  };

  return (
    <div className="goal-allocation">
      <h3>Goal Allocation</h3>
      <div className="goal-allocation-grid">
        {goals.map(goal => (
          <div key={goal.id} className="goal-allocation-item">
            <div className="goal-info">
              <span className="goal-icon">{goal.icon}</span>
              <span className="goal-title">{goal.title}</span>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={getAllocation(goal.id)}
              onChange={(e) => handleAllocationChange(goal.id, e.target.value)}
              placeholder="0.0"
            />
            <span className="percentage-symbol">%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GoalAllocation; 