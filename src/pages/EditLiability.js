import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { liabilityService } from '../services/liabilityService';
import './EditLiability.css';

function EditLiability() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [liabilityData, setLiabilityData] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    const fetchLiability = async () => {
      try {
        if (!id || isNaN(parseInt(id))) {
          throw new Error('Invalid liability ID');
        }
        const liability = await liabilityService.fetchLiabilityById(parseInt(id));
        setLiabilityData(liability);
      } catch (error) {
        console.error('Error fetching liability:', error);
        setError(
          error.message === 'Invalid liability ID'
            ? 'Invalid liability ID. Please check the URL and try again.'
            : error.message === 'Liability not found'
              ? 'Liability not found. Please check the URL and try again.'
              : 'Failed to load liability details. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiability();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLiabilityData(prev => ({
      ...prev,
      [name]: value
    }));
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
    setIsSaving(true);
    
    try {
      await liabilityService.updateLiability(id, liabilityData);
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to update liability. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this liability?')) {
      // Here you would typically delete the liability
      console.log('Deleting liability:', id);
      navigate('/');
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (parseFloat(liabilityData.outstandingAmount) > parseFloat(liabilityData.borrowedAmount)) {
      errors.current_outstanding = "Current outstanding cannot exceed borrowed principle";
    }
    
    if (parseInt(liabilityData.remainingTenure) > parseInt(liabilityData.totalTenure)) {
      errors.remaining_tenure = "Remaining tenure cannot exceed total tenure";
    }
    
    return errors;
  };

  if (isLoading || !liabilityData) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="edit-liability-page">
      <div className="page-header">
        <h1>Edit Liability</h1>
        <button 
          className="delete-button"
          onClick={handleDelete}
          title="Delete liability"
        >
          Delete
        </button>
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
              min="0"
              step="0.01"
            />
            {fieldErrors.borrowed_principle && (
              <div className="field-error">{fieldErrors.borrowed_principle}</div>
            )}
          </div>

          <div className="form-section">
            <label htmlFor="outstandingAmount">Outstanding Amount ($)</label>
            <input
              type="number"
              id="outstandingAmount"
              name="outstandingAmount"
              value={liabilityData.outstandingAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
            {fieldErrors.current_outstanding && (
              <div className="field-error">{fieldErrors.current_outstanding}</div>
            )}
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
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-save"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLiability; 