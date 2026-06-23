import { createClient } from "./server";
import { galleryItems as fallbackGallery } from "@/lib/site-data";

export type GalleryRow = {
  id: string;
  title: string | null;
  description: string | null;
  stylist: string | null;
  image_url: string | null;
  category: string;
  is_featured: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getGalleryItems(): Promise<GalleryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (process.env.NODE_ENV === "development") {
      console.log(`[gallery] getGalleryItems fetched ${data?.length ?? 0} items`);
    }
    return (data ?? []) as GalleryRow[];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[gallery] getGalleryItems fell back to mock:", err);
    }
    return fallbackGallery as unknown as GalleryRow[];
  }
}

export async function getFeaturedGalleryItems(): Promise<GalleryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("is_featured", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (process.env.NODE_ENV === "development") {
      console.log(`[gallery] getFeaturedGalleryItems fetched ${data?.length ?? 0} items`);
    }
    if (data && data.length > 0) {
      return data as GalleryRow[];
    }
    // No featured items — return latest items instead
    const supabase2 = await createClient();
    const { data: latest, error: latestError } = await supabase2
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(5);
    if (latestError) throw latestError;
    if (process.env.NODE_ENV === "development") {
      console.log(`[gallery] fallback to ${latest?.length ?? 0} latest items`);
    }
    return (latest ?? []) as GalleryRow[];
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[gallery] getFeaturedGalleryItems fell back to mock:", err);
    }
    return fallbackGallery as unknown as GalleryRow[];
  }
}

export async function getGalleryItemsCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("gallery_items")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  } catch {
    return fallbackGallery.length;
  }
}
