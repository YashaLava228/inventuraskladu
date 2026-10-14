# Supabase integration — work in progress

This branch adds **only a Supabase client and stock API module**. The existing App.jsx
still reads/writes browser localStorage. Do not treat this as a completed migration or
publish it as a multi-user stock system yet.

## Configuration

1. In Supabase dashboard open Project Settings > API (or Connect).
2. Copy the project URL and the **publishable/anon** key, never the secret/service_role key.
3. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting provider.
4. For local development, copy .env.example to .env.local and fill in the two values.
5. Run npm install then npm run build.

## Next steps

- Replace insecure local login and stored passwords with Supabase Auth sessions.
- Verify server-side profile permissions for adding, editing and deleting products.
- Connect inventory +/- and exact-set controls to stockApi.js and refresh quantities after writes.
- Export localStorage data **before** importing into products and review quantities (currently provisional).
- Never automatically seed provisional quantities into production without user review.
- Review browser Telegram token handling and move bot calls to a protected server endpoint.
- Test two users making concurrent updates before deploying.
