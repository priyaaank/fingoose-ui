import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

function PageHeader({ title, onBack }) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="page-header">
      <button className="back-button" onClick={handleBack}>
        ← Back
      </button>
      <h1>{title}</h1>
    </div>
  );
}

export default PageHeader; 