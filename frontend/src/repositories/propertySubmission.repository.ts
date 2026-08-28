import { fireLeadNotification } from './notifyLead';

import { normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { ListingType, PropertyType } from '@/types';

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
};
