import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PropertyCard } from '@/components/property/PropertyCard';
import { renderWithProviders } from '@/test/utils';
import type { PropertySummary } from '@/types';

const base: PropertySummary = {
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
};

describe('PropertyCard', () => {
  it('renders a rent price with its period', () => {
    renderWithProviders(<PropertyCard property={base} />);
    expect(screen.getByText('KES 85,000 /month')).toBeInTheDocument();
  });

  it('renders a sale price without a period', () => {
    renderWithProviders(
      <PropertyCard
        property={{ ...base, listingType: 'sale', pricePeriod: null, price: 42000000 }}
      />,
    );
    expect(screen.getByText('KES 42,000,000')).toBeInTheDocument();
  });

  it('shows "Price on request" when price is null', () => {
    renderWithProviders(<PropertyCard property={{ ...base, price: null }} />);
    expect(screen.getByText('Price on request')).toBeInTheDocument();
  });

  it('links to the detail page and shows the verified badge', () => {
    renderWithProviders(<PropertyCard property={base} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/properties/test-apartment');
    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('For rent')).toBeInTheDocument();
  });

  it('shows a placeholder (property type) when there is no cover image', () => {
    renderWithProviders(<PropertyCard property={base} />);
    expect(screen.getByText('Apartment')).toBeInTheDocument();
  });
});
