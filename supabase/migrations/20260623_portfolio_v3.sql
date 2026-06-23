-- ============================================================
-- Admin Users Table — v3
-- ============================================================
-- Run this in Supabase SQL Editor AFTER v1 and v2 migrations.
--
-- This table is the authoritative allowlist of users who can
-- call the sync-portfolio-images Edge Function.
--
-- RLS is enabled with NO public read/write policies.
-- Only the service role (used server-side in Edge Functions)
-- can query this table. The frontend never sees it.
-- ============================================================

create table if not exists admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

alter table admin_users enable row level security;
-- No public policies — only accessible via service role key in Edge Functions.

-- ============================================================
-- SETUP: Add yourself as admin
-- ============================================================
-- 1. Create a Supabase Auth account:
--    Dashboard → Authentication → Users → Add user
--    Use your real email and a strong password.
--
-- 2. Copy the UUID shown for that user, then run:
--
--    insert into admin_users (id, email) values
--      ('<paste-your-user-uuid-here>', 'your@email.com');
--
-- 3. Deploy the Edge Function (see PROJECT_NOTES.md).
--    That's it — the admin page and sync function are now protected.
-- ============================================================
