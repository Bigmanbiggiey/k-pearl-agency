import { normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

export interface DashboardCounts {
  propertiesTotal: number;
  propertiesDraft: number;
  propertiesPublished: number;
  propertiesUnavailable: number;
  inquiriesNew: number;
  viewingRequestsNew: number;
  submissionsNew: number;
}

export const staffRepository = {
  async dashboardCounts(): Promise<DashboardCounts> {
    const { data, error } = await supabase.rpc('staff_dashboard_counts');
    if (error) throw normalizeSupabaseError(error);
    const c = (data ?? {}) as Record<string, number>;
    return {
      propertiesTotal: c.properties_total ?? 0,
      propertiesDraft: c.properties_draft ?? 0,
      propertiesPublished: c.properties_published ?? 0,
      propertiesUnavailable: c.properties_unavailable ?? 0,
      inquiriesNew: c.inquiries_new ?? 0,
      viewingRequestsNew: c.viewing_requests_new ?? 0,
      submissionsNew: c.submissions_new ?? 0,
    };
  },
};
