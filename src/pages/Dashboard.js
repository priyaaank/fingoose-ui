import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoalCard from '../components/FinancialGoals/GoalCard';
import InvestmentTable from '../components/Investment/InvestmentTable';
import LiabilitiesTable from '../components/Liabilities/LiabilitiesTable';
import SummaryCard from '../components/Summary/SummaryCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import mockData from '../data/mockData.json';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        Dashboard
      </div>
      <div className="dashboard">
        <h1>Goals</h1>
        <div className="goals-grid">
          {data.goals.map((goal, index) => (
            <GoalCard key={index} {...goal} />
          ))}
        </div>

        <h1>Assets</h1>
        <InvestmentTable investments={data.investments} />

        <h1>Liabilities</h1>
        <LiabilitiesTable liabilities={data.liabilities} />

        <h1>Financial Summary</h1>
        <div className="summary-grid">
          {data.summary.map((item, index) => (
            <SummaryCard key={index} {...item} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard; 