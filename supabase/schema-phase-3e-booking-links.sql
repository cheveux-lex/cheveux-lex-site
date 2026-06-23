-- Phase 3E: Booking Links table
-- Run this in the Supabase SQL Editor after Phase 2, 3A, 3B, and 3D

-- Reusable updated_at trigger function (safe to re-run)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-----------------------
-- Booking Links
-----------------------
CREATE TABLE IF NOT EXISTS public.booking_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  stylist_id UUID,
  booking_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.booking_links ENABLE ROW LEVEL SECURITY;

-- Anyone can read active booking links
CREATE POLICY "Anyone can read active booking links"
  ON public.booking_links
  FOR SELECT
  USING (is_active = true OR auth.role() = 'authenticated');

-- Authenticated admin can insert
CREATE POLICY "Authenticated users can insert booking links"
  ON public.booking_links
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admin can update
CREATE POLICY "Authenticated users can update booking links"
  ON public.booking_links
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated admin can delete
CREATE POLICY "Authenticated users can delete booking links"
  ON public.booking_links
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_booking_links_updated_at ON public.booking_links;
CREATE TRIGGER set_booking_links_updated_at
  BEFORE UPDATE ON public.booking_links
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Seed data
INSERT INTO public.booking_links (label, type, booking_url, is_primary, sort_order) VALUES
  ('Main Booking', 'general', 'https://linktr.ee/Cheveux_lex', true, 0),
  ('Lex Booking', 'stylist', 'https://linktr.ee/Cheveux_lex', false, 1),
  ('Kat Booking', 'stylist', 'https://linktr.ee/Cheveux_lex', false, 2),
  ('Morgan Booking', 'stylist', 'https://linktr.ee/Cheveux_lex', false, 3),
  ('Taylor Booking', 'stylist', 'https://linktr.ee/Cheveux_lex', false, 4)
ON CONFLICT DO NOTHING;
