"use client";

import { useEffect, useState } from "react";
import { siteSettings } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";

const FALLBACK = siteSettings.bookingUrl;

export function usePrimaryBookingUrl(): string {
  const [url, setUrl] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("booking_links")
      .select("booking_url")
      .eq("is_primary", true)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return;
        if (data?.booking_url) {
          if (process.env.NODE_ENV === "development") {
            console.log("[booking-link-hook] primary link:", data.booking_url);
          }
          setUrl(data.booking_url);
        }
      });
    return () => { cancelled = true; };
  }, []);

  return url;
}
