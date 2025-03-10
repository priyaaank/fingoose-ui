import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssetView from '../AssetView';
import { assetService } from '../../../../../services/assetService';

jest.mock('../../../../../services/assetService');

describe('AssetView', () => {
  const mockAsset = {
    id: 1,
    name: 'Test Asset',
    type: 'Mutual Fund',
    value: 10000,
    projectedRoi: 8,
    maturityYear: 2025,
    comments: 'Test comments'
  };

  beforeEach(() => {
    assetService.fetchAssetById.mockResolvedValue(mockAsset);
  });

  it('renders asset details correctly', async () => {
    render(
      <BrowserRouter>
        <AssetView />
      </BrowserRouter>
    );

    expect(await screen.findByText(mockAsset.name)).toBeInTheDocument();
    expect(screen.getByText(mockAsset.type)).toBeInTheDocument();
    expect(screen.getByText(`${mockAsset.projectedRoi}%`)).toBeInTheDocument();
  });
}); 