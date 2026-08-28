# K Pearl Agency — Security Plan

## Rules

- Supabase Auth handles sessions.
- RLS is the authorization boundary.
- Service-role credentials never enter the browser.
- Public forms have strict input validation.
- Database constraints backstop application validation.
- Storage policies restrict uploads to authorized staff.
- Staff routes require authentication.
- Admin-only actions require role-aware RLS.
- Sensitive internal notes are never exposed to public queries — the public role
  has **no `SELECT`** on `inquiries`, `viewing_requests` or `property_submissions`
  (insert-only, column allowlist).
- Staff-only property columns (`address_line`, `latitude`, `longitude`, `owner_*`)
  are dropped by the `public_properties` view; `anon` has no `SELECT` on the
  `properties` base table.
- Agents can mutate only properties where `agent_id = auth.uid()` (RLS); admin-only
  actions (`featured`, `verified`, `areas`, `site_settings`, `profiles`,
  submission convert/decline) are gated by a `security definer` role check.
- Edge Function secrets — Gmail SMTP app password (`notify-lead`), and later the
  WhatsApp Cloud API token — live only in Supabase Function config, never in the
  frontend or the repo.
- Error messages shown to users are sanitized; repositories normalise Supabase
  errors to `AppError` codes.

## Abuse prevention

Public forms (enquiry, viewing request, general contact, property submission) —
**implemented in Phase 5**:
- Off-screen honeypot field + a minimum submit-time (< 2 s = silent drop, so bots
  don't learn they were caught). `src/features/lead-forms/useLeadSubmit.ts`.
- Per-phone rate limit: a `BEFORE INSERT` trigger
  (`enforce_lead_rate_limit`, migration `20260828090001`) rejects a second row
  with the same phone in the same lead table within 45 s. Anonymous inserts only;
  staff-entered rows are exempt.
- Kenyan phone-format validation + email validated when present (Zod).
- Consent checkbox linking to `/privacy` (schema `consent: z.literal(true)`).
- Cloudflare Turnstile / hCaptcha remain conditional — add only if spam becomes
  material.
- Anon has **no `SELECT`** on `inquiries` / `viewing_requests` /
  `property_submissions`; column-level INSERT grants block `status` / `assigned_to`
  / `internal_notes`.

Uploads (`property-media`, staff only): MIME allowlist, 8 MB cap, path convention;
image optimisation via responsive `srcset` + lazy-load.

## Legal (Phase 7)

- Draft Privacy Policy + Terms of Use from a Kenya-appropriate template; the
  owner's lawyer reviews before launch.
- Kenya Data Protection Act 2019: publish a privacy notice, state the lawful
  basis, document a data-subject deletion process, and assess whether registration
  as a data controller is required.
