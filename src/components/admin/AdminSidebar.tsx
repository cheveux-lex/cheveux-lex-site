"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteSettings } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Site Settings", href: "/admin/site-settings", icon: "settings" },
  { label: "Services", href: "/admin/services", icon: "scissors" },
  { label: "Stylists", href: "/admin/stylists", icon: "users" },
  { label: "Gallery", href: "/admin/gallery", icon: "image" },
  { label: "Videos", href: "/admin/videos", icon: "video" },
  // { label: "Media", href: "/admin/media", icon: "camera" },
  { label: "Booking Links", href: "/admin/booking-links", icon: "link" },
  { label: "Messages", href: "/admin/messages", icon: "message" },
];

const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  scissors: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  video: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  link: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  camera: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  message: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [newMsgCount, setNewMsgCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "new")
      .then(({ count }) => {
        if (count !== null) setNewMsgCount(count);
      });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-dvh w-64 flex-col border-r border-beige/20 bg-offwhite transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-beige/20 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-gold shadow-sm">
            <span className="font-heading text-sm font-bold tracking-tight text-offwhite">
              CL
            </span>
          </div>
          <div>
            <span className="block font-heading text-sm font-semibold tracking-tight text-charcoal">
              {siteSettings.shortName}
            </span>
            <span className="block text-[9px] uppercase tracking-[0.2em] text-taupe">
              Admin Panel
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-5">
          {sidebarLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-all ${
                  isActive
                    ? "bg-gold/8 text-gold shadow-[inset_2px_0_0_0_#B89B67]"
                    : "text-charcoal/45 hover:bg-beige/20 hover:text-charcoal/65"
                }`}
              >
                <span className="flex-shrink-0">{icons[link.icon]}</span>
                <span className="flex-1">{link.label}</span>
                {link.label === "Messages" && newMsgCount > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gold/90 px-1.5 text-[8px] font-bold uppercase tracking-wide text-offwhite">
                    {newMsgCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-beige/20 px-4 py-4">
          <div className="rounded-sm bg-cream/80 p-4">
            <p className="font-heading text-sm font-semibold tracking-tight text-charcoal">
              Your site. Your brand.
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-taupe">
              View your public website and see how it looks to clients.
            </p>
            <Link
              href="/"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-gold/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold transition-all hover:bg-gold hover:text-offwhite focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View Site
            </Link>
          </div>
        </div>

        <div className="border-t border-beige/20 px-3 py-3 pb-4">
          <button
            onClick={() => { handleLogout(); onClose(); }}
            className="flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-charcoal/35 transition-all hover:bg-red-50/50 hover:text-red-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
