import { Seo } from '@/components/Seo';
import { Container, PageHeader, Section } from '@/components/ui';
import { useSiteSettings } from '@/hooks';
import { mailtoHref, telHref, whatsappHref } from '@/lib/contact';

export default function ContactPage() {
  const { data: settings, isLoading, isError } = useSiteSettings();

  return (
    <>
      <Seo
        title="Contact"
        description="Contact K Pearl Agency by phone, WhatsApp or email. Viewings and meetings by appointment."
        path="/contact"
      />
      <PageHeader
        eyebrow="Contact"
        title="Talk to K Pearl"
        lede="Call or message us about a property, a viewing, or our services. We aim to reply promptly."
      />

      <Section>
        <Container className="max-w-2xl px-0">
          {isLoading ? <p className="text-muted">Loading contact details…</p> : null}
          {isError ? (
            <p className="text-muted">We couldn’t load the contact details just now.</p>
          ) : null}

          {settings ? (
            <dl className="divide-y divide-line">
              <div className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <dt className="text-sm font-medium text-charcoal">Phone</dt>
                <dd>
                  <a
                    href={telHref(settings.phone)}
                    className="text-gold-deep underline underline-offset-4"
                  >
                    {settings.phone}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <dt className="text-sm font-medium text-charcoal">WhatsApp</dt>
                <dd>
                  <a
                    href={whatsappHref(settings.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold-deep underline underline-offset-4"
                  >
                    Message on WhatsApp
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <dt className="text-sm font-medium text-charcoal">Email</dt>
                <dd>
                  <a
                    href={mailtoHref(settings.email, 'Website enquiry — K Pearl Agency')}
                    className="text-gold-deep underline underline-offset-4"
                  >
                    {settings.email}
                  </a>
                </dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <dt className="text-sm font-medium text-charcoal">Hours</dt>
                <dd className="text-right text-sm text-charcoal">
                  {settings.hoursWeekday}
                  <br />
                  {settings.hoursWeekend}
                </dd>
              </div>
              {settings.byAppointment ? (
                <div className="py-4 text-sm text-muted">
                  Viewings and meetings are arranged by appointment.
                </div>
              ) : null}
            </dl>
          ) : null}

          <p className="mt-8 rounded-md border border-line bg-ivory p-4 text-sm text-muted">
            An online enquiry form is coming soon. For now, please use the phone, WhatsApp or email
            options above.
          </p>
        </Container>
      </Section>
    </>
  );
}
