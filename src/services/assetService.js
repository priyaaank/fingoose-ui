import { config } from '../config/config';

class AssetService {
  async createAsset(assetData) {
    const response = await fetch(`${config.apiUrl}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: assetData.name,
        icon: assetData.icon,
        current_value: parseFloat(assetData.value),
        projected_roi: parseFloat(assetData.projectedRoi),
        maturity_year: parseInt(assetData.maturityYear),
        additional_comments: assetData.comments,
        goal_mappings: assetData.goalMappings || []
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create asset');
    }

    return await response.json();
  }

  async fetchAssets() {
    const response = await fetch(`${config.apiUrl}/assets`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    const assets = await response.json();
    return assets.map(asset => this.transformAssetResponse(asset));
  }

  async fetchAssetById(id) {
    const response = await fetch(`${config.apiUrl}/assets/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch asset');
    }

    const asset = await response.json();
    return this.transformAssetResponse(asset);
  }

  async updateAsset(id, assetData) {
    const response = await fetch(`${config.apiUrl}/assets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: assetData.name,
        icon: assetData.icon,
        current_value: parseFloat(assetData.value),
        projected_roi: parseFloat(assetData.projectedRoi),
        maturity_year: parseInt(assetData.maturityYear),
        additional_comments: assetData.comments,
        goal_mappings: assetData.goalMappings || []
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update asset');
    }

    return await response.json();
  }

  async deleteAsset(id) {
    const response = await fetch(`${config.apiUrl}/assets/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete asset');
    }
  }

  // Helper method to transform API response to component format
  transformAssetResponse(asset) {
    return {
      id: asset.id,
      name: asset.name,
      icon: asset.icon,
      value: asset.current_value,
      projectedRoi: asset.projected_roi,
      maturityYear: asset.maturity_year,
      comments: asset.additional_comments,
      goalMappings: asset.goal_mappings,
      createdAt: asset.created_at,
      updatedAt: asset.updated_at
    };
  }

  handleError(error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('An error occurred while processing your request');
  }
}

export const assetService = new AssetService(); 