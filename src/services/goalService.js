import { config } from '../config/config';

export const goalService = {
  async fetchGoals() {
    try {
      const response = await fetch(`${config.apiUrl}/goals`);
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const goals = await response.json();
      return goals.map(goal => this.transformGoalFromApi(goal));
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
        throw new Error('Failed to update goal');
      }
      
      const result = await response.json();
      return result.message;
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
    return {
      id: apiGoal.id,
      title: apiGoal.name,
      icon: this.getIconForGoalType(apiGoal.type),
      target: apiGoal.target_amount,
      currentValue: apiGoal.current_value,
      projectedDate: apiGoal.target_date,
      targetYear: new Date(apiGoal.target_date).getFullYear().toString(),
      inflation: apiGoal.expected_inflation,
      progress: Math.round((apiGoal.current_value / apiGoal.target_amount) * 100)
    };
  },

  // Transform UI model to API format
  transformGoalToApi(uiGoal) {
    return {
      type: this.getGoalTypeFromIcon(uiGoal.icon) || 'Default',
      name: uiGoal.title,
      target_amount: parseFloat(uiGoal.target),
      current_value: parseFloat(uiGoal.currentValue),
      target_date: uiGoal.projectedDate,
      expected_inflation: parseFloat(uiGoal.inflation)
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