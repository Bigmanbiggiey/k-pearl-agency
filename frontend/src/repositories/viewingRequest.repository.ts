import { fireLeadNotification } from './notifyLead';

import { normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { Paginated, PreferredTime, StaffViewingRequest, ViewingRequestStatus } from '@/types';

export interface ViewingRequestListFilters {
  status?: ViewingRequestStatus;
  propertyId?: string;
  assignedTo?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateViewingRequestInput {
  propertyId: string;
  name: string;
  phone: string;
  email?: string | null;
  preferredDate?: string | null;
  preferredTime?: PreferredTime | null;
  message?: string | null;
}

interface ViewingJoinRow {
  id: string;
  property_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  status: string;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  properties: { title: string; reference_code: string } | null;
}

function map(row: ViewingJoinRow): StaffViewingRequest {
  return {
    id: row.id,
    propertyId: row.property_id,
    propertyTitle: row.properties?.title ?? null,
    propertyReference: row.properties?.reference_code ?? null,
    name: row.name,
    phone: row.phone,
    email: row.email,
    preferredDate: row.preferred_date,
    preferredTime: (row.preferred_time as PreferredTime | null) ?? null,
    message: row.message,
    status: row.status as ViewingRequestStatus,
    assignedTo: row.assigned_to,
    internalNotes: row.internal_notes,
    createdAt: row.created_at,
  };
}

const SELECT = '*, properties(title, reference_code)';

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

  // ─── staff (Phase 6) ───────────────────────────────────────────────────
  async list(filters: ViewingRequestListFilters): Promise<Paginated<StaffViewingRequest>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 25;
    const from = (page - 1) * pageSize;

    let query = supabase.from('viewing_requests').select(SELECT, { count: 'exact' });
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.propertyId) query = query.eq('property_id', filters.propertyId);
    if (filters.assignedTo) query = query.eq('assigned_to', filters.assignedTo);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);
    if (error) throw normalizeSupabaseError(error);

    return {
      items: ((data ?? []) as ViewingJoinRow[]).map(map),
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async getById(id: string): Promise<StaffViewingRequest | null> {
    const { data, error } = await supabase
      .from('viewing_requests')
      .select(SELECT)
      .eq('id', id)
      .maybeSingle();
    if (error) throw normalizeSupabaseError(error);
    return data ? map(data) : null;
  },

  async updateStatus(id: string, status: ViewingRequestStatus): Promise<void> {
    const { error } = await supabase.from('viewing_requests').update({ status }).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async assign(id: string, staffId: string | null): Promise<void> {
    const { error } = await supabase
      .from('viewing_requests')
      .update({ assigned_to: staffId })
      .eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async updateNotes(id: string, notes: string): Promise<void> {
    const { error } = await supabase
      .from('viewing_requests')
      .update({ internal_notes: notes || null })
      .eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },
};
