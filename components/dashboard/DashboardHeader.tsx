"use client";

import { useCallback, useEffect, useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { getProfile } from "@/lib/profile";
import { useAppStateRefresh } from "@/lib/useAppStateRefresh";
import { formatGreeting } from "@/lib/username";

export default function DashboardHeader() {
  const theme = getDashboardTheme();
  const { username: authUsername, loading: authLoading } = useAuthUser();
  const [localUsername, setLocalUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const refreshProfile = useCallback(() => {
    setLocalUsername(getProfile().username);
    setIsReady(true);
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  useAppStateRefresh(refreshProfile);

  const greeting = formatGreeting(
    authLoading ? null : authUsername,
    localUsername,
  );

  return (
    <header className="mb-6 min-w-0">
      <h1 className={`break-words text-2xl font-bold ${theme.primaryText}`}>
        {isReady && !authLoading ? greeting : "Merhaba!"}
        {isReady && !authLoading ? " 👋" : ""}
      </h1>
      <p className={`mt-1 text-sm ${theme.mutedText}`}>
        Bugün Python yolunda küçük bir adım daha atalım.
      </p>
    </header>
  );
}
