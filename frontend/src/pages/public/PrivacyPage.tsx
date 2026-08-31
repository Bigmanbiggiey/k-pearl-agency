import { Seo } from '@/components/Seo';
import { PageHeader, Prose, Section } from '@/components/ui';
import { LEGAL_EFFECTIVE, LEGAL_REVIEW_BANNER, PRIVACY } from '@/content/legal';

export default function PrivacyPage() {
  return (
    <>
      <Seo
        title={PRIVACY.title}
        description="How K Pearl Agency handles personal information submitted through this website."
        path="/privacy"
      />
      <PageHeader eyebrow="Legal" title={PRIVACY.title} />

      <Section>
        <p className="mb-6 rounded-md border border-warning/40 bg-warning/10 p-3 text-sm text-charcoal">
          {LEGAL_REVIEW_BANNER}
        </p>
        <Prose>
          <p className="text-sm text-muted">Effective date: {LEGAL_EFFECTIVE}</p>
          <p>{PRIVACY.intro}</p>
          {PRIVACY.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </Prose>
      </Section>
    </>
  );
}
