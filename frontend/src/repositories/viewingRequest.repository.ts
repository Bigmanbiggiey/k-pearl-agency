import { notImplemented } from '@/lib/errors';
import type { ViewingRequestStatus } from '@/types';

/* Data access for viewing requests (capture-only, ADR-006). Phase 2. */

export interface ViewingRequestListFilters {
  status?: ViewingRequestStatus;
  propertyId?: string;
}

export const viewingRequestRepository = {
  create(_input: unknown): Promise<never> {
    return notImplemented('viewingRequestRepository.create');
  },
  list(_filters: ViewingRequestListFilters): Promise<never> {
    return notImplemented('viewingRequestRepository.list');
  },
  updateStatus(_id: string, _status: ViewingRequestStatus): Promise<never> {
    return notImplemented('viewingRequestRepository.updateStatus');
  },
  updateNotes(_id: string, _notes: string): Promise<never> {
    return notImplemented('viewingRequestRepository.updateNotes');
  },
};
