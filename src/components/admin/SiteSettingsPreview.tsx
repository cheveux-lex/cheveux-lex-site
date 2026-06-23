import type { SiteSettings } from "@/lib/supabase/site-settings";
import { siteSettingsData } from "@/lib/admin-data";

const fieldBase =
  "w-full rounded-[3px] border border-beige/25 bg-cream/40 px-3.5 py-2.5 text-sm text-charcoal placeholder:text-taupe/40 focus:border-gold/50 focus:bg-cream/70 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all";

interface Props {
  settings?: SiteSettings;
}

export default function SiteSettingsPreview({ settings }: Props) {
  const data = settings
    ? {
        heroTitle: settings.tagline,
        heroSubtitle: settings.description,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        bookingUrl: settings.bookingUrl,
        instagram: settings.instagram,
        tiktok: settings.tiktok || siteSettingsData.tiktok,
        facebook: settings.facebook || siteSettingsData.facebook,
      }
    : siteSettingsData;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs text-taupe/70">
          {settings ? "Current values from database" : "Edit your site content below"}
        </p>
        <a
          href="/admin/site-settings"
          className="rounded-[4px] bg-gold px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-offwhite transition-all hover:bg-gold/90 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
        >
          Edit
        </a>
      </div>
      <div className="space-y-2.5">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
            Hero Title
          </label>
          <input
            type="text"
            defaultValue={data.heroTitle}
            className={fieldBase}
            readOnly
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
            Tagline
          </label>
          <input
            type="text"
            defaultValue={data.heroSubtitle}
            className={fieldBase}
            readOnly
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
            Address
          </label>
          <input
            type="text"
            defaultValue={data.address}
            className={fieldBase}
            readOnly
          />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
              Phone
            </label>
            <input
              type="text"
              defaultValue={data.phone}
              className={fieldBase}
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
              Email
            </label>
            <input
              type="email"
              defaultValue={data.email}
              className={fieldBase}
              readOnly
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
            Booking URL
          </label>
          <input
            type="text"
            defaultValue={data.bookingUrl}
            className={fieldBase}
            readOnly
          />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
              Instagram
            </label>
            <input
              type="text"
              defaultValue={data.instagram}
              className={fieldBase}
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
              TikTok
            </label>
            <input
              type="text"
              defaultValue={data.tiktok}
              className={fieldBase}
              readOnly
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
              Facebook
            </label>
            <input
              type="text"
              defaultValue={data.facebook}
              className={fieldBase}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
