import { createClient } from '@supabase/supabase-js';

// Vite exposes only variables beginning with VITE_. Never use a service-role key here.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey
  ? createClient(url, anonKey)
  : null;
