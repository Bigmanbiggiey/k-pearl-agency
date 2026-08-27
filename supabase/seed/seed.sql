-- K Pearl Agency — DEVELOPMENT seed data. NOT FOR PRODUCTION.
-- Loaded only by local `supabase db reset` (config.toml -> [db.seed]).
--
-- Reference data (areas, site_settings) lives in
-- supabase/migrations/20260827090012_reference_data.sql and is applied to every
-- environment. This file adds dev-only staff users and sample listings on top.

-- ─────────────────────────────────────────────────────────────────────────
-- DEV staff users (local only). Password for both: password123
-- ─────────────────────────────────────────────────────────────────────────
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
   confirmation_token, recovery_token, email_change_token_new, email_change)
values
  ('00000000-0000-0000-0000-000000000000',
   '11111111-1111-1111-1111-111111111111',
   'authenticated', 'authenticated', 'admin@kpearl.local',
   extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"K Pearl Admin"}',
   now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000',
   '22222222-2222-2222-2222-222222222222',
   'authenticated', 'authenticated', 'agent@kpearl.local',
   extensions.crypt('password123', extensions.gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"K Pearl Agent"}',
   now(), now(), '', '', '', '');

insert into auth.identities
  (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values
  (gen_random_uuid(), '11111111-1111-1111-1111-111111111111',
   '11111111-1111-1111-1111-111111111111',
   '{"sub":"11111111-1111-1111-1111-111111111111","email":"admin@kpearl.local"}',
   'email', now(), now(), now()),
  (gen_random_uuid(), '22222222-2222-2222-2222-222222222222',
   '22222222-2222-2222-2222-222222222222',
   '{"sub":"22222222-2222-2222-2222-222222222222","email":"agent@kpearl.local"}',
   'email', now(), now(), now());

-- the handle_new_user trigger created profile rows; set details + roles
update public.profiles
  set role = 'admin', full_name = 'K Pearl Admin', phone = '+254704061324', whatsapp = '+254704061324'
  where id = '11111111-1111-1111-1111-111111111111';
update public.profiles
  set role = 'agent', full_name = 'K Pearl Agent', phone = '+254700000002', whatsapp = '+254700000002'
  where id = '22222222-2222-2222-2222-222222222222';

-- ─────────────────────────────────────────────────────────────────────────
-- Sample properties (DEV ONLY — placeholder facts, no real photos).
-- ─────────────────────────────────────────────────────────────────────────
insert into public.properties
  (id, title, slug, listing_type, price_period, property_type, status, price,
   area_id, bedrooms, bathrooms, size_value, size_unit, description, amenities,
   featured, verified, agent_id, published_at)
values
  ('a0000001-0000-0000-0000-000000000001',
   '2-Bed Apartment in Kilimani', '2-bed-apartment-kilimani', 'rent', 'month',
   'apartment', 'published', 85000,
   (select id from public.areas where slug = 'kilimani'), 2, 2, 95, 'sqm',
   'Bright two-bedroom apartment with a balcony, close to Yaya Centre.',
   '["parking","lift","backup_power","balcony","24h_security"]'::jsonb,
   true, true, '22222222-2222-2222-2222-222222222222', now()),

  ('a0000002-0000-0000-0000-000000000002',
   '4-Bedroom Townhouse, Lavington', '4-bed-townhouse-lavington', 'sale', null,
   'townhouse', 'published', 42000000,
   (select id from public.areas where slug = 'lavington'), 4, 4, 260, 'sqm',
   'Spacious townhouse in a gated court with a private garden and DSQ.',
   '["parking","gated_community","garden","dsq","cctv","borehole"]'::jsonb,
   true, true, '22222222-2222-2222-2222-222222222222', now()),

  ('a0000003-0000-0000-0000-000000000003',
   'Furnished Studio, Westlands (short stay)', 'furnished-studio-westlands-short-stay',
   'short_let', 'night', 'studio', 'published', 6500,
   (select id from public.areas where slug = 'westlands'), 1, 1, 38, 'sqm',
   'Fully furnished studio for nightly or weekly stays. Wi-Fi and housekeeping included.',
   '["furnished","fibre_internet","backup_power","lift","24h_security"]'::jsonb,
   false, true, '22222222-2222-2222-2222-222222222222', now()),

  ('a0000004-0000-0000-0000-000000000004',
   '3-Bed Maisonette, Kitengela', '3-bed-maisonette-kitengela', 'rent', 'month',
   'maisonette', 'published', 55000,
   (select id from public.areas where slug = 'kitengela'), 3, 3, 140, 'sqm',
   'Family maisonette in a serviced compound with borehole water and ample parking.',
   '["parking","borehole","gated_community","garden"]'::jsonb,
   false, false, '22222222-2222-2222-2222-222222222222', now()),

  ('a0000005-0000-0000-0000-000000000005',
   'Commercial Office Space, Upper Hill area', 'commercial-office-space-upper-hill',
   'rent', 'month', 'office', 'published', 320000,
   (select id from public.areas where slug = 'kilimani'), null, 2, 300, 'sqm',
   'Open-plan office floor with lift access, backup power and dedicated parking bays.',
   '["parking","lift","backup_power","air_conditioning","cctv","24h_security"]'::jsonb,
   false, true, null, now()),

  ('a0000006-0000-0000-0000-000000000006',
   'Half-Acre Plot, Ruiru', 'half-acre-plot-ruiru', 'sale', null,
   'land', 'published', 9500000,
   (select id from public.areas where slug = 'ruiru'), null, null, 0.5, 'acre',
   'Residential plot with a ready title deed in a fast-growing neighbourhood.',
   '[]'::jsonb,
   true, false, '22222222-2222-2222-2222-222222222222', now()),

  ('a0000007-0000-0000-0000-000000000007',
   'Bedsitter, South B', 'bedsitter-south-b', 'rent', 'month',
   'bedsitter', 'draft', 18000,
   (select id from public.areas where slug = 'south-b'), 1, 1, 24, 'sqm',
   'Compact bedsitter near the shopping centre. Listing still being prepared.',
   '["24h_security","mains_water"]'::jsonb,
   false, false, '22222222-2222-2222-2222-222222222222', null),

  ('a0000008-0000-0000-0000-000000000008',
   'Standalone House, Karen', 'standalone-house-karen', 'sale', null,
   'house', 'unavailable', 78000000,
   (select id from public.areas where slug = 'karen'), 5, 5, 420, 'sqm',
   'Under offer — kept for records.',
   '["parking","borehole","garden","dsq","solar_water"]'::jsonb,
   false, true, '22222222-2222-2222-2222-222222222222', now());

-- placeholder media (paths are not real objects; real photos are added from the
-- admin panel during testing)
insert into public.property_media (property_id, storage_path, alt_text, sort_order, is_cover)
select p.id,
       'properties/' || p.id || '/placeholder-1.jpg',
       p.title || ' — photo 1', 0, true
from public.properties p
where p.status in ('published', 'unavailable');

insert into public.property_media (property_id, storage_path, alt_text, sort_order, is_cover)
select p.id,
       'properties/' || p.id || '/placeholder-2.jpg',
       p.title || ' — photo 2', 1, false
from public.properties p
where p.status = 'published';
