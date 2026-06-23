-- Phase 3A: Stylists table
-- Run this in the Supabase SQL Editor

-- Reusable updated_at trigger function (safe to re-run)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-----------------------
-- Stylists
-----------------------
CREATE TABLE IF NOT EXISTS public.stylists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  specialty TEXT,
  bio TEXT,
  image_url TEXT,
  instagram_url TEXT,
  booking_url TEXT,
  email TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;

-- Public can read only active stylists
CREATE POLICY "Anyone can read active stylists"
  ON public.stylists
  FOR SELECT
  USING (is_active = true);

-- Authenticated admin can read all stylists
CREATE POLICY "Authenticated users can read all stylists"
  ON public.stylists
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated admin can insert
CREATE POLICY "Authenticated users can insert stylists"
  ON public.stylists
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admin can update
CREATE POLICY "Authenticated users can update stylists"
  ON public.stylists
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated admin can delete
CREATE POLICY "Authenticated users can delete stylists"
  ON public.stylists
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_stylists_updated_at ON public.stylists;
CREATE TRIGGER set_stylists_updated_at
  BEFORE UPDATE ON public.stylists
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Seed data
INSERT INTO public.stylists (name, role, specialty, bio, instagram_url, booking_url, sort_order, is_active) VALUES
  (
    'Lex',
    'Owner / Master Stylist',
    'Lived-in color, extensions, bridal',
    'With over a decade of experience, Lex founded Cheveux Lex Salon to create a space where luxury meets authenticity. She specializes in lived-in color, seamless extensions, and transformative blonding.',
    'https://instagram.com/cheveuxlex',
    'https://linktr.ee/Cheveux_lex',
    1,
    true
  ),
  (
    'Kat',
    'Master Stylist',
    'Blonde expert and color specialist',
    'Kat brings editorial precision and a keen eye for detail to every service. Her specialty is creating dimensional brunette and blonde shades that look as natural as they are stunning.',
    'https://instagram.com/cheveuxlex',
    'https://linktr.ee/Cheveux_lex',
    2,
    true
  ),
  (
    'Morgan',
    'Master Stylist',
    'Extensions specialist and dimensional color',
    'Morgan is our extension expert, certified in multiple hand-tied methods. She believes every client deserves hair that makes them feel unstoppable—and she makes that happen with patience and artistry.',
    'https://instagram.com/cheveuxlex',
    'https://linktr.ee/Cheveux_lex',
    3,
    true
  ),
  (
    'Taylor',
    'Lash Artist',
    'Custom lash designs and brow tinting',
    'Taylor is a licensed cosmetologist specializing in lash artistry. She custom-designs every lash set to enhance her clients'' natural features, ensuring a look that''s both stunning and sustainable.',
    'https://instagram.com/cheveuxlex',
    'https://linktr.ee/Cheveux_lex',
    4,
    true
  )
ON CONFLICT DO NOTHING;
