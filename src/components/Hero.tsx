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

      {/* Soft editorial gradient veil for readability */}
      <div
        className="absolute inset-0"
        style={{
          background: hasImage
            ? "linear-gradient(90deg, rgba(246,241,234,0.78) 0%, rgba(246,241,234,0.48) 42%, rgba(246,241,234,0.12) 72%, rgba(246,241,234,0) 100%)"
            : "none",
        }}
      />
      {/* Stronger veil on mobile */}
      {hasImage && (
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background: "linear-gradient(90deg, rgba(246,241,234,0.82) 0%, rgba(246,241,234,0.55) 50%, rgba(246,241,234,0.2) 100%)",
          }}
        />
      )}

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
          <p className="mt-5 max-w-[520px] text-sm leading-[1.55] font-medium md:text-base" style={{ color: "#181410", textShadow: "0 1px 10px rgba(255,255,255,0.35)" }}>
            {settings.description}
          </p>
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
