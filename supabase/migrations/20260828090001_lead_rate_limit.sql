-- K Pearl Agency — lightweight rate limit for public lead submissions.
-- Rejects a second insert with the same phone number into the same lead table
-- within 45 seconds. Only enforced for anonymous (public) inserts; staff-entered
-- rows are exempt. Pairs with the honeypot + min-submit-time checks in the app
-- (docs/security.md). CAPTCHA remains conditional on spam becoming material.

create or replace function public.enforce_lead_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  phone_col text := tg_argv[0];
  phone_val text := (to_jsonb(new) ->> phone_col);
  recent    integer;
begin
  -- exempt staff / service-role / direct SQL
  if coalesce(auth.jwt() ->> 'role', '') <> 'anon' then
    return new;
  end if;

  if phone_val is null or phone_val = '' then
    return new;
  end if;

  execute format(
    'select count(*) from public.%I where %I = $1 and created_at > now() - interval ''45 seconds''',
    tg_table_name, phone_col
  )
  into recent
  using phone_val;

  if recent > 0 then
    raise exception
      'lead_rate_limited: You are sending messages too quickly. Please wait a moment and try again.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger inquiries_rate_limit
before insert on public.inquiries
for each row execute function public.enforce_lead_rate_limit('phone');

create trigger viewing_requests_rate_limit
before insert on public.viewing_requests
for each row execute function public.enforce_lead_rate_limit('phone');

create trigger property_submissions_rate_limit
before insert on public.property_submissions
for each row execute function public.enforce_lead_rate_limit('submitter_phone');
