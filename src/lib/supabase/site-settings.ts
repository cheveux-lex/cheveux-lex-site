import { createClient as createServerClient } from "./server";
import { createClient } from "./client";
import { siteSettings as fallbackSettings } from "@/lib/site-data";

export type SiteSettings = typeof fallbackSettings;

export interface SiteSettingsRow {
  id: string;
  singleton: boolean;
  hero_title: string;
  hero_subtitle: string;
  address: string;
  phone: string;
  email: string;
  booking_url: string;
  logo_url: string | null;
  hero_image_url: string | null;
  salon_image_url: string | null;
  footer_logo_url: string | null;
  map_image_url: string | null;
  instagram_url: string;
  tiktok_url: string;
  facebook_url: string;
  created_at: string;
  updated_at: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("singleton", true)
      .maybeSingle();
    if (error) throw error;
    let bookingUrl = data?.booking_url || fallbackSettings.bookingUrl;
    // Try primary active booking link from booking_links table
    const { data: primaryLink } = await supabase
      .from("booking_links")
      .select("booking_url")
      .eq("is_primary", true)
      .eq("is_active", true)
      .maybeSingle();
    if (primaryLink?.booking_url) {
      if (process.env.NODE_ENV === "development") {
        console.log("[site-settings] primary booking link:", primaryLink.booking_url);
      }
      bookingUrl = primaryLink.booking_url;
    } else {
      // Fallback: first active link
      const { data: activeLink } = await supabase
        .from("booking_links")
        .select("booking_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (activeLink?.booking_url) {
        if (process.env.NODE_ENV === "development") {
          console.log("[site-settings] fallback to first active link:", activeLink.booking_url);
        }
        bookingUrl = activeLink.booking_url;
      }
    }
    return {
      ...fallbackSettings,
      tagline: data?.hero_title || fallbackSettings.tagline,
      description: data?.hero_subtitle || fallbackSettings.description,
      address: data?.address || fallbackSettings.address,
      phone: data?.phone || fallbackSettings.phone,
      email: data?.email || fallbackSettings.email,
      logo_url: data?.logo_url || "",
      hero_image_url: data?.hero_image_url || "",
      salon_image_url: data?.salon_image_url || "",
      footer_logo_url: data?.footer_logo_url || "",
      map_image_url: data?.map_image_url || "",
      bookingUrl,
      instagram: data?.instagram_url || fallbackSettings.instagram,
      tiktok: data?.tiktok_url || fallbackSettings.tiktok,
      facebook: data?.facebook_url || fallbackSettings.facebook,
    };
  } catch {
    return fallbackSettings;
  }
}

export async function updateSiteSettings(data: {
  hero_title: string;
  hero_subtitle: string;
  address: string;
  phone: string;
  email: string;
  booking_url: string;
  instagram_url: string;
  tiktok_url: string;
  facebook_url: string;
}): Promise<void> {
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .eq("singleton", true)
    .maybeSingle();
  if (existing) {
    const { error } = await supabase
      .from("site_settings")
      .update(data)
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("site_settings")
      .insert({ singleton: true, ...data });
    if (error) throw error;
  }
}
