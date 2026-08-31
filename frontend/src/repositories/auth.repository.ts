import type { Session, User } from '@supabase/supabase-js';

import { normalizeSupabaseError } from '@/lib/errors';
import { SITE_URL } from '@/lib/seo';
import { supabase } from '@/lib/supabase';

export type { Session, User } from '@supabase/supabase-js';

export const authRepository = {
  async signInWithPassword(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw normalizeSupabaseError(error);
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw normalizeSupabaseError(error);
  },

  async sendPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/staff/reset`,
    });
    if (error) throw normalizeSupabaseError(error);
  },

  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw normalizeSupabaseError(error);
  },

  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getUser(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
    return () => data.subscription.unsubscribe();
  },
};
