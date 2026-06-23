import { createClient } from "./client";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const BUCKET = "site-assets";

export class MediaUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaUploadError";
  }
}

function sanitizeFilename(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "jpg";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${base}-${unique}.${ext}`;
}

export async function uploadSiteAsset(
  file: File,
  folder = "general"
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new MediaUploadError(
      "Invalid file type. Only JPG, PNG, WebP, and SVG are allowed."
    );
  }
  if (file.size > MAX_SIZE) {
    throw new MediaUploadError("File too large. Maximum size is 5MB.");
  }

  const supabase = createClient();
  const path = `${folder}/${sanitizeFilename(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    if (uploadError.message?.includes("duplicate")) {
      throw new MediaUploadError("A file with this name already exists. Try renaming it.");
    }
    throw new MediaUploadError(`Upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return urlData?.publicUrl ?? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function deleteSiteAsset(pathOrUrl: string): Promise<void> {
  const supabase = createClient();

  // Extract path from URL if full URL is given
  let path = pathOrUrl;
  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
  if (pathOrUrl.startsWith(bucketUrl)) {
    path = pathOrUrl.replace(bucketUrl, "");
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error && !error.message?.includes("not found")) {
    throw new MediaUploadError(`Delete failed: ${error.message}`);
  }
}
