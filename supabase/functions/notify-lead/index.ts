// K Pearl Agency — notify-lead Edge Function (ADR-010).
//
// Invoked by the repositories after a successful insert into a lead table
// (a database webhook can replace the invoke later without changing this code).
// Resolves recipients with the service-role key and emails them.
//
// Secrets (set on the hosted project — never in the frontend):
//   GMAIL_USER, GMAIL_APP_PASSWORD   (email — launch)
//   WHATSAPP_TOKEN, WHATSAPP_PHONE_ID (WhatsApp — post-launch)

import { createClient } from 'jsr:@supabase/supabase-js@2';

import { activeSenders, type LeadNotification, type Recipient } from './senders.ts';

interface LeadPayload {
  type?: string;
  table: 'inquiries' | 'viewing_requests' | 'property_submissions';
  record: Record<string, unknown>;
}

const KIND_BY_TABLE = {
  inquiries: 'inquiry',
  viewing_requests: 'viewing_request',
  property_submissions: 'property_submission',
} as const;

const SITE_URL = 'https://k-pearl-agency.vercel.app';

function admin() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } },
  );
}

async function resolveRecipients(payload: LeadPayload): Promise<Recipient[]> {
  const db = admin();
  const map = new Map<string, Recipient>();

  const add = (r: { full_name?: string | null; email?: string | null; whatsapp?: string | null }) => {
    if (!r.email) return;
    map.set(r.email, {
      name: r.full_name ?? 'K Pearl',
      email: r.email,
      whatsapp: r.whatsapp ?? null,
    });
  };

  // every admin
  const { data: admins } = await db
    .from('profiles')
    .select('full_name, whatsapp, id')
    .eq('role', 'admin');
  for (const a of admins ?? []) {
    const { data: user } = await db.auth.admin.getUserById(a.id as string);
    add({ full_name: a.full_name as string, whatsapp: a.whatsapp as string, email: user.user?.email });
  }

  // the assigned agent, for inquiries / viewing_requests
  const assignedTo = payload.record.assigned_to;
  if (payload.table !== 'property_submissions' && typeof assignedTo === 'string') {
    const { data: agent } = await db
      .from('profiles')
      .select('full_name, whatsapp')
      .eq('id', assignedTo)
      .maybeSingle();
    const { data: user } = await db.auth.admin.getUserById(assignedTo);
    if (agent) {
      add({
        full_name: agent.full_name as string,
        whatsapp: agent.whatsapp as string,
        email: user.user?.email,
      });
    }
  }

  return [...map.values()];
}

function buildNotification(payload: LeadPayload, recipients: Recipient[]): LeadNotification {
  const kind = KIND_BY_TABLE[payload.table];
  const r = payload.record;
  const lines: string[] = [];

  const label = kind.replace('_', ' ');
  lines.push(`A new ${label} was submitted on the K Pearl Agency website.`, '');

  if (payload.table === 'property_submissions') {
    lines.push(
      `From: ${r.submitter_name ?? '—'}`,
      `Phone: ${r.submitter_phone ?? '—'}`,
      `Email: ${r.submitter_email ?? '—'}`,
      '',
      `Proposed: ${r.proposed_title ?? '—'} (${r.proposed_listing_type ?? '—'} / ${r.proposed_property_type ?? '—'})`,
      r.proposed_description ? `\n${r.proposed_description as string}` : '',
    );
  } else {
    lines.push(
      `From: ${r.name ?? '—'}`,
      `Phone: ${r.phone ?? '—'}`,
      `Email: ${r.email ?? '—'}`,
      `Preferred contact: ${r.preferred_contact_method ?? '—'}`,
    );
    if (payload.table === 'viewing_requests') {
      lines.push(
        `Preferred date: ${r.preferred_date ?? 'any'}`,
        `Preferred time: ${r.preferred_time ?? 'any'}`,
      );
    }
    if (r.message) lines.push('', String(r.message));
  }

  if (r.id) lines.push('', `Reference: ${String(r.id)}`);
  lines.push('', `Open the staff dashboard: ${SITE_URL}/staff`);

  return {
    kind,
    subject: `New ${label} — K Pearl Agency`,
    body: lines.filter((l) => l !== undefined).join('\n'),
    recipients,
  };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const payload = (await req.json()) as LeadPayload;
    if (!payload?.table || !KIND_BY_TABLE[payload.table]) {
      return Response.json({ ok: false, error: 'bad payload' }, { status: 400 });
    }

    const recipients = await resolveRecipients(payload);
    const notification = buildNotification(payload, recipients);
    await Promise.allSettled(activeSenders().map((s) => s.send(notification)));

    return Response.json({ ok: true, recipients: recipients.length });
  } catch (error) {
    console.error('[notify-lead] error', error);
    return Response.json({ ok: false }, { status: 500 });
  }
});
