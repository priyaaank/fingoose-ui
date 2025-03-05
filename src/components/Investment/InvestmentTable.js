import React from 'react';

function InvestmentTable({ investments }) {
  return (
    <div className="investment-table">
      <div className="table-header">
        <div>Investment Type</div>
        <div>Investment Name</div>
        <div>Current Value</div>
        <div>Projected ROI</div>
        <div>Actual ROI</div>
        <div>Last Updated</div>
        <div>Actions</div>
      </div>
      {investments.map((investment, index) => (
        <div key={index} className="table-row">
          <div className="investment-type">
            <span className="investment-icon">{investment.icon}</span>
            {investment.type}
          </div>
          <div>{investment.name}</div>
          <div>${investment.value.toLocaleString()}</div>
          <div>{investment.projectedRoi}%</div>
          <div className={investment.actualRoi >= investment.projectedRoi ? 'positive' : 'negative'}>
            {investment.actualRoi}%
          </div>
          <div>{investment.lastUpdated}</div>
          <div>
            <button className="details-btn">Show details</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InvestmentTable; 