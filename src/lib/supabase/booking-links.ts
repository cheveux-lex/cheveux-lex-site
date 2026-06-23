import { createClient } from "./client";

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

export interface CreateBookingLinkData {
  label: string;
  type?: string;
  stylist_id?: string;
  booking_url: string;
  is_primary?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

const FALLBACK_URL = "https://linktr.ee/Cheveux_lex";

export async function getBookingLinks(): Promise<BookingLinkRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("booking_links")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as BookingLinkRow[];
}

export async function getActiveBookingLinks(): Promise<BookingLinkRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("booking_links")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as BookingLinkRow[];
}

export async function getPrimaryBookingLink(): Promise<string> {
  try {
    const supabase = createClient();
    // Try active primary link first
    const { data: primary, error: primaryError } = await supabase
      .from("booking_links")
      .select("booking_url")
      .eq("is_primary", true)
      .eq("is_active", true)
      .maybeSingle();
    if (!primaryError && primary?.booking_url) {
      if (process.env.NODE_ENV === "development") {
        console.log("[booking-links] using primary link:", primary.booking_url);
      }
      return primary.booking_url;
    }
    // Fallback: first active link
    const { data: active } = await supabase
      .from("booking_links")
      .select("booking_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (active?.booking_url) {
      if (process.env.NODE_ENV === "development") {
        console.log("[booking-links] no primary, using first active:", active.booking_url);
      }
      return active.booking_url;
    }
    return FALLBACK_URL;
  } catch {
    return FALLBACK_URL;
  }
}

export async function createBookingLink(data: CreateBookingLinkData): Promise<BookingLinkRow> {
  const supabase = createClient();
  const { data: inserted, error } = await supabase
    .from("booking_links")
    .insert({
      label: data.label,
      type: data.type || "general",
      stylist_id: data.stylist_id || null,
      booking_url: data.booking_url,
      is_primary: data.is_primary || false,
      is_active: data.is_active ?? true,
      sort_order: data.sort_order ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return inserted as BookingLinkRow;
}

export async function updateBookingLink(id: string, data: Partial<CreateBookingLinkData>): Promise<BookingLinkRow> {
  const supabase = createClient();
  const payload: Record<string, unknown> = {};
  if (data.label !== undefined) payload.label = data.label;
  if (data.type !== undefined) payload.type = data.type;
  if (data.stylist_id !== undefined) payload.stylist_id = data.stylist_id || null;
  if (data.booking_url !== undefined) payload.booking_url = data.booking_url;
  if (data.is_primary !== undefined) payload.is_primary = data.is_primary;
  if (data.is_active !== undefined) payload.is_active = data.is_active;
  if (data.sort_order !== undefined) payload.sort_order = data.sort_order;

  const { data: updated, error } = await supabase
    .from("booking_links")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return updated as BookingLinkRow;
}

export async function setPrimaryBookingLink(id: string): Promise<void> {
  const supabase = createClient();
  // Unset all primary flags, then set the selected one
  const { error: resetError } = await supabase
    .from("booking_links")
    .update({ is_primary: false })
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (resetError) throw resetError;

  const { error: setError } = await supabase
    .from("booking_links")
    .update({ is_primary: true })
    .eq("id", id);
  if (setError) throw setError;
}

export async function deleteBookingLink(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("booking_links")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
