import React from 'react';
import { useNavigate } from 'react-router-dom';
import { userProfileService } from '../../services/userProfileService';

function LiabilitiesTable({ liabilities }) {
  const navigate = useNavigate();

  const formatTenure = (months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years, ${remainingMonths} months`;
  };

  return (
    <div className="liabilities-table">
      <div className="table-header">
        <div>Type</div>
        <div>Name</div>
        <div>Outstanding</div>
        <div>EMI</div>
        <div>Interest Rate</div>
        <div>Remaining Tenure</div>
        <div>Actions</div>
      </div>
      {liabilities.map((liability) => (
        <div key={liability.id} className="table-row">
          <div className="liability-type">
            <span className="liability-icon">{liability.icon}</span>
            {liability.type}
          </div>
          <div>{liability.name}</div>
          <div className="amount-column">
            {userProfileService.formatCurrency(liability.outstandingAmount)}
          </div>
          <div className="emi-column">
            {userProfileService.formatCurrency(liability.monthlyPayment)}
          </div>
          <div>{liability.interestRate}%</div>
          <div>{formatTenure(liability.remainingTenure)}</div>
          <div>
            <button 
              className="details-btn"
              onClick={() => navigate(`/liabilities/${liability.id}/edit`)}
              title={liability.comments}
            >
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LiabilitiesTable; 