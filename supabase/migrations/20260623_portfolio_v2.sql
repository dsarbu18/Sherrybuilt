-- ============================================================
-- Portfolio Images — v2: unique constraint on storage_path
-- ============================================================
-- Run this in Supabase SQL Editor AFTER the v1 migration.
-- Prevents the sync function from inserting duplicate rows.
-- ============================================================

alter table portfolio_images
  add constraint portfolio_images_storage_path_key
  unique (storage_path);
