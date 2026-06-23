"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteSettings as fallbackSettings } from "@/lib/site-data";
import { usePrimaryBookingUrl } from "@/lib/usePrimaryBookingUrl";
import { createClient } from "@/lib/supabase/client";
import SafeImage from "@/components/SafeImage";

export default function Header() {
  const bookingUrl = usePrimaryBookingUrl();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(fallbackSettings.logo_url);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      const { data } = await createClient()
        .from("site_settings")
        .select("logo_url")
        .eq("singleton", true)
        .maybeSingle();
      if (data?.logo_url) setLogoUrl(data.logo_url);
    })().catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-beige/30 bg-offwhite/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 lg:px-12">
        <Link href="/" className="group flex-shrink-0">
          {logoUrl ? (
            <SafeImage
              src={logoUrl}
              alt={fallbackSettings.shortName}
              className="h-10 w-auto object-contain"
              fallback={
                <>
                  <span className="font-heading text-xl font-semibold tracking-wide text-charcoal transition-colors group-hover:text-gold md:text-2xl">
                    {fallbackSettings.shortName}
                  </span>
                  <span className="block text-[9px] uppercase tracking-[0.2em] text-taupe md:text-[10px]">
                    {fallbackSettings.subtitle}
                  </span>
                </>
              }
            />
          ) : (
            <>
              <span className="font-heading text-xl font-semibold tracking-wide text-charcoal transition-colors group-hover:text-gold md:text-2xl">
                {fallbackSettings.shortName}
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-taupe md:text-[10px]">
                {fallbackSettings.subtitle}
              </span>
            </>
          )}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {fallbackSettings.navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={`${link.label}-${link.href}`}
                href={link.href}
                className={`relative text-xs font-medium uppercase tracking-widest transition-colors hover:text-gold ${
                  isActive
                    ? "text-gold after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-gold"
                    : "text-charcoal/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-sm bg-gold px-5 py-2 text-xs font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90 hover:shadow-lg lg:inline-block"
          >
            Book Now
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex flex-col gap-1 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`block h-[2px] w-5 bg-charcoal transition-all ${
                mobileOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-charcoal transition-all ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-5 bg-charcoal transition-all ${
                mobileOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-beige/30 bg-offwhite px-5 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {fallbackSettings.navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-gold ${
                    isActive ? "text-gold" : "text-charcoal/80"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block w-full rounded-sm bg-gold px-6 py-3 text-center text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90"
            >
              Book Now
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
