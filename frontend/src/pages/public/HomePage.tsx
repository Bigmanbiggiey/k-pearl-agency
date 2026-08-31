import { Link } from 'react-router-dom';

import { HeroSearch } from '@/components/property/HeroSearch';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Seo } from '@/components/Seo';
import { ButtonLink, Container, Section } from '@/components/ui';
import { HERO, SECTIONS, WHY_KPEARL } from '@/content/home';
import { SERVICES } from '@/content/services';
import { useFeaturedProperties, useLatestProperties } from '@/hooks';

export default function HomePage() {
  const featured = useFeaturedProperties(6);
  const latest = useLatestProperties(6);

  return (
    <>
      <Seo
        description="K Pearl Agency — marketing real estate, creating value. Find property to rent or buy across Nairobi and its environs, and market your property with our team."
        path="/"
      />

      {/* Hero */}
      <div className="bg-ink text-surface">
        <Container className="py-20 sm:py-28">
          <div className="h-px w-12 bg-gold" />
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight sm:text-6xl">{HERO.heading}</h1>
          <p className="mt-5 max-w-2xl text-lg text-surface/75">{HERO.subheading}</p>
          <div className="mt-10 max-w-4xl">
            <HeroSearch />
          </div>
        </Container>
      </div>

      {/* Featured */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl">{SECTIONS.featured.heading}</h2>
            <p className="mt-2 text-muted">{SECTIONS.featured.subheading}</p>
          </div>
          <Link
            to={SECTIONS.featured.cta.to}
            className="text-sm font-medium text-gold-deep underline underline-offset-4"
          >
            {SECTIONS.featured.cta.label}
          </Link>
        </div>
        <div className="mt-8">
          <PropertyGrid
            properties={featured.data}
            isLoading={featured.isLoading}
            isError={featured.isError}
            emptyMessage="Featured properties will appear here once listings are published."
          />
        </div>
      </Section>

      {/* Services overview */}
      <Section tone="surface-alt">
        <h2 className="text-3xl">{SECTIONS.services.heading}</h2>
        <p className="mt-2 max-w-2xl text-muted">{SECTIONS.services.subheading}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => (
            <div key={service.id} className="rounded-md border border-line bg-surface p-5">
              <h3 className="text-lg">{service.title}</h3>
              <p className="mt-2 text-sm text-charcoal">{service.blurb}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <ButtonLink variant="secondary" to={SECTIONS.services.cta.to}>
            {SECTIONS.services.cta.label}
          </ButtonLink>
        </div>
      </Section>

      {/* Why K Pearl */}
      <Section>
        <h2 className="text-3xl">{WHY_KPEARL.heading}</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          {WHY_KPEARL.points.map((point) => (
            <div key={point.title}>
              <div className="h-px w-8 bg-gold" />
              <h3 className="mt-4 text-xl">{point.title}</h3>
              <p className="mt-2 text-charcoal">{point.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Latest */}
      <Section tone="surface-alt">
        <h2 className="text-3xl">{SECTIONS.latest.heading}</h2>
        <p className="mt-2 text-muted">{SECTIONS.latest.subheading}</p>
        <div className="mt-8">
          <PropertyGrid
            properties={latest.data}
            isLoading={latest.isLoading}
            isError={latest.isError}
            emptyMessage="New listings will appear here."
          />
        </div>
      </Section>

      {/* Owner CTA */}
      <Section tone="ink">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl">{SECTIONS.ownerCta.heading}</h2>
            <p className="mt-3 text-surface/75">{SECTIONS.ownerCta.body}</p>
          </div>
          <Link
            to={SECTIONS.ownerCta.cta.to}
            className="rounded-sm bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold-deep"
          >
            {SECTIONS.ownerCta.cta.label}
          </Link>
        </div>
      </Section>
    </>
  );
}
