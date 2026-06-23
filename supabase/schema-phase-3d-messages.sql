-- Phase 3D: Messages / Contact form table
-- Run this in the Supabase SQL Editor after Phase 2 and Phase 3A

-- Reusable updated_at trigger function (safe to re-run, created in Phase 3A)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-----------------------
-- Messages
-----------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a message (contact form submission)
CREATE POLICY "Anyone can insert messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (true);

-- Public cannot read messages at all
-- Authenticated admin can view all messages
CREATE POLICY "Authenticated users can read messages"
  ON public.messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated admin can update message status
CREATE POLICY "Authenticated users can update messages"
  ON public.messages
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Authenticated admin can delete messages
CREATE POLICY "Authenticated users can delete messages"
  ON public.messages
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Updated_at trigger
DROP TRIGGER IF EXISTS set_messages_updated_at ON public.messages;
CREATE TRIGGER set_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
