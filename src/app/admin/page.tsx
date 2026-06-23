import type { Metadata } from "next";
import Link from "next/link";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import DashboardStats from "@/components/admin/DashboardStats";
import AdminCard from "@/components/admin/AdminCard";
import RecentActivity from "@/components/admin/RecentActivity";
import GalleryManagerPreview from "@/components/admin/GalleryManagerPreview";
import StylistsManagerPreview from "@/components/admin/StylistsManagerPreview";
import SiteSettingsPreview from "@/components/admin/SiteSettingsPreview";
import { getServicesCount } from "@/lib/supabase/services";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getStylistsCount, getStylists } from "@/lib/supabase/stylists";
import { getGalleryItems } from "@/lib/supabase/gallery-server";
import { getMessagesCount, getNewMessagesCount } from "@/lib/supabase/messages-server";
import { getVideosCount } from "@/lib/supabase/videos";

export const metadata: Metadata = {
  title: "Dashboard",
};

const quickActions = [
  { href: "/admin/stylists", label: "New Stylist" },
  { href: "/admin/gallery", label: "Upload Gallery" },
  { href: "/admin/services", label: "New Service" },
  { href: "/admin/messages", label: "View Messages" },
];

export default async function AdminDashboardPage() {
  const [servicesCount, settings, stylistsCount, stylists, galleryItems, messagesCount, newMessagesCount, videosCount] = await Promise.all([
    getServicesCount(),
    getSiteSettings(),
    getStylistsCount(),
    getStylists(),
    getGalleryItems(),
    getMessagesCount(),
    getNewMessagesCount(),
    getVideosCount(),
  ]);

  return (
    <>
      <div className="mb-2">
        <p className="text-sm leading-relaxed text-taupe">Welcome back, Lex!</p>
      </div>
      <AdminPageHeader title="Dashboard" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-[4px] border border-gold/25 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold transition-all hover:bg-gold hover:text-offwhite hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              {a.label}
            </Link>
          ))}
        </div>

        <DashboardStats servicesCount={servicesCount} stylistsCount={stylistsCount} messagesCount={messagesCount} newMessagesCount={newMessagesCount} videosCount={videosCount} />

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <AdminCard title="Recent Activity">
            <RecentActivity />
          </AdminCard>

          <AdminCard title="Gallery Manager">
            <GalleryManagerPreview galleryItems={galleryItems} />
          </AdminCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 items-start">
          <AdminCard title="Stylists Manager">
            <StylistsManagerPreview stylists={stylists} />
          </AdminCard>

          <AdminCard title="Site Settings">
            <SiteSettingsPreview settings={settings} />
          </AdminCard>
        </div>
      </div>
    </>
  );
}
