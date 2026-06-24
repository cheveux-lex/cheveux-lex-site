"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadSiteAsset, MediaUploadError } from "@/lib/supabase/media";
import type { VideoRow } from "@/lib/supabase/videos";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminInput from "@/components/admin/AdminInput";

interface FormData {
  title: string;
  video_url: string;
  thumbnail_url: string;
  platform: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
}

const EMPTY_FORM: FormData = {
  title: "",
  video_url: "",
  thumbnail_url: "",
  platform: "external",
  category: "Salon",
  sort_order: 0,
  is_active: true,
  is_featured: false,
};

function getErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "Something went wrong.";
  }
}

const platformOptions = ["external", "youtube", "vimeo", "tiktok", "instagram"];
const categoryOptions = ["Salon", "Color", "Blonde", "Brunette", "Extensions", "Lashes", "Styling", "Tutorial"];

const videoGradients: Record<string, string> = {
  Color: "radial-gradient(ellipse 140% 80% at 50% 130%, #A06040 0%, #C49B7A 25%, #D4A882 45%, #B89B67 65%, #8B6F47 85%, #5C3D28 100%)",
  Extensions: "radial-gradient(ellipse 140% 80% at 50% 130%, #A89C8E 0%, #C4B6A6 30%, #D8CEC2 50%, #C4B6A6 70%, #A89C8E 85%, #8B7E6E 100%)",
  Lashes: "radial-gradient(ellipse 140% 80% at 50% 130%, #2C241B 0%, #4A3F32 30%, #6B5B45 50%, #4A3F32 70%, #2C241B 85%, #1A1510 100%)",
  Blonde: "radial-gradient(ellipse 140% 80% at 50% 130%, #D4B896 0%, #E8D5B7 35%, #F2E4CE 55%, #EAD9BE 70%, #C4A882 90%, #8B7355 100%)",
  Salon: "radial-gradient(ellipse 140% 80% at 50% 130%, #8B7E6E 0%, #A89C8E 30%, #C4B6A6 50%, #A89C8E 70%, #8B7E6E 85%, #6B5B45 100%)",
  Styling: "radial-gradient(ellipse 140% 80% at 50% 130%, #C4A882 0%, #B89B67 30%, #A0845A 50%, #B89B67 70%, #C4A882 85%, #8B6F47 100%)",
  Tutorial: "radial-gradient(ellipse 140% 80% at 50% 130%, #6B5B45 0%, #8B7E6E 30%, #A89C8E 50%, #8B7E6E 70%, #6B5B45 85%, #4A3F32 100%)",
};

function getVideoGradient(cat: string) {
  return videoGradients[cat] || videoGradients.Salon;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [editing, setEditing] = useState<FormData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const supabase = createClient();

  const fetchVideos = useCallback(() => {
    supabase
      .from("videos")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setVideos(data as VideoRow[]);
        setLoading(false);
      });
  }, [supabase]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleNew = useCallback(() => {
    setEditing({ ...EMPTY_FORM, sort_order: videos.length });
    setEditingId(null);
    setError("");
    setSuccess("");
  }, [videos.length]);

  const handleEdit = useCallback((video: VideoRow) => {
    setEditing({
      title: video.title,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url ?? "",
      platform: video.platform,
      category: video.category,
      sort_order: video.sort_order,
      is_active: video.is_active,
      is_featured: video.is_featured,
    });
    setEditingId(video.id);
    setError("");
    setSuccess("");
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(null);
    setEditingId(null);
    setError("");
    setSuccess("");
  }, []);

  const handleThumbnailUpload = useCallback(async (file: File) => {
    setError("");
    setSuccess("");
    try {
      setUploadingThumbnail(true);
      const url = await uploadSiteAsset(file, "videos");
      if (editing) {
        setEditing({ ...editing, thumbnail_url: url });
      }
    } catch (err) {
      setError(err instanceof MediaUploadError ? err.message : getErrorMessage(err));
    } finally {
      setUploadingThumbnail(false);
    }
  }, [editing]);

  const handleSave = useCallback(async () => {
    if (!editing || !editing.title || !editing.video_url) {
      setError("Title and Video URL are required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload: Record<string, unknown> = {
      title: editing.title,
      video_url: editing.video_url,
      thumbnail_url: editing.thumbnail_url || null,
      platform: editing.platform || "external",
      category: editing.category || "Salon",
      sort_order: editing.sort_order,
      is_active: editing.is_active,
      is_featured: editing.is_featured,
    };

    let saveError: unknown = null;
    if (editingId) {
      const { error } = await supabase.from("videos").update(payload).eq("id", editingId);
      saveError = error;
    } else {
      const { error } = await supabase.from("videos").insert(payload);
      saveError = error;
    }

    setSaving(false);
    if (saveError) {
      setError(getErrorMessage(saveError));
    } else {
      setEditing(null);
      setEditingId(null);
      fetchVideos();
      setSuccess(editingId ? "Video updated successfully." : "Video created successfully.");
    }
  }, [editing, editingId, supabase, fetchVideos]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Delete this video?")) return;
    setError("");
    setSuccess("");
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) setError(error.message);
    else {
      fetchVideos();
      setSuccess("Video deleted successfully.");
    }
  }, [supabase, fetchVideos]);

  const handleToggleActive = useCallback(async (id: string, current: boolean) => {
    setError("");
    setSuccess("");
    const { error } = await supabase.from("videos").update({ is_active: !current }).eq("id", id);
    if (error) setError(error.message);
    else fetchVideos();
  }, [supabase, fetchVideos]);

  const handleToggleFeatured = useCallback(async (id: string, current: boolean) => {
    setError("");
    setSuccess("");
    const { error } = await supabase.from("videos").update({ is_featured: !current }).eq("id", id);
    if (error) setError(error.message);
    else fetchVideos();
  }, [supabase, fetchVideos]);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader
          title="Videos"
          description="Manage your video content."
        />
        <AdminButton className="flex-shrink-0" onClick={handleNew}>Add Video</AdminButton>
      </div>

      {error && <p className="mb-4 text-xs font-medium text-red-500">{error}</p>}
      {success && <p className="mb-4 text-xs font-medium text-green-600">{success}</p>}

      {editing && (
        <AdminCard className="mb-6">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="space-y-4 max-w-xl"
          >
            <h3 className="font-heading text-lg font-semibold text-charcoal">
              {editingId ? "Edit Video" : "Add Video"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput
                label="Title"
                value={editing.title}
                onChange={(v) => setEditing({ ...editing, title: v })}
                placeholder="Video title"
              />
              <AdminInput
                label="Sort Order"
                value={String(editing.sort_order)}
                onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })}
                type="number"
              />
            </div>
            <AdminInput
              label="Video URL"
              value={editing.video_url}
              onChange={(v) => setEditing({ ...editing, video_url: v })}
              placeholder="https://..."
            />
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Thumbnail</label>
              {editing.thumbnail_url && (
                <div className="relative mb-2 overflow-hidden rounded-sm border border-beige/20 bg-cream/40">
                  <img
                    src={editing.thumbnail_url}
                    alt="Thumbnail preview"
                    className="h-28 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, thumbnail_url: "" })}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-sm bg-charcoal/60 text-[10px] text-offwhite hover:bg-red-500 transition-colors"
                    title="Remove thumbnail"
                  >
                    &times;
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-taupe transition-colors hover:border-gold/40 hover:text-gold whitespace-nowrap">
                  {uploadingThumbnail ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    disabled={uploadingThumbnail}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleThumbnailUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <span className="text-[9px] text-taupe/50">or</span>
                <input
                  type="text"
                  value={editing.thumbnail_url}
                  onChange={(e) => setEditing({ ...editing, thumbnail_url: e.target.value })}
                  placeholder="Image URL..."
                  className="flex-1 rounded-[3px] border border-beige/25 bg-cream/40 px-2 py-1.5 text-[11px] text-charcoal placeholder:text-taupe/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors"
                />
              </div>
              <p className="mt-1 text-[9px] text-taupe/40">JPG, PNG, WebP, SVG &middot; Max 5MB</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Platform</label>
                <select
                  value={editing.platform}
                  onChange={(e) => setEditing({ ...editing, platform: e.target.value })}
                  className="w-full rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:bg-cream/60 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors"
                >
                  {platformOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:bg-cream/60 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-colors"
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                  className="accent-gold"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="checkbox"
                  checked={editing.is_featured}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                  className="accent-gold"
                />
                Featured
              </label>
            </div>
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
            <div className="flex items-center gap-3">
              <AdminButton type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </AdminButton>
              <button
                type="button"
                onClick={handleCancel}
                className="text-[10px] font-semibold uppercase tracking-[0.15em] text-taupe/60 transition-colors hover:text-taupe"
              >
                Cancel
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      {loading ? (
        <p className="text-sm text-taupe">Loading videos...</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => (
            <AdminCard key={video.id} className="p-0 overflow-hidden">
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-video"
              >
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: getVideoGradient(video.category) }}
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-charcoal/30 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                {video.is_featured && (
                  <div className="absolute left-2 top-2 rounded-[2px] bg-gold/90 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-offwhite backdrop-blur-[2px]">
                    Featured
                  </div>
                )}
              </a>
              <div className="p-3">
                <p className="text-sm font-medium leading-snug text-charcoal">{video.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe">{video.category}</span>
                  <span className="text-[8px] text-taupe/50 uppercase tracking-[0.08em]">{video.platform}</span>
                </div>
                <div className="mt-1 text-[9px] text-taupe/50">Sort: {video.sort_order}</div>
                <div className="mt-3 flex items-center justify-between border-t border-beige/10 pt-3">
                  <div className="flex items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={video.is_featured}
                        onChange={() => handleToggleFeatured(video.id, video.is_featured)}
                        className="h-3 w-3 accent-gold"
                      />
                      <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-taupe/60">Featured</span>
                    </label>
                    <button
                      onClick={() => handleToggleActive(video.id, video.is_active)}
                      className={`inline-block rounded-[2px] px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-[0.1em] transition-colors ${
                        video.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-500"
                      }`}
                    >
                      {video.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(video)}
                      className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/50 transition-colors hover:text-gold focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/50 transition-colors hover:text-red-400 focus:outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
          {videos.length === 0 && !loading && (
            <div className="col-span-full py-10 text-center text-sm text-taupe">
              No videos yet. Click &quot;Add Video&quot; to create one.
            </div>
          )}
        </div>
      )}
    </>
  );
}
