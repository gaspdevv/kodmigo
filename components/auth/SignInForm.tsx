"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import TurnstileWidget, {
  getTurnstileSiteKey,
} from "@/components/auth/TurnstileWidget";
import { mapAuthError } from "@/lib/auth/actions";
import { completeAuthSessionAndResolveRedirect } from "@/lib/auth/completeAuthSession";
import {
  clearLoginAttempts,
  formatLoginLockoutError,
  getLoginLockState,
  recordFailedLoginAttempt,
} from "@/lib/auth/login-attempts";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { validateEmail } from "@/lib/auth/validation";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileEnabled = Boolean(getTurnstileSiteKey());

  useEffect(() => {
    if (authLoading || !user) return;

    const supabase = createClient();
    if (!supabase) return;

    void completeAuthSessionAndResolveRedirect(supabase, redirectTo).then(
      (destination) => {
        router.replace(destination);
      },
    );
  }, [authLoading, user, router, redirectTo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password) {
      setError("Şifreni gir.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const lockState = getLoginLockState(normalizedEmail);

    if (lockState.isLocked) {
      setError(formatLoginLockoutError(lockState.minutesRemaining));
      return;
    }

    if (turnstileEnabled && !captchaToken) {
      setError("Güvenlik doğrulaması tamamlanamadı. Lütfen tekrar dene.");
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError(SUPABASE_ENV_HINT);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
        options: captchaToken ? { captchaToken } : undefined,
      });

      if (signInError) {
        const attemptState = recordFailedLoginAttempt(normalizedEmail);

        if (process.env.NODE_ENV === "development") {
          console.debug("[login-attempts]", {
            count: attemptState.count,
            isLocked: attemptState.isLocked,
            minutesRemaining: attemptState.minutesRemaining,
          });
        }

        if (attemptState.isLocked) {
          setError(formatLoginLockoutError(attemptState.minutesRemaining));
          return;
        }

        const mapped = mapAuthError(signInError.message, {
          status: signInError.status,
          code: signInError.code,
        });
        setError(mapped.message);
        return;
      }

      clearLoginAttempts(normalizedEmail);

      const destination = await completeAuthSessionAndResolveRedirect(
        supabase,
        redirectTo,
      );
      router.replace(destination);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || user) {
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
        <span className="text-slate-500">
          Kodmigo&apos;ya yeni misin?{" "}
          <Link
            href="/auth/sign-up"
            className="text-slate-600 hover:text-kodmigo-orange hover:underline"
          >
            Python yoluna başla
          </Link>
        </span>
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
            maxLength={254}
            disabled={isSubmitting}
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20 disabled:opacity-60"
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
            maxLength={72}
            disabled={isSubmitting}
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20 disabled:opacity-60"
            placeholder="Şifren"
          />
        </div>

        <TurnstileWidget
          onTokenChange={setCaptchaToken}
          onError={() =>
            setError("Güvenlik doğrulaması tamamlanamadı. Lütfen tekrar dene.")
          }
        />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isConfigured}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş yap"}
        </button>
      </form>
    </AuthShell>
  );
}
