import { createBrowserClient } from "@supabase/ssr";

function getEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}. Add it to .env.local`
    );
  }
  return value;
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return createBrowserClient(
    getEnvVar("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl),
    getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey)
  );
}
