import { AppError } from '@/lib/errors';
import { propertyRepository } from '@/repositories/property.repository';
import { propertySearchSchema } from '@/schemas';
import type { PropertyDetail, PropertyListResult, PropertySummary } from '@/types';

/*
 * Property business rules and validation (docs/api-design.md). Components call
 * this via hooks; never the repository directly.
 */

const FEATURED_DEFAULT = 6;
const FEATURED_MAX = 24;

export const propertyService = {
  /** Validate public search filters, then query. */
  search(input: unknown): Promise<PropertyListResult> {
    const parsed = propertySearchSchema.safeParse(input ?? {});
    if (!parsed.success) {
      throw new AppError('VALIDATION_ERROR', 'Invalid property search filters.', {
        cause: parsed.error,
      });
    }
    return propertyRepository.listPublished(parsed.data);
  },

  getBySlug(slug: string): Promise<PropertyDetail | null> {
    const trimmed = slug.trim();
    if (!trimmed) {
      throw new AppError('VALIDATION_ERROR', 'A property slug is required.');
    }
    return propertyRepository.getBySlug(trimmed);
  },

  getFeatured(limit: number = FEATURED_DEFAULT): Promise<PropertySummary[]> {
    const safe =
      Number.isFinite(limit) && limit > 0
        ? Math.min(Math.trunc(limit), FEATURED_MAX)
        : FEATURED_DEFAULT;
    return propertyRepository.getFeatured(safe);
  },
};
