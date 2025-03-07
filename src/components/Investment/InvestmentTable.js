import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userProfileService } from '../../services/userProfileService';

function InvestmentTable({ investments }) {
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
      {investments.map((investment) => (
        <div key={investment.id} className="table-row">
          <div className="investment-type">
            <span className="investment-icon">{investment.icon}</span>
            <span className="investment-type-text">{investment.type}</span>
          </div>
          <div>{investment.name}</div>
          <div className="value-column">
            {userProfileService.formatCurrency(investment.value)}
          </div>
          <div>{investment.projectedRoi}%</div>
          <div>{formatDate(investment.maturityDate)}</div>
          <div>{investment.lastUpdated}</div>
          <div>
            <button 
              className="details-btn"
              onClick={() => navigate(`/view-asset/${investment.id}`)}
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

export default InvestmentTable; 