import React from 'react';
import './AssetMappings.css';

function AssetMappings({ 
  assets, 
  selectedAsset, 
  assetMappings, 
  onAssetSelect, 
  onAddAsset, 
  onAllocationChange, 
  onRemoveAsset 
}) {
  return (
    <div className="asset-mappings-section">
      <h2>Asset Allocations</h2>
      
      <div className="asset-selector">
        <select
          value={selectedAsset}
          onChange={(e) => onAssetSelect(e.target.value)}
          className="asset-dropdown"
        >
          <option value="">Select an asset</option>
          {assets
            .filter(asset => !assetMappings.some(m => m.asset_id === asset.id))
            .map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.name}
              </option>
            ))
          }
        </select>
        <button 
          type="button" 
          className="add-goal-button"
          onClick={onAddAsset}
          disabled={!selectedAsset}
        >
          Add Goal
        </button>
      </div>

      <div className="selected-assets">
        {assetMappings.map(mapping => (
          <div key={mapping.asset_id} className="allocation-row">
            <span className="allocation-name">{mapping.asset_name}</span>
            <div className="allocation-controls">
              <div className="allocation-input">
                <input
                  type="number"
                  value={mapping.allocation_percentage}
                  onChange={(e) => onAllocationChange(mapping.asset_id, e.target.value)}
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="percentage">%</span>
              </div>
              <button
                type="button"
                className="remove-button"
                onClick={() => onRemoveAsset(mapping.asset_id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetMappings; 