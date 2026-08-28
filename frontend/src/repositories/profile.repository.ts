import { AppError, normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { StaffRole } from '@/types';

export interface Profile {
  id: string;
  fullName: string;
  phone: string | null;
  whatsapp: string | null;
  role: StaffRole;
}

interface ProfileRow {
  id: string;
  full_name: string;
  phone: string | null;
  whatsapp: string | null;
  role: string;
}

function map(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    whatsapp: row.whatsapp,
    role: row.role as StaffRole,
  };
}

const COLUMNS = 'id, full_name, phone, whatsapp, role';

export const profileRepository = {
  async getById(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(COLUMNS)
      .eq('id', id)
      .maybeSingle();
    if (error) throw normalizeSupabaseError(error);
    return data ? map(data) : null;
  },

  async listStaff(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(COLUMNS)
      .order('full_name', { ascending: true });
    if (error) throw normalizeSupabaseError(error);
    return ((data ?? []) as ProfileRow[]).map(map);
  },

  async update(
    id: string,
    patch: Partial<Pick<Profile, 'fullName' | 'phone' | 'whatsapp'>>,
  ): Promise<void> {
    const row: { full_name?: string; phone?: string | null; whatsapp?: string | null } = {};
    if (patch.fullName !== undefined) row.full_name = patch.fullName;
    if (patch.phone !== undefined) row.phone = patch.phone || null;
    if (patch.whatsapp !== undefined) row.whatsapp = patch.whatsapp || null;
    const { error } = await supabase.from('profiles').update(row).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async setRole(id: string, role: StaffRole): Promise<void> {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  /**
   * Invite a new staff member. Runs the `invite-staff` Edge Function, which
   * verifies the caller is an admin and uses the service-role key to send the
   * Supabase invite email and set the new profile's role (decision 19.c).
   */
  async invite(input: { email: string; fullName: string; role: StaffRole }): Promise<void> {
    const response = (await supabase.functions.invoke('invite-staff', {
      body: input,
    })) as { error: unknown };
    if (response.error) {
      throw new AppError('UNKNOWN_ERROR', 'The invite could not be sent.', {
        cause: response.error,
      });
    }
  },
};
