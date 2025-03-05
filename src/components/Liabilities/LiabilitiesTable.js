import React from 'react';

function LiabilitiesTable({ liabilities }) {
  return (
    <div className="liabilities-table">
      <div className="table-header">
        <div>Loan Type</div>
        <div>Outstanding</div>
        <div>EMI</div>
        <div>Interest Rate</div>
        <div>Remaining Tenure</div>
      </div>
      {liabilities.map((liability, index) => (
        <div key={index} className="table-row">
          <div className="loan-type">
            <span className="loan-icon">{liability.icon}</span>
            {liability.type}
          </div>
          <div>${liability.outstanding.toLocaleString()}</div>
          <div>${liability.emi}/mo</div>
          <div>{liability.interestRate}%</div>
          <div>{liability.tenure}</div>
        </div>
      ))}
    </div>
  );
}

export default LiabilitiesTable; 