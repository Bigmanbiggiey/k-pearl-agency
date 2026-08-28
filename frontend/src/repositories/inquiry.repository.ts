import { fireLeadNotification } from './notifyLead';

import { normalizeSupabaseError, notImplemented } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { InquiryStatus, InquiryType, PreferredContactMethod } from '@/types';

export interface InquiryListFilters {
  type?: InquiryType;
  status?: InquiryStatus;
  assignedTo?: string;
  propertyId?: string;
}

export interface CreateInquiryInput {
  type: InquiryType;
  propertyId?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  preferredContactMethod: PreferredContactMethod;
}

export const inquiryRepository = {
  /** Public insert. Anon has no SELECT on the row, so nothing is returned. */
  async create(input: CreateInquiryInput): Promise<void> {
    const row = {
      type: input.type,
      property_id: input.propertyId ?? null,
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      message: input.message,
      preferred_contact_method: input.preferredContactMethod,
    };
    const { error } = await supabase.from('inquiries').insert(row);
    if (error) throw normalizeSupabaseError(error);
    fireLeadNotification('inquiries', row);
  },

  // ─── staff — Phase 6 ────────────────────────────────────────────────────
  list(_filters: InquiryListFilters): Promise<never> {
    return notImplemented('inquiryRepository.list');
  },
  getById(_id: string): Promise<never> {
    return notImplemented('inquiryRepository.getById');
  },
  updateStatus(_id: string, _status: InquiryStatus): Promise<never> {
    return notImplemented('inquiryRepository.updateStatus');
  },
  assign(_id: string, _staffId: string | null): Promise<never> {
    return notImplemented('inquiryRepository.assign');
  },
  updateNotes(_id: string, _notes: string): Promise<never> {
    return notImplemented('inquiryRepository.updateNotes');
  },
};
