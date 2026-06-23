import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Add it to .env.local`
    );
  }
  return value;
}

export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createServerClient(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl),
    getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // Silently ignore cookie writes from Server Components.
              // Auth sessions are refreshed via client-side or middleware.
            }
          });
        },
      },
    }
  );
}
