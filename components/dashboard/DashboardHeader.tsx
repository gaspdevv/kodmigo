"use client";

import Link from "next/link";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { dashboardMock } from "@/lib/dashboard-mock";
import { playClickSound } from "@/lib/sounds";

export default function DashboardHeader() {
  const { name } = dashboardMock.user;
  const theme = getDashboardTheme();

  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className={`text-2xl font-bold ${theme.primaryText}`}>
          Merhaba, {name} 👋
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
