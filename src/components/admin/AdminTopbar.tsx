"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminTopbar({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-beige/20 bg-offwhite/95 px-4 backdrop-blur-sm md:px-6 lg:px-8">
      <button
        onClick={onMenuToggle}
        className="flex flex-col gap-1 lg:hidden"
        aria-label="Toggle sidebar"
      >
        <span className="block h-[1.5px] w-5 rounded-full bg-charcoal/40" />
        <span className="block h-[1.5px] w-5 rounded-full bg-charcoal/40" />
        <span className="block h-[1.5px] w-5 rounded-full bg-charcoal/40" />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-beige/25 text-taupe/60 transition-all hover:border-gold/50 hover:text-gold"
          aria-label="Notifications"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold ring-1 ring-offwhite" />
        </button>

        <div className="flex items-center gap-3">
          {userEmail ? (
            <div className="text-right">
              <p className="text-xs font-medium leading-tight text-charcoal truncate max-w-[160px]">
                {userEmail}
              </p>
              <p className="text-[9px] leading-tight tracking-wider text-taupe">
                Admin
              </p>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-xs font-medium leading-tight text-charcoal">
                Lex
              </p>
              <p className="text-[9px] leading-tight tracking-wider text-taupe">
                Owner
              </p>
            </div>
          )}
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gold/30 to-gold/10 ring-1 ring-gold/20">
            <span className="font-heading text-sm font-semibold text-gold">
              {userEmail ? userEmail[0].toUpperCase() : "L"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
