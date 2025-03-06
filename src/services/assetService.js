import { config } from '../config/config';

export const assetService = {
  async fetchAssets() {
    try {
      const response = await fetch(`${config.apiUrl}/assets`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch assets');
      }
      const assets = await response.json();
      return assets.map(asset => this.transformAssetFromApi(asset));
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  async createAsset(assetData) {
    try {
      const response = await fetch(`${config.apiUrl}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.transformAssetToApi(assetData))
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create asset');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  async fetchAssetById(id) {
    try {
      const response = await fetch(`${config.apiUrl}/assets/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch asset');
      }
      const asset = await response.json();
      return this.transformAssetFromApi(asset);
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw error;
    }
  },

  async updateAsset(id, assetData) {
    try {
      const response = await fetch(`${config.apiUrl}/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.transformAssetToApi(assetData))
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update asset');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  },

  async deleteAsset(id) {
    try {
      const response = await fetch(`${config.apiUrl}/assets/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        if (response.status === 404) {
          throw new Error('Asset not found');
        }
        throw new Error(data.error || 'Failed to delete asset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },

  // Transform API response to match our UI model
  transformAssetFromApi(apiAsset) {
    return {
      id: apiAsset.id,
      type: apiAsset.type,
      name: apiAsset.name,
      icon: this.getIconForAssetType(apiAsset.type), // Using emoji instead of image icons
      value: apiAsset.current_value,
      projectedRoi: apiAsset.projected_roi,
      actualRoi: apiAsset.projected_roi, // Using projected as actual for now
      maturityDate: apiAsset.maturity_date,
      comments: apiAsset.additional_comments,
      goalMappings: apiAsset.goal_mappings?.map(mapping => ({
        goalId: mapping.goal_id,
        allocation: mapping.allocation_percentage
      })) || [],
      lastUpdated: new Date().toLocaleDateString() // Using current date as last updated
    };
  },

  // Transform UI model to API format
  transformAssetToApi(uiAsset) {
    return {
      type: uiAsset.type,
      name: uiAsset.name,
      current_value: parseFloat(uiAsset.value),
      projected_roi: parseFloat(uiAsset.projectedRoi),
      maturity_date: uiAsset.maturityDate || undefined,  // Send undefined if empty to omit field
      additional_comments: uiAsset.comments || '',
      goal_mappings: uiAsset.goalMappings?.map(mapping => ({
        goal_id: parseInt(mapping.goalId),
        allocation_percentage: parseFloat(mapping.allocation)
      })) || []
    };
  },

  getIconForAssetType(type) {
    const iconMap = {
      'Mutual Fund': '📈',
      'Fixed Deposit': '🏦',
      'Stocks': '📊',
      'Real Estate': '🏢',
      'Gold': '💎',
      'Cash': '💵',
      'Other': '💰'
    };
    return iconMap[type] || iconMap.Other;
  }
}; 