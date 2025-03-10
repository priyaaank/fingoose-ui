import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssetTable from '../AssetTable';
import { userProfileService } from '../../../../../services/userProfileService';

// Mock the userProfileService
jest.mock('../../../../../services/userProfileService', () => ({
  userProfileService: {
    formatCurrency: jest.fn(val => `$${val}`)
  }
}));

describe('AssetTable', () => {
  const mockAssets = [
    {
      id: 1,
      icon: '💰',
      type: 'Mutual Fund',
      name: 'Test Fund',
      value: 10000,
      projectedRoi: 8,
      maturityDate: '2025-01',
      lastUpdated: '2024-01-20'
    }
  ];

  it('renders asset table with data', () => {
    render(
      <BrowserRouter>
        <AssetTable assets={mockAssets} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Fund')).toBeInTheDocument();
    expect(screen.getByText('Mutual Fund')).toBeInTheDocument();
    expect(screen.getByText('8%')).toBeInTheDocument();
  });

  it('navigates to asset details on button click', () => {
    render(
      <BrowserRouter>
        <AssetTable assets={mockAssets} />
      </BrowserRouter>
    );

    const detailsButton = screen.getByText('Details');
    fireEvent.click(detailsButton);
    // Add navigation test assertions
  });
}); 