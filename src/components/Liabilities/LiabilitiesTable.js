import React from 'react';
import { useNavigate } from 'react-router-dom';

function LiabilitiesTable({ liabilities }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [year, month] = dateString.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

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
        <div>Start Date</div>
        <div>Actions</div>
      </div>
      {liabilities.map((liability) => (
        <div key={liability.id} className="table-row">
          <div className="liability-type">
            <span className="liability-icon">{liability.icon}</span>
            {liability.type}
          </div>
          <div>{liability.name}</div>
          <div>${liability.outstandingAmount.toLocaleString()}</div>
          <div>${liability.emi.toLocaleString()}/month</div>
          <div>{liability.interestRate}%</div>
          <div>{formatTenure(liability.remainingTenure)}</div>
          <div>{formatDate(liability.startDate)}</div>
          <div>
            <button 
              className="details-btn"
              onClick={() => navigate(`/edit-liability/${liability.id}`)}
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