-- Phase: Final Media Audit — website_assets table
-- Run this in the Supabase SQL Editor after all previous schema phases

----------------------
-- 1. website_assets table for remaining section/background images
----------------------
CREATE TABLE IF NOT EXISTS public.website_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  section TEXT,
  description TEXT,
  image_url TEXT,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.website_assets ENABLE ROW LEVEL SECURITY;

-- Public can read active assets
CREATE POLICY "Anyone can read active website assets"
  ON public.website_assets
  FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

-- Authenticated admin can insert
CREATE POLICY "Authenticated users can insert website assets"
  ON public.website_assets
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admin can update
CREATE POLICY "Authenticated users can update website assets"
  ON public.website_assets
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated admin can delete
CREATE POLICY "Authenticated users can delete website assets"
  ON public.website_assets
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_website_assets_updated_at ON public.website_assets;
CREATE TRIGGER set_website_assets_updated_at
  BEFORE UPDATE ON public.website_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

----------------------
-- 2. Seed data — section background placeholders that can be replaced with images
----------------------
INSERT INTO public.website_assets (asset_key, label, section, description, sort_order) VALUES
  ('home.hero.pattern', 'Hero Background Pattern', 'Homepage', 'Decorative background behind hero text section. Replaces the CSS radial-gradient pattern.', 0),
  ('home.featured_services.background', 'Featured Services Background', 'Homepage', 'Background texture behind the featured services cards.', 1),
  ('services.hero.background', 'Services Hero Background', 'Services', 'Background behind the Services page hero heading section.', 2),
  ('gallery.hero.background', 'Gallery Hero Background', 'Gallery', 'Background behind the Gallery page hero heading section.', 3),
  ('stylists.hero.background', 'Stylists Hero Background', 'Stylists', 'Background behind the Stylists page hero heading section.', 4),
  ('contact.hero.background', 'Contact Hero Background', 'Contact', 'Background behind the Contact page hero heading section.', 5),
  ('contact.map.placeholder', 'Contact Map Placeholder', 'Contact', 'Replaces the gradient placeholder in the map/visit section on the Contact page.', 6),
  ('videos.hero.background', 'Videos Hero Background', 'Videos', 'Background behind the Videos page hero heading section.', 7)
ON CONFLICT (asset_key) DO NOTHING;

----------------------
-- 3. Ensure site-assets bucket exists (safe re-run)
----------------------
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'site-assets',
  'site-assets',
  true,
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (safe re-run)
DROP POLICY IF EXISTS "Public can read site-assets" ON storage.objects;
CREATE POLICY "Public can read site-assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'site-assets');

DROP POLICY IF EXISTS "Authenticated can upload site-assets" ON storage.objects;
CREATE POLICY "Authenticated can upload site-assets"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can update site-assets" ON storage.objects;
CREATE POLICY "Authenticated can update site-assets"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated can delete site-assets" ON storage.objects;
CREATE POLICY "Authenticated can delete site-assets"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'site-assets' AND auth.role() = 'authenticated');
