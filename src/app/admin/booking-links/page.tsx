"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BookingLinkRow } from "@/lib/supabase/booking-links";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";

export default function BookingLinksPage() {
  const [links, setLinks] = useState<BookingLinkRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<BookingLinkRow> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    supabase
      .from("booking_links")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setLinks((data ?? []) as BookingLinkRow[]);
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [supabase]);

  const reloadLinks = useCallback(() => {
    supabase
      .from("booking_links")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data, error: reloadError }) => {
        if (!reloadError && data) setLinks(data as BookingLinkRow[]);
      });
  }, [supabase]);

  const handleNew = useCallback(() => {
    setEditing({ label: "", type: "general", booking_url: "", is_primary: false, is_active: true, sort_order: links.length });
    setEditingId(null);
    setError("");
    setSuccess("");
  }, [links.length]);

  const handleEdit = useCallback((link: BookingLinkRow) => {
    setEditing({ ...link });
    setEditingId(link.id);
    setError("");
    setSuccess("");
  }, []);

  const handleCancel = useCallback(() => {
    setEditing(null);
    setEditingId(null);
    setError("");
    setSuccess("");
  }, []);

  const handleSave = useCallback(async () => {
    if (!editing || !editing.label || !editing.booking_url) {
      setError("Label and URL are required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload: Record<string, unknown> = {
      label: editing.label,
      type: editing.type || "general",
      booking_url: editing.booking_url,
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? 0,
    };

    try {
      let savedId = editingId;

      if (editingId) {
        const { error: updateError } = await supabase
          .from("booking_links")
          .update(payload)
          .eq("id", editingId);
        if (updateError) throw updateError;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("booking_links")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        savedId = inserted?.id as string;
      }

      // Handle primary flag: reset all, then set this one if needed
      if (editing.is_primary && savedId) {
        const { error: resetError } = await supabase
          .from("booking_links")
          .update({ is_primary: false })
          .neq("id", "00000000-0000-0000-0000-000000000000");
        if (resetError) throw resetError;
        const { error: setPrimaryError } = await supabase
          .from("booking_links")
          .update({ is_primary: true })
          .eq("id", savedId);
        if (setPrimaryError) throw setPrimaryError;
      }

      setEditing(null);
      setEditingId(null);
      reloadLinks();
      setSuccess("Booking link saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }, [editing, editingId, supabase, reloadLinks]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Delete this booking link?")) return;
    const { error: deleteError } = await supabase
      .from("booking_links")
      .delete()
      .eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      reloadLinks();
    }
  }, [supabase, reloadLinks]);

  const handleSetPrimary = useCallback(async (id: string) => {
    const { error: resetError } = await supabase
      .from("booking_links")
      .update({ is_primary: false })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (resetError) { setError(resetError.message); return; }
    const { error: setPrimaryErr } = await supabase
      .from("booking_links")
      .update({ is_primary: true })
      .eq("id", id);
    if (setPrimaryErr) {
      setError(setPrimaryErr.message);
    } else {
      reloadLinks();
    }
  }, [supabase, reloadLinks]);

  const handleToggleActive = useCallback(async (id: string, current: boolean) => {
    const { error: toggleError } = await supabase
      .from("booking_links")
      .update({ is_active: !current })
      .eq("id", id);
    if (toggleError) {
      setError(toggleError.message);
    } else {
      reloadLinks();
    }
  }, [supabase, reloadLinks]);

  return (
    <>
      <AdminPageHeader
        title="Booking Links"
        description="Manage your salon's booking URLs."
      />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs text-taupe/70">{loading ? "Loading..." : `${links.length} link${links.length !== 1 ? "s" : ""}`}</p>
        <AdminButton onClick={handleNew}>Add Link</AdminButton>
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
              {editingId ? "Edit Booking Link" : "Add Booking Link"}
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput
                label="Label"
                value={editing.label ?? ""}
                onChange={(v) => setEditing({ ...editing, label: v })}
                placeholder="Main Booking"
              />
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">Type</label>
                <select
                  value={editing.type ?? "general"}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                  className="w-full rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-2 text-sm text-charcoal focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/20"
                >
                  <option value="general">General</option>
                  <option value="stylist">Stylist</option>
                </select>
              </div>
            </div>

            <AdminInput
              label="Booking URL"
              value={editing.booking_url ?? ""}
              onChange={(v) => setEditing({ ...editing, booking_url: v })}
              placeholder="https://linktr.ee/Cheveux_lex"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <AdminInput
                label="Sort Order"
                value={String(editing.sort_order ?? 0)}
                onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })}
                type="number"
              />
              <div className="flex items-end gap-4 pb-2">
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={editing.is_active ?? true}
                    onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                    className="accent-gold"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="checkbox"
                    checked={editing.is_primary ?? false}
                    onChange={(e) => setEditing({ ...editing, is_primary: e.target.checked })}
                    className="accent-gold"
                  />
                  Primary
                </label>
              </div>
            </div>

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

      {!loading && links.length === 0 && !editing && (
        <p className="text-sm text-taupe/60">No booking links yet. Click &quot;Add Link&quot; to create one.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <AdminCard key={link.id} className="relative overflow-hidden">
            {link.is_primary && (
              <div className="absolute right-2 top-2 rounded-[2px] bg-gold/90 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.1em] text-offwhite">
                Primary
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-semibold text-charcoal">{link.label}</h3>
                <span className={`inline-block rounded-[2px] px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-[0.1em] ${link.is_active ? "bg-green-50/80 text-green-700" : "bg-beige/20 text-taupe/50"}`}>
                  {link.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="truncate text-[11px] text-taupe">{link.booking_url}</p>
              <p className="text-[9px] text-taupe/50">{link.type} · Sort: {link.sort_order}</p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleEdit(link)}
                  className="text-[9px] font-medium uppercase tracking-[0.12em] text-gold transition-colors hover:text-charcoal focus:outline-none"
                >
                  Edit
                </button>
                {!link.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(link.id)}
                    className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/60 transition-colors hover:text-gold focus:outline-none"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => handleToggleActive(link.id, link.is_active)}
                  className="text-[9px] font-medium uppercase tracking-[0.12em] text-taupe/60 transition-colors hover:text-charcoal focus:outline-none"
                >
                  {link.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(link.id)}
                  className="text-[9px] font-medium uppercase tracking-[0.12em] text-red-400 transition-colors hover:text-red-600 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
