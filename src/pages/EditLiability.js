import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditLiability.css';

function EditLiability() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [liabilityData, setLiabilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    // In a real app, fetch the liability data based on id
    const fetchLiability = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setLiabilityData({
          icon: '🏠',
          type: 'Mortgage',
          name: 'Home Loan',
          borrowedPrincipal: 300000,
          outstanding: 250000,
          emi: 1200,
          interestRate: 3.5,
          startDate: '2023-01-01',
          tenure: '30 years',
          comments: ''
        });
      } catch (error) {
        console.error('Error fetching liability:', error);
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically save the data
    console.log('Updated liability:', liabilityData);
    navigate('/');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this liability?')) {
      // Here you would typically delete the liability
      console.log('Deleting liability:', id);
      navigate('/');
    }
  };

  if (isLoading || !liabilityData) {
    return <div className="loading">Loading...</div>;
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
            <label htmlFor="borrowedPrincipal">Borrowed Principal ($)</label>
            <input
              type="number"
              id="borrowedPrincipal"
              name="borrowedPrincipal"
              value={liabilityData.borrowedPrincipal}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>

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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLiability; 