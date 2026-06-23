"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { siteSettings as fallbackSettings } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";
import SafeImage from "@/components/SafeImage";

export default function Footer() {
  const [footerLogoUrl, setFooterLogoUrl] = useState(fallbackSettings.footer_logo_url);

  useEffect(() => {
    (async () => {
      const { data } = await createClient()
        .from("site_settings")
        .select("footer_logo_url")
        .eq("singleton", true)
        .maybeSingle();
      if (data?.footer_logo_url) setFooterLogoUrl(data.footer_logo_url);
    })().catch(() => {});
  }, []);

  return (
    <footer className="bg-charcoal text-offwhite/80">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 lg:px-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            {footerLogoUrl ? (
              <SafeImage
                src={footerLogoUrl}
                alt={fallbackSettings.shortName}
                className="h-12 w-auto object-contain"
                fallback={
                  <>
                    <span className="font-heading text-xl font-semibold tracking-wide text-offwhite">
                      {fallbackSettings.shortName}
                    </span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-taupe">
                      {fallbackSettings.subtitle}
                    </span>
                  </>
                }
              />
            ) : (
              <>
                <span className="font-heading text-xl font-semibold tracking-wide text-offwhite">
                  {fallbackSettings.shortName}
                </span>
                <span className="block text-[9px] uppercase tracking-[0.2em] text-taupe">
                  {fallbackSettings.subtitle}
                </span>
              </>
            )}
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-offwhite/50">
              {fallbackSettings.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {fallbackSettings.navLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="text-xs transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Contact
            </h3>
            <div className="space-y-2 text-xs leading-relaxed">
              <p className="text-offwhite/50">{fallbackSettings.address}</p>
              <p className="text-offwhite/50">{fallbackSettings.phone}</p>
              <p className="text-offwhite/50">{fallbackSettings.email}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Follow Us
            </h3>
            <a
              href={fallbackSettings.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-offwhite/50 transition-colors hover:text-gold"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              {fallbackSettings.instagramHandle}
            </a>
            <div className="mt-4 space-y-1 text-xs text-offwhite/50">
              <p>Mon&ndash;Wed: 9AM &ndash; 7PM</p>
              <p>Thu&ndash;Fri: 9AM &ndash; 8PM</p>
              <p>Sat: 9AM &ndash; 6PM</p>
              <p>Sun: Closed</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-offwhite/10 pt-6 text-center text-[10px] text-offwhite/30">
          <p>{fallbackSettings.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
