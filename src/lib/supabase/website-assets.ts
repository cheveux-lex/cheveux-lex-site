import { createClient as createServerClient } from "./server";
import { createClient } from "./client";

export type WebsiteAssetRow = {
  id: string;
  asset_key: string;
  label: string;
  section: string | null;
  description: string | null;
  image_url: string | null;
  alt_text: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// --- Server-side reads ---

export async function getWebsiteAssets(): Promise<WebsiteAssetRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("website_assets")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("asset_key", { ascending: true });
    if (error) throw error;
    return (data ?? []) as WebsiteAssetRow[];
  } catch {
    return [];
  }
}

export async function getActiveWebsiteAssets(): Promise<WebsiteAssetRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("website_assets")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("asset_key", { ascending: true });
    if (error) throw error;
    return (data ?? []) as WebsiteAssetRow[];
  } catch {
    return [];
  }
}

export async function getWebsiteAssetByKey(assetKey: string): Promise<WebsiteAssetRow | null> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("website_assets")
      .select("*")
      .eq("asset_key", assetKey)
      .maybeSingle();
    if (error) throw error;
    return data as WebsiteAssetRow | null;
  } catch {
    return null;
  }
}

// --- Client-side writes ---

export async function updateWebsiteAsset(
  assetKey: string,
  data: Partial<{
    label: string;
    section: string;
    description: string;
    image_url: string | null;
    alt_text: string;
    sort_order: number;
    is_active: boolean;
  }>
): Promise<WebsiteAssetRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from("website_assets")
    .update(data)
    .eq("asset_key", assetKey)
    .select()
    .single();
  if (error) throw error;
  return updated as WebsiteAssetRow;
}

export async function createWebsiteAsset(data: {
  asset_key: string;
  label: string;
  section?: string;
  description?: string;
  image_url?: string | null;
  alt_text?: string;
  sort_order?: number;
  is_active?: boolean;
}): Promise<WebsiteAssetRow> {
  const supabase = createClient();
  const { data: inserted, error } = await supabase
    .from("website_assets")
    .insert({
      asset_key: data.asset_key,
      label: data.label,
      section: data.section ?? null,
      description: data.description ?? null,
      image_url: data.image_url ?? null,
      alt_text: data.alt_text ?? null,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return inserted as WebsiteAssetRow;
}

export async function deleteWebsiteAsset(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("website_assets").delete().eq("id", id);
  if (error) throw error;
}
