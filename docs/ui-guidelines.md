# K Pearl Agency — UI Guidelines

## Brand foundation

The supplied K Pearl Agency logo defines the visual direction.

Primary visual language:
- Black / near-black
- Metallic/warm gold
- White / ivory
- Charcoal / muted neutrals

The logo asset is:
`frontend/public/assets/branding/k-pearl-logo.png` — gold-on-black raster, used
as-is on dark surfaces (header, footer, hero). Transparent / vector / horizontal
lockup / favicon variants are still a designer handoff (decision 25.b).

## Typography (decision 25.a — resolved 2026-08-27)

- **Display / headings:** Fraunces Variable (self-hosted, `@fontsource-variable/fraunces`).
- **Body / UI:** Inter Variable (self-hosted, `@fontsource-variable/inter`).
- Wired via `--font-display` / `--font-sans` tokens in `frontend/src/styles/index.css`.
- No Google Fonts or external font CDN.

## Design principles

1. Premium but not flashy.
2. Spacious layouts.
3. Strong property photography.
4. Clear typography hierarchy.
5. Gold used for emphasis and CTAs, not everywhere.
6. Subtle borders and shadows.
7. Strong mobile experience.
8. Accessible contrast.

## Public navigation

MVP navigation (as built, Phase 3):
- Home
- Properties
- Services
- Areas
- About
- Contact

Primary CTA: `View Properties`. Secondary CTA: `Contact K Pearl`.
Mobile: hamburger → Radix Dialog drawer.

## Home page sections

As built (Phase 3; per `docs/product-definition.md` §17):

1. Hero (dark) with inline property search
2. Featured properties
3. Services overview
4. Why K Pearl
5. Latest listings
6. Owner CTA ("List your property")
7. Footer

("How it works" is folded into the Services page; a dedicated Areas grid lives on
`/areas` rather than the homepage.)

## Property catalogue (`/properties`, Phase 4)

- Filters live in the URL query string (shareable links). `usePropertyFilters` +
  `filterParams` are the only place that maps URL ↔ filter state; defaults are
  omitted from the URL.
- Desktop (`lg+`): sticky filter sidebar. Below `lg`: a "Filters (n)" button opens
  a Radix Dialog bottom sheet.
- Above the grid: result count, keyword search (debounced ~350 ms), sort select,
  and removable active-filter chips.
- Pagination: numbered + windowed on `sm+`, `‹ Prev · Page X of Y · Next ›` on
  mobile (decision 11.a).
- States: skeleton grid while loading; "No properties match these filters." +
  Clear-filters action when empty.
- SEO: canonical is always `/properties`; any active filter or `page > 1` sets
  `noindex` (avoids thin duplicate pages).

## Property card

Show:
- cover image
- listing type
- property type
- title
- location
- price
- bedrooms/bathrooms where applicable
- featured/verified badge where applicable
- view details CTA

## Property detail

Prioritize:
- gallery
- price
- location
- key facts
- description
- amenities
- enquiry CTA
- viewing CTA
- contact options

## Accessibility

- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus states.
- Meaningful image alt text.
- Do not rely on color alone.
- Minimum sensible contrast for text.
