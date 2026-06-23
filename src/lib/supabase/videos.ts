import { createClient as createServerClient } from "./server";
import { createClient } from "./client";

export type VideoRow = {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  platform: string;
  category: string;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// --- Server-side reads (used in server components) ---

export async function getVideos(): Promise<VideoRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (process.env.NODE_ENV === "development") {
      console.log(`[videos] getVideos fetched ${data?.length ?? 0} videos`);
    }
    return (data ?? []) as VideoRow[];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[videos] getVideos fell back to empty:", err);
    }
    return [];
  }
}

export async function getActiveVideos(): Promise<VideoRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (process.env.NODE_ENV === "development") {
      console.log(`[videos] getActiveVideos fetched ${data?.length ?? 0} videos`);
    }
    return (data ?? []) as VideoRow[];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[videos] getActiveVideos fell back to empty:", err);
    }
    return [];
  }
}

export async function getFeaturedVideos(): Promise<VideoRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (process.env.NODE_ENV === "development") {
      console.log(`[videos] getFeaturedVideos fetched ${data?.length ?? 0} videos`);
    }
    if (data && data.length > 0) return data as VideoRow[];
    // No featured — return latest active
    const supabase2 = await createServerClient();
    const { data: latest, error: latestError } = await supabase2
      .from("videos")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(4);
    if (latestError) throw latestError;
    return (latest ?? []) as VideoRow[];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[videos] getFeaturedVideos fell back to empty:", err);
    }
    return [];
  }
}

export async function getVideosCount(): Promise<number> {
  try {
    const supabase = await createServerClient();
    const { count, error } = await supabase
      .from("videos")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  } catch {
    return 0;
  }
}

// --- Client-side writes (used in admin components) ---

export async function createVideo(data: {
  title: string;
  video_url: string;
  thumbnail_url?: string | null;
  platform?: string;
  category?: string;
  is_featured?: boolean;
  sort_order?: number;
  is_active?: boolean;
}): Promise<VideoRow> {
  const supabase = createClient();
  const { data: inserted, error } = await supabase
    .from("videos")
    .insert({
      title: data.title,
      video_url: data.video_url,
      thumbnail_url: data.thumbnail_url ?? null,
      platform: data.platform ?? "external",
      category: data.category ?? "Salon",
      is_featured: data.is_featured ?? false,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    })
    .select()
    .single();
  if (error) throw error;
  return inserted as VideoRow;
}

export async function updateVideo(
  id: string,
  data: Partial<{
    title: string;
    video_url: string;
    thumbnail_url: string | null;
    platform: string;
    category: string;
    is_featured: boolean;
    sort_order: number;
    is_active: boolean;
  }>
): Promise<VideoRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from("videos")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return updated as VideoRow;
}

export async function deleteVideo(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw error;
}
