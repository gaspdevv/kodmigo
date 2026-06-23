"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { getProfile } from "@/lib/profile";
import { playClickSound } from "@/lib/sounds";
import { formatGreeting } from "@/lib/username";

export default function DashboardHeader() {
  const theme = getDashboardTheme();
  const { username: authUsername, loading: authLoading } = useAuthUser();
  const [localUsername, setLocalUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setLocalUsername(getProfile().username);
    setIsReady(true);
  }, []);

  const greeting = formatGreeting(
    authLoading ? null : authUsername,
    localUsername,
  );

  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className={`text-2xl font-bold ${theme.primaryText}`}>
          {isReady && !authLoading ? greeting : "Merhaba!"}
          {isReady && !authLoading ? " 👋" : ""}
        </h1>
        <p className={`mt-1 text-sm ${theme.mutedText}`}>
          Bugün Python yolunda küçük bir adım daha atalım.
        </p>
      </div>
      <Link
        href="/profile"
        onClick={playClickSound}
        aria-label="Profil"
        className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-2xl shadow-sm ring-2 transition hover:scale-105 active:scale-95 ${theme.iconBadge}`}
      >
        🦊
      </Link>
    </header>
  );
}
