import { createClient } from "./server";

type AssetMap = Record<string, string | null>;

export async function getWebsiteAssetsMap(): Promise<AssetMap> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("website_assets")
      .select("asset_key, image_url")
      .eq("is_active", true);
    if (error) throw error;
    const map: AssetMap = {};
    for (const row of data ?? []) {
      map[row.asset_key] = row.image_url;
    }
    return map;
  } catch {
    return {};
  }
}

/**
 * Returns a CSS background style object if an image URL exists for the given asset key.
 * Returns null if no image is set (so the original gradient shows through).
 */
export function getSectionBgStyle(
  assets: AssetMap,
  key: string
): React.CSSProperties | null {
  const url = assets[key];
  if (!url) return null;
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
