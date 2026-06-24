import Link from "next/link";
import { siteSettings as defaultSettings } from "@/lib/site-data";
import SafeImage from "@/components/SafeImage";

interface Props {
  settings?: typeof defaultSettings;
}

export default function InfoBand({ settings = defaultSettings }: Props) {
  const embedUrl = settings.map_embed_url ||
    `https://www.google.com/maps?q=${settings.googleMapsQuery}&output=embed`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${settings.googleMapsQuery}`;

  return (
    <section className="bg-offwhite py-16 md:py-20" id="about">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
              About
            </span>
            <h2 className="mt-1 font-heading text-2xl font-light text-charcoal">
              Our Salon
            </h2>
            <div className="mt-2 h-px w-10 bg-gold" />
            <p className="mt-4 text-sm leading-relaxed text-taupe">
              At Cheveux Lex Salon, we believe great hair is the ultimate
              accessory. Our studio is a sanctuary where artistry meets
              relaxation. From lived-in color to precision cuts, we use only
              the finest products and techniques.
            </p>
            <div className="mt-5 flex gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-sm">
                {settings.salon_image_url ? (
                  <SafeImage
                    src={settings.salon_image_url}
                    alt="Our Salon"
                    className="h-full w-full object-cover"
                    fallback={<SalonThumbPlaceholder />}
                  />
                ) : (
                  <SalonThumbPlaceholder />
                )}
              </div>
              <div className="flex-1">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 rounded-sm bg-charcoal px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-charcoal/90 hover:shadow-lg"
                >
                  About Us
                </Link>
                <p className="mt-2 text-[10px] text-taupe">
                  Est. 2023 · Lexington, KY
                </p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
              Booking
            </span>
            <h2 className="mt-1 font-heading text-2xl font-light text-charcoal">
              How To Book
            </h2>
            <div className="mt-2 h-px w-10 bg-gold" />
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 font-heading text-xs font-semibold text-gold">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    Choose Service
                  </p>
                  <p className="text-xs text-taupe">
                    Browse our menu of premium services
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 font-heading text-xs font-semibold text-gold">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    Pick Date &amp; Time
                  </p>
                  <p className="text-xs text-taupe">
                    Find the perfect slot in your schedule
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 font-heading text-xs font-semibold text-gold">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    Confirm &amp; Relax
                  </p>
                  <p className="text-xs text-taupe">
                    Your transformation awaits
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <a
                href={settings.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm bg-gold px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90 hover:shadow-lg"
              >
                Book Appointment
              </a>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
              Location
            </span>
            <h2 className="mt-1 font-heading text-2xl font-light text-charcoal">
              Visit Us
            </h2>
            <div className="mt-2 h-px w-10 bg-gold" />
            <div className="mt-5 space-y-3 text-sm">
              <p className="leading-snug text-charcoal">
                {settings.address}
              </p>
              <p className="text-taupe">{settings.phone}</p>
              <p className="text-taupe">
                Tue - Sat, 9AM - 6PM
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm bg-charcoal px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-charcoal/90 hover:shadow-lg"
              >
                Open in Maps
              </a>
            </div>
            <div className="mt-4 relative aspect-[4/3] w-full overflow-hidden rounded-sm">
              <iframe
                src={embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SalonThumbPlaceholder() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #A89C8E 0%, #8B7E6E 30%, #6B5B45 60%, #4A3F32 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 60% 30%, rgba(255,255,255,0.2) 0%, transparent 40%)",
        }}
      />
    </>
  );
}
