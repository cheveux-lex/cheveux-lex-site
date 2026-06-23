import { createClient as createServerClient } from "./server";
import { createClient } from "./client";
import { services as fallbackServices } from "@/lib/site-data";

export type ServiceRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/^-+|-+$/g, "");
}

export async function getServices(): Promise<ServiceRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false });
    if (error) throw error;
    return data as ServiceRow[];
  } catch {
    return fallbackServices as unknown as ServiceRow[];
  }
}

export async function getActiveServices(): Promise<ServiceRow[]> {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: false });
    if (error) throw error;
    return data as ServiceRow[];
  } catch {
    return (fallbackServices as unknown as ServiceRow[]).filter((s) => s.is_active !== false);
  }
}

export async function getServicesCount(): Promise<number> {
  try {
    const supabase = await createServerClient();
    const { count, error } = await supabase
      .from("services")
      .select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
  } catch {
    return fallbackServices.length;
  }
}

export async function createService(data: {
  title: string;
  slug?: string;
  description?: string | null;
  image_url?: string | null;
  icon?: string | null;
  sort_order?: number;
  is_active?: boolean;
}): Promise<ServiceRow> {
  const supabase = createClient();
  const slug = data.slug || slugify(data.title);
  const { data: inserted, error } = await supabase
    .from("services")
    .insert({ ...data, slug })
    .select()
    .single();
  if (error) throw error;
  return inserted as ServiceRow;
}

export async function updateService(
  id: string,
  data: Partial<{
    title: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    icon: string | null;
    sort_order: number;
    is_active: boolean;
  }>
): Promise<ServiceRow> {
  const supabase = createClient();
  const { data: updated, error } = await supabase
    .from("services")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return updated as ServiceRow;
}

export async function deleteService(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}
