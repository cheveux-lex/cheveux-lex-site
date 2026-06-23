"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadSiteAsset, MediaUploadError } from "@/lib/supabase/media";
import { serviceIcons, getServiceIcon } from "@/lib/service-icons";
import type { ServiceRow } from "@/lib/supabase/services";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminButton from "@/components/admin/AdminButton";
import AdminCard from "@/components/admin/AdminCard";
import AdminInput from "@/components/admin/AdminInput";
import AdminTable from "@/components/admin/AdminTable";

const iconOptions = Object.keys(serviceIcons);

interface FormData {
  title: string;
  slug: string;
  description: string;
  image_url: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormData = {
  title: "",
  slug: "",
  description: "",
  image_url: "",
  icon: "scissors",
  sort_order: 0,
  is_active: true,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/^-+|-+$/g, "");
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FormData | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const supabase = createClient();

  const fetchServices = useCallback(() => {
    supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .then(({ data, error }) => {
        if (!error && data) setServices(data as ServiceRow[]);
        setLoading(false);
      });
  }, [supabase]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleNew = useCallback(() => {
    setEditing({ ...EMPTY_FORM });
    setEditingId(null);
    setError("");
    setSuccess("");
  }, []);

  const handleEdit = useCallback((row: Record<string, unknown>) => {
    const s = row as unknown as ServiceRow;
    setEditing({
      title: s.title,
      slug: s.slug,
      description: s.description ?? "",
      image_url: s.image_url ?? "",
      icon: s.icon ?? "scissors",
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
    setUploadingIcon(true);
    setError("");
    try {
      const url = await uploadSiteAsset(file, "services");
      setEditing({ ...editing, image_url: url });
    } catch (err) {
      setError(err instanceof MediaUploadError ? err.message : "Upload failed.");
    } finally {
      setUploadingIcon(false);
    }
  }, [editing]);

  const handleSave = useCallback(async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const slug = editing.slug || slugify(editing.title);
    const payload = {
      title: editing.title,
      slug,
      description: editing.description || null,
      image_url: editing.image_url || null,
      icon: editing.icon || "scissors",
      sort_order: editing.sort_order,
      is_active: editing.is_active,
    };

    let saveErr: unknown = null;
    if (editingId) {
      const { error } = await supabase
        .from("services")
        .update(payload)
        .eq("id", editingId)
        .select()
        .single();
      saveErr = error;
    } else {
      const { error } = await supabase
        .from("services")
        .insert(payload)
        .select()
        .single();
      saveErr = error;
    }

    setSaving(false);
    if (saveErr) {
      setError(String(saveErr));
    } else {
      setEditing(null);
      setEditingId(null);
      fetchServices();
      setSuccess(editingId ? "Service updated." : "Service created.");
    }
  }, [editing, editingId, supabase, fetchServices]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Delete this service?")) return;
    setError("");
    setSuccess("");
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) setError(error.message);
    else { fetchServices(); setSuccess("Service deleted."); }
  }, [supabase, fetchServices]);

  const handleToggleActive = useCallback(async (id: string, current: boolean) => {
    setError("");
    setSuccess("");
    const { error } = await supabase
      .from("services")
      .update({ is_active: !current })
      .eq("id", id);
    if (error) setError(error.message);
    else fetchServices();
  }, [supabase, fetchServices]);

  const columns = [
    { key: "title", label: "Service" },
    { key: "icon", label: "Icon" },
    { key: "sort_order", label: "Order" },
    {
      key: "is_active",
      label: "Status",
      render: (v: unknown, row: Record<string, unknown>) => (
        <button
          onClick={() => handleToggleActive(row.id as string, v as boolean)}
          className={`inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] transition-colors ${
            v ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-500 hover:bg-red-100"
          }`}
        >
          {v ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "id",
      label: "Actions",
      render: (_v: unknown, row: Record<string, unknown>) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleEdit(row)}
            className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/50 transition-colors hover:text-gold focus:outline-none"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id as string)}
            className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/50 transition-colors hover:text-red-400 focus:outline-none"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const data = services.map((s) => ({ ...s })) as Record<string, unknown>[];

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader
          title="Services"
          description="Manage your service menu, icons, and images."
        />
        <AdminButton className="flex-shrink-0" onClick={handleNew}>Add Service</AdminButton>
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
              {editingId ? "Edit Service" : "Add Service"}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} placeholder="Service name" />
              <AdminInput label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} placeholder="auto-generated if empty" />
            </div>
            <AdminInput label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map((ico) => (
                    <button
                      key={ico}
                      type="button"
                      onClick={() => setEditing({ ...editing, icon: ico })}
                      className={`flex h-9 w-9 items-center justify-center rounded-sm border transition-colors ${
                        editing.icon === ico
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-beige/25 text-taupe hover:border-gold/40 hover:text-gold"
                      }`}
                      title={ico}
                    >
                      {getServiceIcon(ico)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Image</label>
                {editing.image_url && (
                  <div className="relative mb-2 overflow-hidden rounded-sm border border-beige/20 bg-cream/40">
                    <img src={editing.image_url} alt="Preview" className="h-24 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, image_url: "" })}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-sm bg-charcoal/60 text-[10px] text-offwhite hover:bg-red-500 transition-colors"
                    >
                      &times;
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-taupe transition-colors hover:border-gold/40 hover:text-gold">
                    {uploadingIcon ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/svg+xml"
                      className="hidden"
                      disabled={uploadingIcon}
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
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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

      <AdminCard>
        {loading ? (
          <p className="text-sm text-taupe">Loading services...</p>
        ) : (
          <AdminTable columns={columns} data={data} />
        )}
      </AdminCard>
    </>
  );
}
