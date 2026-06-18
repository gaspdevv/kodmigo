"use client";

import Link from "next/link";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { playClickSound } from "@/lib/sounds";

export default function SettingsPageClient() {
  const theme = getDashboardTheme();

  return (
    <main className={`min-h-screen ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/profile"
            onClick={playClickSound}
            aria-label="Profile dön"
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-lg transition hover:scale-105 active:scale-95 ${theme.softBadge}`}
          >
            ←
          </Link>
          <h1 className={`text-2xl font-bold ${theme.primaryText}`}>Ayarlar</h1>
        </div>

        <section
          className={`rounded-3xl border p-6 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
        >
          <p className={`text-sm leading-relaxed ${theme.mutedText}`}>
            Profil ve uygulama ayarları yakında burada olacak.
          </p>
        </section>
      </div>
    </main>
  );
}
