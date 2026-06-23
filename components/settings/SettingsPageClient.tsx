"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getDashboardTheme } from "@/components/dashboard/getDashboardTheme";
import { signOutUser } from "@/lib/auth/actions";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { playClickSound } from "@/lib/sounds";

export default function SettingsPageClient() {
  const theme = getDashboardTheme();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthUser();
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
          <h2 className={`mb-2 text-lg font-bold ${theme.primaryText}`}>
            Hesap
          </h2>

          {authLoading ? (
            <p className={`text-sm ${theme.mutedText}`}>Yükleniyor...</p>
          ) : user ? (
            <div className="space-y-4">
              <p className={`text-sm leading-relaxed ${theme.mutedText}`}>
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
          ) : (
            <div className="space-y-3">
              <p className={`text-sm leading-relaxed ${theme.mutedText}`}>
                Hesabın yoksa kayıt olabilir veya mevcut hesabınla giriş
                yapabilirsin.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/auth/sign-in"
                  onClick={playClickSound}
                  className={`inline-flex h-11 flex-1 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${theme.primaryButton}`}
                >
                  Giriş yap
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={playClickSound}
                  className={`inline-flex h-11 flex-1 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${theme.secondaryButton}`}
                >
                  Kayıt ol
                </Link>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
