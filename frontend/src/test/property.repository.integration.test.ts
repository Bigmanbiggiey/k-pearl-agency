// @vitest-environment node
import { createClient } from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';

import { areaRepository } from '@/repositories/area.repository';
import { propertyService } from '@/services/property.service';
import type { Database } from '@/types';

/*
 * Integration tests against the LOCAL Supabase stack (`npx supabase start`).
 * Skipped automatically when the local API is not reachable, so CI without
 * Docker still passes. The anon key below is the well-known Supabase local dev
 * key — not a secret. Runs in the `node` environment (real fetch, no CORS).
 */
const LOCAL_URL = 'http://127.0.0.1:55321';
const LOCAL_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

async function checkReachable(): Promise<boolean> {
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

// evaluated at module load, before describe.skipIf is checked
const reachable = await checkReachable();

describe.skipIf(!reachable)('property read paths (local Supabase)', () => {
  it('search() returns only published listings', async () => {
    const result = await propertyService.search({ pageSize: 48 });

    expect(result.items.length).toBeGreaterThan(0);
    // seed has 6 published + 1 draft + 1 unavailable
    expect(result.total).toBe(6);
    expect(result.items.some((p) => p.slug === 'bedsitter-south-b')).toBe(false); // draft
    expect(result.items.some((p) => p.slug === 'standalone-house-karen')).toBe(false); // unavailable
  });

  it('search() filters by listing type', async () => {
    const rentals = await propertyService.search({ listingType: 'rent', pageSize: 48 });
    expect(rentals.items.every((p) => p.listingType === 'rent')).toBe(true);

    const shortLets = await propertyService.search({ listingType: 'short_let', pageSize: 48 });
    expect(shortLets.items.every((p) => p.listingType === 'short_let')).toBe(true);
  });

  it('getBySlug() returns a published property with media, null for a draft', async () => {
    const detail = await propertyService.getBySlug('2-bed-apartment-kilimani');
    expect(detail).not.toBeNull();
    expect(detail?.referenceCode).toMatch(/^KP-\d{4}$/);
    expect(detail?.media.length).toBeGreaterThan(0);
    // staff-only fields must not be present on the DTO / public view
    expect(detail).not.toHaveProperty('address_line');
    expect(detail).not.toHaveProperty('owner_name');

    const draft = await propertyService.getBySlug('bedsitter-south-b');
    expect(draft).toBeNull();
  });

  it('getFeatured() returns only featured, published listings', async () => {
    const featured = await propertyService.getFeatured(10);
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it('areaRepository.listActive() returns the seeded areas', async () => {
    const areas = await areaRepository.listActive();
    expect(areas.length).toBe(28);
    expect(areas.some((a) => a.slug === 'kilimani')).toBe(true);
  });

  it('search() filters by minBedrooms and maxPrice', async () => {
    const big = await propertyService.search({ minBedrooms: 3, pageSize: 48 });
    expect(big.items.every((p) => (p.bedrooms ?? 0) >= 3)).toBe(true);

    const cheap = await propertyService.search({ maxPrice: 100_000, pageSize: 48 });
    expect(cheap.items.every((p) => p.price != null && p.price <= 100_000)).toBe(true);
  });

  it('search() matches a keyword and sorts by price ascending', async () => {
    const kw = await propertyService.search({ keyword: 'kilimani', pageSize: 48 });
    expect(kw.items.length).toBeGreaterThan(0);

    const asc = await propertyService.search({ sort: 'price_asc', pageSize: 48 });
    const prices = asc.items.map((p) => p.price ?? Number.POSITIVE_INFINITY);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it('search() paginates', async () => {
    const page1 = await propertyService.search({ pageSize: 4, page: 1 });
    const page2 = await propertyService.search({ pageSize: 4, page: 2 });
    expect(page1.total).toBe(6);
    expect(page1.items).toHaveLength(4);
    expect(page2.items).toHaveLength(2);
    const overlap = page1.items.filter((a) => page2.items.some((b) => b.id === a.id));
    expect(overlap).toHaveLength(0);
  });
});

describe.skipIf(!reachable)('RLS boundary (local Supabase)', () => {
  const anon = createClient<Database>(LOCAL_URL, LOCAL_ANON_KEY);

  it('anon cannot read the properties base table', async () => {
    const { data, error } = await anon.from('properties').select('address_line').limit(1);
    // either a permission error, or an empty result — never actual address data
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it('anon can insert an inquiry but cannot read inquiries back', async () => {
    const insert = await anon.from('inquiries').insert({
      type: 'general',
      name: 'Test Visitor',
      phone: '+254704061324',
      message: 'Integration test message — please ignore.',
      preferred_contact_method: 'phone',
    });
    expect(insert.error).toBeNull();

    const read = await anon.from('inquiries').select('id').limit(1);
    expect(read.error !== null || (read.data ?? []).length === 0).toBe(true);
  });

  it('anon cannot set a protected column on insert', async () => {
    const { error } = await anon.from('inquiries').insert({
      type: 'general',
      name: 'Test Visitor',
      phone: '+254704061324',
      message: 'Attempting to self-assign.',
      preferred_contact_method: 'phone',
      internal_notes: 'should be rejected',
    });
    expect(error).not.toBeNull();
  });
});
