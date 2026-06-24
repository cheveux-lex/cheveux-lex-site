"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadSiteAsset, deleteSiteAsset, MediaUploadError } from "@/lib/supabase/media";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import AdminInput from "@/components/admin/AdminInput";

interface FormFields {
  hero_title: string;
  hero_subtitle: string;
  address: string;
  phone: string;
  email: string;
  booking_url: string;
  instagram_url: string;
  tiktok_url: string;
  facebook_url: string;
  logo_url: string;
  hero_image_url: string;
  salon_image_url: string;
  footer_logo_url: string;
  map_image_url: string;
}

const INITIAL: FormFields = {
  hero_title: "",
  hero_subtitle: "",
  address: "",
  phone: "",
  email: "",
  booking_url: "",
  instagram_url: "",
  tiktok_url: "",
  facebook_url: "",
  logo_url: "",
  hero_image_url: "",
  salon_image_url: "",
  footer_logo_url: "",
  map_image_url: "",
};

interface MediaField {
  key: keyof FormFields;
  label: string;
  folder: string;
}

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

const mediaFields: MediaField[] = [
  { key: "logo_url", label: "Logo", folder: "logo" },
  { key: "hero_image_url", label: "Hero Image", folder: "hero" },
  { key: "salon_image_url", label: "Salon Image", folder: "salon" },
  { key: "footer_logo_url", label: "Footer Logo", folder: "footer" },
  { key: "map_image_url", label: "Map / Location Image", folder: "site" },
];

export default function SiteSettingsPage() {
  const [fields, setFields] = useState<FormFields>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("*")
      .eq("singleton", true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) {
          setFields({
            hero_title: data.hero_title ?? "",
            hero_subtitle: data.hero_subtitle ?? "",
            address: data.address ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
            booking_url: data.booking_url ?? "",
            instagram_url: data.instagram_url ?? "",
            tiktok_url: data.tiktok_url ?? "",
            facebook_url: data.facebook_url ?? "",
            logo_url: data.logo_url ?? "",
            hero_image_url: data.hero_image_url ?? "",
            salon_image_url: data.salon_image_url ?? "",
            footer_logo_url: data.footer_logo_url ?? "",
            map_image_url: data.map_image_url ?? "",
          });
        }
        setLoading(false);
      });
  }, []);

  const handleChange = useCallback((key: keyof FormFields) => (val: string) => {
    setFields((prev) => ({ ...prev, [key]: val }));
    setSuccess(false);
    setError("");
  }, []);

  const handleUpload = useCallback(async (field: MediaField, file: File) => {
    setUploading(field.key);
    setError("");
    setSuccess(false);
    try {
      const url = await uploadSiteAsset(file, field.folder);
      setFields((prev) => ({ ...prev, [field.key]: url }));
    } catch (err) {
      setError(err instanceof MediaUploadError ? err.message : getErrorMessage(err));
    } finally {
      setUploading(null);
    }
  }, []);

  const handleRemove = useCallback(async (field: MediaField) => {
    const current = fields[field.key];
    if (!current) return;
    setError("");
    setSuccess(false);
    try {
      await deleteSiteAsset(current);
    } catch {
      // Ignore delete errors from storage - we still want to clear the URL
    }
    setFields((prev) => ({ ...prev, [field.key]: "" }));
  }, [fields]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSuccess(false);
    setError("");
    const supabase = createClient();
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("singleton", true)
      .maybeSingle();
    let saveErr: unknown = null;
    let returnedRow: Record<string, unknown> | null = null;
    if (existing) {
      const { data, error } = await supabase
        .from("site_settings")
        .update(fields)
        .eq("id", existing.id)
        .select()
        .maybeSingle();
      saveErr = error;
      returnedRow = data;
    } else {
      const { data, error } = await supabase
        .from("site_settings")
        .insert({ singleton: true, ...fields })
        .select()
        .maybeSingle();
      saveErr = error;
      returnedRow = data;
    }
    setSaving(false);
    if (saveErr) {
      setError(getErrorMessage(saveErr));
    } else if (returnedRow) {
      setFields({
        hero_title: (returnedRow.hero_title as string) ?? "",
        hero_subtitle: (returnedRow.hero_subtitle as string) ?? "",
        address: (returnedRow.address as string) ?? "",
        phone: (returnedRow.phone as string) ?? "",
        email: (returnedRow.email as string) ?? "",
        booking_url: (returnedRow.booking_url as string) ?? "",
        instagram_url: (returnedRow.instagram_url as string) ?? "",
        tiktok_url: (returnedRow.tiktok_url as string) ?? "",
        facebook_url: (returnedRow.facebook_url as string) ?? "",
        logo_url: (returnedRow.logo_url as string) ?? "",
        hero_image_url: (returnedRow.hero_image_url as string) ?? "",
        salon_image_url: (returnedRow.salon_image_url as string) ?? "",
        footer_logo_url: (returnedRow.footer_logo_url as string) ?? "",
        map_image_url: (returnedRow.map_image_url as string) ?? "",
      });
      setSuccess(true);
    } else {
      setError("Save did not return updated row.");
    }
  }, [fields]);

  if (loading) {
    return (
      <>
        <AdminPageHeader title="Site Settings" description="Loading settings..." />
        <AdminCard><p className="text-sm text-taupe">Loading...</p></AdminCard>
      </>
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Manage your salon's public-facing information and media."
      />

      {error && <p className="mb-4 text-xs font-medium text-red-500">{error}</p>}
      {success && <p className="mb-4 text-xs font-medium text-green-600">Settings saved successfully.</p>}

      <AdminCard title="Media Assets">
        <div className="grid gap-6 sm:grid-cols-2">
          {mediaFields.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
                {field.label}
              </label>
              {fields[field.key] && (
                <div className="relative mb-2 overflow-hidden rounded-sm border border-beige/20 bg-cream/40">
                  <img
                    src={fields[field.key] as string}
                    alt={field.label}
                    className="h-32 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(field)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-sm bg-charcoal/60 text-[10px] text-offwhite hover:bg-red-500 transition-colors"
                    title="Remove"
                  >
                    &times;
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer rounded-[3px] border border-beige/25 bg-cream/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-taupe transition-colors hover:border-gold/40 hover:text-gold">
                  {uploading === field.key ? "Uploading..." : "Choose File"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    className="hidden"
                    disabled={uploading === field.key}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(field, file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <span className="text-[9px] text-taupe/50">or</span>
                <AdminInput
                  label=""
                  value={fields[field.key] as string}
                  onChange={handleChange(field.key)}
                  placeholder="Paste image URL..."
                />
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <div className="mt-6">
        <AdminCard>
          <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            className="space-y-5 max-w-2xl"
          >
            <h3 className="font-heading text-base font-semibold text-charcoal">Content</h3>
            <AdminInput
              label="Hero Title"
              value={fields.hero_title}
              onChange={handleChange("hero_title")}
              placeholder="Lexington's Hair, Elevated"
            />
            <AdminInput
              label="Hero Subtitle"
              value={fields.hero_subtitle}
              onChange={handleChange("hero_subtitle")}
              placeholder="A modern salon offering lived-in color, extensions, and lashes..."
              multiline
            />
            <AdminInput
              label="Address"
              value={fields.address}
              onChange={handleChange("address")}
              placeholder="393 Waller Ave. Suite 115, Lexington, Kentucky"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <AdminInput
                label="Phone"
                value={fields.phone}
                onChange={handleChange("phone")}
                placeholder="(555) 123-4567"
              />
              <AdminInput
                label="Email"
                value={fields.email}
                onChange={handleChange("email")}
                placeholder="hello@cheveuxlex.com"
              />
            </div>
            <AdminInput
              label="Booking URL"
              value={fields.booking_url}
              onChange={handleChange("booking_url")}
              placeholder="https://linktr.ee/Cheveux_lex"
            />
            <div className="grid gap-5 sm:grid-cols-3">
              <AdminInput
                label="Instagram URL"
                value={fields.instagram_url}
                onChange={handleChange("instagram_url")}
                placeholder="https://instagram.com/..."
              />
              <AdminInput
                label="TikTok URL"
                value={fields.tiktok_url}
                onChange={handleChange("tiktok_url")}
                placeholder="https://tiktok.com/@..."
              />
              <AdminInput
                label="Facebook URL"
                value={fields.facebook_url}
                onChange={handleChange("facebook_url")}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-beige/10 pt-5">
              <AdminButton type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </AdminButton>
            </div>
          </form>
        </AdminCard>
      </div>
    </>
  );
}
