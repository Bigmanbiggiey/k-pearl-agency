-- K Pearl Agency — areas (admin-managed service-location reference)
-- docs/database.md v2.0. Questionnaire Q4: Nairobi and its environs (open-ended).

create table public.areas (
  id          uuid primary key default gen_random_uuid(),
  county      text not null,
  name        text not null,
  slug        text not null unique,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (county, name)
);

alter table public.areas enable row level security;

create index areas_county_active_idx on public.areas (county, is_active);

create trigger areas_set_updated_at
before update on public.areas
for each row execute function public.set_updated_at();
