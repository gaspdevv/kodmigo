"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStateSync } from "@/components/providers/AppStateSyncProvider";
import { ONBOARDING_PATH } from "@/lib/auth/postLoginRedirect";
import { buildSignInRedirectUrl } from "@/lib/auth/routes";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { hasCompletedOnboarding } from "@/lib/onboarding-data";
import { getLocalAppState } from "@/lib/userAppState";
import { getAuthUsername } from "@/lib/username";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading, isConfigured } = useAuthUser();
  const { syncing, syncedUserId } = useAppStateSync();
  const [guardReady, setGuardReady] = useState(false);
  const [hasOnboarding, setHasOnboarding] = useState(false);

  const waitingForAppState = Boolean(
    user && (syncing || syncedUserId !== user.id),
  );
  const loading = authLoading || waitingForAppState || !guardReady;

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setGuardReady(true);
      setHasOnboarding(false);
      router.replace(buildSignInRedirectUrl(pathname));
      return;
    }

    if (waitingForAppState) {
      setGuardReady(false);
      return;
    }

    const onboardingComplete = hasCompletedOnboarding(
      getLocalAppState().onboardingProfile,
    );
    setHasOnboarding(onboardingComplete);
    setGuardReady(true);

    if (!onboardingComplete) {
      router.replace(ONBOARDING_PATH);
    }
  }, [authLoading, user, waitingForAppState, router, pathname]);

  return {
    user,
    username: getAuthUsername(user?.user_metadata),
    loading,
    isConfigured,
    isAuthenticated: guardReady && Boolean(user) && hasOnboarding,
    hasOnboarding,
  };
}
