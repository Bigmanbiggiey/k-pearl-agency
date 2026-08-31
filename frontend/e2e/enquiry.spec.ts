import { expect, test } from '@playwright/test';

import { uniquePhone } from './helpers';

/**
 * docs/testing.md journey 2: Visitor → Detail → Enquiry → Success.
 * useLeadSubmit (src/features/lead-forms/useLeadSubmit.ts) silently
 * "succeeds" any submit under 2s of the form mounting, as an anti-bot guard —
 * without a real wait here this test would pass even if the DB write broke,
 * so it deliberately waits out that window first.
 */
test('visitor submits a property enquiry and sees the success state', async ({ page }) => {
  await page.goto('/properties/2-bed-apartment-kilimani');

  await page.getByRole('button', { name: 'Enquire about this property' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.locator('#enq-name').fill('E2E Visitor');
  await dialog.locator('#enq-phone').fill(uniquePhone());
  await dialog.locator('#enq-message').fill('E2E test enquiry — please ignore.');
  await dialog.locator('#consent').check();

  // Clear the honeypot's < 2s anti-bot window so this exercises a real submit.
  await page.waitForTimeout(2100);

  await dialog.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(dialog.getByText('Thank you — your enquiry is in.')).toBeVisible();
});
