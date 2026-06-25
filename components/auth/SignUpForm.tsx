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
import { validateUsername } from "@/lib/username";

export default function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const { user, loading: authLoading, isConfigured } = useAuthUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace(redirectTo || "/dashboard");
    }
  }, [authLoading, user, router, redirectTo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError(SUPABASE_ENV_HINT);
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(mapAuthErrorMessage(signUpError.message));
      return;
    }

    if (data.session?.user) {
      setLoading(true);
      await completeAuthSession(supabase);
      setLoading(false);
      router.replace(redirectTo || "/dashboard");
      return;
    }

    setSuccess("Hesabını tamamlamak için e-postanı kontrol et.");
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
      title="Kodmigo'ya katıl"
      subtitle="Python yolculuğunu kaybetmeden devam etmek için hesabını oluştur."
      footer={
        <>
          Zaten hesabın var mı?{" "}
          <Link
            href={
              redirectTo
                ? `/auth/sign-in?redirect=${encodeURIComponent(redirectTo)}`
                : "/auth/sign-in"
            }
            className="font-semibold text-kodmigo-orange hover:underline"
          >
            Giriş yap
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
            htmlFor="username"
            className="mb-1.5 block text-sm font-medium text-kodmigo-navy"
          >
            Kullanıcı adı
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20"
            placeholder="Örn. Efe"
          />
        </div>

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
            autoComplete="new-password"
            required
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20"
            placeholder="En az 6 karakter"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-kodmigo-navy"
          >
            Şifre tekrar
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            required
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20"
            placeholder="Şifreni tekrar gir"
          />
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !isConfigured}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Kayıt olunuyor..." : "Kayıt ol"}
        </button>
      </form>
    </AuthShell>
  );
}
