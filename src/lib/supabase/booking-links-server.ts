import { createClient } from "./server";

const FALLBACK_URL = "https://linktr.ee/Cheveux_lex";

export interface BookingLinkRow {
  id: string;
  label: string;
  type: string;
  stylist_id: string | null;
  booking_url: string;
  is_primary: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getPrimaryBookingLink(): Promise<string> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("booking_links")
      .select("booking_url")
      .eq("is_primary", true)
      .eq("is_active", true)
      .single();
    if (error || !data) return FALLBACK_URL;
    return (data as { booking_url: string }).booking_url;
  } catch {
    return FALLBACK_URL;
  }
}

export async function getActiveBookingLinks(): Promise<BookingLinkRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("booking_links")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as BookingLinkRow[];
  } catch {
    return [];
  }
}
