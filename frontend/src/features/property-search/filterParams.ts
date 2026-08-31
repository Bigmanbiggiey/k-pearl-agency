import {
  propertySearchFields,
  propertySearchSchema,
  type PropertySearchInput,
  type PropertySort,
} from '@/schemas';

/*
 * Property-search filters live in the URL query string so a filtered view is
 * shareable and bookmarkable (docs/coding-standards.md). This module is the
 * single place that maps between `URLSearchParams` and `PropertySearchInput`.
 */

const DEFAULT_SORT: PropertySort = 'newest';
const DEFAULT_PAGE = 1;

/** Filter keys the user can set (everything except `sort`, `page`, `pageSize`). */
export const FILTER_KEYS = [
  'listingType',
  'propertyType',
  'areaId',
  'county',
  'minPrice',
  'maxPrice',
  'minBedrooms',
  'verifiedOnly',
  'keyword',
] as const;

function toNumber(value: string | null): number | undefined {
  if (value == null || value.trim() === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function readRaw(params: URLSearchParams): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  const str = (k: string) => {
    const v = params.get(k);
    if (v != null && v.trim() !== '') raw[k] = v.trim();
  };
  str('listingType');
  str('propertyType');
  str('areaId');
  str('county');
  str('sort');

  const q = params.get('q');
  if (q != null && q.trim() !== '') raw.keyword = q.trim();

  const minPrice = toNumber(params.get('minPrice'));
  if (minPrice !== undefined) raw.minPrice = minPrice;
  const maxPrice = toNumber(params.get('maxPrice'));
  if (maxPrice !== undefined) raw.maxPrice = maxPrice;
  const minBedrooms = toNumber(params.get('minBedrooms'));
  if (minBedrooms !== undefined) raw.minBedrooms = minBedrooms;
  const page = toNumber(params.get('page'));
  if (page !== undefined) raw.page = page;

  const verified = params.get('verified');
  if (verified === '1' || verified === 'true') raw.verifiedOnly = true;

  return raw;
}

/** Parse (and validate) filters from the URL. Invalid values are dropped, not fatal. */
export function parseFiltersFromParams(params: URLSearchParams): PropertySearchInput {
  const raw = readRaw(params);

  // Validate each field on its own so one bad value doesn't discard the rest.
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    const fieldSchema = propertySearchFields.shape[key as keyof typeof propertySearchFields.shape];
    if (!fieldSchema) continue;
    const parsed = fieldSchema.safeParse(value);
    if (parsed.success) clean[key] = parsed.data;
  }

  let result = propertySearchSchema.safeParse(clean);
  if (!result.success) {
    // The only cross-field rule is minPrice <= maxPrice — drop both and retry.
    delete clean.minPrice;
    delete clean.maxPrice;
    result = propertySearchSchema.safeParse(clean);
  }
  return result.success ? result.data : propertySearchSchema.parse({});
}

/** Serialise filters back to a query string, omitting anything at its default. */
export function filtersToParams(filters: PropertySearchInput): URLSearchParams {
  const params = new URLSearchParams();
  const set = (key: string, value: string | number | undefined) => {
    if (value !== undefined && value !== '') params.set(key, String(value));
  };

  set('listingType', filters.listingType);
  set('propertyType', filters.propertyType);
  set('areaId', filters.areaId);
  set('county', filters.county);
  set('minPrice', filters.minPrice);
  set('maxPrice', filters.maxPrice);
  set('minBedrooms', filters.minBedrooms);
  set('q', filters.keyword);
  if (filters.verifiedOnly) params.set('verified', '1');
  if (filters.sort !== DEFAULT_SORT) params.set('sort', filters.sort);
  if (filters.page > DEFAULT_PAGE) params.set('page', String(filters.page));

  return params;
}

export function hasActiveFilters(filters: PropertySearchInput): boolean {
  return FILTER_KEYS.some((key) => filters[key] !== undefined && filters[key] !== '');
}

export function activeFilterCount(filters: PropertySearchInput): number {
  return FILTER_KEYS.filter((key) => filters[key] !== undefined && filters[key] !== '').length;
}

export { DEFAULT_PAGE, DEFAULT_SORT };
