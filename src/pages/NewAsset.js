import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetService } from '../services/assetService';
import { goalService } from '../services/goalService';
import './NewAsset.css';
import GoalMappings from '../components/Goal/GoalMappings';

function NewAsset() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    icon: '',
    name: '',
    type: '',
    value: '',
    projectedRoi: '',
    maturityYear: '',
    comments: '',
    goalMappings: []
  });
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [goalMappings, setGoalMappings] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const commonEmojis = ['💰', '🏦', '🏠', '📈', '💎', '🚗', '✨', '🏢', '🌟', '💵', '🏆', '📊'];
  const assetTypes = ['Mutual Fund', 'Fixed Deposit', 'Stocks', 'Real Estate', 'Gold', 'Cash', 'Other'];

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const fetchedGoals = await goalService.fetchGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        setError('Failed to load goals');
      }
    };
    fetchGoals();
  }, []);

  const handleEmojiSelect = (emoji) => {
    setFormData(prev => ({ ...prev, icon: emoji }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await assetService.createAsset(formData);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to create asset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-asset-page">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back
        </button>
        <h1>Add New Asset</h1>
      </div>

      <form onSubmit={handleSubmit} className="asset-form">
        <div className="emoji-selector">
          {commonEmojis.map(emoji => (
            <button
              key={emoji}
              type="button"
              className={`emoji-button ${formData.icon === emoji ? 'selected' : ''}`}
              onClick={() => handleEmojiSelect(emoji)}
            >
              {emoji}
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
              value={formData.icon}
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
              value={formData.name}
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
              value={formData.type}
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
              value={formData.maturityYear}
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
              value={formData.value}
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
              value={formData.projectedRoi}
              onChange={handleChange}
              required
              step="0.1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="comments">Additional Comments</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
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

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="save-button"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAsset; 