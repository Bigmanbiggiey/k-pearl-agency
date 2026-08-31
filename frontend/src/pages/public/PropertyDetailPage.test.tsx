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
    data: { phone: '+254180558075', whatsapp: '+254180558075', email: 'x@y.z' },
  }),
}));

// The lead forms/dialogs have their own tests; stub them here.
vi.mock('@/features/lead-forms', () => ({
  LeadDialog: ({ triggerLabel }: { triggerLabel: string }) => (
    <button type="button">{triggerLabel}</button>
  ),
  EnquiryForm: () => null,
  ViewingRequestForm: () => null,
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
    expect(
      screen.getByRole('button', { name: /enquire about this property/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /request a viewing/i })).toBeInTheDocument();
    const wa = screen.getByRole('link', { name: /message us on whatsapp/i });
    expect(wa.getAttribute('href')).toContain('KP-0007');
  });

  it('shows the 404 page when the property is not found', () => {
    hookState.data = null;
    renderDetail('missing');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
  });
});
