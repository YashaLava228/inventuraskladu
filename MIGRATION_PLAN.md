# Inventory backend rollout

## Current deployment status

The Cloudflare Pages site currently uses the legacy localStorage state and
browser-side passwords. It is **not** ready for workers or live shared stock
updates. Do not use provisional quantities as real inventory.

## SQL step (do not run twice without reviewing changes)

The earlier conversation's SQL Editor commands create:
- `products`, `profiles`, `stock_history`, `inventory_sessions`
- `adjust_stock(product_id, delta)`
- `set_stock_quantity(product_id, new_quantity, expected_quantity)`

File `supabase/001_permissions.sql` reasserts RLS and removes browser write
grants on history and direct quantity updates. Apply only after inspecting
existing Supabase policies. For production, a follow-up migration should use
fine-grained per-column permissions and admin-only product management.

## Data migration checklist

1. Export `louie_items` and `louie_history` from the original browser
   before making changes or clearing storage. These are not in GitHub.
2. Review quantities: user reported they are provisional.
3. Map `minLimit` (frontend) to `min_limit` (database).
4. Convert unit `pal` to `ks` for category `boxes` only, preserving numbers.
5. Import only reviewed data, then compare product codes and total row counts.
6. Authenticate with Supabase Auth and use `profiles` roles; remove legacy
   hardcoded credentials before inviting coworkers.
7. Use database RPCs for `+`, `-` and exact-set changes; refresh after writes
   and display stale-write conflicts.
8. Audit Telegram token exposure and move its sends server-side.
9. Verify stock audit and concurrent edits with two accounts.

## Cloudflare

Repository branch: `supabase-foundation`
Build command: `npm run build`
Output directory: `dist`
Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
Only the Supabase **publishable** key belongs in the browser.

The Supabase JS package is not yet installed in the current locked dependency
set. `src/lib/` contains prepared integration code, not active application code.
Before importing it into App.jsx, run `npm install @supabase/supabase-js`
and commit **both** package.json and package-lock.json.
