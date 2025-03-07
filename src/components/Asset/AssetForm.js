import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetService } from '../../services/assetService';
import { goalService } from '../../services/goalService';
import LoadingSpinner from '../common/LoadingSpinner';
import GoalMappings from '../Goal/GoalMappings';
import './AssetForm.css';

function AssetForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  
  const [assetData, setAssetData] = useState({
    name: '',
    icon: '',
    type: '',
    value: '',
    projectedRoi: '',
    maturityYear: '',
    comments: ''
  });
  
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [goalMappings, setGoalMappings] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  const assetTypes = [
    'Mutual Fund',
    'Fixed Deposit',
    'Stocks',
    'Real Estate',
    'Gold',
    'Cash',
    'Other'
  ];

  const presetIcons = ['💰', '🏠', '🏘️', '📈', '💎', '🚗', '✈️', '🏢', '🏆', '💵', '🏆', '📊'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetData, fetchedGoals] = await Promise.all([
          isEditMode ? assetService.fetchAssetById(parseInt(id)) : null,
          goalService.fetchGoals()
        ]);
        
        if (isEditMode && assetData) {
          setAssetData(assetData);
          // Initialize goal mappings from asset data
          const mappings = assetData.goals?.map(goal => ({
            goal_id: goal.id,
            goal_name: goal.name,
            allocation_percentage: goal.allocation_percentage
          })) || [];
          setGoalMappings(mappings);
        }
        
        setGoals(fetchedGoals);
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditMode) {
        await assetService.updateAsset(id, {
          ...assetData,
          goalMappings
        });
        navigate(`/view-asset/${id}`);
      } else {
        const newAsset = await assetService.createAsset({
          ...assetData,
          goalMappings
        });
        navigate(`/view-asset/${newAsset.id}`);
      }
    } catch (error) {
      setError(isEditMode ? 'Failed to update asset' : 'Failed to create asset');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGoal = () => {
    if (!selectedGoal) return;
    
    const goal = goals.find(g => g.id === parseInt(selectedGoal));
    if (!goal) return;

    setGoalMappings(prev => ([
      ...prev,
      { 
        goal_id: goal.id, 
        goal_name: goal.name,
        allocation_percentage: 0 
      }
    ]));
    setSelectedGoal('');
  };

  const handleAllocationChange = (goalId, value) => {
    const percentage = parseFloat(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) return;

    setGoalMappings(prev => prev.map(mapping =>
      mapping.goal_id === goalId
        ? { ...mapping, allocation_percentage: percentage }
        : mapping
    ));
  };

  const handleRemoveGoal = (goalId) => {
    setGoalMappings(prev => 
      prev.filter(mapping => mapping.goal_id !== goalId)
    );
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="asset-form-page">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
          disabled={isSaving}
        >
          ← Back
        </button>
        <h1>{isEditMode ? 'Edit Asset' : 'New Asset'}</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="asset-form-container">
        <form onSubmit={handleSubmit} className="asset-form">
          <div className="icon-selector">
            {presetIcons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-button ${assetData.icon === icon ? 'selected' : ''}`}
                onClick={() => handleChange({ target: { name: 'icon', value: icon } })}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="icon">Icon</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={assetData.icon}
                onChange={handleChange}
                placeholder="Enter or select an emoji"
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
              <label htmlFor="type">Asset Type</label>
              <select
                id="type"
                name="type"
                value={assetData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                {assetTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="maturityYear">Maturity Year (Optional)</label>
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

          <div className="form-row full-width">
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

          <GoalMappings
            goals={goals}
            selectedGoal={selectedGoal}
            goalMappings={goalMappings}
            onGoalSelect={setSelectedGoal}
            onAddGoal={handleAddGoal}
            onAllocationChange={handleAllocationChange}
            onRemoveGoal={handleRemoveGoal}
          />

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/')}
              disabled={isSaving}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="save-button"
            >
              {isSaving ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Asset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssetForm; 