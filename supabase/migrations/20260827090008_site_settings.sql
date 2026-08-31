-- K Pearl Agency — site_settings (single editable row of public contact info)
-- docs/database.md v2.0. Questionnaire Q7–Q12.

create table public.site_settings (
  id             boolean primary key default true check (id),   -- enforces one row
  phone          text not null,
  whatsapp       text not null,
  email          text not null,
  hours_weekday  text not null,
  hours_weekend  text not null,
  by_appointment boolean not null default true,
  updated_at     timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();
