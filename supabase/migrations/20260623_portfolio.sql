-- ============================================================
-- Portfolio Images Table
-- ============================================================
-- Run this in the Supabase SQL Editor (dashboard.supabase.com)
-- Project: ikqkpmviogbeowjqpfdp
-- ============================================================

create table if not exists portfolio_images (
  id           uuid primary key default gen_random_uuid(),
  title        text,
  category     text not null,
  image_url    text not null,
  storage_path text,
  description  text,
  sort_order   integer not null default 0,
  is_featured  boolean not null default false,
  visible      boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Index for the query pattern used by the portfolio page
create index if not exists portfolio_images_visible_sort
  on portfolio_images (visible, sort_order asc, created_at desc);

-- ============================================================
-- Row Level Security
-- Allow anyone to read visible portfolio images (public gallery).
-- No writes allowed from the frontend — use the Supabase dashboard
-- or service-role key server-side to manage images.
-- ============================================================
alter table portfolio_images enable row level security;

create policy "Public can read visible portfolio images"
  on portfolio_images
  for select
  using (visible = true);

-- ============================================================
-- Storage bucket
-- ============================================================
-- Run this block separately to create the storage bucket.
-- If the bucket already exists, this is a no-op.
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

-- Allow anyone to read files in the portfolio bucket (public CDN).
create policy if not exists "Public portfolio images are readable"
  on storage.objects
  for select
  using (bucket_id = 'portfolio');

-- ============================================================
-- Seed: migrate existing hardcoded images
-- ============================================================
-- After uploading the local images to Supabase Storage,
-- insert rows here so the portfolio page picks them up.
-- Replace <PROJECT_REF> with: ikqkpmviogbeowjqpfdp
--
-- Storage public URL pattern:
--   https://<PROJECT_REF>.supabase.co/storage/v1/object/public/portfolio/<path>
--
-- Example (update the image_url after you upload each file):
--
-- insert into portfolio_images (title, category, image_url, storage_path, sort_order) values
--   ('Basement Renovation',    'Basement Renovation', 'https://ikqkpmviogbeowjqpfdp.supabase.co/storage/v1/object/public/portfolio/basements/GregBsmt.png',  'basements/GregBsmt.png',  10),
--   ('Basement Renovation',    'Basement Renovation', 'https://ikqkpmviogbeowjqpfdp.supabase.co/storage/v1/object/public/portfolio/basements/GregBsmt1.png', 'basements/GregBsmt1.png', 20),
--   ('Exterior Stairs',        'Exterior Work',       'https://ikqkpmviogbeowjqpfdp.supabase.co/storage/v1/object/public/portfolio/exterior/JoeStairs.jpeg',  'exterior/JoeStairs.jpeg',  30),
--   ('Exterior Stairs',        'Exterior Work',       'https://ikqkpmviogbeowjqpfdp.supabase.co/storage/v1/object/public/portfolio/exterior/JoeStairs1.JPG',  'exterior/JoeStairs1.JPG',  40),
--   ('Flooring Installation',  'Flooring',            'https://ikqkpmviogbeowjqpfdp.supabase.co/storage/v1/object/public/portfolio/interior/RayAppt.jpeg',    'interior/RayAppt.jpeg',    50),
--   ('Flooring Installation',  'Flooring',            'https://ikqkpmviogbeowjqpfdp.supabase.co/storage/v1/object/public/portfolio/interior/RayAppt1.jpeg',   'interior/RayAppt1.jpeg',   60);
