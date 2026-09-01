# K Pearl Agency — UI Guidelines

## Brand foundation

The supplied K Pearl Agency logo defines the visual direction.

Primary visual language:
- Black / near-black
- Metallic/warm gold
- White / ivory
- Charcoal / muted neutrals

Logo assets — owner asset kit in `frontend/public/assets/branding/`
(decision 25.b, delivered 2026-09-01):

| File | Use |
| --- | --- |
| `kpearl-mark.png` | pearl-in-shell emblem, transparent — the header mark (rendered 40px next to the text wordmark) |
| `kpearl-lockup-header.png` | mark + "K.pearl AGENCY", transparent, gold-on-dark — full header lockup (available; not wired — 354 KB PNG, would hurt LCP) |
| `kpearl-lockup-full.png` | as above + tagline — larger uses |
| `kpearl-favicon-16.png` / `-32.png` | browser tab |
| `kpearl-apple-touch-icon.png` (180) | iOS home screen |
| `kpearl-icon-512.png` | OG / social card fallback (`Seo.tsx`) |
| `k-pearl-logo.png` | original supplied raster; kept for reference, no longer used |

All PNG (no SVG/vector in the kit). They're unoptimised exports — a pass
through an image optimiser / WebP conversion is a worthwhile follow-up,
especially for the lockups.

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

## Forms (Phase 5)

- Built with `react-hook-form` + `zodResolver` against the schemas in
  `src/schemas/`. Primitives: `FormField` (label + control + error, wired for
  a11y), `TextInput` / `TextArea` / `SelectInput` / `Checkbox` in
  `components/ui/form.tsx`.
- Field labels must be distinct from radio/option labels in the same form
  (e.g. "Phone number" field vs. a "Phone" contact-method radio).
- Every public form: an off-screen honeypot (`Honeypot`), a consent checkbox
  linking to `/privacy` (`ConsentField`), inline field errors, a disabled
  "Sending…" button state, and on success the form is replaced by a
  `LeadFormSuccess` panel. `useLeadSubmit` owns that lifecycle and the silent
  bot-drop.
- Property enquiry + viewing request open from the detail page in a `LeadDialog`
  (Radix Dialog). The general contact form sits inline on `/contact`.

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
