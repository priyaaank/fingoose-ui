import React from 'react';

function LiabilitiesTable({ liabilities }) {
  return (
    <div className="liabilities-table">
      <div className="table-header">
        <div>Type</div>
        <div>Name</div>
        <div>Outstanding</div>
        <div>EMI</div>
        <div>Interest Rate</div>
        <div>Tenure</div>
        <div>Actions</div>
      </div>
      {liabilities.map((liability, index) => (
        <div key={index} className="table-row">
          <div className="liability-type">
            <span className="liability-icon">{liability.icon}</span>
            {liability.type}
          </div>
          <div>{liability.name}</div>
          <div>${liability.outstanding.toLocaleString()}</div>
          <div>${liability.emi.toLocaleString()}</div>
          <div>{liability.interestRate}%</div>
          <div>{liability.tenure}</div>
          <div>
            <button className="details-btn">Show Details</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LiabilitiesTable; 