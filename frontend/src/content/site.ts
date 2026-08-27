/*
 * DRAFT copy — pending K Pearl Agency approval. Contains no invented facts,
 * figures, awards, or history. Edit here; there is no CMS (docs/decisions.md).
 */

export const BRAND = {
  name: 'K.pearl Agency',
  shortName: 'K Pearl',
  tagline: 'Marketing Real Estate, Creating Value',
} as const;

export const PRIMARY_NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/properties', label: 'Properties', end: false },
  { to: '/services', label: 'Services', end: false },
  { to: '/areas', label: 'Areas', end: false },
  { to: '/about', label: 'About', end: false },
  { to: '/contact', label: 'Contact', end: false },
] as const;

export const FOOTER_EXPLORE = [
  { to: '/properties', label: 'Browse properties' },
  { to: '/services', label: 'Our services' },
  { to: '/areas', label: 'Areas we serve' },
  { to: '/list-your-property', label: 'List your property' },
  { to: '/about', label: 'About K Pearl' },
] as const;
