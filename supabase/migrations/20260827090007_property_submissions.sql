-- K Pearl Agency — property_submissions (owner "list your property" queue)
-- docs/database.md v2.0, ADR-009. Public may INSERT only; staff review/convert.

create table public.property_submissions (
  id                     uuid primary key default gen_random_uuid(),

  submitter_name         text not null,
  submitter_phone        text not null,
  submitter_email        text,
  submitter_notes        text,

  proposed_title         text not null,
  proposed_listing_type  text not null check (proposed_listing_type in ('rent', 'sale', 'short_let')),
  proposed_property_type  text not null check (proposed_property_type in (
                           'apartment', 'house', 'townhouse', 'maisonette', 'studio',
                           'bedsitter', 'office', 'shop', 'land')),
  proposed_area_id       uuid references public.areas (id) on delete set null,
  proposed_price         numeric(12, 2),
  proposed_bedrooms      integer,
  proposed_bathrooms     numeric(3, 1),
  proposed_description   text,

  status                 text not null default 'new' check (status in ('new', 'in_review', 'converted', 'declined')),
  reviewed_by            uuid references public.profiles (id) on delete set null,
  converted_property_id  uuid references public.properties (id) on delete set null,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

alter table public.property_submissions enable row level security;

create index property_submissions_status_created_idx
  on public.property_submissions (status, created_at desc);

create trigger property_submissions_set_updated_at
before update on public.property_submissions
for each row execute function public.set_updated_at();
