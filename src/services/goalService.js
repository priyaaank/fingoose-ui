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

  // Transform API response to match our UI model
  transformGoalFromApi(apiGoal) {
    return {
      id: apiGoal.id,
      title: apiGoal.name,
      icon: this.getIconForGoalType(apiGoal.type),
      target: apiGoal.target_amount,
      currentValue: apiGoal.current_value,
      projectedDate: this.formatDate(apiGoal.target_date),
      targetYear: new Date(apiGoal.target_date).getFullYear().toString(),
      inflation: apiGoal.expected_inflation,
      progress: Math.round((apiGoal.current_value / apiGoal.target_amount) * 100)
    };
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
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  }
}; 