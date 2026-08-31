import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as RouterDom from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { HERO } from '@/content/home';
import HomePage from '@/pages/public/HomePage';
import { renderWithProviders } from '@/test/utils';
import type { PropertySummary } from '@/types';

const sample: PropertySummary = {
  id: 'p1',
  title: 'Featured Apartment',
  slug: 'featured-apartment',
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
  featured: true,
  verified: true,
  coverImage: null,
};

const navigate = vi.fn();
vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual<typeof RouterDom>();
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('@/hooks', () => ({
  useFeaturedProperties: () => ({ data: [sample], isLoading: false, isError: false }),
  useLatestProperties: () => ({ data: [], isLoading: false, isError: false }),
  useAreas: () => ({ data: [] }),
  groupAreasByCounty: () => [],
}));

describe('HomePage', () => {
  it('renders the hero heading and a featured property card', () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(HERO.heading);
    expect(screen.getByText('Featured Apartment')).toBeInTheDocument();
  });

  it('navigates to /properties with query params on hero search submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);

    await user.selectOptions(screen.getByLabelText('I want to'), 'rent');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(navigate).toHaveBeenCalledWith('/properties?listingType=rent');
  });
});
