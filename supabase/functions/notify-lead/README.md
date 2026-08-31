# notify-lead

Emails the assigned agent + all admins when a new lead is submitted (ADR-010).

**Status: live (email path).** WhatsApp is deferred to post-launch.

## How it's triggered

The repositories (`src/repositories/notifyLead.ts`) call
`supabase.functions.invoke('notify-lead', { body: { type: 'INSERT', table, record } })`
after a successful insert into `inquiries` / `viewing_requests` /
`property_submissions`. The call is fire-and-forget — a notification failure never
blocks the visitor's submission. `verify_jwt = false` (config.toml) so anonymous
submissions can trigger it; the function itself uses the service-role key.

A database webhook (Database → Webhooks, INSERT → this function) can replace the
invoke later if resilience to a client disconnecting mid-submit matters — the
payload shape is already `{ type, table, record }`.

## Hosted-project setup (owner)

```bash
supabase functions deploy notify-lead
supabase secrets set GMAIL_USER=you@gmail.com GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
```

`GMAIL_APP_PASSWORD` is a Google **App Password** (Google Account → Security →
2-Step Verification → App passwords), not the account password.

Without the secrets the function logs the intended email instead of sending —
which is the local-dev behaviour.

## Local test

```bash
npx supabase functions serve notify-lead
# then submit a form on the site, or:
curl -X POST http://127.0.0.1:55321/functions/v1/notify-lead \
  -H 'Content-Type: application/json' \
  -d '{"type":"INSERT","table":"inquiries","record":{"name":"Test","phone":"+254704061324","message":"hi","preferred_contact_method":"phone"}}'
```
