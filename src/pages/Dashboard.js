import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoalSummary from '../components/GoalForm/GoalSummary';
import InvestmentTable from '../components/Investment/InvestmentTable';
import LiabilitiesTable from '../components/Liabilities/LiabilitiesTable';
import SummaryCard from '../components/Summary/SummaryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { goalService } from '../services/goalService';
import { assetService } from '../services/assetService';
import { liabilityService } from '../services/liabilityService';

function Dashboard() {
  const [goals, setGoals] = useState([]);
  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsData, assetsData, liabilitiesData] = await Promise.all([
          goalService.fetchGoals(),
          assetService.fetchAssets(),
          liabilityService.fetchLiabilities()
        ]);
        
        console.log('Fetched goals:', goalsData);
        setGoals(goalsData);
        setAssets(assetsData);
        setLiabilities(liabilitiesData);
        
        // Calculate summary data
        const summaryData = [
          {
            title: 'Total Assets',
            value: assetsData.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0),
            change: '+5.2%',
            trend: 'up'
          },
          {
            title: 'Total Liabilities',
            value: liabilitiesData.reduce((sum, liability) => sum + (parseFloat(liability.outstandingAmount) || 0), 0),
            change: '-2.1%',
            trend: 'down'
          },
          {
            title: 'Net Worth',
            value: assetsData.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0) - 
                   liabilitiesData.reduce((sum, liability) => sum + (parseFloat(liability.outstandingAmount) || 0), 0),
            change: '+3.8%',
            trend: 'up'
          }
        ];
        
        setSummary(summaryData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data. Please try again.');
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
          {summary.map((item, index) => (
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
          {goals && goals.length > 0 ? (
            goals.map((goal) => (
              <GoalSummary key={goal.id} goal={goal} />
            ))
          ) : (
            <div className="empty-state">
              <p>No goals found. Start by adding your first goal!</p>
            </div>
          )}
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
        <InvestmentTable investments={assets} />

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
        <LiabilitiesTable liabilities={liabilities} />
      </div>
    </>
  );
}

export default Dashboard; 