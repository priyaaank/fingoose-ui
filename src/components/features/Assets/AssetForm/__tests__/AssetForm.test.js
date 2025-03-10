import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssetForm from '../AssetForm';
import { assetService } from '../../../../../services/assetService';
import { goalService } from '../../../../../services/goalService';

// Mock the services
jest.mock('../../../../../services/assetService');
jest.mock('../../../../../services/goalService');

describe('AssetForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(
      <BrowserRouter>
        <AssetForm />
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/value/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/projected roi/i)).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const mockAsset = {
      name: 'Test Asset',
      type: 'Mutual Fund',
      value: 10000,
      projectedRoi: 8
    };

    assetService.createAsset.mockResolvedValueOnce({ id: 1, ...mockAsset });

    render(
      <BrowserRouter>
        <AssetForm />
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: mockAsset.name }
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: mockAsset.type }
    });
    // ... fill other fields

    // Submit the form
    fireEvent.click(screen.getByText(/create asset/i));

    await waitFor(() => {
      expect(assetService.createAsset).toHaveBeenCalledWith(
        expect.objectContaining(mockAsset)
      );
    });
  });
}); 