import { describe, expect, it } from 'vitest';

import { slugify } from './staffProperty.service';

import { propertyFormSchema, type PropertyFormValues } from '@/schemas';

const base: PropertyFormValues = {
  title: 'Sunny 2-bed in Kilimani',
  slug: 'sunny-2-bed-in-kilimani',
  listingType: 'rent',
  pricePeriod: 'month',
  propertyType: 'apartment',
  priceOnRequest: false,
  price: 85000,
  currency: 'KES',
  areaId: null,
  bedrooms: 2,
  bathrooms: 2,
  sizeValue: null,
  sizeUnit: null,
  description: '',
  amenities: [],
  availableFrom: '',
  addressLine: '',
  latitude: null,
  longitude: null,
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  status: 'draft',
  agentId: null,
  featured: false,
  verified: false,
};

describe('slugify', () => {
  it('lowercases, strips punctuation and collapses separators', () => {
    expect(slugify('Sunny 2-bed  in Kilimani!')).toBe('sunny-2-bed-in-kilimani');
  });

  it('falls back to "listing" when nothing usable remains', () => {
    expect(slugify('   ***   ')).toBe('listing');
  });
});

describe('propertyFormSchema', () => {
  it('accepts a valid rental', () => {
    expect(propertyFormSchema.safeParse(base).success).toBe(true);
  });

  it('rejects a sale that still carries a rate period', () => {
    const result = propertyFormSchema.safeParse({
      ...base,
      listingType: 'sale',
      pricePeriod: 'month',
    });
    expect(result.success).toBe(false);
  });

  it('requires a price unless marked price-on-request', () => {
    expect(propertyFormSchema.safeParse({ ...base, price: null }).success).toBe(false);
    expect(
      propertyFormSchema.safeParse({ ...base, price: null, priceOnRequest: true }).success,
    ).toBe(true);
  });

  it('requires size value and unit together', () => {
    expect(propertyFormSchema.safeParse({ ...base, sizeValue: 90, sizeUnit: null }).success).toBe(
      false,
    );
    expect(propertyFormSchema.safeParse({ ...base, sizeValue: 90, sizeUnit: 'sqm' }).success).toBe(
      true,
    );
  });
});
