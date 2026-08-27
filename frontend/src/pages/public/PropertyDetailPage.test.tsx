import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import PropertyDetailPage from '@/pages/public/PropertyDetailPage';
import { renderWithProviders } from '@/test/utils';
import type { PropertyDetail } from '@/types';

const property: PropertyDetail = {
  id: 'p1',
  title: 'Kilimani Apartment',
  slug: 'kilimani-apartment',
  referenceCode: 'KP-0007',
  listingType: 'rent',
  pricePeriod: 'month',
  propertyType: 'apartment',
  price: 90000,
  currency: 'KES',
  areaId: 'a1',
  areaName: 'Kilimani',
  areaCounty: 'Nairobi',
  bedrooms: 2,
  bathrooms: 2,
  featured: true,
  verified: true,
  coverImage: null,
  sizeValue: 95,
  sizeUnit: 'sqm',
  description: 'A bright apartment.',
  amenities: ['parking', 'lift'],
  availableFrom: null,
  publishedAt: '2026-08-01T00:00:00Z',
  media: [],
};

const hookState = { data: property as PropertyDetail | null, isLoading: false, isError: false };

vi.mock('@/hooks', () => ({
  useProperty: () => hookState,
  useSiteSettings: () => ({
    data: { phone: '+254704061324', whatsapp: '+254704061324', email: 'x@y.z' },
  }),
}));

function renderDetail(slug: string) {
  return renderWithProviders(
    <Routes>
      <Route path="/properties/:slug" element={<PropertyDetailPage />} />
    </Routes>,
    { route: `/properties/${slug}` },
  );
}

describe('PropertyDetailPage', () => {
  it('renders the property with a WhatsApp link containing the reference code', () => {
    hookState.data = property;
    renderDetail('kilimani-apartment');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kilimani Apartment');
    const wa = screen.getByRole('link', { name: /enquire on whatsapp/i });
    expect(wa.getAttribute('href')).toContain('KP-0007');
  });

  it('shows the 404 page when the property is not found', () => {
    hookState.data = null;
    renderDetail('missing');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
  });
});
