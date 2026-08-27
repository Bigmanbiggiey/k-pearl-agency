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
- Sensitive internal notes are never exposed to public queries.
- Error messages shown to users are sanitized.

## Abuse prevention

Before launch, assess:
- rate limiting for public enquiries
- CAPTCHA/Turnstile or equivalent if spam becomes material
- email/phone validation
- upload type/size restrictions
- image transformation/optimization
