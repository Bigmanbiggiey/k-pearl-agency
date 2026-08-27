import { describe, expect, it } from 'vitest';

import {
  activeFilterCount,
  filtersToParams,
  hasActiveFilters,
  parseFiltersFromParams,
} from './filterParams';

describe('filterParams', () => {
  it('parses defaults from an empty query string', () => {
    const f = parseFiltersFromParams(new URLSearchParams());
    expect(f.sort).toBe('newest');
    expect(f.page).toBe(1);
    expect(f.pageSize).toBe(12);
    expect(hasActiveFilters(f)).toBe(false);
  });

  it('round-trips filters through the URL, omitting defaults', () => {
    const params = new URLSearchParams(
      'listingType=rent&areaId=11111111-1111-1111-1111-111111111111&minBedrooms=2&verified=1&q=kilimani&sort=price_asc&page=3',
    );
    const filters = parseFiltersFromParams(params);
    expect(filters.listingType).toBe('rent');
    expect(filters.minBedrooms).toBe(2);
    expect(filters.verifiedOnly).toBe(true);
    expect(filters.keyword).toBe('kilimani');
    expect(filters.sort).toBe('price_asc');
    expect(filters.page).toBe(3);

    const back = filtersToParams(filters);
    expect(back.get('listingType')).toBe('rent');
    expect(back.get('q')).toBe('kilimani');
    expect(back.get('verified')).toBe('1');
    expect(back.get('sort')).toBe('price_asc');
    expect(back.get('page')).toBe('3');
    expect(back.has('pageSize')).toBe(false);
  });

  it('drops invalid values instead of failing the whole parse', () => {
    const f = parseFiltersFromParams(
      new URLSearchParams('listingType=banana&minPrice=abc&minBedrooms=2'),
    );
    expect(f.listingType).toBeUndefined();
    expect(f.minPrice).toBeUndefined();
    expect(f.minBedrooms).toBe(2);
  });

  it('drops price bounds when min exceeds max (schema refine)', () => {
    const f = parseFiltersFromParams(new URLSearchParams('minPrice=900000&maxPrice=100000'));
    expect(f.minPrice).toBeUndefined();
    expect(f.maxPrice).toBeUndefined();
  });

  it('counts active filters, ignoring sort/page/pageSize', () => {
    const f = parseFiltersFromParams(
      new URLSearchParams('listingType=sale&minBedrooms=3&sort=price_desc&page=2'),
    );
    expect(activeFilterCount(f)).toBe(2);
  });
});
