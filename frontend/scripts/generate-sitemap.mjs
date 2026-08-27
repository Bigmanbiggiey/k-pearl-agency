/**
 * Build-time sitemap generator (ADR-011, decision 23.a).
 * Runs after `vite build`; writes dist/sitemap.xml.
 *
 * Static routes are always included. Published property URLs are added when the
 * Supabase REST API is reachable — otherwise the build still succeeds with a
 * static-only sitemap (e.g. in CI without a database).
 */
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SITE_URL = 'https://k-pearl-agency.vercel.app';
const DIST = resolve(import.meta.dirname, '..', 'dist');

const STATIC_PATHS = [
  '/',
  '/properties',
  '/services',
  '/about',
  '/contact',
  '/areas',
  '/list-your-property',
  '/privacy',
  '/terms',
];

async function fetchPropertySlugs() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/public_properties?select=slug,published_at&order=published_at.desc`,
      { headers: { apikey: key }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

function urlEntry(path, lastmod) {
  return [
    '  <url>',
    `    <loc>${SITE_URL}${path}</loc>`,
    lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

const properties = await fetchPropertySlugs();

const body = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...STATIC_PATHS.map((p) => urlEntry(p)),
  ...properties.map((row) => urlEntry(`/properties/${row.slug}`, row.published_at)),
  '</urlset>',
  '',
].join('\n');

await writeFile(resolve(DIST, 'sitemap.xml'), body, 'utf8');
console.log(
  `sitemap.xml written — ${STATIC_PATHS.length} static + ${properties.length} property URLs`,
);
