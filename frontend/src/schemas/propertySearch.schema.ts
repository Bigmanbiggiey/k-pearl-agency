import { z } from 'zod';

import { listingType, propertyType } from './common';

export const propertySortSchema = z.enum(['newest', 'price_asc', 'price_desc']);
export type PropertySort = z.infer<typeof propertySortSchema>;

/** Field-by-field schema (exposes `.shape` for lenient URL parsing). */
export const propertySearchFields = z.object({
  listingType: listingType.optional(),
  propertyType: propertyType.optional(),
  areaId: z.uuid().optional(),
  county: z.string().trim().min(1).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  minBedrooms: z.number().int().nonnegative().optional(),
  verifiedOnly: z.boolean().optional(),
  keyword: z.string().trim().min(1).max(120).optional(),
  sort: propertySortSchema.default('newest'),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(48).default(12),
});

/** Public property-search filters. Mirrors docs/database.md v2.0 constraints. */
export const propertySearchSchema = propertySearchFields.refine(
  (v) => v.minPrice === undefined || v.maxPrice === undefined || v.minPrice <= v.maxPrice,
  { error: 'Minimum price must not exceed maximum price', path: ['minPrice'] },
);

export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
