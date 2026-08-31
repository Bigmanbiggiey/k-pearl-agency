import type { ListingType, PricePeriod, PropertyStatus, PropertyType } from '@/types';

const LISTING_TYPE_LABEL: Record<ListingType, string> = {
  rent: 'For rent',
  sale: 'For sale',
  short_let: 'Short let',
};

const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  apartment: 'Apartment',
  house: 'House',
  townhouse: 'Townhouse',
  maisonette: 'Maisonette',
  studio: 'Studio',
  bedsitter: 'Bedsitter',
  office: 'Office',
  shop: 'Shop / retail',
  land: 'Land',
};

const PERIOD_SUFFIX: Record<PricePeriod, string> = {
  month: '/month',
  night: '/night',
  week: '/week',
};

export function listingTypeLabel(type: ListingType): string {
  return LISTING_TYPE_LABEL[type];
}

export function propertyTypeLabel(type: PropertyType): string {
  return PROPERTY_TYPE_LABEL[type];
}

/** Ordered option lists for filter controls. */
export const LISTING_TYPES: readonly ListingType[] = ['rent', 'sale', 'short_let'];

export const PROPERTY_TYPES: readonly PropertyType[] = [
  'apartment',
  'house',
  'townhouse',
  'maisonette',
  'studio',
  'bedsitter',
  'office',
  'shop',
  'land',
];

const currencyFormatter = new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 });

export function formatPrice(
  price: number | null,
  currency: string,
  period: PricePeriod | null,
): string {
  if (price == null) return 'Price on request';
  const amount = `${currency} ${currencyFormatter.format(price)}`;
  return period ? `${amount} ${PERIOD_SUFFIX[period]}` : amount;
}

export function amenityLabel(slug: string): string {
  return slug
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bDsq\b/, 'DSQ')
    .replace(/\bCctv\b/, 'CCTV')
    .replace(/\b24h\b/, '24h');
}

/** Amenity vocabulary (docs/database.md v2.0 — owner trims post-launch). */
export const AMENITIES: readonly string[] = [
  'parking',
  'borehole',
  'mains_water',
  'backup_power',
  'solar_water',
  'lift',
  'gym',
  'swimming_pool',
  'balcony',
  'furnished',
  'air_conditioning',
  'gated_community',
  'cctv',
  '24h_security',
  'pet_friendly',
  'garden',
  'dsq',
  'ensuite',
  'fibre_internet',
  'wheelchair_access',
];

const PROPERTY_STATUS_LABEL: Record<PropertyStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  unavailable: 'Unavailable',
  let_or_sold: 'Let / sold',
  archived: 'Archived',
};

export const PROPERTY_STATUSES: readonly PropertyStatus[] = [
  'draft',
  'published',
  'unavailable',
  'let_or_sold',
  'archived',
];

export function statusLabel(status: PropertyStatus): string {
  return PROPERTY_STATUS_LABEL[status];
}

export const PRICE_PERIODS: readonly PricePeriod[] = ['month', 'night', 'week'];

export const SIZE_UNITS = ['sqm', 'sqft', 'acre', 'ha'] as const;
export type SizeUnit = (typeof SIZE_UNITS)[number];
