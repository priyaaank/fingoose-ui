import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewAsset.css';

function NewAsset() {
  const navigate = useNavigate();
  const [assetData, setAssetData] = useState({
    icon: '📈',
    type: '',
    name: '',
    value: '',
    projectedRoi: '',
    maturityDate: '',
    comments: ''
  });

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
    console.log('New asset:', assetData);
    navigate('/');
  };

  return (
    <div className="new-asset-page">
      <div className="page-header">
        <h1>Add New Asset</h1>
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
            min={new Date().toISOString().split('T')[0]}
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

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Add Asset
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewAsset; 