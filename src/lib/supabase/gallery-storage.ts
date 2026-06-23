import { createClient } from "./client";

const STORAGE_BUCKET = "gallery";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}

export async function uploadGalleryImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError("Only JPG, PNG, and WebP images are allowed.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new UploadError("File size must be under 5MB.");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(safeName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new UploadError(`Upload failed: ${error.message}`);
  }

  const { data: publicUrl } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(safeName);

  return publicUrl.publicUrl;
}

export async function deleteGalleryImageFromStorage(imageUrl: string): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const bucketUrl = `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/`;

  if (!imageUrl.startsWith(bucketUrl)) return;

  const path = imageUrl.replace(bucketUrl, "");
  if (!path) return;

  const supabase = createClient();
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) {
    console.warn("Failed to delete image from storage:", error.message);
  }
}
