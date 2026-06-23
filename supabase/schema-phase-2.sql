-- Phase 2: Site Settings + Services tables
-- Run this in the Supabase SQL Editor

-----------------------
-- Site Settings
-----------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site_settings"
  ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert site_settings"
  ON public.site_settings
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update site_settings"
  ON public.site_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete site_settings"
  ON public.site_settings
  FOR DELETE
  USING (auth.role() = 'authenticated');

INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', 'Cheveux Lex Salon'),
  ('hero_title', 'Lexington''s Hair, Elevated'),
  ('hero_tagline', 'A modern salon offering lived-in color, extensions, and lashes.'),
  ('about_description', 'A modern salon offering lived-in color, extensions, and lashes—designed to bring out your most confident self.'),
  ('address', '393 Waller Ave. Suite 115, Lexington, Kentucky'),
  ('phone', '(555) 123-4567'),
  ('email', 'hello@cheveuxlex.com'),
  ('hours', 'Tue – Sat: 9:00 AM – 6:00 PM'),
  ('facebook', 'https://facebook.com/cheveuxlex'),
  ('instagram', 'https://instagram.com/cheveuxlex'),
  ('booking_url', 'https://linktr.ee/Cheveux_lex'),
  ('tiktok', 'https://tiktok.com/@cheveuxlex'),
  ('footer_tagline', 'Experience the art of hair care.')
ON CONFLICT (key) DO NOTHING;

-----------------------
-- Services
-----------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  icon TEXT DEFAULT 'scissors',
  price_range TEXT,
  category TEXT DEFAULT 'All',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active services"
  ON public.services
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can read all services"
  ON public.services
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert services"
  ON public.services
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services"
  ON public.services
  FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete services"
  ON public.services
  FOR DELETE
  USING (auth.role() = 'authenticated');

INSERT INTO public.services (title, slug, description, short_description, icon, price_range, category, sort_order, is_active) VALUES
  ('Lived-in Color', 'lived-in-color', 'Our signature lived-in color service delivers dimensional, sun-kissed results that grow out beautifully. Using premium color lines and customized techniques, we create soft highlights, babylights, and tonal blends that enhance your natural beauty with minimal maintenance.', 'Effortless, grow-out friendly color that looks natural and luminous.', 'palette', '$180+', 'Color', 1, true),
  ('Extensions', 'extensions', 'Transform your hair with our hand-tied weft and tape-in extensions. We use only the finest 100% human hair, matched perfectly to your texture and color. Whether you want mermaid length or subtle volume, our certified extension specialists deliver seamless, natural results.', 'Premium hand-tied extensions for length, volume, and confidence.', 'sparkles', '$400+', 'Extensions', 2, true),
  ('Lashes', 'lashes', 'From classic sets to volume fans, our lash artists create bespoke lash looks that complement your eye shape and lifestyle. We use lightweight, premium lashes that feel like your own—because your eyes deserve to be the focal point.', 'Custom lash extensions that accentuate your natural eye shape.', 'eye', '$120+', 'Lashes', 3, true),
  ('Bridal Styling', 'bridal-styling', 'Complete bridal beauty packages including trials, hair styling, and makeup for your special day. Our stylists work with you to create the perfect look that photographs beautifully and lasts all day and night.', 'Full bridal beauty packages for your special day.', 'brush', '$250+', 'Styling', 4, true),
  ('Haircuts', 'haircuts', 'Precision cuts tailored to your face shape, hair texture, and lifestyle. Our stylists combine precision cutting techniques with an eye for shape and movement. Finish with a signature blowout or soft curls for instant polish.', 'Precision cuts and blowouts tailored to your style.', 'scissors', '$85+', 'Cut', 5, true),
  ('Consultations', 'consultations', 'Not sure what you need? Book a complimentary consultation to discuss your hair goals. We''ll assess your hair type, review inspiration photos, and recommend the perfect services and maintenance plan for you.', 'Complimentary consultation to plan your perfect look.', 'star', 'Free', 'Consultation', 6, true)
ON CONFLICT (slug) DO NOTHING;
