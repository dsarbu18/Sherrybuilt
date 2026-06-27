-- ============================================================
-- Quote Requests Table
-- ============================================================
-- Run this in the Supabase SQL Editor.
-- This replaces the old KV-store-based quote submission flow.
-- ============================================================

create table if not exists quote_requests (
  id                       uuid primary key default gen_random_uuid(),
  full_name                text not null,
  email                    text not null,
  phone                    text,
  project_location         text,
  service_needed           text,
  preferred_contact_method text,
  message                  text not null,
  created_at               timestamptz not null default now()
);

-- Index for admin queries (newest first)
create index if not exists quote_requests_created_at_idx
  on quote_requests (created_at desc);

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table quote_requests enable row level security;

-- Anyone (including anonymous visitors) can insert a quote request.
drop policy if exists "Anyone can submit quote requests" on quote_requests;
create policy "Anyone can submit quote requests"
  on quote_requests
  for insert
  with check (true);

-- No public read. To view submissions use the Supabase dashboard
-- (service role) or a future admin panel.
