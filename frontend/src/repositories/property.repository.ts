import { notImplemented } from '@/lib/errors';
import type { ListingType, PropertyStatus } from '@/types';

/*
 * Data access for properties. Phase 2 wires these to Supabase:
 *   import { supabase } from '@/lib/supabase';
 * Repositories own the queries, map rows to DTOs, and normalise errors
 * (docs/api-design.md). No business rules here — those live in the service.
 */

export interface PropertyListFilters {
  listingType?: ListingType;
  propertyType?: string;
  county?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  verifiedOnly?: boolean;
  keyword?: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
}

export const propertyRepository = {
  listPublished(_filters: PropertyListFilters, _pagination: Pagination): Promise<never> {
    return notImplemented('propertyRepository.listPublished');
  },
  getBySlug(_slug: string): Promise<never> {
    return notImplemented('propertyRepository.getBySlug');
  },
  getFeatured(_limit: number): Promise<never> {
    return notImplemented('propertyRepository.getFeatured');
  },
  create(_input: unknown): Promise<never> {
    return notImplemented('propertyRepository.create');
  },
  update(_id: string, _input: unknown): Promise<never> {
    return notImplemented('propertyRepository.update');
  },
  setStatus(_id: string, _status: PropertyStatus): Promise<never> {
    return notImplemented('propertyRepository.setStatus');
  },
  publish(_id: string): Promise<never> {
    return notImplemented('propertyRepository.publish');
  },
  unpublish(_id: string): Promise<never> {
    return notImplemented('propertyRepository.unpublish');
  },
  markUnavailable(_id: string): Promise<never> {
    return notImplemented('propertyRepository.markUnavailable');
  },
  markLetOrSold(_id: string): Promise<never> {
    return notImplemented('propertyRepository.markLetOrSold');
  },
  archive(_id: string): Promise<never> {
    return notImplemented('propertyRepository.archive');
  },
  setFeatured(_id: string, _featured: boolean): Promise<never> {
    return notImplemented('propertyRepository.setFeatured');
  },
  setVerified(_id: string, _verified: boolean): Promise<never> {
    return notImplemented('propertyRepository.setVerified');
  },
  listMedia(_propertyId: string): Promise<never> {
    return notImplemented('propertyRepository.listMedia');
  },
  addMedia(_input: unknown): Promise<never> {
    return notImplemented('propertyRepository.addMedia');
  },
  removeMedia(_id: string): Promise<never> {
    return notImplemented('propertyRepository.removeMedia');
  },
  reorderMedia(_propertyId: string, _orderedIds: string[]): Promise<never> {
    return notImplemented('propertyRepository.reorderMedia');
  },
};
