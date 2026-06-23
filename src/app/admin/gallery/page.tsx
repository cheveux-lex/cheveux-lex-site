"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GalleryRow } from "@/lib/supabase/gallery";
import { uploadGalleryImage, deleteGalleryImageFromStorage } from "@/lib/supabase/gallery-storage";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminInput from "@/components/admin/AdminInput";

function getErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string") return msg;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "Something went wrong.";
  }
}

const categories = ["All", "Blonde", "Brunette", "Extensions", "Lashes", "Color"];

const hairGradients: Record<string, string> = {
  Blonde:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #D4B896 0%, #E8D5B7 35%, #F2E4CE 55%, #EAD9BE 70%, #C4A882 90%, #8B7355 100%), " +
    "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)",
  Brunette:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #4A3F32 0%, #6B5B45 30%, #8B7355 50%, #6B5B45 70%, #4A3F32 85%, #2C241B 100%), " +
    "radial-gradient(ellipse 100% 40% at 50% 15%, rgba(180,160,130,0.12) 0%, transparent 50%)",
  Extensions:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #A89C8E 0%, #C4B6A6 30%, #D8CEC2 50%, #C4B6A6 70%, #A89C8E 85%, #8B7E6E 100%), " +
    "linear-gradient(180deg, rgba(200,190,180,0.15) 0%, transparent 30%)",
  Lashes:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #2C241B 0%, #4A3F32 30%, #6B5B45 50%, #4A3F32 70%, #2C241B 85%, #1A1510 100%), " +
    "radial-gradient(ellipse 80% 30% at 50% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)",
  Color:
    "radial-gradient(ellipse 140% 80% at 50% 130%, #A06040 0%, #C49B7A 25%, #D4A882 45%, #B89B67 65%, #8B6F47 85%, #5C3D28 100%), " +
    "radial-gradient(ellipse 100% 45% at 50% 15%, rgba(255,200,160,0.15) 0%, transparent 50%)",
};

function getHairGradient(cat: string) {
  return hairGradients[cat] || hairGradients.Color;
}

interface FormData {
  category: string;
  title: string;
  stylist: string;
  image_url: string;
  is_featured: boolean;
  sort_order: number;
}

const EMPTY_FORM: FormData = {
  category: "Blonde",
  title: "",
  stylist: "Lex",
  image_url: "",
  is_featured: false,
  sort_order: 0,
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<FormData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const fetchItems = useCallback(() => {
    supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data as GalleryRow[]);
        setLoading(false);
      });
  }, [supabase]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const filtered = filter === "All" ? items : items.filter((g) => g.category === filter);

  const handleNew = useCallback(() => {
    setEditing({ ...EMPTY_FORM });
    setEditingId(null);
    setPreviewUrl(null);
    setError("");
  }, []);

  const handleEdit = useCallback((row: Record<string, unknown>) => {
    const g = row as unknown as GalleryRow;
    setEditing({
      category: g.category,
      title: (g.title ?? g.description) ?? "",
      stylist: g.stylist ?? "",
      image_url: g.image_url ?? "",
      is_featured: g.is_featured || g.featured,
      sort_order: g.sort_order,
    });
    setEditingId(g.id);
    setPreviewUrl(g.image_url);
    setError("");
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(null);
    setEditingId(null);
    setPreviewUrl(null);
    setPendingFile(null);
    setError("");
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be under 5MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPendingFile(file);
    setError("");
  }, []);

  const handleSave = useCallback(async () => {
    if (!editing) return;
    let uploadedUrl = editing.image_url;

    if (pendingFile) {
      setUploading(true);
      setError("");
      try {
        uploadedUrl = await uploadGalleryImage(pendingFile);
      } catch (err) {
        if (process.env.NODE_ENV === "development") console.error(err);
        setError(getErrorMessage(err));
        setUploading(false);
        return;
      }
      setUploading(false);
      setPendingFile(null);
    }

    setSaving(true);

    const payload: Record<string, unknown> = {
      category: editing.category,
      title: editing.title || null,
      stylist: editing.stylist || null,
      image_url: uploadedUrl || null,
      is_featured: editing.is_featured,
      sort_order: editing.sort_order,
    };

    let saveError: unknown = null;
    if (editingId) {
      const { error } = await supabase.from("gallery_items").update(payload).eq("id", editingId);
      saveError = error;
    } else {
      const { error } = await supabase.from("gallery_items").insert(payload);
      saveError = error;
    }

    setSaving(false);
    if (saveError) {
      if (process.env.NODE_ENV === "development") console.error(saveError);
      setError(getErrorMessage(saveError));
    } else {
      setEditing(null);
      setEditingId(null);
      setPreviewUrl(null);
      fetchItems();
    }
  }, [editing, editingId, pendingFile, supabase, fetchItems]);

  const handleDelete = useCallback(async (id: string, imageUrl: string | null) => {
    if (!window.confirm("Delete this image?")) return;
    if (imageUrl) {
      await deleteGalleryImageFromStorage(imageUrl);
    }
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) setError(error.message);
    else fetchItems();
  }, [supabase, fetchItems]);

  const handleToggleFeatured = useCallback(async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("gallery_items")
      .update({ is_featured: !current })
      .eq("id", id);
    if (error) setError(error.message);
    else fetchItems();
  }, [supabase, fetchItems]);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader
          title="Gallery"
          description="Manage your portfolio images."
        />
        <AdminButton className="flex-shrink-0" onClick={handleNew}>Add Image</AdminButton>
      </div>

      {editing && (
        <AdminCard className="mb-6">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="space-y-4 max-w-xl"
          >
            <h3 className="font-heading text-lg font-semibold text-charcoal">
              {editingId ? "Edit Image" : "Add Image"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20"
                >
                  {categories.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <AdminInput label="Stylist" value={editing.stylist} onChange={(v) => setEditing({ ...editing, stylist: v })} placeholder="Lex" />
            </div>
            <AdminInput label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Sun-kissed balayage" />

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Image</label>
              {previewUrl && (
                <div className="mb-3 overflow-hidden rounded-[3px] border border-beige/25 bg-cream/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="block w-full text-xs text-taupe file:mr-3 file:cursor-pointer file:rounded-[3px] file:border-0 file:bg-gold/10 file:px-3 file:py-1.5 file:text-[10px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-gold hover:file:bg-gold/20 focus:outline-none"
                />
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setPendingFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="flex-shrink-0 text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/50 transition-colors hover:text-red-400"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="mt-1 text-[9px] text-taupe/50">JPG, PNG, WebP · Max 5MB</p>
            </div>

            <AdminInput label="Image URL (advanced)" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} placeholder="https://..." />

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Sort Order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })} type="number" />
              <div className="flex items-end pb-2">
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
            </div>
            {error && <p className="text-xs font-medium text-red-500">{error}</p>}
            <div className="flex items-center gap-3">
              <AdminButton type="submit" disabled={saving || uploading}>
                {uploading ? "Uploading..." : saving ? "Saving..." : editingId ? "Update" : "Create"}
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

      <div className="mb-5 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-[4px] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all focus:outline-none ${
              filter === cat
                ? "bg-gold text-offwhite shadow-sm"
                : "border border-beige/25 bg-cream/40 text-taupe hover:border-gold/40 hover:text-gold"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-taupe">Loading gallery...</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((item) => (
            <AdminCard key={item.id} className="p-0 overflow-hidden">
              <div className="group relative aspect-[3/4]">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={(item.title ?? item.description) || "Gallery image"}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.style.background = getHairGradient(item.category);
                    }}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: getHairGradient(item.category) }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-offwhite/90">
                      {item.category}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item as unknown as Record<string, unknown>)}
                        className="text-[9px] font-medium uppercase tracking-[0.12em] text-offwhite/70 transition-colors hover:text-gold focus:outline-none"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.image_url)}
                        className="text-[9px] font-medium uppercase tracking-[0.12em] text-offwhite/70 transition-colors hover:text-red-300 focus:outline-none"
                      >
                        Del
                      </button>
                    </div>
                  </div>
                </div>
                {(item.is_featured || item.featured) && (
                  <div className="absolute right-2 top-2 rounded-[2px] bg-gold/90 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-offwhite backdrop-blur-[2px]">
                    Featured
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-[9px] text-taupe">by {item.stylist ?? "Lex"}</p>
                <label className="flex cursor-pointer items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={item.is_featured || item.featured}
                    onChange={() => handleToggleFeatured(item.id, item.is_featured || item.featured)}
                    className="h-3 w-3 accent-gold"
                  />
                  <span className="text-[8px] font-medium uppercase tracking-[0.1em] text-taupe/60">
                    Featured
                  </span>
                </label>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </>
  );
}
