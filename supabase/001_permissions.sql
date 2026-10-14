-- Inventura Skladu: permissions hardening.
-- Execute once in Supabase SQL Editor after initial tables and stock RPC functions exist.
-- Stock changes are permitted ONLY through adjust_stock / set_stock_quantity.
-- These functions check that the caller is an authenticated user with a profile.

BEGIN;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_sessions ENABLE ROW LEVEL SECURITY;

-- Browser clients should never directly update quantities or fabricate history.
REVOKE INSERT, UPDATE, DELETE ON public.stock_history FROM anon, authenticated;
REVOKE UPDATE, DELETE ON public.products FROM anon, authenticated;

-- Privileges also require matching RLS policies. Admin product inserts have a policy.
GRANT SELECT ON public.products, public.stock_history,
  public.profiles, public.inventory_sessions TO authenticated;
GRANT INSERT ON public.products TO authenticated;

-- Enforce positive stock counts at the database level.
-- This is already set by the initial products schema; reassert safely if missing.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.products'::regclass
      AND conname = 'products_quantity_nonnegative'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT products_quantity_nonnegative CHECK (quantity >= 0);
  END IF;
END $$;

-- Ensure the stock RPCs are not callable by anonymous clients.
REVOKE ALL ON FUNCTION public.adjust_stock(text, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.set_stock_quantity(text, integer, integer)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.adjust_stock(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_stock_quantity(text, integer, integer)
  TO authenticated;

COMMIT;

-- NOTE: Profiles are created manually by the admin in Supabase dashboard.
-- Do not add a self-service policy that lets employees grant themselves admin.
