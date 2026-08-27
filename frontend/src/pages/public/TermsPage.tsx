import { Seo } from '@/components/Seo';
import { PageHeader, Prose, Section } from '@/components/ui';
import { LEGAL_REVIEW_BANNER, TERMS } from '@/content/legal';

export default function TermsPage() {
  return (
    <>
      <Seo
        title={TERMS.title}
        description="The terms that govern use of the K Pearl Agency website."
        path="/terms"
      />
      <PageHeader eyebrow="Legal" title={TERMS.title} />

      <Section>
        <p className="mb-6 rounded-md border border-warning/40 bg-warning/10 p-3 text-sm text-charcoal">
          {LEGAL_REVIEW_BANNER}
        </p>
        <Prose>
          <p>{TERMS.intro}</p>
          {TERMS.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </Prose>
      </Section>
    </>
  );
}
