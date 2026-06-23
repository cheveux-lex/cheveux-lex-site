import type { Metadata } from "next";
import { galleryItems as fallbackItems } from "@/lib/site-data";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getGalleryItems } from "@/lib/supabase/gallery-server";
import GalleryGridClient from "@/components/GalleryGridClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our portfolio of blondes, brunettes, extensions, lashes, and color transformations.",
};

export default async function GalleryPage() {
  const [settings, items] = await Promise.all([
    getSiteSettings(),
    getGalleryItems(),
  ]);

  const galleryItems = (items?.length ? items : fallbackItems) as unknown as Record<string, unknown>[];

  return (
    <>
      <section className="relative overflow-hidden bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8 lg:px-12">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Portfolio
          </span>
          <h1 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl lg:text-6xl">
            Our Work
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-taupe">
          Every image tells a story of transformation. Browse our work
          across color, extensions, and lashes.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <GalleryGridClient items={galleryItems} />
        </div>
      </section>

      <section className="bg-cream py-16 text-center md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <h2 className="font-heading text-3xl font-light text-charcoal md:text-4xl">
            Want a Look Like This?
          </h2>
          <p className="mt-3 text-taupe">
            Let&apos;s create something beautiful together.
          </p>
          <a
            href={settings?.bookingUrl ?? "https://linktr.ee/Cheveux_lex"}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90 hover:shadow-lg"
          >
            Book Appointment
          </a>
        </div>
      </section>
    </>
  );
}
