import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { areaRepository, profileRepository, siteSettingsRepository } from '@/repositories';
import type { AreaInput, Area } from '@/repositories';
import type { SiteSettings, StaffRole } from '@/types';

// ─── Site settings ───────────────────────────────────────────────────────

export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation<void, Error, Partial<SiteSettings>>({
    mutationFn: (patch) => siteSettingsRepository.update(patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.siteSettings.all }),
  });
}

// ─── Areas ───────────────────────────────────────────────────────────────

export function useAllAreas() {
  return useQuery<Area[]>({
    queryKey: ['staff', 'areas', 'all'],
    queryFn: () => areaRepository.listAll(),
  });
}

export function useAreaActions() {
  const qc = useQueryClient();
  const done = () => {
    void qc.invalidateQueries({ queryKey: ['staff', 'areas', 'all'] });
    void qc.invalidateQueries({ queryKey: queryKeys.areas.all });
  };
  return {
    create: useMutation<void, Error, AreaInput>({
      mutationFn: (input) => areaRepository.create(input),
      onSuccess: done,
    }),
    update: useMutation<void, Error, { id: string; input: AreaInput }>({
      mutationFn: ({ id, input }) => areaRepository.update(id, input),
      onSuccess: done,
    }),
    setActive: useMutation<void, Error, { id: string; isActive: boolean }>({
      mutationFn: ({ id, isActive }) => areaRepository.setActive(id, isActive),
      onSuccess: done,
    }),
  };
}

// ─── Team / profiles ─────────────────────────────────────────────────────

export function useTeamActions() {
  const qc = useQueryClient();
  const done = () => qc.invalidateQueries({ queryKey: ['staff', 'profiles'] });
  return {
    updateProfile: useMutation<
      void,
      Error,
      { id: string; fullName: string; phone: string; whatsapp: string }
    >({
      mutationFn: ({ id, ...patch }) => profileRepository.update(id, patch),
      onSuccess: done,
    }),
    setRole: useMutation<void, Error, { id: string; role: StaffRole }>({
      mutationFn: ({ id, role }) => profileRepository.setRole(id, role),
      onSuccess: done,
    }),
    invite: useMutation<void, Error, { email: string; fullName: string; role: StaffRole }>({
      mutationFn: (input) => profileRepository.invite(input),
      onSuccess: done,
    }),
  };
}
