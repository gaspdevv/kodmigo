import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";

let browserClient: SupabaseClient | null = null;

const browserAuthOptions = {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
} as const;

export function createClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.warn(
        "[Kodmigo] Supabase yapılandırması eksik. Auth özellikleri çalışmayacak.",
      );
    }
    return null;
  }

  if (!browserClient) {
    browserClient = createBrowserClient(url, key, {
      auth: browserAuthOptions,
    });
  }

  return browserClient;
}
