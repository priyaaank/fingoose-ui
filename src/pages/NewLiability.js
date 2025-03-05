import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NewLiability.css';

function NewLiability() {
  const navigate = useNavigate();
  const [liabilityData, setLiabilityData] = useState({
    icon: '🏠',
    type: '',
    name: '',
    outstanding: '',
    emi: '',
    interestRate: '',
    startDate: '',
    tenure: '',
    comments: ''
  });

  const icons = ['🏠', '🚗', '🎓', '💳', '🏦', '🏥', '💼', '📱'];
  const liabilityTypes = [
    'Mortgage',
    'Car Loan',
    'Student Loan',
    'Credit Card',
    'Personal Loan',
    'Medical Debt',
    'Business Loan',
    'Others'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLiabilityData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the data
    console.log('New liability:', liabilityData);
    navigate('/');
  };

  return (
    <div className="new-liability-page">
      <div className="page-header">
        <h1>Add New Liability</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="liability-form">
        <div className="form-section">
          <label>Choose Icon</label>
          <div className="icon-selector">
            {icons.map(icon => (
              <button
                key={icon}
                type="button"
                className={`icon-option ${liabilityData.icon === icon ? 'selected' : ''}`}
                onClick={() => setLiabilityData(prev => ({ ...prev, icon }))}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="type">Liability Type</label>
            <select
              id="type"
              name="type"
              value={liabilityData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select liability type</option>
              {liabilityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <label htmlFor="name">Liability Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={liabilityData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Home Mortgage"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="outstanding">Outstanding Amount ($)</label>
            <input
              type="number"
              id="outstanding"
              name="outstanding"
              value={liabilityData.outstanding}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-section">
            <label htmlFor="emi">Monthly Payment (EMI) ($)</label>
            <input
              type="number"
              id="emi"
              name="emi"
              value={liabilityData.emi}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="interestRate">Interest Rate (%)</label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={liabilityData.interestRate}
              onChange={handleChange}
              required
              step="0.1"
              min="0"
              placeholder="0.0"
            />
          </div>

          <div className="form-section">
            <label htmlFor="tenure">Tenure</label>
            <input
              type="text"
              id="tenure"
              name="tenure"
              value={liabilityData.tenure}
              onChange={handleChange}
              required
              placeholder="e.g., 30 years"
            />
          </div>
        </div>

        <div className="form-section">
          <label htmlFor="startDate">
            Start Date
            <span className="optional-label">(Optional)</span>
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={liabilityData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-section">
          <label htmlFor="comments">
            Additional Comments
            <span className="optional-label">(Optional)</span>
          </label>
          <textarea
            id="comments"
            name="comments"
            value={liabilityData.comments}
            onChange={handleChange}
            placeholder="Add any additional notes about this liability..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Add Liability
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewLiability; 