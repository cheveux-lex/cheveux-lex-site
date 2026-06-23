-- Phase 3B: Gallery table
-- Run this in the Supabase SQL Editor

----------------------
-- Gallery
----------------------
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'Blonde',
  description TEXT,
  stylist TEXT DEFAULT 'Lex',
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Public can read all gallery items
CREATE POLICY "Anyone can read gallery"
  ON public.gallery
  FOR SELECT
  USING (true);

-- Authenticated admin can insert
CREATE POLICY "Authenticated users can insert gallery"
  ON public.gallery
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admin can update
CREATE POLICY "Authenticated users can update gallery"
  ON public.gallery
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated admin can delete
CREATE POLICY "Authenticated users can delete gallery"
  ON public.gallery
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_gallery_updated_at ON public.gallery;
CREATE TRIGGER set_gallery_updated_at
  BEFORE UPDATE ON public.gallery
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Seed data
INSERT INTO public.gallery (category, description, stylist, featured, sort_order) VALUES
  ('Blonde',     'Sun-kissed balayage',              'Lex',    true,  1),
  ('Brunette',   'Chocolate caramel melt',            'Kat',    true,  2),
  ('Extensions', 'Hand-tied installation',            'Morgan', false, 3),
  ('Lashes',     'Volume lash set',                   'Taylor', true,  4),
  ('Color',      'Copper rose gold melt',             'Lex',    false, 5),
  ('Blonde',     'Platinum bob',                      'Kat',    false, 6),
  ('Brunette',   'Espresso gloss',                    'Morgan', false, 7),
  ('Color',      'Bronde baby lights',                'Lex',    true,  8),
  ('Extensions', 'Tape-in length',                    'Morgan', false, 9),
  ('Lashes',     'Wispy natural set',                 'Taylor', false, 10),
  ('Blonde',     'Honey blonde highlights',            'Kat',    false, 11),
  ('Brunette',   'Rich chestnut',                     'Lex',    false, 12)
ON CONFLICT DO NOTHING;
