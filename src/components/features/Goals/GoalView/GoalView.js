import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { goalService } from '../../../../services/goalService';
import { userProfileService } from '../../../../services/userProfileService';
import LoadingSpinner from '../../../common/LoadingSpinner';
import ProgressBar from '../../../common/ProgressBar';
import './GoalView.css';

function GoalView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const goalData = await goalService.fetchGoalById(parseInt(id));
        setGoal(goalData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-goal/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalService.deleteGoal(parseInt(id));
        navigate('/');
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    const date = new Date(dateString);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;
  if (!goal) return <div className="error-message">Goal not found</div>;

  return (
    <div className="goal-view-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
        <h1>Goal Details</h1>
        <div className="header-actions">
          <button className="edit-button" onClick={handleEdit}>Edit</button>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="goal-content">
        <div className="goal-title-section">
          <div className="goal-icon">{goal.icon}</div>
          <h1>{goal.name}</h1>
        </div>

        <div className="goal-details">
          <div className="detail-item">
            <h2>Initial Value</h2>
            <div className="detail-value">
              {userProfileService.formatCurrency(goal.initial_goal_value)}
            </div>
          </div>

          <div className="detail-item">
            <h2>Projected Value</h2>
            <div className="detail-value">
              {userProfileService.formatCurrency(goal.projected_value)}
            </div>
          </div>

          <div className="detail-item">
            <h2>Timeline</h2>
            <div className="detail-value">
              {goal.goal_creation_year} → {goal.target_year}
            </div>
          </div>

          <div className="detail-item">
            <h2>Inflation Rate</h2>
            <div className="detail-value">{goal.projected_inflation}%</div>
          </div>
        </div>

        <hr className="section-divider" />
        <div className="asset-allocations">
          <h2>Asset Allocations</h2>
          <div className="allocations-list">
            {goal.assets?.length > 0 ? goal.assets.map((mapping) => (
              <div key={mapping.id} className="allocation-item">
                <div className="allocation-name">{mapping.name}</div>
                <ProgressBar percentage={mapping.allocation_percentage} />
                <div className="allocation-percentage">{mapping.allocation_percentage}%</div>
              </div>
            )) : (
              <div className="no-allocations">
                No asset allocations found for this goal
              </div>
            )}
          </div>
          <div className="last-updated">
            Last updated: {formatDate(goal.last_updated)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalView; 