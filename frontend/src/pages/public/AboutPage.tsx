import { Seo } from '@/components/Seo';
import { ButtonLink, PageHeader, Prose, Section } from '@/components/ui';
import { ABOUT } from '@/content/about';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        description="K Pearl Agency is a marketing-led real estate agency representing residential and commercial property to rent and buy across Nairobi and its environs."
        path="/about"
      />
      <PageHeader eyebrow={ABOUT.eyebrow} title={ABOUT.title} lede={ABOUT.lede} />

      <Section>
        <Prose>
          {ABOUT.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Prose>
      </Section>

      <Section tone="surface-alt">
        <h2 className="text-3xl">How we work</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {ABOUT.principles.map((principle) => (
            <div key={principle.title}>
              <div className="h-px w-8 bg-gold" />
              <h3 className="mt-4 text-xl">{principle.title}</h3>
              <p className="mt-2 text-charcoal">{principle.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/properties">Browse properties</ButtonLink>
          <ButtonLink variant="secondary" to="/contact">
            Contact K Pearl
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
