import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { goalService } from '../services/goalService';
import { assetService } from '../services/assetService';
import './EditGoal.css';

function EditGoal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentYear = new Date().getFullYear();
  const presetIcons = ['🎯', '💰', '🏠', '🚗', '🎓', '✈️', '👶', '💍', '🏦', '📈'];
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [goalData, setGoalData] = useState({
    name: '',
    icon: '🎯',
    goal_creation_year: currentYear,
    target_year: currentYear + 1,
    projected_inflation: 5.0,
    initial_goal_value: '',
    projected_value: 0
  });
  
  const [originalData, setOriginalData] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [assetAllocations, setAssetAllocations] = useState({});
  const [selectedAssetId, setSelectedAssetId] = useState('');

  // Helper function to convert string ID to number
  const toNumber = (id) => typeof id === 'string' ? parseInt(id, 10) : id;

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const goal = await goalService.fetchGoalById(id);
        setGoalData(goal);
        setOriginalData(goal);
        // Initialize asset allocations from existing mappings
        const allocations = {};
        goal.assets?.forEach(asset => {
          allocations[toNumber(asset.id)] = asset.allocation_percentage;
        });
        setAssetAllocations(allocations);
      } catch (error) {
        setError(error.message || 'Failed to fetch goal details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const assets = await assetService.fetchAssets();
        setAvailableAssets(assets);
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };

    if (isEditMode) {
      fetchAssets();
    }
  }, [isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'icon') {
      if (value && /\p{Emoji}/u.test(value)) {
        setFieldErrors(prev => ({ ...prev, icon: null }));
      } else {
        setFieldErrors(prev => ({ ...prev, icon: 'Please enter a valid emoji' }));
      }
    }
    setGoalData(prev => ({
      ...prev,
      [name]: value
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleAllocationChange = (assetId, value) => {
    const percentage = Math.min(100, Math.max(0, Number(value)));
    setAssetAllocations(prev => ({
      ...prev,
      [toNumber(assetId)]: percentage
    }));
  };

  const validateGoalData = (data) => {
    const errors = {};
    const currentYear = new Date().getFullYear();
    
    // Validate target year
    if (data.target_year) {
      const targetYear = parseInt(data.target_year);
      if (targetYear < currentYear) {
        errors.target_year = 'Target year cannot be in the past';
      } else if (targetYear > currentYear + 100) {
        errors.target_year = 'Target year cannot be more than 100 years in the future';
      }
    }

    // ... any other existing validations ...

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    
    // Validate before submitting
    const validationErrors = validateGoalData(goalData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedGoal = await goalService.updateGoal(id, {
        ...goalData,
        asset_allocations: Object.entries(assetAllocations)
          .filter(([_, percentage]) => percentage > 0)
          .map(([assetId, percentage]) => ({
            asset_id: toNumber(assetId),
            allocation_percentage: percentage
          }))
      });
      setGoalData(updatedGoal.goal);
      setOriginalData(updatedGoal.goal);
      setIsEditMode(false);
    } catch (error) {
      if (error.response?.data?.details) {
        setFieldErrors(error.response.data.details);
      } else {
        setError(error.message || 'Failed to update goal');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalService.deleteGoal(id);
        navigate('/');
      } catch (error) {
        setError(error.message || 'Failed to delete goal');
      }
    }
  };

  const handleCancel = () => {
    setGoalData(originalData);
    setFieldErrors({});
    setError(null);
    setIsEditMode(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const renderField = (label, value, formatter = (v) => v) => (
    <div className="view-field">
      <label>{label}</label>
      <span>{formatter(value)}</span>
    </div>
  );

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return '#4caf50';  // Green
    if (percentage >= 40) return '#ff9800';  // Orange
    return '#ff5722';  // Red
  };

  return (
    <div className="edit-goal-page">
      <div className="page-header">
        <div className="header-left">
          <button 
            className="btn-back"
            onClick={() => navigate('/')}
          >
            ← Back
          </button>
          <h1>Goal Details</h1>
        </div>
        <div className="header-actions">
          {!isEditMode && (
            <>
              <button 
                className="btn-edit"
                onClick={() => setIsEditMode(true)}
              >
                Edit
              </button>
              <button 
                className="btn-delete"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      {isEditMode ? (
        <form onSubmit={handleSubmit} className="goal-form">
          <div className="preset-emojis">
            <label>Preset Icons</label>
            <div className="icon-selector">
              {presetIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${goalData.icon === icon ? 'selected' : ''}`}
                  onClick={() => {
                    setGoalData(prev => ({ ...prev, icon }));
                    setFieldErrors(prev => ({ ...prev, icon: null }));
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-row goal-basics">
            <div className="form-section emoji-input-section">
              <label htmlFor="icon">Goal Icon</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={goalData.icon}
                onChange={handleChange}
                className="emoji-input"
                placeholder="😀"
                maxLength="2"
                required
              />
              {fieldErrors.icon && <div className="field-error">{fieldErrors.icon}</div>}
            </div>
            
            <div className="form-section goal-name-section">
              <label htmlFor="name">Goal Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={goalData.name}
                onChange={handleChange}
                placeholder="e.g., Retirement Fund"
                maxLength="100"
                required
              />
              {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="initial_goal_value">Initial Goal Value ($)</label>
              <input
                type="number"
                id="initial_goal_value"
                name="initial_goal_value"
                value={goalData.initial_goal_value}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
              {fieldErrors.initial_goal_value && (
                <div className="field-error">{fieldErrors.initial_goal_value}</div>
              )}
            </div>

            <div className="form-section">
              <label>Projected Value ($)</label>
              <input
                type="text"
                value={goalData.projected_value?.toLocaleString()}
                className="readonly-input"
                readOnly
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="goal_creation_year">Start Year</label>
              <input
                type="number"
                id="goal_creation_year"
                name="goal_creation_year"
                value={goalData.goal_creation_year}
                onChange={handleChange}
                min={currentYear}
                required
              />
              {fieldErrors.goal_creation_year && (
                <div className="field-error">{fieldErrors.goal_creation_year}</div>
              )}
            </div>

            <div className="form-section">
              <label htmlFor="target_year">Target Year</label>
              <input
                type="number"
                id="target_year"
                name="target_year"
                value={goalData.target_year}
                onChange={handleChange}
                min={goalData.goal_creation_year + 1}
                required
              />
              {fieldErrors.target_year && (
                <div className="field-error">{fieldErrors.target_year}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="projected_inflation">Projected Inflation (%)</label>
              <input
                type="number"
                id="projected_inflation"
                name="projected_inflation"
                value={goalData.projected_inflation}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                required
              />
              {fieldErrors.projected_inflation && (
                <div className="field-error">{fieldErrors.projected_inflation}</div>
              )}
            </div>
          </div>

          <div className="form-section asset-mapping">
            <h3>Asset Allocations</h3>
            <div className="asset-allocation-form">
              <div className="asset-selector">
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="asset-dropdown"
                >
                  <option value="">Select an asset</option>
                  {availableAssets
                    .filter(asset => !assetAllocations[toNumber(asset.id)])
                    .map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.icon} {asset.name} (${parseFloat(asset.current_value).toLocaleString()})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="btn-add-asset"
                  disabled={!selectedAssetId}
                  onClick={() => {
                    setAssetAllocations(prev => ({
                      ...prev,
                      [toNumber(selectedAssetId)]: 0
                    }));
                    setSelectedAssetId('');
                  }}
                >
                  Add
                </button>
              </div>

              <div className="allocated-assets">
                {Object.entries(assetAllocations).map(([assetId, percentage]) => {
                  const asset = availableAssets.find(a => toNumber(a.id) === toNumber(assetId));
                  if (!asset) return null;
                  
                  return (
                    <div key={asset.id} className="asset-allocation-item">
                      <div className="asset-info">
                        <span className="asset-icon">{asset.icon}</span>
                        <div className="asset-details">
                          <span className="asset-name">{asset.name}</span>
                          <span className="asset-value">
                            ${parseFloat(asset.current_value).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="allocation-input">
                        <div className="allocation-input-group">
                          <input
                            className="allocation-input-number"
                            type="number"
                            value={percentage}
                            onChange={(e) => handleAllocationChange(asset.id, e.target.value)}
                            min="0"
                            max="100"
                            step="1"
                            placeholder="0"
                          />
                          <div className="allocation-input-symbol">%</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-remove-asset"
                        onClick={() => {
                          const newAllocations = { ...assetAllocations };
                          delete newAllocations[asset.id];
                          setAssetAllocations(newAllocations);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            {availableAssets.length === 0 ? (
              <div className="no-assets-message">
                No assets available for allocation. Please add assets first.
              </div>
            ) : Object.keys(assetAllocations).length === 0 && (
              <div className="no-allocations">
                No assets allocated. Use the dropdown above to add assets.
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="goal-details">
          <div className="details-section">
            <div className="goal-header">
              <span className="goal-icon">{goalData.icon}</span>
              <h2>{goalData.name}</h2>
            </div>

            <div className="details-grid">
              {renderField('Initial Value', goalData.initial_goal_value, 
                (v) => `$${parseFloat(v).toLocaleString()}`)}
              {renderField('Projected Value', goalData.projected_value, 
                (v) => `$${parseFloat(v).toLocaleString()}`)}
              {renderField('Timeline', `${goalData.goal_creation_year} → ${goalData.target_year}`)}
              {renderField('Inflation Rate', `${goalData.projected_inflation}%`)}
            </div>

            <div className="progress-section">
              <h3>Progress</h3>
              <div className="progress-container">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${goalData.progress || 35}%`,
                    backgroundColor: getProgressColor(goalData.progress || 35)
                  }}
                />
              </div>
              <div className="progress-details">
                <span className="progress-text">{goalData.progress || 35}% complete</span>
                <span className="saved-amount">
                  Saved: ${((goalData.projected_value * (goalData.progress || 35)) / 100).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="asset-allocations">
              <h3>Asset Allocations</h3>
              {goalData.assets?.length > 0 ? (
                <div className="allocations-grid">
                  {goalData.assets.map(asset => (
                    <div key={asset.id} className="allocation-card">
                      <div className="allocation-header">
                        <span className="asset-icon">{asset.icon}</span>
                        <span className="asset-name">{asset.name}</span>
                      </div>
                      <div className="allocation-details">
                        <div className="allocation-value">
                          ${parseFloat(asset.allocated_amount).toLocaleString()}
                        </div>
                        <div className="allocation-percentage">
                          {asset.allocation_percentage}% of asset
                        </div>
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
          </div>
        </div>
      )}
    </div>
  );
}

export default EditGoal; 