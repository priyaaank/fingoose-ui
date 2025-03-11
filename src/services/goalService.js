import { config } from '../config/config';

export const goalService = {
  async fetchGoals() {
    try {
      const response = await fetch(`${config.apiUrl}/goals`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const goals = await response.json();
      console.log('Raw API response:', goals); // Debug log
      const transformedGoals = goals.map(goal => this.transformGoalFromApi(goal));
      console.log('Transformed goals:', transformedGoals); // Debug log
      return transformedGoals;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  },

  async createGoal(goalData) {
    try {
      const response = await fetch(`${config.apiUrl}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.transformGoalToApi(goalData))
      });
      
      if (!response.ok) {
        throw new Error('Failed to create goal');
      }
      
      const goal = await response.json();
      return this.transformGoalFromApi(goal);
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  },

  async updateGoal(id, goalData) {
    try {
      const response = await fetch(`${config.apiUrl}/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.transformGoalToApi(goalData))
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          throw new Error('Goal not found');
        }
        if (errorData.details) {
          throw { response: { data: errorData } };
        }
        throw new Error(errorData.error || 'Failed to update goal');
      }
      
      const { message, goal } = await response.json();
      return { message, goal: this.transformGoalFromApi(goal) };
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  },

  async fetchGoalById(id) {
    try {
      const response = await fetch(`${config.apiUrl}/goals/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch goal');
      }
      const goal = await response.json();
      return this.transformGoalFromApi(goal);
    } catch (error) {
      console.error('Error fetching goal:', error);
      throw error;
    }
  },

  async deleteGoal(id) {
    try {
      const response = await fetch(`${config.apiUrl}/goals/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 404) {
          throw new Error('Goal not found');
        }
        throw new Error(data.error || 'Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  },

  // Transform API response to match our UI model
  transformGoalFromApi(apiGoal) {
    console.log('Transforming goal:', apiGoal); // Debug log
    return {
      id: apiGoal.id,
      name: apiGoal.name,
      icon: apiGoal.icon,
      goal_creation_year: apiGoal.goal_creation_year,
      target_year: apiGoal.target_year,
      projected_inflation: apiGoal.projected_inflation,
      initial_goal_value: apiGoal.initial_goal_value,
      projected_value: apiGoal.projected_value,
      created_at: new Date(apiGoal.created_at),
      updated_at: new Date(apiGoal.updated_at),
      progress: apiGoal.progress || 35, // Temporary hardcoded value
      assets: apiGoal.asset_mappings?.map(asset => ({
        id: asset.asset_id,
        name: asset.asset_name,
        allocation_percentage: asset.allocation_percentage
      })) || []
    };
  },

  // Transform UI model to API format
  transformGoalToApi(uiGoal) {
    return {
      name: uiGoal.name,
      icon: uiGoal.icon,
      initial_goal_value: parseFloat(uiGoal.initial_goal_value),
      target_year: parseInt(uiGoal.target_year),
      goal_creation_year: parseInt(uiGoal.goal_creation_year),
      projected_inflation: parseFloat(uiGoal.projected_inflation),
      asset_allocations: uiGoal.asset_allocations
    };
  },

  // Reverse mapping of icon to goal type
  getGoalTypeFromIcon(icon) {
    const reverseIconMap = {
      '👴': 'Retirement',
      '🏠': 'House',
      '🚗': 'Car',
      '🎓': 'Education',
      '🚨': 'Emergency',
      '✈️': 'Travel',
      '💍': 'Wedding',
      '🎯': 'Default'
    };
    return reverseIconMap[icon];
  },

  getIconForGoalType(type) {
    const iconMap = {
      'Retirement': '👴',
      'House': '🏠',
      'Car': '🚗',
      'Education': '🎓',
      'Emergency': '🚨',
      'Travel': '✈️',
      'Wedding': '💍',
      'Default': '🎯'
    };
    return iconMap[type] || iconMap.Default;
  }
}; 