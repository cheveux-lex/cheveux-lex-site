import { createClient as createServerClient } from "./server";
import { createClient } from "./client";
import { stylists as fallbackStylists } from "@/lib/site-data";

export type StylistRow = {
  id: string;
  name: string;
  role: string | null;
  specialty: string | null;
  bio: string | null;
  image_url: string | null;
  instagram_url: string | null;
  booking_url: string | null;
  email: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getStylists(): Promise<StylistRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("stylists")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false });
    if (error) throw error;
    return data as StylistRow[];
  } catch {
    return fallbackStylists as unknown as StylistRow[];
  }
}

export async function getActiveStylists(): Promise<StylistRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("stylists")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: false });
    if (error) throw error;
    return data as StylistRow[];
  } catch {
    return (fallbackStylists as unknown as StylistRow[]).filter((s) => s.is_active !== false);
  }
}

export async function getStylistsCount(): Promise<number> {
  try {
    const supabase = await createServerClient();
    const { count, error } = await supabase
      .from("stylists")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  } catch {
    return fallbackStylists.length;
  }
}

export async function createStylist(data: {
  name: string;
  role?: string | null;
  specialty?: string | null;
  bio?: string | null;
  image_url?: string | null;
  instagram_url?: string | null;
  booking_url?: string | null;
  email?: string | null;
  sort_order?: number;
  is_active?: boolean;
}): Promise<StylistRow> {
  const supabase = createClient();
  const { data: inserted, error } = await supabase
    .from("stylists")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return inserted as StylistRow;
}

export async function updateStylist(
  id: string,
  data: Partial<{
    name: string;
    role: string | null;
    specialty: string | null;
    bio: string | null;
    image_url: string | null;
    instagram_url: string | null;
    booking_url: string | null;
    email: string | null;
    sort_order: number;
    is_active: boolean;
  }>
): Promise<StylistRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from("stylists")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return updated as StylistRow;
}

export async function deleteStylist(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("stylists").delete().eq("id", id);
  if (error) throw error;
}
