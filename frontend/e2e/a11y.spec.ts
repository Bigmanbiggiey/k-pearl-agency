import { expect, test } from '@playwright/test';

import { expectNoSeriousA11yViolations, STAFF_ADMIN } from './helpers';

/**
 * Phase 7 tranche 2 (ADR-013): automated a11y sweep of the key public pages
 * plus one representative authenticated staff page. Not a substitute for a
 * manual audit — axe-core catches a subset of WCAG issues (missing labels,
 * contrast, landmark/heading structure) — but it's cheap and runs every CI
 * pass.
 */
const PUBLIC_PAGES: Array<[name: string, path: string]> = [
  ['Home', '/'],
  ['Properties', '/properties'],
  ['Property detail', '/properties/2-bed-apartment-kilimani'],
  ['Contact', '/contact'],
];

for (const [name, path] of PUBLIC_PAGES) {
  test(`${name} has no serious a11y violations`, async ({ page }) => {
    await page.goto(path);
    await expectNoSeriousA11yViolations(page);
  });
}

test('staff dashboard has no serious a11y violations', async ({ page }) => {
  await page.goto('/staff/login');
  await page.getByLabel('Email').fill(STAFF_ADMIN.email);
  await page.getByLabel('Password').fill(STAFF_ADMIN.password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/staff\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: /welcome/i })).toBeVisible();

  await expectNoSeriousA11yViolations(page);
});
