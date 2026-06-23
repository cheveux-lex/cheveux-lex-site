import Link from "next/link";
import { stylists as fallbackStylists } from "@/lib/site-data";
import type { StylistRow } from "@/lib/supabase/stylists";

interface Props {
  stylists?: StylistRow[];
}

const stylistGradients: Record<string, string> = {
  Lex: "linear-gradient(135deg, #B89B67 0%, #A0845A 40%, #8B6F47 100%)",
  Kat: "linear-gradient(135deg, #C4A882 0%, #B89B67 40%, #A0845A 100%)",
  Morgan:
    "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 40%, #6B5B45 100%)",
  Taylor:
    "linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 40%, #A89C8E 100%)",
};

export default function StylistsPreview({ stylists: stylistsProp }: Props) {
  const stylists = stylistsProp ?? (fallbackStylists as unknown as StylistRow[]);

  return (
    <section className="bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Our Team
          </span>
          <h2 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl">
            Meet Our Stylists
          </h2>
          <p className="mt-4 text-taupe">
            Talented artists dedicated to making you look and feel your best.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stylists.map((stylist) => {
            const s = stylist as Record<string, unknown>;
            const specialties = Array.isArray(s.specialties)
              ? (s.specialties as string[])
              : typeof s.specialty === "string"
                ? [s.specialty as string]
                : [];
            const instagram = (s.instagram as string) || (s.instagram_url as string) || "";
            return (
              <div
                key={s.id as string}
                className="group rounded-sm bg-cream p-6 text-center transition-all hover:shadow-lg"
              >
                <div className="mx-auto mb-5 h-28 w-28 overflow-hidden rounded-full">
                  <div
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    style={{
                      background:
                        stylistGradients[s.name as string] ||
                        "linear-gradient(135deg, #D8CEC2, #A89C8E)",
                    }}
                  />
                </div>
                <h3 className="font-heading text-xl font-semibold text-charcoal">
                  {s.name as string}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {s.role as string}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-taupe">
                  {specialties.join(" · ")}
                </p>
                <div className="mt-4 flex justify-center">
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-beige text-taupe transition-colors hover:border-gold hover:text-gold"
                    aria-label={`${s.name as string} on Instagram`}
                  >
                    <svg
                      width="16"
                      height="16"
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
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/stylists"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gold transition-colors hover:text-charcoal"
          >
            Meet the Full Team
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
