import Link from "next/link";
import { siteSettings as defaultSettings } from "@/lib/site-data";

interface Props {
  settings?: typeof defaultSettings;
}

export default function Hero({ settings = defaultSettings }: Props) {
  const hasImage = !!settings.hero_image_url;

  return (
    <section className="relative overflow-hidden bg-cream">
      {/* Decorative gradient fallback (always rendered, covered by image if present) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 15% 60%, #D8CEC2 0%, transparent 55%),
            radial-gradient(ellipse at 85% 30%, #D8CEC2 0%, transparent 45%),
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(184, 155, 103, 0.02) 35px,
              rgba(184, 155, 103, 0.02) 36px
            )
          `,
        }}
      />

      {/* Full-width hero background image */}
      {hasImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${settings.hero_image_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Warm overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: hasImage
            ? "linear-gradient(135deg, rgba(248,244,240,0.88) 0%, rgba(248,244,240,0.45) 50%, rgba(248,244,240,0.1) 100%)"
            : "none",
        }}
      />

      {/* Content on top */}
      <div className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col justify-center px-5 py-14 md:px-8 lg:px-12">
        <div className="max-w-lg">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
            {settings.name}
          </span>
          <h1 className="mt-3 font-heading text-5xl font-light leading-[1.1] tracking-tight text-charcoal md:text-5xl lg:text-6xl">
            {settings.tagline}
          </h1>
          <div className="mt-4 h-px w-16 bg-gold" />
          <div
            className="mt-5 inline-block max-w-md"
            style={{
              background: "linear-gradient(90deg, rgba(246,241,234,0.62) 0%, rgba(246,241,234,0.42) 55%, rgba(246,241,234,0.12) 100%)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "10px",
              padding: "10px 14px",
              boxShadow: "0 6px 18px rgba(21,18,15,0.04)",
            }}
          >
            <p className="text-sm leading-[1.55] font-medium md:text-base" style={{ color: "#1A1714" }}>
              {settings.description}
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={settings.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm bg-charcoal px-7 py-3 text-xs font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-charcoal/90 hover:shadow-lg"
            >
              Book Appointment
            </a>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-sm border border-charcoal/20 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-charcoal transition-all hover:border-gold hover:text-gold"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
