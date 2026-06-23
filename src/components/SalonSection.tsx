import Link from "next/link";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import SafeImage from "@/components/SafeImage";

export default async function SalonSection() {
  const settings = await getSiteSettings();

  return (
    <section className="bg-beige/30 py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-5 md:flex-row md:px-8 lg:px-12">
        <div className="flex-1">
          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-sm md:max-w-none">
            {settings.salon_image_url ? (
              <SafeImage
                src={settings.salon_image_url}
                alt="Our Salon"
                className="h-full w-full object-cover"
                fallback={<SalonGradient />}
              />
            ) : (
              <SalonGradient />
            )}
          </div>
        </div>

        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            About
          </span>
          <h2 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl">
            Our Salon
          </h2>
          <p className="mt-6 leading-relaxed text-taupe">
            At Cheveux Lex Salon, we believe great hair is the ultimate
            accessory. Our studio is designed as a sanctuary where artistry
            meets relaxation&mdash;a place where every guest feels seen, heard,
            and beautifully transformed.
          </p>
          <p className="mt-4 leading-relaxed text-taupe">
            From lived-in color and seamless extensions to precision cuts
            and custom lashes, our team of master stylists and lash artists
            collaborates to bring your vision to life. We use only the
            finest products and techniques, ensuring every result is as
            healthy as it is stunning.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-charcoal px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-charcoal/90 hover:shadow-lg"
          >
            About Us
          </Link>
        </div>
      </div>
    </section>
  );
}

function SalonGradient() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, #A89C8E 0%, #8B7E6E 30%, #6B5B45 60%, #4A3F32 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 60% 30%, rgba(255,255,255,0.2) 0%, transparent 40%),
            radial-gradient(circle at 20% 70%, rgba(255,255,255,0.15) 0%, transparent 30%)
          `,
        }}
      />
      <div className="absolute bottom-6 left-6 right-6">
        <div className="inline-block rounded-sm bg-offwhite/90 px-4 py-3 backdrop-blur-sm">
          <p className="font-heading text-lg font-semibold text-charcoal">
            Lexington&apos;s Premier Salon
          </p>
          <p className="text-xs text-taupe">Est. 2023</p>
        </div>
      </div>
    </>
  );
}
