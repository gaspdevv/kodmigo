import type { SupabaseClient } from "@supabase/supabase-js";
import { syncAppStateAfterLogin } from "@/lib/appStatePersist";

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
