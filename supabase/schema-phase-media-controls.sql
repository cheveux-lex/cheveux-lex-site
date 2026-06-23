-- Phase: Media Controls
-- Adds image/icon editing to site_settings, services, stylists, and creates site-assets storage bucket

----------------------
-- 1. Add columns to site_settings
----------------------
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS salon_image_url TEXT,
  ADD COLUMN IF NOT EXISTS footer_logo_url TEXT;

----------------------
-- 2. Ensure services table has image_url and icon
----------------------
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS icon TEXT;

----------------------
-- 3. Ensure stylists table has image_url
----------------------
ALTER TABLE public.stylists
  ADD COLUMN IF NOT EXISTS image_url TEXT;

----------------------
-- 4. Create site-assets storage bucket
----------------------
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO NOTHING;

----------------------
-- 5. Storage RLS policies for site-assets
----------------------
-- Public read
DROP POLICY IF EXISTS "Public can read site-assets" ON storage.objects;
CREATE POLICY "Public can read site-assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'site-assets');

-- Authenticated upload
DROP POLICY IF EXISTS "Authenticated can upload site-assets" ON storage.objects;
CREATE POLICY "Authenticated can upload site-assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

-- Authenticated update
DROP POLICY IF EXISTS "Authenticated can update site-assets" ON storage.objects;
CREATE POLICY "Authenticated can update site-assets"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

-- Authenticated delete
DROP POLICY IF EXISTS "Authenticated can delete site-assets" ON storage.objects;
CREATE POLICY "Authenticated can delete site-assets"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');
