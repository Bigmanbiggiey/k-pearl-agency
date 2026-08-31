import { expect, test } from '@playwright/test';

import { seedInquiry, STAFF_ADMIN } from './helpers';

/**
 * docs/testing.md journey 4: Staff → Enquiries → Update status. Seeds its own
 * uniquely-named inquiry via the anon REST API (the public contact form's
 * insert path) so the test doesn't depend on e2e/enquiry.spec.ts having run
 * first, or on row position if other specs run in parallel.
 */
test('staff finds an enquiry and updates its status', async ({ page }) => {
  const uniqueName = `E2E Enquiry ${Date.now()}`;
  await seedInquiry(uniqueName);

  await page.goto('/staff/login');
  await page.getByLabel('Email').fill(STAFF_ADMIN.email);
  await page.getByLabel('Password').fill(STAFF_ADMIN.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/staff\/?$/);

  await page.goto('/staff/enquiries');
  const row = page.getByRole('row', { name: new RegExp(uniqueName) });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: /open/i }).click();

  const statusSelect = page.getByLabel('Status');
  await expect(statusSelect).toHaveValue('new');
  await statusSelect.selectOption('contacted');
  await expect(statusSelect).toHaveValue('contacted');
});
