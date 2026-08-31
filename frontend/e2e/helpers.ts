/**
 * Shared constants/helpers for E2E specs against the LOCAL Supabase stack
 * (docs/supabase-setup.md). The anon key here is the fixed Supabase CLI demo
 * JWT every local install uses — not a secret — mirrored from
 * src/test/*.integration.test.ts.
 */
export const LOCAL_URL = 'http://127.0.0.1:55321';
export const LOCAL_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const STAFF_ADMIN = { email: 'admin@kpearl.local', password: 'password123' };

/** A unique Kenyan-format phone so the 45s per-phone rate limit never trips. */
export function uniquePhone(): string {
  return `+2547${String(Date.now()).slice(-8)}`;
}

/**
 * Seeds one general inquiry directly via the anon REST API (same insert path
 * the public contact form uses) so the staff-enquiries journey has a known,
 * uniquely-named row to find and act on without re-driving the submission UI
 * (that's e2e/enquiry.spec.ts's job).
 */
export async function seedInquiry(uniqueName: string): Promise<void> {
  const res = await fetch(`${LOCAL_URL}/rest/v1/inquiries`, {
    method: 'POST',
    headers: { apikey: LOCAL_ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'general',
      name: uniqueName,
      phone: uniquePhone(),
      message: 'E2E seeded enquiry — safe to ignore.',
      preferred_contact_method: 'phone',
    }),
  });
  if (!res.ok) {
    throw new Error(`seedInquiry failed: ${res.status} ${await res.text()}`);
  }
}
