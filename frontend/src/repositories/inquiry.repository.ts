import { fireLeadNotification } from './notifyLead';

import { normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type {
  InquiryStatus,
  InquiryType,
  Paginated,
  PreferredContactMethod,
  StaffInquiry,
} from '@/types';

export interface InquiryListFilters {
  type?: InquiryType;
  status?: InquiryStatus;
  assignedTo?: string;
  propertyId?: string;
  page?: number;
  pageSize?: number;
}

interface InquiryJoinRow {
  id: string;
  type: string;
  property_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  preferred_contact_method: string;
  status: string;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  properties: { title: string; reference_code: string } | null;
}

function mapInquiry(row: InquiryJoinRow): StaffInquiry {
  return {
    id: row.id,
    type: row.type as InquiryType,
    propertyId: row.property_id,
    propertyTitle: row.properties?.title ?? null,
    propertyReference: row.properties?.reference_code ?? null,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    preferredContactMethod: row.preferred_contact_method as PreferredContactMethod,
    status: row.status as InquiryStatus,
    assignedTo: row.assigned_to,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
  };
}

const SELECT = '*, properties(title, reference_code)';

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

  // ─── staff (Phase 6) ───────────────────────────────────────────────────
  async list(filters: InquiryListFilters): Promise<Paginated<StaffInquiry>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 25;
    const from = (page - 1) * pageSize;

    let query = supabase.from('inquiries').select(SELECT, { count: 'exact' });
    if (filters.type) query = query.eq('type', filters.type);
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.assignedTo) query = query.eq('assigned_to', filters.assignedTo);
    if (filters.propertyId) query = query.eq('property_id', filters.propertyId);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);
    if (error) throw normalizeSupabaseError(error);

    return {
      items: ((data ?? []) as InquiryJoinRow[]).map(mapInquiry),
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async getById(id: string): Promise<StaffInquiry | null> {
    const { data, error } = await supabase
      .from('inquiries')
      .select(SELECT)
      .eq('id', id)
      .maybeSingle();
    if (error) throw normalizeSupabaseError(error);
    return data ? mapInquiry(data) : null;
  },

  async updateStatus(id: string, status: InquiryStatus): Promise<void> {
    const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async assign(id: string, staffId: string | null): Promise<void> {
    const { error } = await supabase
      .from('inquiries')
      .update({ assigned_to: staffId })
      .eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async updateNotes(id: string, notes: string): Promise<void> {
    const { error } = await supabase
      .from('inquiries')
      .update({ internal_notes: notes || null })
      .eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },
};
