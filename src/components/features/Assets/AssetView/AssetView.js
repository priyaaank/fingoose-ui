import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assetService } from '../../../../services/assetService';
import { userProfileService } from '../../../../services/userProfileService';
import LoadingSpinner from '../../../common/LoadingSpinner';
import './AssetView.css';

function AssetView() {
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await assetService.deleteAsset(parseInt(id));
        navigate('/');
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!assetData) return <div className="error-message">Asset not found</div>;

  return (
    <div className="view-asset-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="header-actions">
          <button className="edit-button" onClick={handleEdit}>
            Edit Asset
          </button>
          <button className="delete-button" onClick={handleDelete}>
            Delete Asset
          </button>
        </div>
      </div>

      <div className="asset-content">
        <div className="asset-title-section">
          <div className="asset-icon">{assetData.icon}</div>
          <h1 className="asset-title">{assetData.name}</h1>
        </div>

        <div className="metrics-grid">
          <div className="metric-item">
            <h2>Asset Type</h2>
            <div className="metric-value">
              {assetData.type}
            </div>
          </div>
          
          <div className="metric-item">
            <h2>Current Value</h2>
            <div className="metric-value">
              {userProfileService.formatCurrency(assetData.value)}
            </div>
          </div>

          <div className="metric-item">
            <h2>Projected ROI</h2>
            <div className="metric-value">
              {assetData.projectedRoi}%
            </div>
          </div>
        </div>

        {assetData.comments && (
          <>
            <hr className="section-divider" />
            <div className="comments-section">
              <h2 className="comments-title">Comments</h2>
              <div className="comments-text">
                {assetData.comments}
              </div>
            </div>
          </>
        )}

        <div className="goal-allocations">
          <h2>Goal Allocations</h2>
          {assetData.goalMappings?.length > 0 ? (
            <div className="allocations-list">
              {assetData.goalMappings.map(mapping => (
                <div key={mapping.goal_id} className="allocation-item">
                  <div className="allocation-header">
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
              No goals are currently allocated to this asset
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

export default AssetView; 