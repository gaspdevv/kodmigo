"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { mapAuthErrorMessage } from "@/lib/auth/actions";
import { completeAuthSession } from "@/lib/auth/completeAuthSession";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENV_HINT } from "@/lib/supabase/env";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { user, loading: authLoading, isConfigured } = useAuthUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo || "/dashboard");
    }
  }, [authLoading, user, router, redirectTo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError(SUPABASE_ENV_HINT);
      return;
    }

    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setLoading(false);
      setError(mapAuthErrorMessage(signInError.message));
      return;
    }

    await completeAuthSession(supabase);
    setLoading(false);

    router.replace(redirectTo || "/dashboard");
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      </main>
    );
  }

  return (
    <AuthShell
      title="Tekrar hoş geldin"
      subtitle="Yolculuğuna kaldığın yerden devam et."
      footer={
        <>
          Hesabın yok mu?{" "}
          <Link
            href={
              redirectTo
                ? `/auth/sign-up?redirect=${encodeURIComponent(redirectTo)}`
                : "/auth/sign-up"
            }
            className="font-semibold text-kodmigo-orange hover:underline"
          >
            Kayıt ol
          </Link>
        </>
      }
    >
      {!isConfigured && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {SUPABASE_ENV_HINT}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-kodmigo-navy"
          >
            E-posta
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20"
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-kodmigo-navy"
          >
            Şifre
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20"
            placeholder="Şifren"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !isConfigured}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
    </AuthShell>
  );
}
