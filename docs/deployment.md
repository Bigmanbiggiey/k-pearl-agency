# K Pearl Agency — Deployment

## Target

Frontend:
- Vercel or equivalent static/frontend host.

Backend:
- Supabase hosted project.

## Environments

Recommended:
- local
- staging
- production

Do not connect local development directly to production data.

## Frontend environment

Only public/non-sensitive values:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Never expose:
- service-role key
- private integration secrets
- SMTP credentials
- third-party private API keys

## Supabase

Production deployment should use reviewed migrations.

Before launch:
- RLS enabled and tested
- storage policies reviewed
- auth redirect URLs configured
- backups/recovery understood
- production seed/content reviewed
