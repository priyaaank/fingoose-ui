import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userProfileService } from '../../../../services/userProfileService';
import './AssetTable.css';

function AssetTable({ assets }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'No maturity';
    const [year, month] = dateString.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div className="investment-table">
      <div className="table-header">
        <div>Asset Type</div>
        <div>Investment Name</div>
        <div>Current Value</div>
        <div>Projected ROI</div>
        <div>Maturity Date</div>
        <div>Last Updated</div>
        <div>Actions</div>
      </div>
      {assets.map((asset) => (
        <div key={asset.id} className="table-row">
          <div className="investment-type">
            <span className="investment-icon">{asset.icon}</span>
            <span className="investment-type-text">{asset.type}</span>
          </div>
          <div>{asset.name}</div>
          <div className="value-column">
            {userProfileService.formatCurrency(asset.value)}
          </div>
          <div>{asset.projectedRoi}%</div>
          <div>{formatDate(asset.maturityDate)}</div>
          <div>{asset.lastUpdated}</div>
          <div>
            <button 
              className="details-btn"
              onClick={() => navigate(`/view-asset/${asset.id}`)}
              title="View details"
            >
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssetTable; 