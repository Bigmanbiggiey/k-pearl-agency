import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { propertyService } from '@/services';
import type { PropertyDetail, PropertySummary } from '@/types';

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
