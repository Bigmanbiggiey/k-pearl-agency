-- K Pearl Agency — properties
-- docs/database.md v2.0. ADR-003 (rent|sale|short_let), ADR-007 (agent_id).

create sequence if not exists public.property_reference_seq;

create table public.properties (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  slug            text not null unique,
  reference_code  text not null unique,           -- set by trigger if null

  listing_type    text not null check (listing_type in ('rent', 'sale', 'short_let')),
  price_period    text check (price_period in ('month', 'night', 'week')),
  property_type   text not null check (property_type in (
                    'apartment', 'house', 'townhouse', 'maisonette', 'studio',
                    'bedsitter', 'office', 'shop', 'land')),
  status          text not null default 'draft' check (status in (
                    'draft', 'published', 'unavailable', 'let_or_sold', 'archived')),

  price           numeric(12, 2),                 -- null => "price on request"
  currency        text not null default 'KES' check (currency = 'KES'),

  area_id         uuid references public.areas (id) on delete set null,

  -- staff-only (excluded from public_properties)
  address_line    text,
  latitude        numeric(9, 6),
  longitude       numeric(9, 6),
  owner_name      text,
  owner_phone     text,
  owner_email     text,

  bedrooms        integer,
  bathrooms       numeric(3, 1),
  size_value      numeric(10, 2),
  size_unit       text check (size_unit in ('sqm', 'sqft', 'acre', 'ha')),

  description     text not null default '',
  amenities      jsonb not null default '[]'::jsonb,

  featured       boolean not null default false,  -- admin-only write (trigger)
  verified       boolean not null default false,  -- admin-only write (trigger)

  available_from date,

  agent_id       uuid references public.profiles (id) on delete set null,
  created_by     uuid default auth.uid() references public.profiles (id) on delete set null,

  published_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  -- a sale has no rate period; rent / short_let may set one
  constraint properties_sale_has_no_period
    check (not (listing_type = 'sale' and price_period is not null))
);

alter table public.properties enable row level security;

create index properties_status_published_idx on public.properties (status, published_at desc);
create index properties_type_idx             on public.properties (listing_type, property_type);
create index properties_area_idx             on public.properties (area_id);
create index properties_price_idx            on public.properties (price);
create index properties_featured_pub_idx     on public.properties (featured) where status = 'published';

create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

-- reference code: KP-0001, KP-0002, ...
create or replace function public.set_property_reference_code()
returns trigger
language plpgsql
as $$
begin
  if new.reference_code is null or new.reference_code = '' then
    new.reference_code := 'KP-' || lpad(nextval('public.property_reference_seq')::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger properties_set_reference_code
before insert on public.properties
for each row execute function public.set_property_reference_code();

-- stamp published_at on the first transition into 'published'
create or replace function public.set_property_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create trigger properties_set_published_at
before insert or update on public.properties
for each row execute function public.set_property_published_at();
