"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { completeAuthSessionAndResolveRedirect } from "@/lib/auth/completeAuthSession";
import { resolvePostLoginPathFromLocalState } from "@/lib/auth/postLoginRedirect";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { createClient } from "@/lib/supabase/client";

export default function LandingAuthRedirect() {
  const router = useRouter();
  const { user, loading } = useAuthUser();

  useEffect(() => {
    if (loading || !user) return;

    const supabase = createClient();
    if (!supabase) {
      router.replace(resolvePostLoginPathFromLocalState("/dashboard"));
      return;
    }

    void completeAuthSessionAndResolveRedirect(supabase, "/dashboard").then(
      (destination) => {
        router.replace(destination);
      },
    );
  }, [loading, user, router]);

  return null;
}
