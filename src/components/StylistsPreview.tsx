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
    <section className="w-full max-w-full overflow-hidden bg-offwhite py-20 pb-32 md:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="mb-12 max-w-xl md:mx-auto md:mb-14 md:text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Our Team
          </span>

          <h2 className="mt-3 font-heading text-4xl font-light leading-none text-charcoal md:text-5xl">
            Meet Our Stylists
          </h2>

          <div className="mt-5 h-px w-24 bg-gold md:mx-auto" />

          <p className="mt-5 text-taupe">
            Talented artists dedicated to making you look and feel your best.
          </p>
        </div>

        <div className="grid w-full max-w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stylists.map((stylist, index) => {
            const s = stylist as Record<string, unknown>;

            const name = String(s.name ?? "");
            const role = String(s.role ?? "");
            const imageUrl =
              typeof s.image_url === "string"
                ? s.image_url
                : typeof s.image === "string"
                  ? s.image
                  : "";

            const specialties = Array.isArray(s.specialties)
              ? (s.specialties as string[])
              : typeof s.specialty === "string"
                ? [s.specialty as string]
                : typeof s.bio === "string"
                  ? [s.bio as string]
                  : [];

            const instagram =
              (s.instagram as string) || (s.instagram_url as string) || "";

            return (
              <div
                key={(s.id as string) || `${name}-${index}`}
                className="
                  group mx-auto box-border w-[calc(100vw-56px)] max-w-[calc(100vw-56px)]
                  -translate-x-3 overflow-hidden rounded-[30px] border border-beige/70
                  bg-[#FFFCF7] p-5 shadow-[0_10px_28px_rgba(21,18,15,0.06)]
                  transition-all hover:shadow-lg
                  md:w-full md:max-w-full md:translate-x-0 md:rounded-sm md:bg-cream md:p-6 md:text-center
                "
              >
                <div className="mb-5 h-28 w-28 overflow-hidden rounded-full md:mx-auto">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                      style={{
                        background:
                          stylistGradients[name] ||
                          "linear-gradient(135deg, #D8CEC2, #A89C8E)",
                      }}
                    />
                  )}
                </div>

                <div className="w-full min-w-0">
                  <h3 className="font-heading text-[34px] font-semibold leading-none text-charcoal md:text-xl md:leading-tight">
                    {name}
                  </h3>

                  <p className="mt-3 break-words text-xs font-semibold uppercase tracking-[0.22em] text-gold md:mt-1 md:tracking-[0.2em]">
                    {role}
                  </p>

                  {specialties.length > 0 && (
                    <p className="mt-3 max-w-full break-words text-[17px] leading-relaxed text-taupe md:text-sm">
                      {specialties.join(" · ")}
                    </p>
                  )}

                  {instagram && (
                    <div className="mt-5 flex md:justify-center">
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-beige text-taupe transition-colors hover:border-gold hover:text-gold md:h-9 md:w-9"
                        aria-label={`${name} on Instagram`}
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
                  )}
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