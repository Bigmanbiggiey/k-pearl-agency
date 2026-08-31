// K Pearl Agency — lead-notification senders (ADR-010).
//
// Launch: emailSender (Gmail SMTP). WhatsApp is added post-launch once the owner
// completes Meta Business verification.

import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

export interface Recipient {
  name: string;
  email: string;
  whatsapp: string | null;
}

export interface LeadNotification {
  kind: 'inquiry' | 'viewing_request' | 'property_submission';
  subject: string;
  body: string;
  recipients: Recipient[];
}

export interface Sender {
  readonly channel: 'email' | 'whatsapp';
  send(n: LeadNotification): Promise<void>;
}

const GMAIL_USER = Deno.env.get('GMAIL_USER');
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD');

export const emailSender: Sender = {
  channel: 'email',
  async send(n) {
    const to = n.recipients.map((r) => r.email).filter(Boolean);
    if (to.length === 0) {
      console.log('[notify-lead] no email recipients resolved; skipping');
      return;
    }

    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
      // Local dev / not-yet-configured: log the intended email instead of sending.
      console.log(
        `[notify-lead] (no GMAIL secrets) would email ${to.join(', ')}\nSubject: ${n.subject}\n\n${n.body}`,
      );
      return;
    }

    const client = new SMTPClient({
      connection: {
        hostname: 'smtp.gmail.com',
        port: 465,
        tls: true,
        auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
      },
    });

    try {
      await client.send({
        from: `K Pearl Agency <${GMAIL_USER}>`,
        to,
        subject: n.subject,
        content: n.body,
      });
    } finally {
      await client.close();
    }
  },
};

export const whatsappSender: Sender = {
  channel: 'whatsapp',
  send(n) {
    // Post-launch: POST to the WhatsApp Cloud API with an approved template.
    console.log(
      `[notify-lead] (stub) whatsapp -> ${n.recipients.filter((r) => r.whatsapp).length} recipient(s): ${n.subject}`,
    );
    return Promise.resolve();
  },
};

/** Channels active for the current phase. WhatsApp is added post-launch. */
export function activeSenders(): Sender[] {
  return [emailSender];
}
