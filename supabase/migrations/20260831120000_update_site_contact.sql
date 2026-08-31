-- K Pearl Agency — update public contact details (owner change 2026-08-31).
-- Phone / WhatsApp -> +254180558075, email -> k.pearlagency@gmail.com.
-- The original values were set by 20260827090012_reference_data.sql, which is
-- already applied everywhere, so this new migration carries the change.
-- Idempotent (upsert on the single settings row); safe to re-run.

insert into public.site_settings
  (id, phone, whatsapp, email, hours_weekday, hours_weekend, by_appointment)
values
  (true, '+254180558075', '+254180558075', 'k.pearlagency@gmail.com',
   'Mon–Fri 8:00 AM – 5:00 PM', 'Sat–Sun 9:00 AM – 2:00 PM', true)
on conflict (id) do update
set phone    = excluded.phone,
    whatsapp = excluded.whatsapp,
    email    = excluded.email;
