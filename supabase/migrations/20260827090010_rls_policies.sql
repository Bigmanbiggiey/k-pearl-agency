-- K Pearl Agency — RLS policies and grants (the authorization boundary)
-- docs/database.md v2.0 · docs/security.md · ADR-005 / ADR-007 / ADR-009.
--
-- Model:
--   anon  -> read the public_* views + active areas + site_settings; INSERT
--            leads/submissions only (column-scoped). No SELECT on lead tables.
--   agent -> read the whole catalogue + all leads; mutate only properties
--            (and their media) where agent_id = auth.uid().
--   admin -> everything, plus featured/verified, areas, site_settings, profiles.

-- 1. Strip the auto-exposed blanket grants from anon; re-grant precisely -----
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;

grant select on public.public_properties      to anon;
grant select on public.public_property_media  to anon;
grant select on public.areas                  to anon;
grant select on public.site_settings          to anon;

grant insert (type, property_id, name, phone, email, message, preferred_contact_method)
  on public.inquiries to anon;
grant insert (property_id, name, phone, email, preferred_date, preferred_time, message)
  on public.viewing_requests to anon;
grant insert (submitter_name, submitter_phone, submitter_email, submitter_notes,
              proposed_title, proposed_listing_type, proposed_property_type,
              proposed_area_id, proposed_price, proposed_bedrooms,
              proposed_bathrooms, proposed_description)
  on public.property_submissions to anon;

grant usage, select on sequence public.property_reference_seq to authenticated;

-- 2. profiles --------------------------------------------------------------
create policy profiles_staff_select on public.profiles
  for select to authenticated using (public.is_staff());

create policy profiles_self_or_admin_update on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy profiles_admin_insert on public.profiles
  for insert to authenticated with check (public.is_admin());

create policy profiles_admin_delete on public.profiles
  for delete to authenticated using (public.is_admin());

-- 3. areas ---------------------------------------------------------------
create policy areas_public_read on public.areas
  for select to anon using (is_active);

create policy areas_staff_read on public.areas
  for select to authenticated using (true);

create policy areas_admin_write on public.areas
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 4. properties --------------------------------------------------------
create policy properties_staff_read on public.properties
  for select to authenticated using (public.is_staff());

create policy properties_staff_insert on public.properties
  for insert to authenticated with check (public.is_staff());

create policy properties_owner_or_admin_update on public.properties
  for update to authenticated
  using (public.is_admin() or agent_id = auth.uid())
  with check (public.is_admin() or agent_id = auth.uid());

create policy properties_owner_or_admin_delete on public.properties
  for delete to authenticated
  using (public.is_admin() or agent_id = auth.uid());

-- featured / verified are admin-only, even for the assigned agent
create or replace function public.enforce_property_admin_columns()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null
     and (new.featured is distinct from old.featured
          or new.verified is distinct from old.verified)
     and not public.is_admin() then
    raise exception 'Only an admin may change featured/verified';
  end if;
  return new;
end;
$$;

create trigger properties_enforce_admin_columns
before update on public.properties
for each row execute function public.enforce_property_admin_columns();

-- 5. property_media --------------------------------------------------
create policy property_media_staff_read on public.property_media
  for select to authenticated using (public.is_staff());

create policy property_media_owner_or_admin_write on public.property_media
  for all to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.properties p
      where p.id = property_media.property_id and p.agent_id = auth.uid()
    )
  )
  with check (
    public.is_admin() or exists (
      select 1 from public.properties p
      where p.id = property_media.property_id and p.agent_id = auth.uid()
    )
  );

-- 6. inquiries -------------------------------------------------------
create policy inquiries_anon_insert on public.inquiries
  for insert to anon with check (true);

create policy inquiries_staff_insert on public.inquiries
  for insert to authenticated with check (public.is_staff());

create policy inquiries_staff_select on public.inquiries
  for select to authenticated using (public.is_staff());

create policy inquiries_staff_update on public.inquiries
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy inquiries_admin_delete on public.inquiries
  for delete to authenticated using (public.is_admin());

-- 7. viewing_requests ---------------------------------------------
create policy viewing_requests_anon_insert on public.viewing_requests
  for insert to anon with check (true);

create policy viewing_requests_staff_insert on public.viewing_requests
  for insert to authenticated with check (public.is_staff());

create policy viewing_requests_staff_select on public.viewing_requests
  for select to authenticated using (public.is_staff());

create policy viewing_requests_staff_update on public.viewing_requests
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy viewing_requests_admin_delete on public.viewing_requests
  for delete to authenticated using (public.is_admin());

-- 8. property_submissions ---------------------------------------
create policy property_submissions_anon_insert on public.property_submissions
  for insert to anon with check (true);

create policy property_submissions_staff_select on public.property_submissions
  for select to authenticated using (public.is_staff());

create policy property_submissions_staff_update on public.property_submissions
  for update to authenticated
  using (public.is_staff()) with check (public.is_staff());

create policy property_submissions_admin_delete on public.property_submissions
  for delete to authenticated using (public.is_admin());

-- 9. site_settings --------------------------------------------
create policy site_settings_public_read on public.site_settings
  for select to anon, authenticated using (true);

create policy site_settings_admin_update on public.site_settings
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
