// @vitest-environment node
import { createClient } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';

import { inquiryService, propertySubmissionService, viewingRequestService } from '@/services';
import type { Database } from '@/types';

/*
 * Lead-submission integration tests against the LOCAL Supabase stack.
 * Skipped when the API is unreachable (CI without Docker).
 */
const LOCAL_URL = 'http://127.0.0.1:55321';
const LOCAL_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

async function reachable(): Promise<boolean> {
  try {
    const res = await fetch(`${LOCAL_URL}/rest/v1/areas?select=id&limit=1`, {
      headers: { apikey: LOCAL_ANON_KEY },
      signal: AbortSignal.timeout(2500),
    });
    return res.ok;
  } catch {
    return false;
  }
}

const ok = await reachable();

/** A unique Kenyan-format phone so re-runs don't hit the rate limiter. */
function uniquePhone(): string {
  return `+2547${String(Date.now()).slice(-8)}`;
}

const PUBLISHED_SLUG = '2-bed-apartment-kilimani';

async function publishedPropertyId(): Promise<string> {
  const anon = createClient<Database>(LOCAL_URL, LOCAL_ANON_KEY);
  const { data } = await anon
    .from('public_properties')
    .select('id')
    .eq('slug', PUBLISHED_SLUG)
    .single();
  if (!data?.id) throw new Error(`seed property ${PUBLISHED_SLUG} not found`);
  return data.id;
}

describe.skipIf(!ok)('lead submissions (local Supabase)', () => {
  it('creates a general inquiry as anon and rate-limits a rapid repeat', async () => {
    const phone = uniquePhone();
    await expect(
      inquiryService.create({
        type: 'general',
        name: 'Integration Test',
        phone,
        email: '',
        message: 'Automated test — please ignore.',
        preferredContactMethod: 'phone',
        consent: true,
        company: '',
      }),
    ).resolves.toBeUndefined();

    await expect(
      inquiryService.create({
        type: 'general',
        name: 'Integration Test',
        phone,
        email: '',
        message: 'Second attempt, same phone.',
        preferredContactMethod: 'phone',
        consent: true,
        company: '',
      }),
    ).rejects.toThrow(/too quickly/i);
  });

  it('creates a viewing request for a published property', async () => {
    const propertyId = await publishedPropertyId();
    await expect(
      viewingRequestService.create({
        propertyId,
        name: 'Integration Test',
        phone: uniquePhone(),
        consent: true,
        company: '',
      }),
    ).resolves.toBeUndefined();
  });

  it('creates a property submission', async () => {
    await expect(
      propertySubmissionService.create({
        submitterName: 'Integration Test',
        submitterPhone: uniquePhone(),
        proposedTitle: 'Test property submission',
        proposedListingType: 'rent',
        proposedPropertyType: 'apartment',
        consent: true,
        company: '',
      }),
    ).resolves.toBeUndefined();
  });

  it('anon still cannot read the lead tables back', async () => {
    const anon = createClient<Database>(LOCAL_URL, LOCAL_ANON_KEY);
    const read = await anon.from('inquiries').select('id').limit(1);
    expect(read.error !== null || (read.data ?? []).length === 0).toBe(true);
  });
});
