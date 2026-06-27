"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { buildSignInRedirectUrl } from "@/lib/auth/routes";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { getAuthUsername } from "@/lib/username";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, isConfigured } = useAuthUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(buildSignInRedirectUrl(pathname));
    }
  }, [loading, user, router, pathname]);

  return {
    user,
    username: getAuthUsername(user?.user_metadata),
    loading,
    isConfigured,
    isAuthenticated: !loading && Boolean(user),
  };
}
