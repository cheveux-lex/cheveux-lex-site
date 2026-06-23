"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { siteSettings } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("lex@cheveuxlex.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream/50 px-4">
      <div className="w-full max-w-sm rounded-sm border border-beige/20 bg-offwhite p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-sm bg-gold shadow-sm">
            <span className="font-heading text-lg font-bold tracking-tight text-offwhite">
              CL
            </span>
          </div>
          <span className="font-heading text-xl font-semibold tracking-tight text-charcoal">
            {siteSettings.shortName}
          </span>
          <span className="block text-[9px] uppercase tracking-[0.2em] text-taupe">
            Admin Panel
          </span>
          <div className="mx-auto mt-4 h-px w-8 bg-gold/60" />
          <p className="mt-4 text-xs leading-relaxed text-taupe">
            Sign in to manage your salon
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-[4px] border border-beige/30 bg-cream/40 px-3 py-2.5 text-sm text-charcoal placeholder:text-taupe/40 transition-all focus:border-gold/50 focus:bg-cream/60 focus:outline-none focus:ring-1 focus:ring-gold/20"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe/80">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-[4px] border border-beige/30 bg-cream/40 px-3 py-2.5 text-sm text-charcoal placeholder:text-taupe/40 transition-all focus:border-gold/50 focus:bg-cream/60 focus:outline-none focus:ring-1 focus:ring-gold/20"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="rounded-[3px] bg-red-50/80 px-3 py-2 text-[11px] leading-relaxed text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 block w-full rounded-[4px] bg-gold px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-[0.15em] text-offwhite shadow-sm transition-all hover:bg-gold/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] leading-relaxed text-taupe/45">
          Admin access only.
        </p>
      </div>
    </div>
  );
}
