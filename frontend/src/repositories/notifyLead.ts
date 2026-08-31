import { supabase } from '@/lib/supabase';

type LeadTable = 'inquiries' | 'viewing_requests' | 'property_submissions';

/**
 * Fire-and-forget call to the `notify-lead` Edge Function after a lead is
 * created (ADR-010). A notification failure must never surface to the visitor,
 * so errors are swallowed.
 */
export function fireLeadNotification(table: LeadTable, record: Record<string, unknown>): void {
  void supabase.functions
    .invoke('notify-lead', { body: { type: 'INSERT', table, record } })
    .catch(() => {
      /* best effort */
    });
}
