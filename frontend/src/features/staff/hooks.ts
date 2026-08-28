import { useQuery } from '@tanstack/react-query';

import {
  profileRepository,
  staffRepository,
  type DashboardCounts,
  type Profile,
} from '@/repositories';

export function useDashboardCounts() {
  return useQuery<DashboardCounts>({
    queryKey: ['staff', 'dashboard-counts'],
    queryFn: () => staffRepository.dashboardCounts(),
    staleTime: 30_000,
  });
}

export function useStaffProfiles() {
  return useQuery<Profile[]>({
    queryKey: ['staff', 'profiles'],
    queryFn: () => profileRepository.listStaff(),
    staleTime: 5 * 60_000,
  });
}
