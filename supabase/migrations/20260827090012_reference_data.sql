-- K Pearl Agency — reference / configuration data (safe for production).
-- Idempotent: re-running `db push` or `db reset` will not duplicate rows.
-- Dev-only data (staff users, sample properties) stays in supabase/seed/seed.sql.

-- Service areas: Nairobi metro (questionnaire Q4). Admins manage these afterwards.
insert into public.areas (county, name, slug, sort_order) values
  ('Nairobi',  'Kilimani',        'kilimani',        10),
  ('Nairobi',  'Kileleshwa',      'kileleshwa',      20),
  ('Nairobi',  'Lavington',       'lavington',       30),
  ('Nairobi',  'Westlands',       'westlands',       40),
  ('Nairobi',  'Parklands',       'parklands',       50),
  ('Nairobi',  'Karen',           'karen',           60),
  ('Nairobi',  'Lang''ata',       'langata',         70),
  ('Nairobi',  'Runda',           'runda',           80),
  ('Nairobi',  'Kitisuru',        'kitisuru',        90),
  ('Nairobi',  'Ridgeways',       'ridgeways',      100),
  ('Nairobi',  'South B',         'south-b',        110),
  ('Nairobi',  'South C',         'south-c',        120),
  ('Nairobi',  'Donholm',         'donholm',        130),
  ('Nairobi',  'Embakasi',        'embakasi',       140),
  ('Nairobi',  'Roysambu',        'roysambu',       150),
  ('Nairobi',  'Kasarani',        'kasarani',       160),
  ('Kajiado',  'Kitengela',       'kitengela',      170),
  ('Kajiado',  'Ongata Rongai',   'ongata-rongai',  180),
  ('Kajiado',  'Ngong',           'ngong',          190),
  ('Machakos', 'Athi River',      'athi-river',     200),
  ('Machakos', 'Syokimau',        'syokimau',       210),
  ('Machakos', 'Mlolongo',        'mlolongo',       220),
  ('Kiambu',   'Kiambu Town',     'kiambu-town',    230),
  ('Kiambu',   'Kiambu Road',     'kiambu-road',    240),
  ('Kiambu',   'Ruaka',           'ruaka',          250),
  ('Kiambu',   'Ruiru',           'ruiru',          260),
  ('Kiambu',   'Juja',            'juja',           270),
  ('Kiambu',   'Thika',           'thika',          280)
on conflict (slug) do nothing;

-- Single row of public contact info (questionnaire Q7–Q12). Editable by an admin.
insert into public.site_settings
  (id, phone, whatsapp, email, hours_weekday, hours_weekend, by_appointment)
values
  (true, '+254704061324', '+254704061324', 'barakabradley@gmail.com',
   'Mon–Fri 8:00 AM – 5:00 PM', 'Sat–Sun 9:00 AM – 2:00 PM', true)
on conflict (id) do nothing;
