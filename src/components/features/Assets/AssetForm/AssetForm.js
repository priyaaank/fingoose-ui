import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetService } from '../../../../services/assetService';
import { goalService } from '../../../../services/goalService';
import LoadingSpinner from '../../../common/LoadingSpinner';
import GoalMappings from '../../Goals/GoalMappings/GoalMappings';
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

  const presetIcons = [
    '💰', // money bag
    '🏠', // house
    '🏘️', // houses
    '📈', // chart increasing
    '💎', // gem
    '🚗', // car
    '✈️', // airplane
    '🏢', // office building
    '🏆', // trophy (removed duplicate)
    '💵', // dollar bill
    '📊'  // bar chart
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsData, assetData] = await Promise.all([
          goalService.fetchGoals(),
          isEditMode ? assetService.fetchAssetById(parseInt(id)) : null
        ]);
        
        setGoals(goalsData);
        
        if (isEditMode && assetData) {
          setAssetData({
            name: assetData.name,
            icon: assetData.icon,
            type: assetData.type,
            value: assetData.value.toString(),
            projectedRoi: assetData.projectedRoi.toString(),
            maturityYear: assetData.maturityYear?.toString() || '',
            comments: assetData.comments || ''
          });
          setGoalMappings(assetData.goalMappings || []);
        }
      } catch (error) {
        setError(error.message);
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

  const handleIconSelect = (icon) => {
    setAssetData(prev => ({
      ...prev,
      icon
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formattedData = {
        ...assetData,
        value: parseFloat(assetData.value),
        projectedRoi: parseFloat(assetData.projectedRoi),
        maturityYear: assetData.maturityYear ? parseInt(assetData.maturityYear) : null,
        goalMappings
      };

      if (isEditMode) {
        await assetService.updateAsset(parseInt(id), formattedData);
      } else {
        await assetService.createAsset(formattedData);
      }
      
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGoal = () => {
    if (!selectedGoal) return;
    
    const selectedGoalData = goals.find(g => g.id === parseInt(selectedGoal));
    if (!selectedGoalData) return;

    if (goalMappings.some(m => m.goal_id === parseInt(selectedGoal))) {
      setError('This goal is already mapped to this asset');
      return;
    }

    setGoalMappings(prev => [...prev, {
      goal_id: parseInt(selectedGoal),
      goal_name: selectedGoalData.title,
      allocation_percentage: 0
    }]);
    setSelectedGoal('');
  };

  const handleAllocationChange = (goalId, value) => {
    setGoalMappings(prev => prev.map(mapping => 
      mapping.goal_id === goalId 
        ? { ...mapping, allocation_percentage: parseFloat(value) }
        : mapping
    ));
  };

  const handleRemoveGoal = (goalId) => {
    setGoalMappings(prev => prev.filter(mapping => mapping.goal_id !== goalId));
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="asset-form-page">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit Asset' : 'Add New Asset'}</h1>
      </div>

      <form className="asset-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-section">
          <label>Icon</label>
          <div className="icon-selector">
            {presetIcons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-button ${assetData.icon === icon ? 'selected' : ''}`}
                onClick={() => handleIconSelect(icon)}
              >
                {icon}
              </button>
            ))}
          </div>
          <div className="selected-icon-display">
            <label>Selected Icon</label>
            <div className="selected-icon">
              {assetData.icon || 'No icon selected'}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="name">Asset Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={assetData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-section">
            <label htmlFor="type">Asset Type</label>
            <select
              id="type"
              name="type"
              value={assetData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="value">Current Value</label>
            <input
              id="value"
              name="value"
              type="number"
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
              id="projectedRoi"
              name="projectedRoi"
              type="number"
              value={assetData.projectedRoi}
              onChange={handleChange}
              required
              step="0.1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="maturityYear">
              Maturity Year
              <span className="optional-label">(Optional)</span>
            </label>
            <input
              id="maturityYear"
              name="maturityYear"
              type="number"
              value={assetData.maturityYear}
              onChange={handleChange}
              min={new Date().getFullYear()}
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
  );
}

export default AssetForm; 