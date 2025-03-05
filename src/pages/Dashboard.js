import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoalCard from '../components/FinancialGoals/GoalCard';
import InvestmentTable from '../components/Investment/InvestmentTable';
import LiabilitiesTable from '../components/Liabilities/LiabilitiesTable';
import SummaryCard from '../components/Summary/SummaryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import mockData from '../data/mockData.json';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call delay
    const fetchData = async () => {
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setData(mockData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !data) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="dashboard">
        <h1>Overview</h1>
        <div className="summary-grid">
          {data.summary.map((item, index) => (
            <SummaryCard key={index} {...item} />
          ))}
        </div>

        <div className="section-header">
          <h1>Goals</h1>
          <button 
            className="add-button"
            onClick={() => navigate('/new-goal')}
            title="Add new goal"
          >
            +
          </button>
        </div>
        <div className="goals-grid">
          {data.goals.map((goal, index) => (
            <GoalCard key={index} {...goal} />
          ))}
        </div>

        <div className="section-header">
          <h1>Assets</h1>
          <button 
            className="add-button"
            onClick={() => navigate('/new-asset')}
            title="Add new asset"
          >
            +
          </button>
        </div>
        <InvestmentTable investments={data.investments} />

        <div className="section-header">
          <h1>Liabilities</h1>
          <button 
            className="add-button"
            onClick={() => navigate('/new-liability')}
            title="Add new liability"
          >
            +
          </button>
        </div>
        <LiabilitiesTable liabilities={data.liabilities} />
      </div>
    </>
  );
}

export default Dashboard; 