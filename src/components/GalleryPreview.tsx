import Link from "next/link";
import { galleryItems as fallbackItems } from "@/lib/site-data";
import type { GalleryRow } from "@/lib/supabase/gallery";

const categoryGradients: Record<string, string> = {
  Blonde: "linear-gradient(135deg, #E8D5B7 0%, #D4B896 40%, #C4A882 100%)",
  Brunette: "linear-gradient(135deg, #8B7355 0%, #6B5B45 40%, #4A3F32 100%)",
  Extensions: "linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 40%, #A89C8E 100%)",
  Lashes: "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 40%, #6B5B45 100%)",
  Color: "linear-gradient(135deg, #C49B7A 0%, #B89B67 40%, #A0845A 100%)",
};

interface Props {
  galleryItems?: GalleryRow[];
}

export default function GalleryPreview({ galleryItems }: Props) {
  const items = (galleryItems?.length ? galleryItems : fallbackItems) as unknown as Record<string, unknown>[];

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              Portfolio
            </span>
            <h2 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl">
              Our Work
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold transition-colors hover:text-charcoal md:inline-flex"
          >
            View All
            <svg
              width="14"
              height="14"
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

        <div className="hidden grid-cols-5 gap-4 md:grid">
          {items.slice(0, 5).map((item, i) => (
            <div
              key={(item.id as string) || String(item.id as number) || i}
              className="group relative aspect-[3/4] overflow-hidden rounded-sm"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  background:
                    categoryGradients[item.category as string] ||
                    "linear-gradient(135deg, #D8CEC2, #A89C8E)",
                }}
              />
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
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  {item.category as string}
                </p>
                <p className="text-sm text-offwhite">{item.description as string || item.alt as string}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 md:hidden">
          {items.slice(0, 5).map((item, i) => (
            <div
              key={(item.id as string) || String(item.id as number) || i}
              className="relative aspect-[3/4] w-64 flex-shrink-0 overflow-hidden rounded-sm"
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    categoryGradients[item.category as string] ||
                    "linear-gradient(135deg, #D8CEC2, #A89C8E)",
                }}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)
                  `,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  {item.category as string}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold transition-colors hover:text-charcoal"
          >
            View All Work
            <svg
              width="14"
              height="14"
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
    </section>
  );
}
