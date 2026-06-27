"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { mapAuthErrorMessage } from "@/lib/auth/actions";
import { completeAuthSessionAndResolveRedirect } from "@/lib/auth/completeAuthSession";
import { buildEmailConfirmationRedirectUrl } from "@/lib/auth/routes";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENV_HINT } from "@/lib/supabase/env";
import { validateUsername } from "@/lib/username";

const SIGN_IN_LINK = "/auth/sign-in?redirect=/dashboard";

const EMAIL_VERIFICATION_MESSAGE =
  "Kaydını tamamlamak için e-posta adresine gönderdiğimiz doğrulama bağlantısına tıkla.";

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
  const [awaitingEmailVerification, setAwaitingEmailVerification] =
    useState(false);
  const [loading, setLoading] = useState(false);

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

    if (loading) return;

    setError(null);

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
        emailRedirectTo: buildEmailConfirmationRedirectUrl(
          window.location.origin,
        ),
        data: {
          username: username.trim(),
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(
        mapAuthErrorMessage(signUpError.message, { status: signUpError.status }),
      );
      return;
    }

    if (data.session?.user) {
      const destination = await completeAuthSessionAndResolveRedirect(
        supabase,
        redirectTo,
      );
      setLoading(false);
      router.replace(destination);
      return;
    }

    setLoading(false);
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20 disabled:opacity-60"
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
            disabled={loading}
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20 disabled:opacity-60"
            placeholder="Şifreni tekrar gir"
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
          {loading ? "Kayıt olunuyor..." : "Kayıt ol"}
        </button>
      </form>
    </AuthShell>
  );
}
