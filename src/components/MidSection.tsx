import Link from "next/link";
import { galleryItems as fallbackGallery, stylists as fallbackStylists } from "@/lib/site-data";
import type { StylistRow } from "@/lib/supabase/stylists";
import type { GalleryRow } from "@/lib/supabase/gallery";
import MobileGalleryCarousel from "@/components/MobileGalleryCarousel";

interface Props {
  stylists?: StylistRow[];
  galleryItems?: GalleryRow[];
}

const categoryGradients: Record<string, string> = {
  Blonde: "linear-gradient(135deg, #E8D5B7 0%, #D4B896 40%, #C4A882 100%)",
  Brunette: "linear-gradient(135deg, #8B7355 0%, #6B5B45 40%, #4A3F32 100%)",
  Extensions: "linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 40%, #A89C8E 100%)",
  Lashes: "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 40%, #6B5B45 100%)",
  Color: "linear-gradient(135deg, #C49B7A 0%, #B89B67 40%, #A0845A 100%)",
};

const stylistGradients: Record<string, string> = {
  Lex: "linear-gradient(135deg, #B89B67 0%, #A0845A 40%, #8B6F47 100%)",
  Kat: "linear-gradient(135deg, #C4A882 0%, #B89B67 40%, #A0845A 100%)",
  Morgan: "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 40%, #6B5B45 100%)",
  Taylor: "linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 40%, #A89C8E 100%)",
};

export default function MidSection({ stylists: stylistsProp, galleryItems: galleryProp }: Props) {
  const stylists = stylistsProp ?? (fallbackStylists as unknown as StylistRow[]);
  const displayItems = (galleryProp?.length ? galleryProp : fallbackGallery) as unknown as Record<string, unknown>[];
  return (
    <section className="bg-cream w-full max-w-full overflow-hidden pt-16 pb-28 md:py-20" id="our-work">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                  Portfolio
                </span>
                <h2 className="mt-1 font-heading text-3xl font-light text-charcoal md:text-4xl">
                  Our Work
                </h2>
                <div className="mt-2 h-px w-12 bg-gold" />
              </div>
              <Link
                href="/gallery"
                className="hidden items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold transition-colors hover:text-charcoal md:inline-flex"
              >
                View All
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            <div className="hidden grid-cols-5 gap-3 md:grid">
              {displayItems.slice(0, 5).map((item, i) => (
                <div
                  key={(item.id as string) || String(item.id as number) || i}
                  className="group relative aspect-[3/4] overflow-hidden rounded-sm"
                >
                  <div
                    className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      background: categoryGradients[item.category as string] || "linear-gradient(135deg, #D8CEC2, #A89C8E)",
                    }}
                  />
                  {item.image_url ? (
                    <img
                      src={item.image_url as string}
                      alt={(item.title as string) || (item.description as string) || (item.alt as string) || "Gallery image"}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : null}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%),
                        radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 40%)
                      `,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">
                      {item.category as string}
                    </p>
                    <p className="text-xs text-offwhite/90 line-clamp-1">
                      {(item.description as string) || (item.alt as string)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:hidden">
              <MobileGalleryCarousel items={displayItems} categoryGradients={categoryGradients} />
            </div>

            <div className="mt-4 md:hidden">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold transition-colors hover:text-charcoal"
              >
                View All Work
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                Our Team
              </span>
              <h2 className="mt-1 font-heading text-3xl font-light text-charcoal md:text-4xl">
                Meet Our Stylists
              </h2>
              <div className="mt-2 h-px w-12 bg-gold" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {stylists.map((stylist) => {
                const s = stylist as Record<string, unknown>;
                const specialties = Array.isArray(s.specialties)
                  ? (s.specialties as string[])
                  : typeof s.specialty === "string"
                    ? [s.specialty as string]
                    : [];
                const instagram = (s.instagram as string) || (s.instagram_url as string) || "";
                const initial = (s.name as string)?.[0] || "?";
                return (
                  <div
                    key={s.id as string}
                    className="group rounded-[24px] transition-all w-full max-w-full min-w-0 flex flex-col items-start p-5 border border-[#E9DED0] shadow-[0_8px_22px_rgba(21,18,15,0.05)] overflow-hidden md:items-center md:text-center md:p-4 md:rounded-sm md:bg-offwhite md:border-0 md:shadow-none"
                    style={{ backgroundColor: '#FFFCF7' }}
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden flex-none mb-4 md:w-20 md:h-20 md:mx-auto md:mb-3 relative">
                      {s.image_url ? (
                        <img
                          src={s.image_url as string}
                          alt={s.name as string}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-beige/30 text-gold font-heading text-lg font-semibold">
                          {initial}
                        </div>
                      )}
                    </div>
                    <div className="w-full min-w-0 md:text-center">
                      <h3 className="font-heading text-[26px] leading-tight font-semibold text-charcoal break-words">
                        {s.name as string}
                      </h3>
                      <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-gold break-words">
                        {s.role as string}
                      </p>
                      <p className="mt-1.5 text-[16px] leading-[1.4] text-taupe break-words">
                        {specialties.join(" · ")}
                      </p>
                      {instagram && (
                        <div className="mt-3">
                          <a
                            href={instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full border text-taupe transition-colors hover:border-gold hover:text-gold"
                            style={{ borderColor: 'rgba(190, 158, 103, 0.25)' }}
                            aria-label={`${s.name as string} on Instagram`}
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
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 text-center">
              <Link
                href="/stylists"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold transition-colors hover:text-charcoal"
              >
                Meet the Full Team
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
