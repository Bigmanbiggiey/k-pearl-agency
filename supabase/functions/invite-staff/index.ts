// K Pearl Agency — invite-staff Edge Function (decision 19.c: invite-only, no
// public signup).
//
// POST { email, fullName, role }. Verifies the caller's JWT (verify_jwt = true)
// AND that their profiles.role = 'admin' (looked up with the service-role key),
// then sends a Supabase invite email and sets the new profile's name + role.
//
// Secrets (hosted project only): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// SUPABASE_ANON_KEY are provided by the platform.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SITE_URL = 'https://k-pearl-agency.vercel.app';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface InvitePayload {
  email?: string;
  fullName?: string;
  role?: 'admin' | 'agent';
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

function admin() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } },
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader) return json({ ok: false, error: 'unauthorized' }, 401);

  const db = admin();

  // Who is calling?
  const { data: caller, error: callerError } = await db.auth.getUser(
    authHeader.replace('Bearer ', ''),
  );
  if (callerError || !caller.user) return json({ ok: false, error: 'unauthorized' }, 401);

  const { data: callerProfile } = await db
    .from('profiles')
    .select('role')
    .eq('id', caller.user.id)
    .maybeSingle();
  if (callerProfile?.role !== 'admin') return json({ ok: false, error: 'forbidden' }, 403);

  let payload: InvitePayload;
  try {
    payload = (await req.json()) as InvitePayload;
  } catch {
    return json({ ok: false, error: 'bad json' }, 400);
  }

  const email = payload.email?.trim().toLowerCase();
  const fullName = payload.fullName?.trim() ?? '';
  const role = payload.role === 'admin' ? 'admin' : 'agent';
  if (!email || !email.includes('@') || fullName.length < 2) {
    return json({ ok: false, error: 'bad payload' }, 400);
  }

  const { data: invited, error: inviteError } = await db.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo: `${SITE_URL}/staff/reset`,
  });
  if (inviteError || !invited.user) {
    console.error('[invite-staff] invite failed', inviteError);
    return json({ ok: false, error: inviteError?.message ?? 'invite failed' }, 400);
  }

  // handle_new_user created the profile row (role 'agent'); set name + role.
  const { error: profileError } = await db
    .from('profiles')
    .update({ full_name: fullName, role })
    .eq('id', invited.user.id);
  if (profileError) {
    console.error('[invite-staff] profile update failed', profileError);
    return json({ ok: false, error: 'profile update failed' }, 500);
  }

  return json({ ok: true, userId: invited.user.id });
});
