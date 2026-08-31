import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import PropertiesPage from '@/pages/public/PropertiesPage';
import { renderWithProviders } from '@/test/utils';
import type { PropertyListResult, PropertySummary } from '@/types';

function item(over: Partial<PropertySummary> = {}): PropertySummary {
  return {
    id: 'p1',
    title: 'Test Apartment',
    slug: 'test-apartment',
    referenceCode: 'KP-0001',
    listingType: 'rent',
    pricePeriod: 'month',
    propertyType: 'apartment',
    price: 85000,
    currency: 'KES',
    areaId: 'a1',
    areaName: 'Kilimani',
    areaCounty: 'Nairobi',
    bedrooms: 2,
    bathrooms: 2,
    featured: false,
    verified: true,
    coverImage: null,
    ...over,
  };
}

interface PropertiesHookState {
  data: PropertyListResult | undefined;
  isLoading: boolean;
  isError: boolean;
}

const state: { current: PropertiesHookState } = {
  current: {
    data: { items: [item()], total: 1, page: 1, pageSize: 12 },
    isLoading: false,
    isError: false,
  },
};

vi.mock('@/hooks', () => ({
  useProperties: () => state.current,
  useAreas: () => ({ data: [] }),
  groupAreasByCounty: () => [],
  useDebouncedCallback: (fn: (...a: unknown[]) => void) => fn,
}));

function LocationProbe() {
  return <output data-testid="loc">{useLocation().search}</output>;
}

function renderPage(route = '/properties') {
  return renderWithProviders(
    <>
      <PropertiesPage />
      <LocationProbe />
    </>,
    { route },
  );
}

describe('PropertiesPage', () => {
  it('renders the result count and property cards', () => {
    state.current = {
      data: { items: [item()], total: 1, page: 1, pageSize: 12 },
      isLoading: false,
      isError: false,
    };
    renderPage();
    expect(screen.getByText('1 property')).toBeInTheDocument();
    expect(screen.getByText('Test Apartment')).toBeInTheDocument();
  });

  it('writes a filter to the URL from the mobile filters sheet', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /filters/i }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Rent' }));

    expect(screen.getByTestId('loc')).toHaveTextContent('listingType=rent');
  });

  it('shows the empty state with a Clear filters action', () => {
    state.current = {
      data: { items: [], total: 0, page: 1, pageSize: 12 },
      isLoading: false,
      isError: false,
    };
    renderPage('/properties?listingType=sale');
    expect(screen.getByText(/no properties match these filters/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });
});
