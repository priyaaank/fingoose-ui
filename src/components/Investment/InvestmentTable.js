import React from 'react';
import { useNavigate } from 'react-router-dom';

function InvestmentTable({ investments }) {
  const navigate = useNavigate();

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
            <button 
              className="details-btn"
              onClick={() => navigate(`/edit-asset/${investment.id}`)}
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