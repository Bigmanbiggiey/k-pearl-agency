import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { siteSettingsRepository } from '@/repositories';
import type { SiteSettings } from '@/types';

export function useSiteSettings() {
  return useQuery<SiteSettings>({
    queryKey: queryKeys.siteSettings.all,
    queryFn: () => siteSettingsRepository.get(),
    staleTime: 30 * 60 * 1000,
  });
}
