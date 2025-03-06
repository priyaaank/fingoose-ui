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
        setData({
          goals: goalsData,
          investments: assetsData,
          liabilities: liabilitiesData,
          summary: summaryData
        });
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