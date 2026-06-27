import type { SupabaseClient } from "@supabase/supabase-js";
import { syncAppStateAfterLogin } from "@/lib/appStatePersist";
import { resolvePostLoginPathAfterSync } from "@/lib/auth/postLoginRedirect";

export async function completeAuthSession(
  supabase: SupabaseClient,
): Promise<void> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Kodmigo] completeAuthSession oturum hatası:", error);
    }
    return;
  }

  if (!session?.user) {
    return;
  }

  await syncAppStateAfterLogin(session.user);
}

export async function completeAuthSessionAndResolveRedirect(
  supabase: SupabaseClient,
  redirectTo: string | null,
): Promise<string> {
  await completeAuthSession(supabase);
  return resolvePostLoginPathAfterSync(supabase, redirectTo);
}
