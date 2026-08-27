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
};
