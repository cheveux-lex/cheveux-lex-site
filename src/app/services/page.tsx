import type { Metadata } from "next";
import { getActiveServices } from "@/lib/supabase/services";
import { getSiteSettings } from "@/lib/supabase/site-settings";
import { getServiceIcon } from "@/lib/service-icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our premium salon services including lived-in color, extensions, lashes, cuts, and more.",
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getActiveServices(),
    getSiteSettings(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 text-center md:px-8 lg:px-12">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            What We Offer
          </span>
          <h1 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl lg:text-6xl">
            Our Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-taupe">
            Every service is tailored to your unique beauty. Browse our menu
            and book the experience that speaks to you.
          </p>
        </div>
      </section>

      <section className="bg-offwhite py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => {
              const svc = service as Record<string, unknown>;
              const price = (svc.price_range || svc.priceRange) as string | undefined;
              const category = svc.category as string | undefined;
              const categories = svc.categories as string[] | undefined;
              return (
                <div
                  key={service.id}
                  id={service.slug}
                  className="group rounded-sm border border-beige/30 bg-cream p-8 transition-all hover:shadow-lg md:p-10"
                >
                  <div className="flex items-start gap-5">
                    <div className="mb-5 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-beige/30 text-gold">
                      {getServiceIcon(service.icon ?? "palette")}
                    </div>
                    {service.image_url && (
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-heading text-2xl font-semibold text-charcoal">
                      {service.title}
                    </h2>
                    {price && (
                      <span className="whitespace-nowrap text-sm font-semibold text-gold">
                        {price}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 leading-relaxed text-taupe">
                    {service.description}
                  </p>
                  {categories && Array.isArray(categories) ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {categories.map((cat, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-beige/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-taupe"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  ) : category ? (
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-beige/20 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-taupe">
                        {category}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 text-center md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
          <h2 className="font-heading text-3xl font-light text-charcoal md:text-4xl">
            Ready to Transform?
          </h2>
          <p className="mt-3 text-taupe">
            Your perfect look is just a booking away.
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
