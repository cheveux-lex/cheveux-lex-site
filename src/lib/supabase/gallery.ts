import { createClient } from "./client";

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

export async function createGalleryItem(data: {
  category: string;
  title?: string | null;
  description?: string | null;
  stylist?: string | null;
  image_url?: string | null;
  is_featured?: boolean;
  featured?: boolean;
  sort_order?: number;
}): Promise<GalleryRow> {
  const supabase = createClient();
  const { data: inserted, error } = await supabase
    .from("gallery_items")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return inserted as GalleryRow;
}

export async function updateGalleryItem(
  id: string,
  data: Partial<{
    category: string;
    title: string | null;
    description: string | null;
    stylist: string | null;
    image_url: string | null;
    is_featured: boolean;
    featured: boolean;
    sort_order: number;
  }>
): Promise<GalleryRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from("gallery_items")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return updated as GalleryRow;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw error;
}
