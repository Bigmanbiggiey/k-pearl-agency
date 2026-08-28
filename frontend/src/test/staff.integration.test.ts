// @vitest-environment node
import { createClient } from '@supabase/supabase-js';
import { afterAll, describe, expect, it } from 'vitest';

import { authRepository, profileRepository, siteSettingsRepository } from '@/repositories';
import type { PropertyFormValues } from '@/schemas';
import { staffLeadsService, staffPropertyService } from '@/services';
import type { Database } from '@/types';

/*
 * Staff-dashboard integration tests against the LOCAL Supabase stack.
 * Exercises the RLS model: agents mutate only their own properties, admins
 * mutate any, featured/verified is admin-only, submissions convert, and a
 * non-admin cannot write site_settings. Skipped when the API is unreachable.
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

const AGENT = { email: 'agent@kpearl.local', password: 'password123' };
const ADMIN = { email: 'admin@kpearl.local', password: 'password123' };

function draftValues(title: string): PropertyFormValues {
  return {
    title,
    slug: '',
    listingType: 'rent',
    pricePeriod: 'month',
    propertyType: 'apartment',
    priceOnRequest: false,
    price: 75000,
    currency: 'KES',
    areaId: null,
    bedrooms: 2,
    bathrooms: 1,
    sizeValue: null,
    sizeUnit: null,
    description: 'Integration test listing — safe to delete.',
    amenities: [],
    availableFrom: '',
    addressLine: '',
    latitude: null,
    longitude: null,
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    status: 'draft',
    agentId: null,
    featured: false,
    verified: false,
  };
}

const createdPropertyIds: string[] = [];

async function signInAs(creds: { email: string; password: string }): Promise<string> {
  await authRepository.signInWithPassword(creds.email, creds.password);
  const user = await authRepository.getUser();
  if (!user) throw new Error('sign-in produced no user');
  return user.id;
}

afterAll(async () => {
  if (!ok) return;
  await authRepository.signInWithPassword(ADMIN.email, ADMIN.password);
  const admin = createClient<Database>(LOCAL_URL, LOCAL_ANON_KEY);
  await admin.auth.signInWithPassword(ADMIN);
  for (const id of createdPropertyIds) {
    await admin.from('properties').delete().eq('id', id);
  }
  await authRepository.signOut();
});

describe.skipIf(!ok)('staff dashboard (local Supabase)', () => {
  it('an agent creates and edits their own draft; featured is admin-only', async () => {
    const agentId = await signInAs(AGENT);
    const profile = await profileRepository.getById(agentId);
    expect(profile?.role).toBe('agent');

    const id = await staffPropertyService.create(draftValues(`IT agent ${Date.now()}`), {
      userId: agentId,
      isAdmin: false,
    });
    createdPropertyIds.push(id);

    const created = await staffPropertyService.getForStaff(id);
    expect(created?.status).toBe('draft');
    expect(created?.agentId).toBe(agentId);

    await expect(
      staffPropertyService.update(
        id,
        { ...draftValues('IT agent edited'), status: 'draft' },
        {
          userId: agentId,
          isAdmin: false,
        },
      ),
    ).resolves.toBeUndefined();

    await expect(staffPropertyService.setFeatured(id, true)).rejects.toThrow();

    await authRepository.signOut();
    await signInAs(ADMIN);
    await expect(staffPropertyService.setFeatured(id, true)).resolves.toBeUndefined();
    await authRepository.signOut();
  });

  it('converts a property submission into a draft property', async () => {
    const anon = createClient<Database>(LOCAL_URL, LOCAL_ANON_KEY);
    const insert = await anon.from('property_submissions').insert({
      submitter_name: 'IT Submitter',
      submitter_phone: `+2547${String(Date.now()).slice(-8)}`,
      proposed_title: `IT submission ${Date.now()}`,
      proposed_listing_type: 'rent',
      proposed_property_type: 'apartment',
    });
    expect(insert.error).toBeNull();

    await signInAs(ADMIN);
    const list = await staffLeadsService.listSubmissions({ status: 'new', pageSize: 1 });
    const submission = list.items[0];
    expect(submission).toBeDefined();
    if (!submission) return;

    const newPropertyId = await staffLeadsService.convertSubmission(submission.id, null);
    createdPropertyIds.push(newPropertyId);
    const converted = await staffLeadsService.getSubmission(submission.id);
    expect(converted?.status).toBe('converted');
    expect(converted?.convertedPropertyId).toBe(newPropertyId);
    await authRepository.signOut();
  });

  it('a non-admin cannot update site settings', async () => {
    await signInAs(AGENT);
    await expect(siteSettingsRepository.update({ byAppointment: true })).rejects.toThrow();
    await authRepository.signOut();
    expect(await authRepository.getSession()).toBeNull();
  });
});
