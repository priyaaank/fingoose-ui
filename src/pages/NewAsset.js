import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assetService } from '../services/assetService';
import './NewAsset.css';

function NewAsset() {
  const navigate = useNavigate();
  const [assetData, setAssetData] = useState({
    icon: '📈',
    type: 'Mutual Fund',
    name: '',
    value: '',
    projectedRoi: '',
    maturityDate: '',
    comments: ''
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const icons = ['📈', '📊', '🏢', '🏦', '💎', '💰', '🏭', '💳', '🏗️', '🚗'];
  const assetTypes = [
    'Mutual Fund',
    'Fixed Deposit',
    'Stocks',
    'Real Estate',
    'Gold',
    'Cash',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    
    try {
      await assetService.createAsset(assetData);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.details) {
        setFieldErrors(error.response.data.details);
      } else {
        setError(error.message || 'Failed to create asset. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-asset-page">
      <div className="page-header">
        <h1>Add New Asset</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
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
          {fieldErrors.type && <div className="field-error">{fieldErrors.type}</div>}
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
            placeholder="e.g., Vanguard 500 Index Fund"
          />
          {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}
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
              step="0.01"
              placeholder="0.00"
            />
            {fieldErrors.current_value && (
              <div className="field-error">{fieldErrors.current_value}</div>
            )}
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
              placeholder="0.0"
            />
            {fieldErrors.projected_roi && (
              <div className="field-error">{fieldErrors.projected_roi}</div>
            )}
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="maturityDate">Maturity Date (if applicable)</label>
          <input
            type="month"
            id="maturityDate"
            name="maturityDate"
            value={assetData.maturityDate}
            onChange={handleChange}
            min={new Date().toISOString().substring(0, 7)}
            pattern="\d{4}-\d{2}"
          />
          {fieldErrors.maturity_date && (
            <div className="field-error">{fieldErrors.maturity_date}</div>
          )}
        </div>

        <div className="form-section">
          <label htmlFor="comments">Additional Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={assetData.comments}
            onChange={handleChange}
            rows="3"
            placeholder="Any additional notes about this asset..."
          />
          {fieldErrors.additional_comments && (
            <div className="field-error">{fieldErrors.additional_comments}</div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAsset; 