-- Phase 3C: Videos table
-- Run this in the Supabase SQL Editor after Phase 2

-- Reusable updated_at trigger function (safe to re-run)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

----------------------
-- Videos
----------------------
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  platform TEXT NOT NULL DEFAULT 'external',
  category TEXT NOT NULL DEFAULT 'Salon',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Anyone can read active videos
CREATE POLICY "Anyone can read active videos"
  ON public.videos
  FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

-- Authenticated admin can insert
CREATE POLICY "Authenticated users can insert videos"
  ON public.videos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admin can update
CREATE POLICY "Authenticated users can update videos"
  ON public.videos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated admin can delete
CREATE POLICY "Authenticated users can delete videos"
  ON public.videos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_videos_updated_at ON public.videos;
CREATE TRIGGER set_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Seed data
INSERT INTO public.videos (title, video_url, thumbnail_url, platform, category, is_featured, sort_order) VALUES
  ('Salon Tour', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, 'youtube', 'Salon', true, 0),
  ('Blonde Transformation', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, 'youtube', 'Color', false, 1),
  ('Extensions Reveal', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, 'youtube', 'Extensions', false, 2),
  ('Lash Detail', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', NULL, 'external', 'Lashes', false, 3)
ON CONFLICT DO NOTHING;
