import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { filtersToParams, parseFiltersFromParams } from './filterParams';

import type { PropertySearchInput } from '@/schemas';

/**
 * Reads the property-search filters from the URL and returns setters that write
 * them back. Any filter change other than paging resets `page` to 1.
 */
export function usePropertyFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);

  const setFilters = useCallback(
    (next: PropertySearchInput) => {
      setSearchParams(filtersToParams(next));
    },
    [setSearchParams],
  );

  const setFilter = useCallback(
    <K extends keyof PropertySearchInput>(key: K, value: PropertySearchInput[K]) => {
      const next: PropertySearchInput = { ...filters, [key]: value };
      if (key !== 'page') next.page = 1;
      setSearchParams(filtersToParams(next));
    },
    [filters, setSearchParams],
  );

  const clearFilters = useCallback(() => {
    const cleared = parseFiltersFromParams(new URLSearchParams());
    setSearchParams(filtersToParams({ ...cleared, sort: filters.sort }));
  }, [filters.sort, setSearchParams]);

  return { filters, setFilter, setFilters, clearFilters };
}
