"use client";

import { bookingSteps } from "@/lib/site-data";
import { usePrimaryBookingUrl } from "@/lib/usePrimaryBookingUrl";

export default function HowToBook() {
  const bookingUrl = usePrimaryBookingUrl();
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Booking
          </span>
          <h2 className="mt-3 font-heading text-4xl font-light text-charcoal md:text-5xl">
            How to Book
          </h2>
          <p className="mt-4 text-taupe">
            Three simple steps to your next appointment.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {bookingSteps.map((step) => (
            <div key={step.step} className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <span className="font-heading text-2xl font-semibold text-gold">
                  {String(step.step).padStart(2, "0")}
                </span>
              </div>
              {step.step < bookingSteps.length && (
                <div className="absolute left-[60%] top-8 hidden h-[2px] w-[calc(80%-4rem)] bg-beige md:block" />
              )}
              <h3 className="font-heading text-xl font-semibold text-charcoal">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-taupe">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-sm bg-gold px-8 py-3.5 text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90 hover:shadow-lg"
          >
            Book Appointment
          </a>
        </div>
      </div>
    </section>
  );
}
