import { Seo } from '@/components/Seo';
import { ButtonLink, PageHeader, Section } from '@/components/ui';
import { SERVICES, SERVICES_INTRO } from '@/content/services';

export default function ServicesPage() {
  return (
    <>
      <Seo
        title="Services"
        description="K Pearl Agency services: property sales and marketing, letting and tenant sourcing, property search for buyers and tenants, and relocation support across Nairobi."
        path="/services"
      />
      <PageHeader eyebrow="Services" title="How K Pearl can help" lede={SERVICES_INTRO} />

      {SERVICES.map((service, index) => (
        <Section key={service.id} tone={index % 2 === 1 ? 'surface-alt' : 'default'}>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="h-px w-10 bg-gold" />
              <h2 className="mt-4 text-2xl sm:text-3xl">{service.title}</h2>
              <p className="mt-3 text-charcoal">{service.blurb}</p>
              <ButtonLink variant="secondary" to={service.cta.to} className="mt-6">
                {service.cta.label}
              </ButtonLink>
            </div>
            <ul className="space-y-3 self-center">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-charcoal">
                  <span aria-hidden="true" className="mt-1 text-gold">
                    ✦
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ))}
    </>
  );
}
