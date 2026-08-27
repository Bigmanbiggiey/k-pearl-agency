-- K Pearl Agency — viewing_requests (capture-only, ADR-006)
-- docs/database.md v2.0.

create table public.viewing_requests (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid not null references public.properties (id) on delete set null,
  name            text not null,
  phone           text not null,
  email           text,
  preferred_date  date,
  preferred_time  text check (preferred_time in ('morning', 'afternoon', 'evening')),
  message         text,
  status          text not null default 'new' check (status in ('new', 'scheduled', 'completed', 'cancelled')),
  assigned_to     uuid references public.profiles (id) on delete set null,
  internal_notes  text,                           -- staff-only (public has no SELECT)
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.viewing_requests enable row level security;

create index viewing_requests_status_created_idx on public.viewing_requests (status, created_at desc);
create index viewing_requests_property_idx       on public.viewing_requests (property_id);

create trigger viewing_requests_set_updated_at
before update on public.viewing_requests
for each row execute function public.set_updated_at();
