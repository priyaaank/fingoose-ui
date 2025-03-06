import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalCard from '../components/FinancialGoals/GoalCard';
import InvestmentTable from '../components/Investment/InvestmentTable';
import LiabilitiesTable from '../components/Liabilities/LiabilitiesTable';
import SummaryCard from '../components/Summary/SummaryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { goalService } from '../services/goalService';
import { assetService } from '../services/assetService';
import { liabilityService } from '../services/liabilityService';
import mockData from '../data/mockData.json';

function Dashboard() {
  const [data, setData] = useState(null);
  const [goals, setGoals] = useState([]);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call delay
    const fetchData = async () => {
      try {
        // In a real application, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        const [goalsData, assetsData, liabilitiesData, otherData] = await Promise.all([
          goalService.fetchGoals(),
          assetService.fetchAssets(),
          liabilityService.fetchLiabilities(),
          // Keep other mock data for now
          new Promise(resolve => setTimeout(() => resolve(mockData), 1000))
        ]);
        
        setGoals(goalsData);
        setAssets(assetsData);
        setLiabilities(liabilitiesData);
        setData({
          ...otherData,
          goals: goalsData, // Replace mock goals with API goals
          investments: assetsData, // Replace mock investments with API assets
          liabilities: liabilitiesData
        });
      } catch (error) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error('Dashboard data loading error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
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
          {goals.map((goal) => (
            <GoalCard key={goal.id} {...goal} />
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