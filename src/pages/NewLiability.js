import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { liabilityService } from '../services/liabilityService';
import './NewLiability.css';

function NewLiability() {
  const navigate = useNavigate();
  const [liabilityData, setLiabilityData] = useState({
    icon: '🏠',
    type: 'Home Loan',
    name: '',
    borrowedAmount: '',
    outstandingAmount: '',
    interestRate: '',
    emi: '',
    remainingTenure: '',
    totalTenure: '',
    startDate: new Date().toISOString().substring(0, 7),
    comments: ''
  });
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const icons = ['🏠', '🚗', '🎓', '💳', '🏦', '🏥', '💼', '📱'];
  const liabilityTypes = [
    'Home Loan',
    'Car Loan',
    'Personal Loan',
    'Education Loan',
    'Credit Card',
    'Business Loan',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLiabilityData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    
    try {
      await liabilityService.createLiability(liabilityData);
      navigate('/');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.details) {
        setFieldErrors(error.response.data.details);
      } else {
        setError(error.message || 'Failed to create liability. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-liability-page">
      <div className="page-header">
        <h1>Add New Liability</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
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
            {fieldErrors.type && <div className="field-error">{fieldErrors.type}</div>}
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
            <label htmlFor="borrowedAmount">Borrowed Amount ($)</label>
            <input
              type="number"
              id="borrowedAmount"
              name="borrowedAmount"
              value={liabilityData.borrowedAmount}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div className="form-section">
            <label htmlFor="outstandingAmount">Outstanding Amount ($)</label>
            <input
              type="number"
              id="outstandingAmount"
              name="outstandingAmount"
              value={liabilityData.outstandingAmount}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-row">
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
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="remainingTenure">Remaining Tenure</label>
            <input
              type="text"
              id="remainingTenure"
              name="remainingTenure"
              value={liabilityData.remainingTenure}
              onChange={handleChange}
              required
              placeholder="e.g., 30 years"
            />
          </div>

          <div className="form-section">
            <label htmlFor="totalTenure">Total Tenure</label>
            <input
              type="text"
              id="totalTenure"
              name="totalTenure"
              value={liabilityData.totalTenure}
              onChange={handleChange}
              required
              placeholder="e.g., 30 years"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-section">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="month"
              id="startDate"
              name="startDate"
              value={liabilityData.startDate}
              onChange={handleChange}
              pattern="\d{4}-\d{2}"
            />
            {fieldErrors.start_date && (
              <div className="field-error">{fieldErrors.start_date}</div>
            )}
          </div>
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
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => navigate('/')}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Liability'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewLiability; 