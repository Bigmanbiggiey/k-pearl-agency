import { AppError, normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';

export const siteSettingsRepository = {
  async get(): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('phone, whatsapp, email, hours_weekday, hours_weekend, by_appointment')
      .maybeSingle();
    if (error) throw normalizeSupabaseError(error);
    if (!data) throw new AppError('NOT_FOUND', 'Site settings have not been configured.');

    return {
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      hoursWeekday: data.hours_weekday,
      hoursWeekend: data.hours_weekend,
      byAppointment: data.by_appointment,
    };
  },

  /** Admin-only (RLS). The table is a single row keyed `id = true`. */
  async update(patch: Partial<SiteSettings>): Promise<void> {
    const row: {
      phone?: string;
      whatsapp?: string;
      email?: string;
      hours_weekday?: string;
      hours_weekend?: string;
      by_appointment?: boolean;
    } = {};
    if (patch.phone !== undefined) row.phone = patch.phone;
    if (patch.whatsapp !== undefined) row.whatsapp = patch.whatsapp;
    if (patch.email !== undefined) row.email = patch.email;
    if (patch.hoursWeekday !== undefined) row.hours_weekday = patch.hoursWeekday;
    if (patch.hoursWeekend !== undefined) row.hours_weekend = patch.hoursWeekend;
    if (patch.byAppointment !== undefined) row.by_appointment = patch.byAppointment;

    const { data, error } = await supabase
      .from('site_settings')
      .update(row)
      .eq('id', true)
      .select('id');
    if (error) throw normalizeSupabaseError(error);
    // A non-admin passes RLS's row filter to zero rows rather than erroring.
    if (!data || data.length === 0) {
      throw new AppError('FORBIDDEN', 'You do not have permission to change site settings.');
    }
  },
};
