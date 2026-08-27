-- K Pearl Agency — storage bucket for property photos
-- docs/database.md v2.0. Public read; staff-only writes. (config.toml also
-- declares this bucket for local dev; this migration is what production gets.)

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-media',
  'property-media',
  true,
  8388608,                                  -- 8 MiB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read
create policy "property-media public read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'property-media');

-- Staff (admin or agent) write
create policy "property-media staff insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'property-media' and public.is_staff());

create policy "property-media staff update"
on storage.objects for update
to authenticated
using (bucket_id = 'property-media' and public.is_staff())
with check (bucket_id = 'property-media' and public.is_staff());

create policy "property-media staff delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'property-media' and public.is_staff());
