import { expect, test, type Page } from '@playwright/test';

/**
 * Phase 7 tranche 5: SEO sweep of the public routes. Asserts the document
 * metadata rendered by <Seo> (src/components/Seo.tsx) — title, description,
 * canonical, Open Graph, Twitter — plus the noindex rule on filtered property
 * views, the RealEstateListing JSON-LD on a property detail page, and that
 * /staff stays out of the index. Runs in `npm run test:e2e`, so it is
 * enforced in CI.
 */

// Mirrored from src/lib/seo.ts SITE_URL (hardcoded here like LOCAL_URL in helpers.ts).
const SITE_URL = 'https://k-pearl-agency.vercel.app';

// A published rental in the local seed (supabase/seed/seed.sql).
const SEED_SLUG = '2-bed-apartment-kilimani';

const ROUTES: Array<[name: string, path: string]> = [
  ['Home', '/'],
  ['Properties', '/properties'],
  ['Services', '/services'],
  ['About', '/about'],
  ['Contact', '/contact'],
  ['Areas', '/areas'],
  ['List your property', '/list-your-property'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Property detail', `/properties/${SEED_SLUG}`],
];

function metaContent(page: Page, selector: string): Promise<string | null> {
  return page.locator(`head > ${selector}`).first().getAttribute('content');
}

const canonicalFor = (path: string) => `${SITE_URL}${path}`;

for (const [name, path] of ROUTES) {
  test(`${name} has complete document metadata`, async ({ page }) => {
    await page.goto(path);
    // <Seo> supplies all document metadata on mount (index.html ships none).
    // Wait for it to land before asserting.
    await expect(page).toHaveTitle(/K Pearl Agency/);

    // Title: exactly one, non-empty, carries the site name.
    await expect(page.locator('head > title')).toHaveCount(1);
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
    expect(title).toContain('K Pearl Agency');

    // Description: exactly one, non-empty.
    await expect(page.locator('head > meta[name="description"]')).toHaveCount(1);
    const description = await metaContent(page, 'meta[name="description"]');
    expect((description ?? '').trim().length).toBeGreaterThan(20);

    // Canonical: exactly one, absolute, query-stripped.
    await expect(page.locator('head > link[rel="canonical"]')).toHaveCount(1);
    expect(await page.locator('head > link[rel="canonical"]').getAttribute('href')).toBe(
      canonicalFor(path),
    );

    // Open Graph essentials present and non-empty.
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:image', 'og:site_name']) {
      const value = await metaContent(page, `meta[property="${prop}"]`);
      expect((value ?? '').length, prop).toBeGreaterThan(0);
    }
    expect(await metaContent(page, 'meta[property="og:url"]')).toBe(canonicalFor(path));

    // Twitter summary card.
    expect(await metaContent(page, 'meta[name="twitter:card"]')).toBe('summary_large_image');
  });
}

test('canonical /properties is indexable; a filtered view is noindex', async ({ page }) => {
  await page.goto('/properties');
  await expect(page.locator('head > meta[name="robots"]')).toHaveCount(0);

  await page.goto('/properties?listingType=rent');
  await expect(page.locator('head > meta[name="robots"]')).toHaveCount(1);
  expect(await page.locator('head > meta[name="robots"]').getAttribute('content')).toBe(
    'noindex, nofollow',
  );
});

test('property detail renders RealEstateListing JSON-LD', async ({ page }) => {
  await page.goto(`/properties/${SEED_SLUG}`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const ld = page.locator('script[type="application/ld+json"]');
  await expect(ld).toHaveCount(1);
  const parsed = JSON.parse((await ld.textContent()) ?? '{}') as Record<string, unknown>;
  expect(parsed['@type']).toBe('RealEstateListing');
  expect((parsed.provider as { name?: string } | undefined)?.name).toBe('K Pearl Agency');
});

test('staff login is kept out of the index', async ({ page }) => {
  await page.goto('/staff/login');
  await expect(page.locator('head > meta[name="robots"]')).toHaveCount(1);
  expect(await page.locator('head > meta[name="robots"]').getAttribute('content')).toContain(
    'noindex',
  );
});
