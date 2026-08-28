-- K Pearl Agency — staff RPCs (Phase 6).

-- ─────────────────────────────────────────────────────────────────────────
-- Convert a queued property submission into a draft property (ADR-009).
-- One transaction; staff only.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.convert_property_submission(
  p_submission_id uuid,
  p_agent_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sub    public.property_submissions%rowtype;
  v_new_id uuid;
  v_slug   text;
begin
  if not public.is_staff() then
    raise exception 'Not authorised';
  end if;

  select * into v_sub from public.property_submissions where id = p_submission_id for update;
  if not found then
    raise exception 'Submission not found';
  end if;
  if v_sub.status = 'converted' then
    raise exception 'Submission already converted';
  end if;

  v_slug := regexp_replace(lower(trim(coalesce(v_sub.proposed_title, 'listing'))), '[^a-z0-9]+', '-', 'g');
  v_slug := trim(both '-' from v_slug);
  if v_slug = '' then
    v_slug := 'listing';
  end if;
  v_slug := v_slug || '-' || substr(md5(random()::text), 1, 6);

  insert into public.properties (
    title, slug, listing_type, price_period, property_type, status,
    price, area_id, bedrooms, bathrooms, description, agent_id, created_by
  ) values (
    coalesce(v_sub.proposed_title, 'Untitled listing'),
    v_slug,
    v_sub.proposed_listing_type,
    case v_sub.proposed_listing_type when 'rent' then 'month' when 'short_let' then 'night' else null end,
    v_sub.proposed_property_type,
    'draft',
    v_sub.proposed_price,
    v_sub.proposed_area_id,
    v_sub.proposed_bedrooms,
    v_sub.proposed_bathrooms,
    coalesce(v_sub.proposed_description, ''),
    p_agent_id,
    auth.uid()
  )
  returning id into v_new_id;

  update public.property_submissions
    set status = 'converted',
        converted_property_id = v_new_id,
        reviewed_by = auth.uid(),
        updated_at = now()
    where id = p_submission_id;

  return v_new_id;
end;
$$;

revoke execute on function public.convert_property_submission(uuid, uuid) from public;
grant execute on function public.convert_property_submission(uuid, uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- Dashboard tile numbers in one round-trip. Counts only — no PII.
-- ─────────────────────────────────────────────────────────────────────────
create or replace function public.staff_dashboard_counts()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'properties_total',       (select count(*) from public.properties),
    'properties_draft',       (select count(*) from public.properties where status = 'draft'),
    'properties_published',   (select count(*) from public.properties where status = 'published'),
    'properties_unavailable', (select count(*) from public.properties where status = 'unavailable'),
    'inquiries_new',          (select count(*) from public.inquiries where status = 'new'),
    'viewing_requests_new',   (select count(*) from public.viewing_requests where status = 'new'),
    'submissions_new',        (select count(*) from public.property_submissions where status = 'new')
  );
$$;

revoke execute on function public.staff_dashboard_counts() from public;
grant execute on function public.staff_dashboard_counts() to authenticated;
