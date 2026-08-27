import { notImplemented } from '@/lib/errors';

/*
 * Business rules and validation for properties (docs/api-design.md). Phase 2:
 * validate input with Zod, enforce domain rules, then delegate to
 * `propertyRepository`. Components never call repositories directly.
 */
export const propertyService = {
  search(_filters: unknown, _pagination: unknown): Promise<never> {
    return notImplemented('propertyService.search');
  },
  getBySlug(_slug: string): Promise<never> {
    return notImplemented('propertyService.getBySlug');
  },
  getFeatured(_limit: number): Promise<never> {
    return notImplemented('propertyService.getFeatured');
  },
};
