# notify-lead

Lead-alert fan-out for K Pearl Agency (ADR-010).

**Status: scaffold (Phase 2).** The `Sender` interface and the handler shape are
in place; nothing is sent yet.

## Phase 5 — wire it up

1. **Database Webhooks** (Supabase dashboard → Database → Webhooks): one per
   table, on `INSERT`, pointing at this function:
   - `public.inquiries`
   - `public.viewing_requests`
   - `public.property_submissions`
2. In `index.ts`, resolve recipients with a service-role client:
   - the row's `assigned_to` agent → `profiles.email` + `profiles.whatsapp`
   - **plus** every `profiles` row where `role = 'admin'`
   - if `assigned_to` is null, notify all admins only.
3. Implement `emailSender` in `senders.ts` (Gmail SMTP, `smtp.gmail.com:465`).

## Phase 7+ — WhatsApp

Add `whatsappSender` to `activeSenders()` once the owner has completed Meta
Business verification for +254704061324 and an alert template is approved.

## Secrets

```
supabase secrets set GMAIL_USER=... GMAIL_APP_PASSWORD=...
# later:
supabase secrets set WHATSAPP_TOKEN=... WHATSAPP_PHONE_ID=...
```

Never place these in the frontend or in `.env` files that ship to the browser.
