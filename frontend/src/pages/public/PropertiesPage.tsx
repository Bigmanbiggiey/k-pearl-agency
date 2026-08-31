import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Seo } from '@/components/Seo';
import { Container, PageHeader } from '@/components/ui';
import {
  ActiveFilterChips,
  activeFilterCount,
  FiltersSheet,
  hasActiveFilters,
  Pagination,
  PropertyFilters,
  SortSelect,
  usePropertyFilters,
} from '@/features/property-search';
import { useDebouncedCallback, useProperties } from '@/hooks';

export default function PropertiesPage() {
  const { filters, setFilter, clearFilters } = usePropertyFilters();
  const { data, isLoading, isError } = useProperties(filters);

  const total = data?.total ?? 0;
  const filtered = hasActiveFilters(filters) || filters.page > 1;

  const commitKeyword = useDebouncedCallback((value: string) => {
    setFilter('keyword', value.trim() === '' ? undefined : value.trim());
  }, 350);

  return (
    <>
      <Seo
        title="Properties"
        description="Browse properties to rent, buy or short-let across Nairobi and its environs with K Pearl Agency."
        path="/properties"
        noindex={filtered}
      />
      <PageHeader
        eyebrow="Properties"
        title="Find a property"
        lede="Filter by what you need — to rent, to buy or a short stay — across Nairobi and its environs."
      />

      <Container className="py-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {isLoading ? 'Loading…' : `${total} ${total === 1 ? 'property' : 'properties'}`}
          </p>
          <div className="flex items-center gap-3">
            <SortSelect value={filters.sort} onChange={(v) => setFilter('sort', v)} />
            <FiltersSheet
              filters={filters}
              setFilter={setFilter}
              onClear={clearFilters}
              activeCount={activeFilterCount(filters)}
              resultCount={total}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="property-keyword" className="sr-only">
            Search properties
          </label>
          <input
            id="property-keyword"
            key={filters.keyword ?? ''}
            type="search"
            defaultValue={filters.keyword ?? ''}
            onChange={(e) => commitKeyword(e.currentTarget.value)}
            placeholder="Search by title, area or keyword"
            className="w-full max-w-md rounded-sm border border-line bg-ivory px-3 py-2.5 text-sm text-ink focus-visible:outline-2 focus-visible:outline-gold"
          />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[18rem_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-md border border-line bg-ivory p-5">
              <PropertyFilters filters={filters} setFilter={setFilter} onClear={clearFilters} />
            </div>
          </aside>

          <div>
            <ActiveFilterChips filters={filters} setFilter={setFilter} />

            {!isLoading && !isError && total === 0 ? (
              <div className="rounded-md border border-line bg-ivory p-8 text-center">
                <p className="text-charcoal">No properties match these filters.</p>
                {hasActiveFilters(filters) ? (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 inline-block rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-ink hover:bg-gold-deep"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            ) : (
              <>
                <PropertyGrid
                  properties={data?.items}
                  isLoading={isLoading}
                  isError={isError}
                  skeletonCount={6}
                />
                {data ? (
                  <Pagination
                    page={data.page}
                    pageSize={data.pageSize}
                    total={data.total}
                    onPageChange={(p) => setFilter('page', p)}
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
