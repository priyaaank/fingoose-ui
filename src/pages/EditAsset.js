import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditAsset.css';

function EditAsset() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [availableGoals, setAvailableGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const icons = ['📈', '📊', '🏢', '🏦', '💎', '💰', '🏭', '💳', '🏗️', '🚗'];
  const assetTypes = [
    'Stocks',
    'Mutual Funds',
    'Real Estate',
    'Fixed Deposits',
    'Gold Bonds',
    'Cash',
    'Corporate Bonds',
    'Government Securities',
    'Commodities',
    'Others'
  ];

  useEffect(() => {
    // In a real app, fetch the asset data and available goals
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAssetData({
          icon: '📈',
          type: 'Stocks',
          name: 'Sample Stock',
          value: 10000,
          projectedRoi: 8.5,
          maturityDate: '',
          comments: ''
        });
        // Fetch available goals
        setAvailableGoals([
          { id: 1, title: 'Home Down Payment', target: 250000 },
          { id: 2, title: 'Emergency Fund', target: 50000 },
          { id: 3, title: 'Retirement', target: 1000000 }
        ]);
        // Fetch existing goal mappings for this asset
        setSelectedGoals([
          { goalId: 1, allocation: 60, title: 'Home Down Payment' },
          { goalId: 2, allocation: 40, title: 'Emergency Fund' }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the data
    console.log('Updated asset:', assetData);
    navigate('/');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      // Here you would typically delete the asset
      console.log('Deleting asset:', id);
      navigate('/');
    }
  };

  const handleGoalAdd = () => {
    const select = document.getElementById('goalSelect');
    const goalId = parseInt(select.value);
    const goal = availableGoals.find(g => g.id === goalId);
    
    if (goal && !selectedGoals.some(g => g.goalId === goalId)) {
      setSelectedGoals([...selectedGoals, {
        goalId,
        title: goal.title,
        allocation: 0
      }]);
    }
  };
  
  const handleGoalRemove = (goalId) => {
    setSelectedGoals(selectedGoals.filter(g => g.goalId !== goalId));
  };
  
  const handleAllocationChange = (goalId, allocation) => {
    setSelectedGoals(selectedGoals.map(goal => 
      goal.goalId === goalId 
        ? { ...goal, allocation: Math.min(100, Math.max(0, parseInt(allocation) || 0)) }
        : goal
    ));
  };
  
  const getTotalAllocation = () => {
    return selectedGoals.reduce((sum, goal) => sum + goal.allocation, 0);
  };

  if (isLoading || !assetData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="edit-asset-page">
      <div className="page-header">
        <h1>Edit Asset</h1>
        <button 
          className="delete-button"
          onClick={handleDelete}
          title="Delete asset"
        >
          Delete
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="asset-form">
        <div className="form-section">
          <label>Choose Icon</label>
          <div className="icon-selector">
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-option ${assetData.icon === icon ? 'selected' : ''}`}
                onClick={() => setAssetData(prev => ({ ...prev, icon }))}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="type">Asset Type</label>
            <select
              id="type"
              name="type"
              value={assetData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select asset type</option>
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label htmlFor="name">Asset Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={assetData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Vanguard S&P 500 ETF"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="value">Current Value ($)</label>
            <input
              type="number"
              id="value"
              name="value"
              value={assetData.value}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-section">
            <label htmlFor="projectedRoi">Projected ROI (%)</label>
            <input
              type="number"
              id="projectedRoi"
              name="projectedRoi"
              value={assetData.projectedRoi}
              onChange={handleChange}
              required
              step="0.1"
              min="0"
              placeholder="0.0"
            />
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="maturityDate">
            Maturity Date
            <span className="optional-label">(Optional)</span>
          </label>
          <input
            type="date"
            id="maturityDate"
            name="maturityDate"
            value={assetData.maturityDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <label htmlFor="comments">
            Additional Comments
            <span className="optional-label">(Optional)</span>
          </label>
          <textarea
            id="comments"
            name="comments"
            value={assetData.comments}
            onChange={handleChange}
            placeholder="Add any additional notes about this asset..."
            rows="3"
          />
        </div>

        <div className="form-section">
          <label>Goal Allocations</label>
          <div className="goal-allocation-container">
            <div className="goal-selector">
              <select 
                id="goalSelect"
                className="goal-select"
              >
                <option value="">Select a goal to add...</option>
                {availableGoals
                  .filter(goal => !selectedGoals.some(sg => sg.goalId === goal.id))
                  .map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))
                }
              </select>
              <button 
                type="button" 
                className="btn-add-goal"
                onClick={handleGoalAdd}
              >
                Add Goal
              </button>
            </div>
            
            <div className="selected-goals">
              {selectedGoals.map(goal => (
                <div key={goal.goalId} className="goal-allocation-row">
                  <span className="goal-title">{goal.title}</span>
                  <div className="goal-allocation-controls">
                    <input
                      type="number"
                      value={goal.allocation}
                      onChange={(e) => handleAllocationChange(goal.goalId, e.target.value)}
                      min="0"
                      max="100"
                      className="allocation-input"
                    />
                    <span className="percentage">%</span>
                    <button
                      type="button"
                      className="btn-remove-goal"
                      onClick={() => handleGoalRemove(goal.goalId)}
                      title="Remove goal"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="allocation-summary">
              <span className="total-label">Total Allocation:</span>
              <span className={`total-value ${getTotalAllocation() > 100 ? 'error' : ''}`}>
                {getTotalAllocation()}%
              </span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAsset; 