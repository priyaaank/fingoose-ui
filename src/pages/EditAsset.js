import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetService } from '../services/assetService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './EditAsset.css';

function EditAsset() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assetData, setAssetData] = useState({
    name: '',
    icon: '',
    type: '',
    value: '',
    projectedRoi: '',
    maturityYear: '',
    comments: '',
    goalMappings: []
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const assetTypes = [
    'Mutual Fund',
    'Fixed Deposit',
    'Stocks',
    'Real Estate',
    'Gold',
    'Cash',
    'Other'
  ];

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const asset = await assetService.fetchAssetById(parseInt(id));
        setAssetData(asset);
      } catch (error) {
        setError(error.message || 'Failed to load asset');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssetData(prev => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await assetService.updateAsset(id, assetData);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to update asset');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="edit-asset-page">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
          disabled={isSaving}
        >
          ← Back
        </button>
        <h1>Edit Asset</h1>
      </div>

      <form onSubmit={handleSubmit} className="asset-form">
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
              <option value="">Select Type</option>
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {fieldErrors.type && (
              <div className="field-error">{fieldErrors.type}</div>
            )}
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
            />
            {fieldErrors.name && (
              <div className="field-error">{fieldErrors.name}</div>
            )}
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
              step="0.01"
            />
            {fieldErrors.value && (
              <div className="field-error">{fieldErrors.value}</div>
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
            />
            {fieldErrors.projectedRoi && (
              <div className="field-error">{fieldErrors.projectedRoi}</div>
            )}
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
            {fieldErrors.maturityYear && (
              <div className="field-error">{fieldErrors.maturityYear}</div>
            )}
          </div>

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
            {fieldErrors.icon && (
              <div className="field-error">{fieldErrors.icon}</div>
            )}
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
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAsset; 