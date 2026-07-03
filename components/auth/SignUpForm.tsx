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
import { buildEmailConfirmationRedirectUrl } from "@/lib/auth/routes";
import {
  isSignUpOnCooldown,
  markSignUpCooldown,
  SIGNUP_COOLDOWN_MESSAGE,
} from "@/lib/auth/signup-cooldown";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import {
  normalizeEmail,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENV_HINT } from "@/lib/supabase/env";
import { validateUsername } from "@/lib/username";

const SIGN_IN_LINK = "/auth/sign-in?redirect=/onboarding";

const EMAIL_VERIFICATION_MESSAGE =
  "Doğrulama e-postanı gönderdik. Lütfen gelen kutunu ve spam klasörünü kontrol et.";

const EMAIL_VERIFICATION_HINT =
  "E-postayı göremiyorsan spam/gereksiz klasörünü kontrol et.";

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
  const [showSignInLink, setShowSignInLink] = useState(false);
  const [awaitingEmailVerification, setAwaitingEmailVerification] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileEnabled = Boolean(getTurnstileSiteKey());

  useEffect(() => {
    if (authLoading || awaitingEmailVerification || !user) return;

    const supabase = createClient();
    if (!supabase) return;

    void completeAuthSessionAndResolveRedirect(supabase, redirectTo).then(
      (destination) => {
        router.replace(destination);
      },
    );
  }, [authLoading, user, router, redirectTo, awaitingEmailVerification]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setShowSignInLink(false);

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const passwordMatchError = validatePasswordMatch(password, confirmPassword);
    if (passwordMatchError) {
      setError(passwordMatchError);
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    if (isSignUpOnCooldown(normalizedEmail)) {
      setError(SIGNUP_COOLDOWN_MESSAGE);
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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: buildEmailConfirmationRedirectUrl(
          window.location.origin,
        ),
        data: {
          username: username.trim(),
        },
        captchaToken: captchaToken ?? undefined,
      },
    });

    if (signUpError) {
      setIsSubmitting(false);
      const mapped = mapAuthError(signUpError.message, {
        status: signUpError.status,
      });
      setShowSignInLink(mapped.kind === "user_exists");
      setError(mapped.message);
      return;
    }

    markSignUpCooldown(normalizedEmail);

    if (data.session?.user) {
      const destination = await completeAuthSessionAndResolveRedirect(
        supabase,
        redirectTo,
      );
      setIsSubmitting(false);
      router.replace(destination);
      return;
    }

    setIsSubmitting(false);
    setAwaitingEmailVerification(true);
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      </main>
    );
  }

  if (awaitingEmailVerification) {
    return (
      <AuthShell
        title="E-postanı doğrula"
        subtitle="Hesabını aktifleştirmek için son bir adım kaldı."
        footer={
          <>
            Zaten hesabın var mı?{" "}
            <Link
              href={SIGN_IN_LINK}
              className="font-semibold text-kodmigo-orange hover:underline"
            >
              Giriş yap
            </Link>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <p className="text-sm font-semibold leading-relaxed text-emerald-900">
              {EMAIL_VERIFICATION_MESSAGE}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-800/90">
              {EMAIL_VERIFICATION_HINT}
            </p>
          </div>

          <p className="text-center text-sm text-slate-500">
            <span className="font-medium text-slate-700">{email}</span> adresine
            gönderildi.
          </p>

          <Link
            href={SIGN_IN_LINK}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600"
          >
            Giriş sayfasına git
          </Link>
        </div>
      </AuthShell>
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
            href={SIGN_IN_LINK}
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
            minLength={3}
            maxLength={24}
            disabled={isSubmitting}
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20 disabled:opacity-60"
            placeholder="Kullanıcı adı"
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
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            disabled={isSubmitting}
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20 disabled:opacity-60"
            placeholder="En az 8 karakter"
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
            minLength={8}
            maxLength={72}
            disabled={isSubmitting}
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20 disabled:opacity-60"
            placeholder="Şifreni tekrar gir"
          />
        </div>

        <TurnstileWidget
          onTokenChange={setCaptchaToken}
          onError={() =>
            setError("Güvenlik doğrulaması tamamlanamadı. Lütfen tekrar dene.")
          }
        />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p>{error}</p>
            {showSignInLink && (
              <Link
                href={SIGN_IN_LINK}
                className="mt-2 inline-block font-semibold text-kodmigo-orange hover:underline"
              >
                Giriş yap
              </Link>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isConfigured}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Kayıt oluşturuluyor..." : "Kayıt ol"}
        </button>
      </form>
    </AuthShell>
  );
}
