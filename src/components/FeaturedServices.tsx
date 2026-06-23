import Link from "next/link";
import { getServiceIcon } from "@/lib/service-icons";
import type { ServiceRow } from "@/lib/supabase/services";

interface Props {
  services: ServiceRow[];
}

export default function FeaturedServices({ services }: Props) {
  const displayed = services.slice(0, 3);

  return (
    <section className="bg-offwhite py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="grid gap-5 md:grid-cols-3">
          {displayed.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-sm bg-cream p-6 transition-all hover:shadow-lg"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse at 20% 30%, rgba(184,155,103,0.2) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 70%, rgba(184,155,103,0.15) 0%, transparent 50%),
                    repeating-linear-gradient(
                      0deg,
                      transparent 0px,
                      transparent 20px,
                      rgba(184,155,103,0.04) 20px,
                      rgba(184,155,103,0.04) 21px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent 0px,
                      transparent 20px,
                      rgba(184,155,103,0.04) 20px,
                      rgba(184,155,103,0.04) 21px
                    )
                  `,
                }}
              />

              <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-[0.06]"
                style={{
                  background:
                    "radial-gradient(circle, #B89B67 0%, transparent 70%)",
                }}
              />

              <div className="relative flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-beige/30 text-gold">
                  {getServiceIcon(service.icon ?? "palette")}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-lg font-semibold text-charcoal">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-taupe">
                    {service.description}
                  </p>
                  <Link
                    href={`/services#${service.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-gold transition-colors hover:text-charcoal"
                  >
                    Learn More
                    <svg
                      width="12"
                      height="12"
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
          ))}
        </div>
      </div>
    </section>
  );
}
