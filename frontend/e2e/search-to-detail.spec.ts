import { expect, test } from '@playwright/test';

/**
 * docs/testing.md journey 1: Visitor → Properties → Filter → Detail.
 * Against the local seed's published rental, "2-Bed Apartment in Kilimani"
 * (supabase/seed/seed.sql).
 */
test('visitor filters the property list and opens a listing', async ({ page }) => {
  await page.goto('/properties');

  await page.getByRole('button', { name: 'Rent', exact: true }).click();

  const listing = page.getByRole('link', { name: /2-Bed Apartment in Kilimani/i });
  await expect(listing).toBeVisible();
  await listing.click();

  await expect(page).toHaveURL(/\/properties\/2-bed-apartment-kilimani/);
  await expect(
    page.getByRole('heading', { level: 1, name: '2-Bed Apartment in Kilimani' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Enquire about this property' })).toBeVisible();
});
