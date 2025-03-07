import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetService } from '../services/assetService';
import { userProfileService } from '../services/userProfileService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ViewAsset.css';

function ViewAsset() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [assetData, setAssetData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const asset = await assetService.fetchAssetById(parseInt(id));
        setAssetData(asset);
      } catch (error) {
        setError(error.message || 'Failed to load asset details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setIsDeleting(true);
      try {
        await assetService.deleteAsset(id);
        navigate('/');
      } catch (error) {
        setError(error.message || 'Failed to delete asset');
        setIsDeleting(false);
      }
    }
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
          disabled={isDeleting}
        >
          ← Back
        </button>
        <h1>Asset Details</h1>
        <div className="header-actions">
          <button 
            className="edit-button"
            onClick={() => navigate(`/assets/${id}/edit`)}
            disabled={isDeleting}
          >
            Edit
          </button>
          <button 
            className="delete-button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="asset-content">
        <div className="asset-details">
          <div className="detail-row">
            <span className="label">Type:</span>
            <span className="value">{assetData.type}</span>
          </div>
          <div className="detail-row">
            <span className="label">Name:</span>
            <span className="value">{assetData.name}</span>
          </div>
          <div className="detail-row">
            <span className="label">Current Value:</span>
            <span className="value">{userProfileService.formatCurrency(assetData.value)}</span>
          </div>
          <div className="detail-row">
            <span className="label">Projected ROI:</span>
            <span className="value">{assetData.projectedRoi}%</span>
          </div>
          <div className="detail-row">
            <span className="label">Maturity Year:</span>
            <span className="value">{assetData.maturityYear || 'N/A'}</span>
          </div>
          
          {assetData.goalMappings && assetData.goalMappings.length > 0 && (
            <div className="detail-row">
              <span className="label">Goal Allocations:</span>
              <div className="value goal-allocations">
                {assetData.goalMappings.map(mapping => (
                  <div key={mapping.goal_id} className="goal-allocation">
                    <span>{mapping.goal_name}</span>
                    <span>{mapping.allocation_percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="detail-row">
            <span className="label">Created:</span>
            <span className="value">{formatDate(assetData.createdAt)}</span>
          </div>

          <div className="detail-row">
            <span className="label">Last Updated:</span>
            <span className="value">{formatDate(assetData.updatedAt)}</span>
          </div>

          {assetData.comments && (
            <div className="detail-row">
              <span className="label">Comments:</span>
              <span className="value">{assetData.comments}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewAsset; 