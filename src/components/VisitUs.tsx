import { siteSettings } from "@/lib/site-data";

export default function VisitUs() {
  const mapsUrl = `https://www.google.com/maps/search/${siteSettings.googleMapsQuery}`;

  return (
    <section className="bg-offwhite py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Location
          </span>
          <h2 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl">
            Visit Us
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Address
              </h3>
              <p className="mt-2 font-heading text-2xl leading-snug text-charcoal">
                {siteSettings.address}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Phone
              </h3>
              <p className="mt-2 text-taupe">{siteSettings.phone}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Hours
              </h3>
              <div className="mt-3 space-y-2">
                {siteSettings.hours.map((h) => (
                  <div key={h.day} className="flex gap-6 text-sm">
                    <span className="w-24 font-medium text-charcoal">
                      {h.day}
                    </span>
                    <span className="text-taupe">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-charcoal px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-charcoal/90 hover:shadow-lg"
            >
              Open in Maps
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
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(135deg, #D8CEC2 0%, #C4B6A6 20%, #B89B67 45%, #C4B6A6 70%, #D8CEC2 100%)
                `,
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 30px,
                    rgba(184, 155, 103, 0.15) 30px,
                    rgba(184, 155, 103, 0.15) 31px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 30px,
                    rgba(184, 155, 103, 0.15) 30px,
                    rgba(184, 155, 103, 0.15) 31px
                  )
                `,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gold"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="mt-4 font-heading text-xl font-semibold text-charcoal">
                {siteSettings.shortName}
              </p>
              <p className="mt-1 text-sm text-taupe">
                {siteSettings.addressShort}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
