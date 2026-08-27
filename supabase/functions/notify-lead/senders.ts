// K Pearl Agency — lead-notification senders (ADR-010).
//
// SCAFFOLD ONLY (Phase 2). Full wiring is Phase 5:
//   - emailSender: real Gmail SMTP send using GMAIL_USER / GMAIL_APP_PASSWORD.
//   - whatsappSender: real WhatsApp Cloud API call using WHATSAPP_TOKEN /
//     WHATSAPP_PHONE_ID, switched on after the owner's Meta Business verification.

export interface LeadNotification {
  kind: 'inquiry' | 'viewing_request' | 'property_submission';
  subject: string;
  body: string;
  /** Resolved recipients: the assigned agent (if any) plus every admin. */
  recipients: Array<{ email: string; whatsapp: string | null; name: string }>;
}

export interface Sender {
  readonly channel: 'email' | 'whatsapp';
  send(n: LeadNotification): Promise<void>;
}

export const emailSender: Sender = {
  channel: 'email',
  async send(n) {
    // Phase 5: SMTP via smtp.gmail.com:465, auth GMAIL_USER / GMAIL_APP_PASSWORD.
    console.log(`[notify-lead] (stub) email -> ${n.recipients.map((r) => r.email).join(', ')}: ${n.subject}`);
    await Promise.resolve();
  },
};

export const whatsappSender: Sender = {
  channel: 'whatsapp',
  async send(n) {
    // Phase 7+: POST https://graph.facebook.com/v20.0/{WHATSAPP_PHONE_ID}/messages
    // with an approved template; only recipients with a whatsapp number.
    console.log(`[notify-lead] (stub) whatsapp -> ${n.recipients.filter((r) => r.whatsapp).length} recipient(s): ${n.subject}`);
    await Promise.resolve();
  },
};

/** Active senders for the current phase. WhatsApp is added once verified. */
export function activeSenders(): Sender[] {
  return [emailSender];
}
