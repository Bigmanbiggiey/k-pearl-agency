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
    // Wait for the SPA to render before axe runs — document metadata
    // (incl. <title>) is supplied by <Seo> on mount, not by index.html.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });
}

// Regression guard: the base `h1..h4 { color: --color-ink }` rule beats the
// light `text-surface` that dark bands set for inheritance, so headings on
// `bg-ink` (hero, PageHeader, Section tone="ink") rendered near-black on
// near-black — invisible, and axe reported it only as "incomplete". Check the
// real contrast ratio of every heading against its effective background.
for (const [name, path] of PUBLIC_PAGES) {
  test(`${name} headings meet contrast against their background`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const bad = await page.evaluate(() => {
      const lum = (c: string) => {
        const [r = 0, g = 0, b = 0] = (c.match(/[\d.]+/g) ?? []).slice(0, 3).map((v) => {
          const s = Number(v) / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const opaqueBg = (el: Element | null): string => {
        for (let n = el; n; n = n.parentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          if (bg && !bg.includes('rgba(0, 0, 0, 0)') && bg !== 'transparent') return bg;
        }
        return 'rgb(255, 255, 255)';
      };
      const out: Array<{ text: string; ratio: number }> = [];
      for (const h of document.querySelectorAll('main h1, main h2, main h3')) {
        const rect = h.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const fg = lum(getComputedStyle(h).color);
        const bg = lum(opaqueBg(h));
        const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
        if (ratio < 3)
          out.push({ text: (h.textContent ?? '').slice(0, 60), ratio: +ratio.toFixed(2) });
      }
      return out;
    });

    expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
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
