// K Pearl Agency — notify-lead Edge Function (ADR-010).
//
// SCAFFOLD ONLY (Phase 2). Wiring in Phase 5:
//   1. Create a Database Webhook on INSERT into public.inquiries,
//      public.viewing_requests and public.property_submissions -> this function.
//   2. Resolve recipients here with the service-role key: the row's assigned
//      agent (profiles.email + profiles.whatsapp) plus every admin.
//   3. Fan out through activeSenders().
//
// Secrets (set via `supabase secrets set`, never in the frontend):
//   GMAIL_USER, GMAIL_APP_PASSWORD  (email, launch)
//   WHATSAPP_TOKEN, WHATSAPP_PHONE_ID  (WhatsApp, later)

import { activeSenders, type LeadNotification } from './senders.ts';

interface WebhookPayload {
  type: 'INSERT';
  table: 'inquiries' | 'viewing_requests' | 'property_submissions';
  record: Record<string, unknown>;
}

function summarise(p: WebhookPayload): LeadNotification {
  const kindByTable = {
    inquiries: 'inquiry',
    viewing_requests: 'viewing_request',
    property_submissions: 'property_submission',
  } as const;

  return {
    kind: kindByTable[p.table],
    subject: `New ${kindByTable[p.table].replace('_', ' ')} — K Pearl Agency`,
    body: JSON.stringify(p.record, null, 2),
    recipients: [], // Phase 5: resolved from profiles via the service-role client
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const payload = (await req.json()) as WebhookPayload;
    const notification = summarise(payload);

    // Phase 5: resolve notification.recipients, then actually send.
    await Promise.all(activeSenders().map((s) => s.send(notification)));

    return Response.json({ ok: true, scaffold: true });
  } catch (error) {
    console.error('[notify-lead] error', error);
    return Response.json({ ok: false }, { status: 500 });
  }
});
