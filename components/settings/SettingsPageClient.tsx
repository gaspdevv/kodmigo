"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { signOutUser } from "@/lib/auth/actions";
import { useRequireAuth } from "@/lib/auth/useRequireAuth";
import { playClickSound } from "@/lib/sounds";

export default function SettingsPageClient() {
  const theme = getDashboardTheme();
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useRequireAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    playClickSound();
    setError(null);
    setLoading(true);

    const signOutError = await signOutUser();
    setLoading(false);

    if (signOutError) {
      setError(signOutError);
      return;
    }

    router.replace("/auth/sign-in");
  };

  if (authLoading || !isAuthenticated) {
    return (
      <main className={`min-h-screen overflow-x-hidden ${theme.pageBackground}`}>
        <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
          <p className={`text-sm ${theme.mutedText}`}>Yükleniyor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen overflow-x-hidden ${theme.pageBackground}`}>
      <div className="mx-auto max-w-lg px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/profile"
            onClick={playClickSound}
            aria-label="Profil'e dön"
            className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-lg transition hover:scale-105 active:scale-95 ${theme.softBadge}`}
          >
            ←
          </Link>
          <h1 className={`text-2xl font-bold ${theme.primaryText}`}>Ayarlar</h1>
        </div>

        <section
          className={`rounded-3xl border p-6 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
        >
          <h2 className={`mb-2 text-lg font-bold ${theme.primaryText}`}>
            Hesap
          </h2>

          {user ? (
            <div className="space-y-4">
              <p className={`break-all text-sm leading-relaxed ${theme.mutedText}`}>
                {user.email}
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loading}
                className={`inline-flex h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${theme.secondaryButton}`}
              >
                {loading ? "Çıkış yapılıyor..." : "Çıkış yap"}
              </button>
            </div>
          ) : null}

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>

        <section
          className={`mt-4 rounded-3xl border p-6 ${theme.cardBackground} ${theme.cardBorder} ${theme.cardShadow}`}
        >
          <h2 className={`mb-1 text-lg font-bold ${theme.primaryText}`}>
            Bilgilendirme
          </h2>
          <p className={`mb-4 text-sm leading-relaxed ${theme.mutedText}`}>
            Verilerini nasıl kullandığımızı ve temel kuralları buradan
            okuyabilirsin.
          </p>

          <div className="space-y-2">
            <Link
              href="/privacy"
              onClick={playClickSound}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition hover:scale-[1.01] active:scale-[0.99] ${theme.softBadge}`}
            >
              <span>Gizlilik Politikası</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/terms"
              onClick={playClickSound}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition hover:scale-[1.01] active:scale-[0.99] ${theme.softBadge}`}
            >
              <span>Kullanım Şartları</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
