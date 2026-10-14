// Supabase Edge Function: worker-register
// Deploy only after setting up tables in supabase/003_worker_registration.sql.
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as Edge Function secrets.
// Do NOT expose the service-role key in the Vite frontend.
import { createClient } from 'npm:@supabase/supabase-js@2';

const origin = Deno.env.get('PUBLIC_SITE_ORIGIN') || 'https://inventuraskladu.pages.dev';
const headers = {
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Headers': 'content-type, authorization, apikey, prefer, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const json = (status: number, body: object) => new Response(JSON.stringify(body), { status, headers });
const digest = async (value: string) => {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(hash)].map(v => v.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });
  if (req.headers.get('origin') && req.headers.get('origin') !== origin) return json(403, { error: 'Origin not allowed' });
  const projectUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!projectUrl || !serviceKey) return json(503, { error: 'Registration unavailable' });
  let payload: { surname?: string; password?: string; code?: string };
  try { payload = await req.json(); } catch { return json(400, { error: 'Invalid request' }); }
  const surname = String(payload.surname || '').trim().normalize('NFKC');
  const login = surname.toLocaleLowerCase('cs-CZ').replace(/\s+/g, '');
  const password = String(payload.password || '');
  const code = String(payload.code || '').trim();
  if (!/^[\p{L}\p{M}0-9-]{2,40}$/u.test(login) || password.length < 10 || password.length > 128 || !/^[a-f0-9]{36}$/.test(code))
    return json(400, { error: 'Check surname, password (at least 10 characters) and invite code' });
  const db = createClient(projectUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const codeHash = await digest(code);
  const { data: invites, error: inviteError } = await db.from('worker_invitations').select('id').eq('code_hash', codeHash)
    .is('used_at', null).gt('expires_at', new Date().toISOString()).limit(1);
  if (inviteError || !invites?.length) return json(400, { error: 'Invitation invalid or expired' });
  const { data: existing } = await db.from('worker_logins').select('login').eq('login', login).maybeSingle();
  if (existing) return json(409, { error: 'Surname already registered; ask admin for a unique login' });

  // Internal email is only a Supabase Auth identifier; user never needs an email.
  const internalEmail = login + '@worker.alemar.invalid';
  const { data: created, error: authError } = await db.auth.admin.createUser({
    email: internalEmail, password, email_confirm: true,
    user_metadata: { surname }
  });
  if (authError || !created.user) return json(409, { error: 'Could not create account; try a unique surname' });
  const uid = created.user.id;
  try {
    const { error: mapError } = await db.from('worker_logins').insert({ login, user_id: uid });
    if (mapError) throw mapError;
    const { error: profileError } = await db.from('profiles').insert({ id: uid, name: surname, role: 'worker' });
    if (profileError) throw profileError;
    const { data: claimed, error: claimError } = await db.from('worker_invitations')
      .update({ used_at: new Date().toISOString(), used_by: uid }).eq('id', invites[0].id)
      .is('used_at', null).select('id');
    if (claimError || !claimed?.length) throw new Error('Invitation already used');
    return json(201, { ok: true });
  } catch (err) {
    await db.from('profiles').delete().eq('id', uid);
    await db.from('worker_logins').delete().eq('user_id', uid);
    await db.auth.admin.deleteUser(uid);
    return json(409, { error: 'Registration unsuccessful. Invite may be in use; please retry with a new code.' });
  }
});
