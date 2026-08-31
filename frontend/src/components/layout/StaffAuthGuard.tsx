import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * Placeholder guard. Phase 6 replaces this with a real Supabase Auth check
 * (staff-only, ADR-005) that redirects unauthenticated users to `/staff/login`
 * and verifies the `profiles.role` is `admin` or `agent` (ADR-007). RLS remains
 * the actual authorization boundary (CLAUDE.md §7).
 */
export function StaffAuthGuard({ children }: Props) {
  return <>{children}</>;
}
