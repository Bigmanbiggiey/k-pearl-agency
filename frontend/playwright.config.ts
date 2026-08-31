import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config (docs/testing.md). Drives the Vite dev server directly (no
 * separate build step) against a local Supabase stack — `supabase start` +
 * `supabase db reset` must have already run (see docs/supabase-setup.md).
 * `frontend/.env` already points dev at the local stack; CI writes the same
 * values before this runs.
 */
const PORT = 4173;
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // --host 127.0.0.1: Vite's default `localhost` bind resolves IPv6-only
    // on some setups, which the baseURL health check above can't reach.
    command: `npx vite --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
