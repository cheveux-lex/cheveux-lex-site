"use client";

import { usePrimaryBookingUrl } from "@/lib/usePrimaryBookingUrl";

export default function MobileStickyCTA() {
  const bookingUrl = usePrimaryBookingUrl();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-beige/30 bg-offwhite/95 px-5 py-3 backdrop-blur-sm md:hidden">
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full rounded-sm bg-gold px-6 py-3 text-center text-sm font-semibold uppercase tracking-widest text-offwhite transition-all hover:bg-gold/90"
      >
        Book Appointment
      </a>
    </div>
  );
}
