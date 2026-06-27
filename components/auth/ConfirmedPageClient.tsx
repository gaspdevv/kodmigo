"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { completeAuthSessionAndResolveRedirect } from "@/lib/auth/completeAuthSession";
import { resolvePostLoginPathFromLocalState } from "@/lib/auth/postLoginRedirect";
import { useAuthUser } from "@/lib/auth/useAuthUser";
import { createClient } from "@/lib/supabase/client";

const SIGN_IN_AFTER_CONFIRM_LINK = "/auth/sign-in?redirect=/onboarding";

function ConfirmedErrorView() {
  return (
    <AuthShell
      title="Doğrulama bağlantısı geçersiz veya süresi dolmuş olabilir."
      subtitle="Hesabın zaten doğrulanmış olabilir. Giriş yapmayı deneyebilirsin."
      footer={
        <Link href="/" className="text-slate-500 hover:text-kodmigo-orange">
          Ana sayfaya dön
        </Link>
      }
    >
      <div className="space-y-4">
        <div
          className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-center"
          aria-hidden
        >
          <span className="text-4xl">⚠️</span>
        </div>
        <Link
          href={SIGN_IN_AFTER_CONFIRM_LINK}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600"
        >
          Giriş sayfasına git
        </Link>
      </div>
    </AuthShell>
  );
}

function hasSupabaseConfirmationError(
  searchParams: URLSearchParams,
): boolean {
  if (searchParams.get("error") === "1") return true;
  if (searchParams.has("error_code")) return true;
  if (searchParams.has("error_description")) return true;

  const error = searchParams.get("error");
  return Boolean(error && error !== "1");
}

export default function ConfirmedPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuthUser();
  const showError = hasSupabaseConfirmationError(searchParams);
  const authCode = searchParams.get("code");
  const [signedInDestination, setSignedInDestination] = useState("/dashboard");

  useEffect(() => {
    if (showError || !authCode) return;

    let cancelled = false;
    const supabase = createClient();
    if (!supabase) return;

    void supabase.auth.exchangeCodeForSession(authCode).then(async ({ error }) => {
      if (cancelled || error) return;

      const destination = await completeAuthSessionAndResolveRedirect(
        supabase,
        "/onboarding",
      );
      if (!cancelled) {
        setSignedInDestination(destination);
      }
      router.replace("/auth/confirmed");
    });

    return () => {
      cancelled = true;
    };
  }, [authCode, showError, router]);

  useEffect(() => {
    if (authLoading || !user) return;

    const supabase = createClient();
    if (!supabase) {
      setSignedInDestination(resolvePostLoginPathFromLocalState("/onboarding"));
      return;
    }

    void completeAuthSessionAndResolveRedirect(supabase, "/onboarding").then(
      (destination) => {
        setSignedInDestination(destination);
      },
    );
  }, [authLoading, user]);

  if (showError) {
    return <ConfirmedErrorView />;
  }

  const isSignedIn = !authLoading && Boolean(user);
  const ctaHref = isSignedIn ? signedInDestination : SIGN_IN_AFTER_CONFIRM_LINK;
  const ctaLabel = isSignedIn ? "Devam et" : "Giriş yap";
  const subtitle = isSignedIn
    ? "Kodmigo hesabın başarıyla doğrulandı. Python yolculuğuna devam etmek için bir sonraki adıma geçebilirsin."
    : "Kodmigo hesabın başarıyla doğrulandı. Şimdi giriş yaparak Python yolculuğuna devam edebilirsin.";

  return (
    <AuthShell
      title="Hesabın doğrulandı!"
      subtitle={subtitle}
      footer={
        <Link href="/" className="text-slate-500 hover:text-kodmigo-orange">
          Ana sayfaya dön
        </Link>
      }
    >
      <div className="space-y-4">
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center"
          aria-hidden
        >
          <span className="text-4xl">✅</span>
          <p className="mt-2 text-sm font-medium text-emerald-800">
            E-posta adresin onaylandı.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-kodmigo-orange/15 bg-kodmigo-orange-light/30 px-4 py-3">
          <span className="text-xl" aria-hidden>
            🦊
          </span>
          <p className="text-sm leading-relaxed text-slate-600">
            Migo seni bekliyor! Giriş yaptıktan sonra kaldığın yerden devam
            edebilirsin.
          </p>
        </div>

        <Link
          href={ctaHref}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600"
        >
          {authLoading ? "Yükleniyor..." : ctaLabel}
        </Link>
      </div>
    </AuthShell>
  );
}
