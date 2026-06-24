-- Add map_embed_url column to site_settings
alter table public.site_settings
add column if not exists map_embed_url text;

-- Grant permissions
grant all on public.site_settings to authenticated;
grant select on public.site_settings to anon;
