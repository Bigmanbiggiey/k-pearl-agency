import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { areaRepository, type Area } from '@/repositories';

export function useAreas() {
  return useQuery<Area[]>({
    queryKey: queryKeys.areas.active(),
    queryFn: () => areaRepository.listActive(),
    staleTime: 30 * 60 * 1000,
  });
}

/** Areas grouped by county, preserving the repository's sort order. */
export function groupAreasByCounty(areas: Area[]): Array<{ county: string; areas: Area[] }> {
  const map = new Map<string, Area[]>();
  for (const area of areas) {
    const bucket = map.get(area.county) ?? [];
    bucket.push(area);
    map.set(area.county, bucket);
  }
  return [...map.entries()].map(([county, list]) => ({ county, areas: list }));
}
