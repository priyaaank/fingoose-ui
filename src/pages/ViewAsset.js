import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetService } from '../services/assetService';
import { goalService } from '../services/goalService';
import { userProfileService } from '../services/userProfileService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ViewAsset.css';

function ViewAsset() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [goals, setGoals] = useState([]);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [asset, allGoals] = await Promise.all([
          assetService.fetchAssetById(parseInt(id)),
          goalService.fetchGoals()
        ]);
        setAssetData(asset);
        setOriginalData(asset);
        setGoals(allGoals);
      } catch (error) {
        setError(error.message || 'Failed to load data');
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

  const handleAllocationChange = (goalId, value) => {
    const percentage = parseFloat(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) return;

    setAssetData(prev => {
      const existingMappings = prev.goalMappings || [];
      const mappingIndex = existingMappings.findIndex(m => m.goal_id === goalId);
      
      if (mappingIndex >= 0) {
        const newMappings = [...existingMappings];
        if (percentage === 0) {
          newMappings.splice(mappingIndex, 1);
        } else {
          newMappings[mappingIndex] = {
            ...newMappings[mappingIndex],
            allocation_percentage: percentage
          };
        }
        return { ...prev, goalMappings: newMappings };
      } else if (percentage > 0) {
        const goalName = goals.find(g => g.id === goalId)?.name || '';
        return {
          ...prev,
          goalMappings: [
            ...existingMappings,
            { goal_id: goalId, goal_name: goalName, allocation_percentage: percentage }
          ]
        };
      }
      return prev;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await assetService.updateAsset(id, assetData);
      setOriginalData(assetData);
      setIsEditMode(false);
    } catch (error) {
      setError(error.message || 'Failed to update asset');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setAssetData(originalData);
    setIsEditMode(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="view-asset-page">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
          disabled={isSaving}
        >
          ← Back
        </button>
        {!isEditMode && (
          <button 
            className="edit-button"
            onClick={() => setIsEditMode(true)}
          >
            Edit
          </button>
        )}
      </div>

      {isEditMode ? (
        <form onSubmit={handleSubmit} className="asset-form">
          <div className="form-row">
            <div className="form-section">
              <label htmlFor="icon">Icon</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={assetData.icon}
                onChange={handleChange}
                placeholder="Enter an emoji"
              />
            </div>

            <div className="form-section">
              <label htmlFor="name">Investment Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={assetData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="value">Current Value</label>
              <input
                type="number"
                id="value"
                name="value"
                value={assetData.value}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
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
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="maturityYear">Maturity Year</label>
              <input
                type="number"
                id="maturityYear"
                name="maturityYear"
                value={assetData.maturityYear}
                onChange={handleChange}
                min={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="comments">Additional Comments</label>
              <textarea
                id="comments"
                name="comments"
                value={assetData.comments}
                onChange={handleChange}
                rows="3"
              />
            </div>
          </div>

          <div className="goal-allocations-section">
            <h2>Goal Allocations</h2>
            <div className="goal-allocations-grid">
              {goals.map(goal => {
                const allocation = assetData.goalMappings?.find(
                  m => m.goal_id === goal.id
                )?.allocation_percentage || 0;
                
                return (
                  <div key={goal.id} className="goal-allocation-item">
                    <div className="goal-info">
                      <span className="goal-icon">{goal.icon}</span>
                      <span className="goal-name">{goal.name}</span>
                    </div>
                    <input
                      type="number"
                      value={allocation}
                      onChange={(e) => handleAllocationChange(goal.id, e.target.value)}
                      min="0"
                      max="100"
                      step="1"
                    />
                    <span className="percentage-symbol">%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="asset-content">
          <div className="asset-header">
            <span className="asset-icon">{assetData.icon}</span>
            <h1>{assetData.name}</h1>
          </div>

          <div className="metrics-grid">
            <div className="metric-item">
              <h3>INITIAL VALUE</h3>
              <div className="metric-value">
                {userProfileService.formatCurrency(assetData.value)}
              </div>
            </div>

            <div className="metric-item">
              <h3>PROJECTED VALUE</h3>
              <div className="metric-value">
                {userProfileService.formatCurrency(
                  assetData.value * (1 + assetData.projectedRoi / 100)
                )}
              </div>
            </div>

            <div className="metric-item">
              <h3>TIMELINE</h3>
              <div className="metric-value">
                {new Date().getFullYear()} → {assetData.maturityYear}
              </div>
            </div>

            <div className="metric-item">
              <h3>PROJECTED ROI</h3>
              <div className="metric-value">{assetData.projectedRoi}%</div>
            </div>
          </div>

          {assetData.comments && (
            <div className="comments-section">
              <h2>Additional Comments</h2>
              <p>{assetData.comments}</p>
            </div>
          )}

          <div className="allocations-section">
            <h2>Asset Allocations</h2>
            {assetData.goalMappings && assetData.goalMappings.length > 0 ? (
              <div className="allocations-grid">
                {assetData.goalMappings.map(mapping => (
                  <div key={mapping.goal_id} className="allocation-item">
                    <div className="goal-info">
                      <span className="goal-name">{mapping.goal_name}</span>
                      <span className="allocation-percentage">
                        {mapping.allocation_percentage}%
                      </span>
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
            ) : (
              <div className="no-allocations">
                No assets are currently allocated to this goal
              </div>
            )}
          </div>

          <div className="last-updated">
            Last updated: {formatDate(assetData.updatedAt)}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAsset; 