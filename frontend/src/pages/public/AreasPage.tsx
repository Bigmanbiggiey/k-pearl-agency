import { Link } from 'react-router-dom';

import { Seo } from '@/components/Seo';
import { PageHeader, Section } from '@/components/ui';
import { groupAreasByCounty, useAreas } from '@/hooks';

export default function AreasPage() {
  const { data: areas, isLoading, isError } = useAreas();
  const grouped = groupAreasByCounty(areas ?? []);

  return (
    <>
      <Seo
        title="Areas we serve"
        description="K Pearl Agency covers Nairobi and its environs — neighbourhoods across Nairobi plus satellite towns in Kiambu, Kajiado and Machakos."
        path="/areas"
      />
      <PageHeader
        eyebrow="Coverage"
        title="Areas we serve"
        lede="Nairobi and its environs — city neighbourhoods and the growing satellite towns around them."
      />

      <Section>
        {isLoading ? <p className="text-muted">Loading areas…</p> : null}
        {isError ? <p className="text-muted">We couldn’t load the area list just now.</p> : null}

        <div className="space-y-10">
          {grouped.map((group) => (
            <div key={group.county}>
              <h2 className="text-xl">{group.county} County</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.areas.map((area) => (
                  <li key={area.id}>
                    <Link
                      to={`/properties?areaId=${area.id}`}
                      className="inline-block rounded-full border border-line bg-ivory px-3 py-1.5 text-sm text-charcoal transition-colors hover:border-gold hover:text-gold-deep"
                    >
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
