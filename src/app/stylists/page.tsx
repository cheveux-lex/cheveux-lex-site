import type { Metadata } from "next";
import { getActiveStylists } from "@/lib/supabase/stylists";
import { getSiteSettings } from "@/lib/supabase/site-settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stylists",
  description: "Meet our talented team of master stylists and lash artists at Cheveux Lex Salon.",
};

const stylistGradients: Record<string, string> = {
  Lex: "linear-gradient(135deg, #B89B67 0%, #A0845A 40%, #8B6F47 100%)",
  Kat: "linear-gradient(135deg, #C4A882 0%, #B89B67 40%, #A0845A 100%)",
  Morgan: "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 40%, #6B5B45 100%)",
  Taylor: "linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 40%, #A89C8E 100%)",
};

export default async function StylistsPage() {
  const [stylists, settings] = await Promise.all([
    getActiveStylists(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8 lg:px-12">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Our Team
          </span>
          <h1 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl lg:text-6xl">
            Meet Our Stylists
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-taupe">
            Our team brings years of experience, passion, and artistry to
            every appointment. Get to know the faces behind Cheveux Lex.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="grid gap-10 md:grid-cols-2">
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
                  className="group flex flex-col gap-6 rounded-sm border border-beige/30 bg-cream p-8 transition-all hover:shadow-lg sm:flex-row md:p-10"
                >
                  <div className="mx-auto h-32 w-32 flex-shrink-0 overflow-hidden rounded-full sm:mx-0">
                    {s.image_url ? (
                      <img
                        src={s.image_url as string}
                        alt={s.name as string}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                        style={{
                          background: stylistGradients[s.name as string] || "linear-gradient(135deg, #D8CEC2, #A89C8E)",
                        }}
                      />
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center gap-3 sm:justify-start">
                      <h2 className="font-heading text-2xl font-semibold text-charcoal">
                        {s.name as string}
                      </h2>
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-beige text-taupe transition-colors hover:border-gold hover:text-gold"
                        aria-label={`${s.name as string} on Instagram`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                      {s.role as string}
                    </p>
                    <p className="mt-3 leading-relaxed text-taupe">
                      {s.bio as string}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {specialties.map((spec) => (
                        <span
                          key={spec}
                          className="rounded-full bg-beige/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-taupe"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 text-center md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <h2 className="font-heading text-3xl font-light text-charcoal md:text-4xl">
            Book With Confidence
          </h2>
          <p className="mt-3 text-taupe">
            Every stylist is ready to bring your vision to life.
          </p>
          <a
            href={settings.bookingUrl}
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
