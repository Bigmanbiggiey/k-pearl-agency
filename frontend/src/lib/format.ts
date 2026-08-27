import type { ListingType, PricePeriod, PropertyType } from '@/types';

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
