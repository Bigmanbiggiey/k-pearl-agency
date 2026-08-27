import type { ListingType, PricePeriod, PropertyType } from './domain';

/** Application DTOs — what repositories return to services/UI (not DB row shapes). */

export interface PropertyMedia {
  id: string;
  propertyId: string;
  storagePath: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
}

export interface PropertySummary {
  id: string;
  title: string;
  slug: string;
  referenceCode: string;
  listingType: ListingType;
  pricePeriod: PricePeriod | null;
  propertyType: PropertyType;
  price: number | null;
  currency: string;
  areaId: string | null;
  areaName: string | null;
  areaCounty: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  featured: boolean;
  verified: boolean;
  coverImage: PropertyMedia | null;
}

export interface PropertyDetail extends PropertySummary {
  sizeValue: number | null;
  sizeUnit: string | null;
  description: string;
  amenities: string[];
  availableFrom: string | null;
  publishedAt: string | null;
  media: PropertyMedia[];
}

export interface PropertyListResult {
  items: PropertySummary[];
  total: number;
  page: number;
  pageSize: number;
}
