-- K Pearl Agency — property_media
-- docs/database.md v2.0. Files live in the `property-media` storage bucket.

create table public.property_media (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid not null references public.properties (id) on delete cascade,
  storage_path text not null,
  alt_text     text not null default '',
  sort_order   integer not null default 0,
  is_cover     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.property_media enable row level security;

create index property_media_property_sort_idx
  on public.property_media (property_id, sort_order);

-- at most one cover image per property
create unique index property_media_one_cover_idx
  on public.property_media (property_id)
  where is_cover;
