-- K Pearl Agency — inquiries (property enquiries + general messages)
-- docs/database.md v2.0. ADR-009 moved owner listings to property_submissions.

create table public.inquiries (
  id                        uuid primary key default gen_random_uuid(),
  type                      text not null check (type in ('property_enquiry', 'general')),
  property_id               uuid references public.properties (id) on delete set null,
  name                      text not null,
  phone                     text not null,
  email                     text,
  message                   text not null,
  preferred_contact_method  text not null check (preferred_contact_method in ('phone', 'whatsapp', 'email')),
  status                    text not null default 'new' check (status in ('new', 'contacted', 'in_progress', 'closed')),
  assigned_to               uuid references public.profiles (id) on delete set null,
  internal_notes            text,                 -- staff-only (public has no SELECT)
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create index inquiries_status_created_idx on public.inquiries (status, created_at desc);
create index inquiries_type_idx           on public.inquiries (type);
create index inquiries_assigned_idx       on public.inquiries (assigned_to);
create index inquiries_property_idx       on public.inquiries (property_id);

create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();
