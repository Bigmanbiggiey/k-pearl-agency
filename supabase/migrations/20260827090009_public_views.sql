-- K Pearl Agency — public read views
-- docs/database.md v2.0. These hide staff-only columns from anon and limit rows
-- to published listings. Created SECURITY DEFINER (security_invoker = false) so
-- anon needs privileges only on the view, not the base tables. Area name/county
-- are denormalised in so the public paths need no join.

create view public.public_properties
with (security_invoker = false, security_barrier = true) as
select
  p.id,
  p.title,
  p.slug,
  p.reference_code,
  p.listing_type,
  p.price_period,
  p.property_type,
  p.price,
  p.currency,
  p.area_id,
  a.name   as area_name,
  a.county as area_county,
  p.bedrooms,
  p.bathrooms,
  p.size_value,
  p.size_unit,
  p.description,
  p.amenities,
  p.featured,
  p.verified,
  p.available_from,
  p.published_at,
  p.created_at
from public.properties p
left join public.areas a on a.id = p.area_id
where p.status = 'published';

create view public.public_property_media
with (security_invoker = false, security_barrier = true) as
select
  m.id,
  m.property_id,
  m.storage_path,
  m.alt_text,
  m.sort_order,
  m.is_cover,
  m.created_at
from public.property_media m
join public.properties p on p.id = m.property_id
where p.status = 'published';

grant select on public.public_properties      to anon, authenticated;
grant select on public.public_property_media  to anon, authenticated;
