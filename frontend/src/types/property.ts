import type { ListingType, PricePeriod, PropertyStatus, PropertyType } from './domain';

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

/** Staff-facing DTOs — read the base tables, include staff-only columns. */

export interface StaffPropertyListItem {
  id: string;
  title: string;
  slug: string;
  referenceCode: string;
  status: PropertyStatus;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number | null;
  currency: string;
  pricePeriod: PricePeriod | null;
  areaId: string | null;
  areaName: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  featured: boolean;
  verified: boolean;
  agentId: string | null;
  mediaCount: number;
  updatedAt: string;
}

export interface StaffPropertyDetail extends StaffPropertyListItem {
  addressLine: string | null;
  latitude: number | null;
  longitude: number | null;
  ownerName: string | null;
  ownerPhone: string | null;
  ownerEmail: string | null;
  sizeValue: number | null;
  sizeUnit: string | null;
  description: string;
  amenities: string[];
  availableFrom: string | null;
  createdBy: string | null;
  publishedAt: string | null;
  createdAt: string;
  media: PropertyMedia[];
}

export interface StaffPropertyListResult {
  items: StaffPropertyListItem[];
  total: number;
  page: number;
  pageSize: number;
}
