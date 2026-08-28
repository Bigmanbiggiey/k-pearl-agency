import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '@/features/auth';
import {
  profileRepository,
  staffRepository,
  type DashboardCounts,
  type Profile,
  type StaffPropertyFilters,
} from '@/repositories';
import type { PropertyFormValues } from '@/schemas';
import { staffPropertyService, type StaffPropertyContext } from '@/services';
import type {
  PropertyMedia,
  PropertyStatus,
  StaffPropertyDetail,
  StaffPropertyListResult,
} from '@/types';

const keys = {
  counts: ['staff', 'dashboard-counts'] as const,
  profiles: ['staff', 'profiles'] as const,
  properties: (filters: StaffPropertyFilters) => ['staff', 'properties', filters] as const,
  property: (id: string) => ['staff', 'property', id] as const,
  media: (propertyId: string) => ['staff', 'property-media', propertyId] as const,
};

export function useDashboardCounts() {
  return useQuery<DashboardCounts>({
    queryKey: keys.counts,
    queryFn: () => staffRepository.dashboardCounts(),
    staleTime: 30_000,
  });
}

export function useStaffProfiles() {
  return useQuery<Profile[]>({
    queryKey: keys.profiles,
    queryFn: () => profileRepository.listStaff(),
    staleTime: 5 * 60_000,
  });
}

export function useStaffProperties(filters: StaffPropertyFilters) {
  return useQuery<StaffPropertyListResult>({
    queryKey: keys.properties(filters),
    queryFn: () => staffPropertyService.list(filters),
    placeholderData: keepPreviousData,
  });
}

export function useStaffProperty(id: string | undefined) {
  return useQuery<StaffPropertyDetail | null>({
    queryKey: keys.property(id ?? ''),
    queryFn: () => staffPropertyService.getForStaff(id ?? ''),
    enabled: Boolean(id),
  });
}

export function usePropertyMedia(propertyId: string | undefined) {
  return useQuery<PropertyMedia[]>({
    queryKey: keys.media(propertyId ?? ''),
    queryFn: () => staffPropertyService.listMedia(propertyId ?? ''),
    enabled: Boolean(propertyId),
  });
}

/** Auth-derived context for create/update; throws if the profile hasn't loaded. */
function useStaffContext(): StaffPropertyContext {
  const { user, isAdmin } = useAuth();
  return { userId: user?.id ?? '', isAdmin };
}

export function useCreateProperty() {
  const qc = useQueryClient();
  const ctx = useStaffContext();
  return useMutation<string, Error, PropertyFormValues>({
    mutationFn: (values) => staffPropertyService.create(values, ctx),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['staff', 'properties'] });
      void qc.invalidateQueries({ queryKey: keys.counts });
    },
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  const ctx = useStaffContext();
  return useMutation<void, Error, PropertyFormValues>({
    mutationFn: (values) => staffPropertyService.update(id, values, ctx),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.property(id) });
      void qc.invalidateQueries({ queryKey: ['staff', 'properties'] });
      void qc.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

function invalidateProperty(qc: ReturnType<typeof useQueryClient>, id: string) {
  void qc.invalidateQueries({ queryKey: keys.property(id) });
  void qc.invalidateQueries({ queryKey: ['staff', 'properties'] });
  void qc.invalidateQueries({ queryKey: keys.counts });
  void qc.invalidateQueries({ queryKey: ['properties'] });
}

export function usePropertyLifecycle(id: string) {
  const qc = useQueryClient();
  const setStatus = useMutation<void, Error, PropertyStatus>({
    mutationFn: (status) => staffPropertyService.setStatus(id, status),
    onSuccess: () => invalidateProperty(qc, id),
  });
  const setFeatured = useMutation<void, Error, boolean>({
    mutationFn: (value) => staffPropertyService.setFeatured(id, value),
    onSuccess: () => invalidateProperty(qc, id),
  });
  const setVerified = useMutation<void, Error, boolean>({
    mutationFn: (value) => staffPropertyService.setVerified(id, value),
    onSuccess: () => invalidateProperty(qc, id),
  });
  return { setStatus, setFeatured, setVerified };
}

export function usePropertyMediaActions(propertyId: string) {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: keys.media(propertyId) });
    void qc.invalidateQueries({ queryKey: keys.property(propertyId) });
  };
  const upload = useMutation<PropertyMedia, Error, { file: File; altText: string }>({
    mutationFn: ({ file, altText }) => staffPropertyService.uploadMedia(propertyId, file, altText),
    onSuccess: invalidate,
  });
  const update = useMutation<void, Error, { id: string; altText?: string; isCover?: boolean }>({
    mutationFn: ({ id, ...patch }) => staffPropertyService.updateMedia(id, patch),
    onSuccess: invalidate,
  });
  const remove = useMutation<void, Error, string>({
    mutationFn: (id) => staffPropertyService.removeMedia(id),
    onSuccess: invalidate,
  });
  const reorder = useMutation<void, Error, string[]>({
    mutationFn: (orderedIds) => staffPropertyService.reorderMedia(propertyId, orderedIds),
    onSuccess: invalidate,
  });
  return { upload, update, remove, reorder };
}
