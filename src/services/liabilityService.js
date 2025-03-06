import { config } from '../config/config';

export const liabilityService = {
  async fetchLiabilities() {
    try {
      const response = await fetch(`${config.apiUrl}/liabilities`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch liabilities');
      }
      const liabilities = await response.json();
      return liabilities.map(liability => this.transformLiabilityFromApi(liability));
    } catch (error) {
      console.error('Error fetching liabilities:', error);
      throw error;
    }
  },

  async createLiability(liabilityData) {
    try {
      const response = await fetch(`${config.apiUrl}/liabilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.transformLiabilityToApi(liabilityData))
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create liability');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating liability:', error);
      throw error;
    }
  },

  async fetchLiabilityById(id) {
    try {
      const response = await fetch(`${config.apiUrl}/liabilities/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Liability not found');
        }
        throw new Error('Failed to fetch liability');
      }
      const liability = await response.json();
      return this.transformLiabilityFromApi(liability);
    } catch (error) {
      console.error('Error fetching liability:', error);
      throw error;
    }
  },

  async updateLiability(id, liabilityData) {
    try {
      const response = await fetch(`${config.apiUrl}/liabilities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.transformLiabilityToApi(liabilityData))
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Liability not found');
        }
        throw new Error(data.error || 'Failed to update liability');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating liability:', error);
      throw error;
    }
  },

  async deleteLiability(id) {
    try {
      const response = await fetch(`${config.apiUrl}/liabilities/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 404) {
          throw new Error('Liability not found');
        }
        throw new Error(data.error || 'Failed to delete liability');
      }
    } catch (error) {
      console.error('Error deleting liability:', error);
      throw error;
    }
  },

  // Transform API response to match our UI model
  transformLiabilityFromApi(apiLiability) {
    return {
      id: apiLiability.id,
      type: apiLiability.type,
      name: apiLiability.name,
      icon: this.getIconForLiabilityType(apiLiability.type),
      borrowedAmount: apiLiability.borrowed_principle,
      outstandingAmount: apiLiability.current_outstanding,
      interestRate: apiLiability.rate_of_interest,
      emi: apiLiability.emi,
      remainingTenure: apiLiability.remaining_tenure,
      totalTenure: apiLiability.total_tenure,
      startDate: apiLiability.start_date,
      comments: apiLiability.additional_comments,
      progress: Math.round(((apiLiability.borrowed_principle - apiLiability.current_outstanding) / apiLiability.borrowed_principle) * 100)
    };
  },

  // Transform UI model to API format
  transformLiabilityToApi(uiLiability) {
    return {
      type: uiLiability.type,
      name: uiLiability.name,
      borrowed_principle: parseFloat(uiLiability.borrowedAmount),
      current_outstanding: parseFloat(uiLiability.outstandingAmount),
      rate_of_interest: parseFloat(uiLiability.interestRate),
      emi: parseFloat(uiLiability.emi),
      remaining_tenure: parseInt(uiLiability.remainingTenure),
      total_tenure: parseInt(uiLiability.totalTenure),
      start_date: uiLiability.startDate,
      additional_comments: uiLiability.comments || ''
    };
  },

  getIconForLiabilityType(type) {
    const iconMap = {
      'Home Loan': '🏠',
      'Car Loan': '🚗',
      'Personal Loan': '💰',
      'Education Loan': '🎓',
      'Credit Card': '💳',
      'Business Loan': '💼',
      'Other': '📝'
    };
    return iconMap[type] || iconMap.Other;
  }
}; 