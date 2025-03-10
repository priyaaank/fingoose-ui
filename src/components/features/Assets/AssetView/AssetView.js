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
        </div>
      </div>

      <div className="asset-info">
        <div className="info-card">
          <div className="icon">{assetData.icon}</div>
          <h3>Asset Type</h3>
          <div className="value">{assetData.type}</div>
        </div>
        <div className="info-card">
          <h3>Current Value</h3>
          <div className="value">
            {userProfileService.formatCurrency(assetData.value)}
          </div>
        </div>
        <div className="info-card">
          <h3>Projected ROI</h3>
          <div className="value">{assetData.projectedRoi}%</div>
        </div>
      </div>

      <div className="asset-details">
        <div className="detail-row">
          <div className="detail-label">Name</div>
          <div className="detail-value">{assetData.name}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Maturity Year</div>
          <div className="detail-value">
            {assetData.maturityYear || 'Not specified'}
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Comments</div>
          <div className="detail-value">
            {assetData.comments || 'No comments'}
          </div>
        </div>
      </div>

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
            No assets are currently allocated to this goal
          </div>
        )}
      </div>

      <div className="last-updated">
        Last updated: {formatDate(assetData.updatedAt)}
      </div>
    </div>
  );
}

export default AssetView; 