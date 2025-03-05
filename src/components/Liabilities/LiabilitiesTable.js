import React from 'react';
import { useNavigate } from 'react-router-dom';

function LiabilitiesTable({ liabilities }) {
  const navigate = useNavigate();

  return (
    <div className="liabilities-table">
      <div className="table-header">
        <div>Type</div>
        <div>Name</div>
        <div>Borrowed Principal</div>
        <div>Outstanding</div>
        <div>Monthly Payment</div>
        <div>Interest Rate</div>
        <div>Actions</div>
      </div>
      {liabilities.map((liability, index) => (
        <div key={index} className="table-row">
          <div className="liability-type">
            <span className="liability-icon">{liability.icon}</span>
            {liability.type}
          </div>
          <div>{liability.name}</div>
          <div>${(liability.borrowedPrincipal || 0).toLocaleString()}</div>
          <div>${liability.outstanding.toLocaleString()}</div>
          <div>${liability.emi.toLocaleString()}</div>
          <div>{liability.interestRate}%</div>
          <div>
            <button 
              className="details-btn"
              onClick={() => navigate(`/edit-liability/${liability.id}`)}
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