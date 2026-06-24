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
    // Fetch featured items first (up to 6)
    const { data: featured, error: featuredErr } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("is_featured", true)
      .not("image_url", "is", null)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(6);
    if (featuredErr) throw featuredErr;
    const featuredItems = (featured ?? []) as GalleryRow[];
    if (featuredItems.length >= 6) {
      if (process.env.NODE_ENV === "development") {
        console.log(`[gallery] getFeaturedGalleryItems fetched ${featuredItems.length} featured items`);
      }
      return featuredItems;
    }
    // Fill remaining slots with non-featured items (avoid duplicates)
    const featuredIds = featuredItems.map((f) => f.id);
    const remaining = 6 - featuredItems.length;
    const { data: nonFeatured, error: nonFeaturedErr } = await supabase
      .from("gallery_items")
      .select("*")
      .not("image_url", "is", null)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(remaining);
    if (nonFeaturedErr) throw nonFeaturedErr;
    const nonFeaturedItems = ((nonFeatured ?? []) as GalleryRow[]).filter(
      (nf) => !featuredIds.includes(nf.id)
    );
    const result = [...featuredItems, ...nonFeaturedItems].slice(0, 6);
    if (process.env.NODE_ENV === "development") {
      console.log(`[gallery] getFeaturedGalleryItems returning ${result.length} items (${featuredItems.length} featured, ${nonFeaturedItems.length} non-featured)`);
    }
    return result;
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
