import type { PropertyDetail } from '@/types';

export const SITE_NAME = 'K Pearl Agency';
export const SITE_TAGLINE = 'Marketing Real Estate, Creating Value';
export const SITE_URL = 'https://k-pearl-agency.vercel.app';

export function buildTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
}

export function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

const LISTING_TYPE_LABEL: Record<PropertyDetail['listingType'], string> = {
  rent: 'For rent',
  sale: 'For sale',
  short_let: 'Short let',
};

/** schema.org structured data for a property detail page. */
export function propertyJsonLd(property: PropertyDetail): Record<string, unknown> {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const image = property.coverImage
    ? absoluteUrl(`/assets/branding/k-pearl-logo.png`) // real media URL wired when photos exist
    : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    url,
    ...(image ? { image } : {}),
    description: property.description || undefined,
    identifier: property.referenceCode,
    category: LISTING_TYPE_LABEL[property.listingType],
    ...(property.areaName
      ? {
          areaServed: {
            '@type': 'Place',
            name: [property.areaName, property.areaCounty].filter(Boolean).join(', '),
          },
        }
      : {}),
    ...(property.price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: property.currency,
            ...(property.pricePeriod ? { unitText: property.pricePeriod } : {}),
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    provider: {
      '@type': 'RealEstateAgent',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
