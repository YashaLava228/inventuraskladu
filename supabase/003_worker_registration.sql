-- Run in Supabase SQL Editor before deploying registration Edge Function.
-- Invitations are single-use, have an expiry, and are looked up by SHA-256 hash.
CREATE TABLE IF NOT EXISTS public.worker_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  used_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.worker_invitations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.worker_invitations FROM anon, authenticated;
CREATE UNIQUE INDEX IF NOT EXISTS worker_invitations_code_hash_idx
ON public.worker_invitations(code_hash);

-- One worker per normalized surname. If two workers share a surname,
-- assign a unique suffix, e.g. Novak2.
CREATE TABLE IF NOT EXISTS public.worker_logins (
  login text PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.worker_logins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.worker_logins FROM anon, authenticated;

-- Example: generate a one-time invitation in SQL Editor.
-- Store the displayed code privately; do not paste it into GitHub or chat.
-- WITH new_code AS (SELECT encode(gen_random_bytes(18), 'hex') AS code)
-- INSERT INTO public.worker_invitations(code_hash, expires_at)
-- SELECT encode(digest(code, 'sha256'), 'hex'), now() + interval '7 days' FROM new_code
-- RETURNING id;
-- Use this version if you want the code printed in SQL result:
-- WITH code AS (SELECT encode(gen_random_bytes(18), 'hex') AS value),
-- created AS (
--   INSERT INTO public.worker_invitations(code_hash, expires_at)
--   SELECT encode(digest(value, 'sha256'), 'hex'), now() + interval '7 days'
--   FROM code RETURNING code_hash
-- )
-- SELECT code.value AS invitation_code FROM code JOIN created
-- ON created.code_hash = encode(digest(code.value, 'sha256'), 'hex');
