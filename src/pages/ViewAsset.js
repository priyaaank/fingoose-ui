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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const asset = await assetService.fetchAssetById(parseInt(id));
        setAssetData(asset);
      } catch (error) {
        setError(error.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-asset/${id}`);
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
        >
          ← Back
        </button>
        <h1>Asset Details</h1>
        <div className="header-actions">
          <button 
            className="edit-button"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button 
            className="delete-button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this asset?')) {
                assetService.deleteAsset(id).then(() => navigate('/'));
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="asset-content">
        <div className="asset-header">
          <div className="asset-title">
            <span className="asset-icon">{assetData.icon}</span>
            <h2>{assetData.name}</h2>
          </div>
        </div>

        <div className="asset-details">
          <div className="detail-row">
            <span className="detail-label">Asset Type:</span>
            <span className="detail-value">{assetData.type}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Current Value:</span>
            <span className="detail-value">
              {userProfileService.formatCurrency(assetData.value)}
            </span>
          </div>

          {assetData.maturityYear && (
            <div className="detail-row">
              <span className="detail-label">Maturity Year:</span>
              <span className="detail-value">{assetData.maturityYear}</span>
            </div>
          )}

          <div className="detail-row">
            <span className="detail-label">Projected ROI:</span>
            <span className="detail-value">{assetData.projectedRoi}%</span>
          </div>
        </div>

        {assetData.comments && (
          <div className="comments-section">
            <h2>Additional Comments</h2>
            <p>{assetData.comments}</p>
          </div>
        )}

        <div className="allocations-section">
          <h2>Asset Allocations</h2>
          {assetData.goalMappings && assetData.goalMappings.length > 0 ? (
            <div className="allocations-grid">
              {assetData.goalMappings.map(mapping => (
                <div key={mapping.goal_id} className="allocation-item">
                  <div className="goal-info">
                    <span className="goal-name">{mapping.goal_name}</span>
                    <span className="allocation-percentage">
                      {mapping.allocation_percentage}%
                    </span>
                  </div>
                  <div className="allocation-bar">
                    <div 
                      className="allocation-progress"
                      style={{ width: `${mapping.allocation_percentage}%` }}
                    />
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

        <div className="last-updated">
          Last updated: {formatDate(assetData.updatedAt)}
        </div>
      </div>
    </div>
  );
}

export default ViewAsset; 