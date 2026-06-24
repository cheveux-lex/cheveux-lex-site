import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Cheveux Lex Salon. Visit us in Lexington, Kentucky or book online.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const embedUrl = settings.map_embed_url ||
    `https://www.google.com/maps?q=${settings.googleMapsQuery}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${settings.googleMapsQuery}`;

  return (
    <>
      <section className="relative overflow-hidden bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8 lg:px-12">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Get in Touch
          </span>
          <h1 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-taupe">
            We&apos;d love to hear from you. Reach out, stop by, or book
            your appointment online.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div className="space-y-10">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Address
                </h2>
                <p className="mt-2 font-heading text-2xl leading-snug text-charcoal">
                  {settings.address}
                </p>
              </div>

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Phone
                </h2>
                <a
                  href={`tel:${settings.phone.replace(/\D/g, "")}`}
                  className="mt-2 block font-heading text-2xl text-charcoal transition-colors hover:text-gold"
                >
                  {settings.phone}
                </a>
              </div>

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Email
                </h2>
                <a
                  href={`mailto:${settings.email}`}
                  className="mt-2 block font-heading text-2xl text-charcoal transition-colors hover:text-gold"
                >
                  {settings.email}
                </a>
              </div>

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Hours
                </h2>
                <div className="mt-4 space-y-3">
                  {settings.hours.map((h) => (
                    <div key={h.day} className="flex gap-6">
                      <span className="w-24 text-sm font-medium text-charcoal">
                        {h.day}
                      </span>
                      <span className="text-sm text-taupe">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  Follow Us
                </h2>
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-taupe transition-colors hover:text-gold"
                >
                  <svg
                    width="20"
                    height="20"
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
                  <span className="text-sm">{settings.instagramHandle}</span>
                </a>
              </div>

              <a
                href={settings.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90 hover:shadow-lg"
              >
                Book Appointment
              </a>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
              <iframe
                src={embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-sm bg-charcoal/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-charcoal"
              >
                Open in Maps
              </a>
            </div>
          </div>

          <div className="mt-16 border-t border-beige/15 pt-16">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                Send a Message
              </span>
              <h2 className="mt-2 font-heading text-3xl font-light text-charcoal">
                Get in Touch
              </h2>
              <p className="mt-2 text-sm text-taupe">
                Have a question or want to book a specific service? Send us a message
                and we&apos;ll get back to you.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a
              href={settings.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90 hover:shadow-lg"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
