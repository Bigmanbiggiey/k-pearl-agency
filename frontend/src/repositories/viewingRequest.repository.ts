import { fireLeadNotification } from './notifyLead';

import { normalizeSupabaseError, notImplemented } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { ViewingRequestStatus } from '@/types';

export interface ViewingRequestListFilters {
  status?: ViewingRequestStatus;
  propertyId?: string;
}

export interface CreateViewingRequestInput {
  propertyId: string;
  name: string;
  phone: string;
  email?: string | null;
  preferredDate?: string | null;
  preferredTime?: 'morning' | 'afternoon' | 'evening' | null;
  message?: string | null;
}

export const viewingRequestRepository = {
  async create(input: CreateViewingRequestInput): Promise<void> {
    const row = {
      property_id: input.propertyId,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      preferred_date: input.preferredDate || null,
      preferred_time: input.preferredTime || null,
      message: input.message || null,
    };
    const { error } = await supabase.from('viewing_requests').insert(row);
    if (error) throw normalizeSupabaseError(error);
    fireLeadNotification('viewing_requests', row);
  },

  // ─── staff — Phase 6 ────────────────────────────────────────────────────
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
