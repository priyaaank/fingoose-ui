import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { goalService } from '../services/goalService';
import { assetService } from '../services/assetService';
import './EditGoal.css';
import AssetMappings from '../components/Asset/AssetMappings';

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
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [assetMappings, setAssetMappings] = useState([]);

  // Helper function to convert string ID to number
  const toNumber = (id) => typeof id === 'string' ? parseInt(id, 10) : id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [goalData, fetchedAssets] = await Promise.all([
          goalService.fetchGoalById(id),
          assetService.fetchAssets()
        ]);
        
        // Set goal data
        setGoalData(goalData);
        setOriginalData(goalData);
        
        // Set assets
        setAssets(fetchedAssets);
        
        // Initialize asset mappings from goal data
        const mappings = goalData.assets?.map(asset => ({
          asset_id: asset.id,
          asset_name: asset.name,
          allocation_percentage: asset.allocation_percentage
        })) || [];
        setAssetMappings(mappings);
        
        setError(null);
      } catch (error) {
        setError('Failed to load goal data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const handleAddAsset = () => {
    if (!selectedAsset) return;
    
    const asset = assets.find(a => a.id === parseInt(selectedAsset));
    if (!asset) return;

    setAssetMappings(prev => ([
      ...prev,
      { 
        asset_id: asset.id, 
        asset_name: asset.name,
        allocation_percentage: 0 
      }
    ]));
    setSelectedAsset('');
  };

  const handleAllocationChange = (assetId, value) => {
    const percentage = parseFloat(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) return;

    setAssetMappings(prev => prev.map(mapping =>
      mapping.asset_id === assetId
        ? { ...mapping, allocation_percentage: percentage }
        : mapping
    ));
  };

  const handleRemoveAsset = (assetId) => {
    setAssetMappings(prev => 
      prev.filter(mapping => mapping.asset_id !== assetId)
    );
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
        asset_mappings: assetMappings
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

          <AssetMappings
            assets={assets}
            selectedAsset={selectedAsset}
            assetMappings={assetMappings}
            onAssetSelect={setSelectedAsset}
            onAddAsset={handleAddAsset}
            onAllocationChange={handleAllocationChange}
            onRemoveAsset={handleRemoveAsset}
          />

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
              <div className="detail-item">
                <h3>Initial Value</h3>
                <div className="detail-value">
                  ${parseFloat(goalData.initial_goal_value).toLocaleString()}
                </div>
              </div>
              <div className="detail-item">
                <h3>Projected Value</h3>
                <div className="detail-value">
                  ${parseFloat(goalData.projected_value).toLocaleString()}
                </div>
              </div>
              <div className="detail-item">
                <h3>Timeline</h3>
                <div className="detail-value">
                  {goalData.goal_creation_year} → {goalData.target_year}
                </div>
              </div>
              <div className="detail-item">
                <h3>Inflation Rate</h3>
                <div className="detail-value">
                  {goalData.projected_inflation}%
                </div>
              </div>
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
              <div className="allocations-list">
                {assetMappings.map(mapping => (
                  <div key={mapping.asset_id} className="allocation-item">
                    <span className="asset-name">{mapping.asset_name}</span>
                    <span className="allocation-value">{mapping.allocation_percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditGoal; 