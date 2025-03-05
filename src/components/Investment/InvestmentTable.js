import React from 'react';

function InvestmentTable({ investments }) {
  return (
    <div className="investment-table">
      <div className="table-header">
        <div>Investment Type</div>
        <div>Current Value</div>
        <div>YoY Return</div>
        <div>Goal Allocation</div>
        <div>Last Updated</div>
      </div>
      {investments.map((investment, index) => (
        <div key={index} className="table-row">
          <div className="investment-type">
            <span className="investment-icon">{investment.icon}</span>
            {investment.type}
          </div>
          <div>${investment.value.toLocaleString()}</div>
          <div>{investment.return}%</div>
          <div>{investment.goalAllocation}</div>
          <div>{investment.lastUpdated}</div>
        </div>
      ))}
    </div>
  );
}

export default InvestmentTable; 