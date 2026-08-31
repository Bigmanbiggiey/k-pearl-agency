import { fireLeadNotification } from './notifyLead';

import { normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type {
  ListingType,
  Paginated,
  PropertySubmissionStatus,
  PropertyType,
  StaffPropertySubmission,
} from '@/types';

export interface PropertySubmissionListFilters {
  status?: PropertySubmissionStatus;
  page?: number;
  pageSize?: number;
}

interface SubmissionJoinRow {
  id: string;
  submitter_name: string;
  submitter_phone: string;
  submitter_email: string | null;
  submitter_notes: string | null;
  proposed_title: string;
  proposed_listing_type: string;
  proposed_property_type: string;
  proposed_area_id: string | null;
  proposed_price: number | null;
  proposed_bedrooms: number | null;
  proposed_bathrooms: number | null;
  proposed_description: string | null;
  status: string;
  reviewed_by: string | null;
  converted_property_id: string | null;
  created_at: string;
  areas: { name: string } | null;
}

function mapSubmission(row: SubmissionJoinRow): StaffPropertySubmission {
  return {
    id: row.id,
    submitterName: row.submitter_name,
    submitterPhone: row.submitter_phone,
    submitterEmail: row.submitter_email,
    submitterNotes: row.submitter_notes,
    proposedTitle: row.proposed_title,
    proposedListingType: row.proposed_listing_type as ListingType,
    proposedPropertyType: row.proposed_property_type as PropertyType,
    proposedAreaId: row.proposed_area_id,
    proposedAreaName: row.areas?.name ?? null,
    proposedPrice: row.proposed_price,
    proposedBedrooms: row.proposed_bedrooms,
    proposedBathrooms: row.proposed_bathrooms,
    proposedDescription: row.proposed_description,
    status: row.status as PropertySubmissionStatus,
    reviewedBy: row.reviewed_by,
    convertedPropertyId: row.converted_property_id,
    createdAt: row.created_at,
  };
}

const SELECT = '*, areas(name)';

export interface CreatePropertySubmissionInput {
  submitterName: string;
  submitterPhone: string;
  submitterEmail?: string | null;
  submitterNotes?: string | null;
  proposedTitle: string;
  proposedListingType: ListingType;
  proposedPropertyType: PropertyType;
  proposedAreaId?: string | null;
  proposedPrice?: number | null;
  proposedBedrooms?: number | null;
  proposedBathrooms?: number | null;
  proposedDescription?: string | null;
}

export const propertySubmissionRepository = {
  /** Public "list your property" submission (ADR-009). Never auto-published. */
  async create(input: CreatePropertySubmissionInput): Promise<void> {
    const row = {
      submitter_name: input.submitterName,
      submitter_phone: input.submitterPhone,
      submitter_email: input.submitterEmail || null,
      submitter_notes: input.submitterNotes || null,
      proposed_title: input.proposedTitle,
      proposed_listing_type: input.proposedListingType,
      proposed_property_type: input.proposedPropertyType,
      proposed_area_id: input.proposedAreaId || null,
      proposed_price: input.proposedPrice ?? null,
      proposed_bedrooms: input.proposedBedrooms ?? null,
      proposed_bathrooms: input.proposedBathrooms ?? null,
      proposed_description: input.proposedDescription || null,
    };
    const { error } = await supabase.from('property_submissions').insert(row);
    if (error) throw normalizeSupabaseError(error);
    fireLeadNotification('property_submissions', row);
  },

  // ─── staff (Phase 6) ───────────────────────────────────────────────────
  async list(filters: PropertySubmissionListFilters): Promise<Paginated<StaffPropertySubmission>> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 25;
    const from = (page - 1) * pageSize;

    let query = supabase.from('property_submissions').select(SELECT, { count: 'exact' });
    if (filters.status) query = query.eq('status', filters.status);

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, from + pageSize - 1);
    if (error) throw normalizeSupabaseError(error);

    return {
      items: ((data ?? []) as SubmissionJoinRow[]).map(mapSubmission),
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async getById(id: string): Promise<StaffPropertySubmission | null> {
    const { data, error } = await supabase
      .from('property_submissions')
      .select(SELECT)
      .eq('id', id)
      .maybeSingle();
    if (error) throw normalizeSupabaseError(error);
    return data ? mapSubmission(data) : null;
  },

  async setStatus(id: string, status: 'in_review' | 'declined'): Promise<void> {
    const { error } = await supabase.from('property_submissions').update({ status }).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  /** Runs the `convert_property_submission` RPC; returns the new property id. */
  async convert(id: string, agentId: string | null): Promise<string> {
    const args = agentId ? { p_submission_id: id, p_agent_id: agentId } : { p_submission_id: id };
    const { data, error } = await supabase.rpc('convert_property_submission', args);
    if (error) throw normalizeSupabaseError(error);
    return data;
  },
};
