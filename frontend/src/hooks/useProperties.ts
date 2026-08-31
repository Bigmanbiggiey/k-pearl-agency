import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import type { PropertySearchInput } from '@/schemas';
import { propertyService } from '@/services';
import type { PropertyDetail, PropertyListResult, PropertySummary } from '@/types';

/** Paginated, filtered catalogue query (Phase 4). */
export function useProperties(filters: PropertySearchInput) {
  return useQuery<PropertyListResult>({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => propertyService.search(filters),
    placeholderData: keepPreviousData,
  });
}

export function useFeaturedProperties(limit = 6) {
  return useQuery<PropertySummary[]>({
    queryKey: queryKeys.properties.featured(limit),
    queryFn: () => propertyService.getFeatured(limit),
  });
}

export function useLatestProperties(limit = 6) {
  return useQuery<PropertySummary[]>({
    queryKey: queryKeys.properties.latest(limit),
    queryFn: async () => {
      const result = await propertyService.search({ sort: 'newest', pageSize: limit });
      return result.items;
    },
  });
}

export function useProperty(slug: string | undefined) {
  return useQuery<PropertyDetail | null>({
    queryKey: queryKeys.properties.detail(slug ?? ''),
    queryFn: () => propertyService.getBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });
}
