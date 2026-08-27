import { createClient } from '@supabase/supabase-js';

import { env } from '@/lib/env';
import type { Database } from '@/types';

/**
 * The single Supabase client for the browser app. Only `src/repositories/**`
 * may import this module (enforced by the `no-restricted-imports` ESLint rule).
 * Uses the public anon key; RLS is the authorization boundary (CLAUDE.md §7).
 */
export const supabase = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
