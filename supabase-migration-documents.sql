-- ==============================================================================
-- NERONOVA 2026 - Supabase Storage & Documents Migration
-- ==============================================================================
-- Scope:
-- 1. Add id_card_path and payment_screenshot_path to public.teams table
-- 2. Create private storage bucket 'registration-documents' (5MB limit, images only)
-- 3. Configure strict Storage RLS policies:
--    - Public (anon): Can only INSERT (upload during registration)
--    - Public (anon): Zero SELECT, UPDATE, DELETE permissions (strictly private)
--    - Main Admin: Exclusive SELECT (read / signed URLs) and DELETE permissions
--
-- Safety:
-- - Non-destructive (ADD COLUMN IF NOT EXISTS preserves all existing data)
-- - Idempotent (safe to re-run multiple times)
-- ==============================================================================

-- 1. Add document reference columns to existing public.teams table
alter table public.teams 
add column if not exists id_card_path text,
add column if not exists payment_screenshot_path text;

-- 2. Create Private Storage Bucket for Registration Documents
-- (Strictly private: public = false prevents direct public URL access)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'registration-documents',
  'registration-documents',
  false, -- PRIVATE BUCKET: Never exposed publicly
  5242880, -- 5 MB Maximum File Size Limit
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 3. Enable RLS on storage.objects (if not already enabled)
alter table storage.objects enable row level security;

-- 4. Drop existing policies to prevent duplicate policy errors on re-run
drop policy if exists "Public users can upload registration documents" on storage.objects;
drop policy if exists "Main Admin can view registration documents" on storage.objects;
drop policy if exists "Main Admin can delete registration documents" on storage.objects;

-- 5. STORAGE RLS POLICY: Public users can upload documents during registration
create policy "Public users can upload registration documents"
    on storage.objects
    for insert
    to anon, authenticated
    with check (
        bucket_id = 'registration-documents'
    );

-- 6. STORAGE RLS POLICY: ONLY authenticated Main Admin can view/download via signed URLs
create policy "Main Admin can view registration documents"
    on storage.objects
    for select
    to authenticated
    using (
        bucket_id = 'registration-documents'
        and public.is_admin()
    );

-- 7. STORAGE RLS POLICY: ONLY authenticated Main Admin can delete documents
create policy "Main Admin can delete registration documents"
    on storage.objects
    for delete
    to authenticated
    using (
        bucket_id = 'registration-documents'
        and public.is_admin()
    );

