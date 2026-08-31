/**
 * Phase 7 tranche 2 (ADR-013): Lighthouse Performance + Accessibility audit
 * of the public pages, against a production build (`vite preview`, not the
 * dev server — dev's unbundled/unminified output would misreport
 * performance). Targets: Perf ≥90, A11y ≥95 (CLAUDE.md §10).
 *
 * Run via `npm run audit:lighthouse` (builds first). Prints a table; paste
 * the real numbers into docs/launch-audit.md — this script does not write
 * the doc itself.
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve as resolvePath } from 'node:path';

import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const require = createRequire(import.meta.url);
// vite's package.json doesn't export ./bin/vite.js, so resolve the package
// root (an always-allowed subpath) and reach the bin script from there.
const viteBin = resolvePath(dirname(require.resolve('vite/package.json')), 'bin/vite.js');

const PORT = 4175;
const BASE = `http://127.0.0.1:${PORT}`;

const PAGES = [
  ['Home', '/'],
  ['Properties', '/properties'],
  ['Property detail', '/properties/2-bed-apartment-kilimani'],
  ['Contact', '/contact'],
];

async function waitForServer(url, timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server at ${url} did not become ready in ${timeoutMs}ms`);
}

async function main() {
  // Spawn vite's own bin directly (node -> vite.js) rather than through
  // npx/a shell — an extra cmd.exe layer on Windows was swallowing this
  // process's stdio entirely, with no error and no output.
  const server = spawn(
    process.execPath,
    [viteBin, 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    { stdio: 'inherit' },
  );

  try {
    await waitForServer(BASE);

    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless=new', '--no-sandbox'],
    });
    try {
      const rows = [];
      for (const [name, path] of PAGES) {
        console.log(`Auditing ${name} (${path})…`);
        const result = await lighthouse(`${BASE}${path}`, {
          port: chrome.port,
          output: 'json',
          onlyCategories: ['performance', 'accessibility'],
          logLevel: 'error',
        });
        const { performance, accessibility } = result.lhr.categories;
        rows.push({
          page: name,
          performance: Math.round(performance.score * 100),
          accessibility: Math.round(accessibility.score * 100),
        });
      }
      console.table(rows);

      const failing = rows.filter((r) => r.performance < 90 || r.accessibility < 95);
      if (failing.length > 0) {
        console.error(
          `Below target (Perf ≥90, A11y ≥95): ${failing.map((r) => r.page).join(', ')}`,
        );
        process.exitCode = 1;
      }
    } finally {
      // chrome-launcher's tmp-profile cleanup throws EPERM on Windows if a
      // file is still momentarily locked — harmless, but must not crash the
      // audit or leave the process hanging.
      try {
        await chrome.kill();
      } catch (err) {
        console.warn('chrome.kill() cleanup warning (ignored):', err.message);
      }
    }
  } finally {
    server.kill();
  }
}

await main();
