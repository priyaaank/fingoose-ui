import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetService } from '../services/assetService';
import './EditAsset.css';

function EditAsset() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
        if (!id || isNaN(parseInt(id))) {
          throw new Error('Invalid asset ID');
        }
        const asset = await assetService.fetchAssetById(parseInt(id));
        setAssetData(asset);
      } catch (error) {
        console.error('Error fetching asset:', error);
        setError(
          error.message === 'Invalid asset ID'
            ? 'Invalid asset ID. Please check the URL and try again.'
            : error.message === 'Failed to fetch asset'
              ? 'Asset not found. Please check the URL and try again.'
              : 'Failed to load asset details. Please try again.'
        );
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
    setError(null);
    setFieldErrors({});
    setIsSaving(true);
    
    try {
      await assetService.updateAsset(id, assetData);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.details) {
        setFieldErrors(error.response.data.details);
      } else {
        setError(error.message || 'Failed to update asset. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setError(null);
      setIsDeleting(true);
      try {
        await assetService.deleteAsset(id);
        navigate('/');
      } catch (error) {
        setError(error.message || 'Failed to delete asset. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  if (isLoading || !assetData) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="edit-asset-page">
      <div className="page-header">
        <h1>Edit Asset</h1>
        <button 
          className="delete-button"
          onClick={handleDelete}
          title="Delete asset"
          disabled={isSaving || isDeleting}
        >
          Delete
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="asset-form">
        <div className="form-section">
          <label htmlFor="type">Asset Type</label>
          <select
            id="type"
            name="type"
            value={assetData.type}
            onChange={handleChange}
            required
          >
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
            value={assetData.maturityDate || ''}
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
            value={assetData.comments || ''}
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
            disabled={isSaving || isDeleting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={isSaving || isDeleting}
          >
            {isSaving ? 'Saving...' : isDeleting ? 'Deleting...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAsset; 