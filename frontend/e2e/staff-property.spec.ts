import { expect, test } from '@playwright/test';

import { STAFF_ADMIN } from './helpers';

/**
 * docs/testing.md journey 3: Staff → Login → Dashboard → Create property →
 * Publish. Uses the seeded local dev admin (supabase/seed/seed.sql) — never
 * run against production.
 */
test('staff logs in, creates a property, and publishes it', async ({ page }) => {
  await page.goto('/staff/login');
  await page.getByLabel('Email').fill(STAFF_ADMIN.email);
  await page.getByLabel('Password').fill(STAFF_ADMIN.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/staff\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: /welcome/i })).toBeVisible();

  await page.getByRole('link', { name: 'New property' }).click();
  await expect(page).toHaveURL(/\/staff\/properties\/new/);

  const title = `E2E Test Listing ${Date.now()}`;
  await page.getByLabel('Title').fill(title);
  await page.getByLabel('Price (KES)').fill('50000');
  await page.getByRole('button', { name: 'Save', exact: true }).click();

  await expect(page).toHaveURL(/\/staff\/properties\/[0-9a-f-]{36}$/);
  await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
  await expect(page.getByText('draft', { exact: true })).toBeVisible();

  await page.getByRole('tab', { name: 'Publishing' }).click();
  await page.getByRole('button', { name: 'Publish', exact: true }).click();

  await expect(page.getByText('published', { exact: true })).toBeVisible();

  // Archive the property this test created so it doesn't linger in public
  // search results and inflate published-count assertions on repeated local
  // runs (property.repository.integration.test.ts hardcodes the seed total).
  await page.getByRole('button', { name: 'Archive', exact: true }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Archive', exact: true }).click();
  await expect(page.getByText('archived', { exact: true })).toBeVisible();
});
