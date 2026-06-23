"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadSiteAsset, MediaUploadError } from "@/lib/supabase/media";
import type { StylistRow } from "@/lib/supabase/stylists";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminInput from "@/components/admin/AdminInput";

const portraitGradients = [
  "radial-gradient(ellipse 130% 70% at 50% 110%, #8B6F47 0%, #B89B67 40%, #C4A882 55%, #B89B67 70%, #8B6F47 85%), radial-gradient(ellipse 80% 30% at 50% 25%, rgba(255,220,180,0.2) 0%, transparent 50%)",
  "radial-gradient(ellipse 130% 70% at 50% 110%, #6B5B45 0%, #A0845A 35%, #C4A882 50%, #A0845A 65%, #6B5B45 80%), radial-gradient(ellipse 80% 30% at 50% 25%, rgba(255,210,170,0.15) 0%, transparent 50%)",
  "radial-gradient(ellipse 130% 70% at 50% 110%, #4A3F32 0%, #6B5B45 40%, #8B7E6E 55%, #6B5B45 70%, #4A3F32 85%), radial-gradient(ellipse 80% 30% at 50% 25%, rgba(200,180,160,0.12) 0%, transparent 50%)",
  "radial-gradient(ellipse 130% 70% at 50% 110%, #8B7E6E 0%, #B8A898 35%, #D8CEC2 50%, #B8A898 65%, #8B7E6E 80%), radial-gradient(ellipse 80% 30% at 50% 25%, rgba(255,240,230,0.2) 0%, transparent 50%)",
];

interface FormData {
  name: string;
  role: string;
  specialty: string;
  bio: string;
  image_url: string;
  instagram_url: string;
  booking_url: string;
  email: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  name: "",
  role: "",
  specialty: "",
  bio: "",
  image_url: "",
  instagram_url: "",
  booking_url: "",
  email: "",
  sort_order: 0,
  is_active: true,
};

export default function AdminStylistsPage() {
  const [stylists, setStylists] = useState<StylistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FormData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const supabase = createClient();

  const fetchStylists = useCallback(() => {
    supabase
      .from("stylists")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .then(({ data, error }) => {
        if (!error && data) setStylists(data as StylistRow[]);
        setLoading(false);
      });
  }, [supabase]);

  useEffect(() => {
    fetchStylists();
  }, [fetchStylists]);

  const handleNew = useCallback(() => {
    setEditing({ ...EMPTY_FORM });
    setEditingId(null);
    setError("");
    setSuccess("");
  }, []);

  const handleEdit = useCallback((row: Record<string, unknown>) => {
    const s = row as unknown as StylistRow;
    setEditing({
      name: s.name,
      role: s.role ?? "",
      specialty: s.specialty ?? "",
      bio: s.bio ?? "",
      image_url: s.image_url ?? "",
      instagram_url: s.instagram_url ?? "",
      booking_url: s.booking_url ?? "",
      email: s.email ?? "",
      sort_order: s.sort_order,
      is_active: s.is_active,
    });
    setEditingId(s.id);
    setError("");
    setSuccess("");
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(null);
    setEditingId(null);
    setError("");
    setSuccess("");
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!editing) return;
    setUploadingImage(true);
    setError("");
    try {
      const url = await uploadSiteAsset(file, "stylists");
      setEditing({ ...editing, image_url: url });
    } catch (err) {
      setError(err instanceof MediaUploadError ? err.message : "Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }, [editing]);

  const handleSave = useCallback(async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      name: editing.name,
      role: editing.role || null,
      specialty: editing.specialty || null,
      bio: editing.bio || null,
      image_url: editing.image_url || null,
      instagram_url: editing.instagram_url || null,
      booking_url: editing.booking_url || null,
      email: editing.email || null,
      sort_order: editing.sort_order,
      is_active: editing.is_active,
    };

    let saveError: unknown = null;
    if (editingId) {
      const { error } = await supabase
        .from("stylists")
        .update(payload)
        .eq("id", editingId);
      saveError = error;
    } else {
      const { error } = await supabase
        .from("stylists")
        .insert(payload);
      saveError = error;
    }

    setSaving(false);
    if (saveError) {
      setError(String(saveError));
    } else {
      setEditing(null);
      setEditingId(null);
      fetchStylists();
      setSuccess(editingId ? "Stylist updated." : "Stylist created.");
    }
  }, [editing, editingId, supabase, fetchStylists]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Delete this stylist?")) return;
    setError("");
    setSuccess("");
    const { error } = await supabase.from("stylists").delete().eq("id", id);
    if (error) setError(error.message);
    else { fetchStylists(); setSuccess("Stylist deleted."); }
  }, [supabase, fetchStylists]);

  const handleToggleActive = useCallback(async (id: string, current: boolean) => {
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("stylists")
      .update({ is_active: !current })
      .eq("id", id);
    if (error) setError(error.message);
    else fetchStylists();
  }, [supabase, fetchStylists]);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader
          title="Stylists"
          description="Manage your team of stylists and lash artists."
        />
        <AdminButton className="flex-shrink-0" onClick={handleNew}>Add Stylist</AdminButton>
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
              {editingId ? "Edit Stylist" : "Add Stylist"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} placeholder="Stylist name" />
              <AdminInput label="Role" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} placeholder="Owner / Master Stylist" />
            </div>
            <AdminInput label="Specialty" value={editing.specialty} onChange={(v) => setEditing({ ...editing, specialty: v })} placeholder="Lived-in color, extensions, bridal" />
            <AdminInput label="Bio" value={editing.bio} onChange={(v) => setEditing({ ...editing, bio: v })} multiline />
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Profile Photo</label>
              {editing.image_url && (
                <div className="relative mb-2 inline-block overflow-hidden rounded-full border border-beige/20">
                  <img src={editing.image_url} alt="Preview" className="h-24 w-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, image_url: "" })}
                    className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal/60 text-[10px] text-offwhite hover:bg-red-500 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-taupe transition-colors hover:border-gold/40 hover:text-gold">
                  {uploadingImage ? "Uploading..." : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <span className="text-[9px] text-taupe/50">or</span>
                <AdminInput label="" value={editing.image_url} onChange={(v) => setEditing({ ...editing, image_url: v })} placeholder="Image URL..." />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Instagram URL" value={editing.instagram_url} onChange={(v) => setEditing({ ...editing, instagram_url: v })} placeholder="https://instagram.com/..." />
              <AdminInput label="Booking URL" value={editing.booking_url} onChange={(v) => setEditing({ ...editing, booking_url: v })} placeholder="https://linktr.ee/..." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Email" value={editing.email} onChange={(v) => setEditing({ ...editing, email: v })} placeholder="stylist@cheveuxlex.com" />
              <AdminInput label="Sort Order" value={String(editing.sort_order)} onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })} type="number" />
            </div>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input
                type="checkbox"
                checked={editing.is_active}
                onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                className="accent-gold"
              />
              Active
            </label>
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
        <p className="text-sm text-taupe">Loading stylists...</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stylists.map((s, i) => (
            <AdminCard key={s.id}>
              <div className="text-center">
                {s.image_url ? (
                  <div className="mx-auto h-20 w-20 overflow-hidden rounded-full ring-1 ring-beige/20">
                    <img
                      src={s.image_url}
                      alt={s.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="mx-auto h-20 w-20 overflow-hidden rounded-full ring-1 ring-beige/20"
                    style={{ background: portraitGradients[i % portraitGradients.length] }}
                  />
                )}
                <h3 className="mt-3 font-heading text-lg font-semibold tracking-tight text-charcoal">
                  {s.name}
                </h3>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
                  {s.role}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-taupe">{s.specialty}</p>

                <div className="mt-4 space-y-2 text-left">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">
                      Instagram
                    </p>
                    <p className="text-xs text-charcoal truncate">{s.instagram_url || "—"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-taupe/70">
                      Booking Link
                    </p>
                    <p className="truncate text-xs text-charcoal">
                      {s.booking_url || "—"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleToggleActive(s.id, s.is_active)}
                      className={`inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] transition-colors ${
                        s.is_active ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-500 hover:bg-red-100"
                      }`}
                    >
                      {s.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-4 border-t border-beige/10 pt-4">
                  <button
                    onClick={() => handleEdit(s as unknown as Record<string, unknown>)}
                    className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/50 transition-colors hover:text-gold focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/50 transition-colors hover:text-red-400 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </>
  );
}
