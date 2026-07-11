"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import PasswordChecklist from "@/components/auth/PasswordChecklist";
import { mapAuthError } from "@/lib/auth/actions";
import {
  AUTH_FORGOT_PASSWORD_PATH,
  AUTH_SIGN_IN_PATH,
  AUTH_UPDATE_PASSWORD_PATH,
} from "@/lib/auth/routes";
import {
  isPasswordFormValid,
  validatePassword,
  validatePasswordMatch,
} from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENV_HINT } from "@/lib/supabase/env";
import type { SupabaseClient } from "@supabase/supabase-js";

const INVALID_RECOVERY_MESSAGE =
  "Şifre yenileme bağlantısı geçersiz veya süresi dolmuş olabilir. Lütfen yeniden şifre yenileme isteği gönder.";

const RECOVERY_WAIT_MS = 1500;

/** Strict Mode çift mount'ta aynı code'un iki kez exchange edilmesini önler */
const recoveryExchangePromises = new Map<string, Promise<boolean>>();

function hasSupabaseRecoveryError(searchParams: URLSearchParams): boolean {
  if (searchParams.get("error") === "1") return true;
  if (searchParams.has("error_code")) return true;
  if (searchParams.has("error_description")) return true;

  const error = searchParams.get("error");
  return Boolean(error && error !== "1");
}

function getRecoveryCodeFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const queryCode = new URLSearchParams(window.location.search).get("code");
  if (queryCode) return queryCode;

  return null;
}

function hashHasRecoveryTokens(): boolean {
  if (typeof window === "undefined") return false;

  const hashParams = new URLSearchParams(
    window.location.hash.replace(/^#/, ""),
  );

  return (
    hashParams.get("type") === "recovery" || hashParams.has("access_token")
  );
}

async function exchangeRecoveryCodeForSession(
  client: SupabaseClient,
  code: string,
): Promise<boolean> {
  const existing = recoveryExchangePromises.get(code);
  if (existing) {
    return existing;
  }

  const exchangePromise = (async () => {
    const { error: exchangeError } =
      await client.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      return true;
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("[Kodmigo] exchangeCodeForSession error:", exchangeError);
    }

    const {
      data: { session },
    } = await client.auth.getSession();

    return Boolean(session);
  })();

  recoveryExchangePromises.set(code, exchangePromise);
  return exchangePromise;
}

async function waitForRecoverySession(
  client: SupabaseClient,
  timeoutMs: number,
): Promise<boolean> {
  const {
    data: { session: initialSession },
  } = await client.auth.getSession();

  if (initialSession) {
    return true;
  }

  return new Promise((resolve) => {
    let settled = false;

    const finish = (hasSession: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
      resolve(hasSession);
    };

    const timeoutId = setTimeout(async () => {
      const {
        data: { session },
      } = await client.auth.getSession();
      finish(Boolean(session));
    }, timeoutMs);

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        finish(Boolean(session));
      }
    });
  });
}

function InvalidRecoveryView() {
  return (
    <AuthShell
      title="Yeni şifre belirle"
      subtitle="Hesabın için yeni ve güçlü bir şifre seç."
      footer={
        <Link href="/" className="text-slate-500 hover:text-kodmigo-orange">
          Ana sayfaya dön
        </Link>
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
          <p className="text-sm leading-relaxed text-amber-900">
            {INVALID_RECOVERY_MESSAGE}
          </p>
        </div>

        <Link
          href={AUTH_FORGOT_PASSWORD_PATH}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600"
        >
          Şifre yenileme isteği gönder
        </Link>
      </div>
    </AuthShell>
  );
}

export default function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [invalidRecovery, setInvalidRecovery] = useState(false);
  const recoveryInitRef = useRef(false);

  const showUrlError = hasSupabaseRecoveryError(searchParams);

  const supabase = createClient();
  const isConfigured = Boolean(supabase);
  const isFormValid = isPasswordFormValid(password, confirmPassword);

  useEffect(() => {
    if (showUrlError) {
      setInvalidRecovery(true);
      setSessionChecking(false);
      return;
    }

    if (recoveryInitRef.current) return;
    recoveryInitRef.current = true;

    let cancelled = false;

    async function establishRecoverySession() {
      const client = createClient();
      if (!client) {
        if (!cancelled) {
          setInvalidRecovery(true);
          setSessionChecking(false);
        }
        return;
      }

      const recoveryCode = getRecoveryCodeFromUrl();
      const hasHashRecovery = hashHasRecoveryTokens();

      if (recoveryCode) {
        const exchangeSucceeded = await exchangeRecoveryCodeForSession(
          client,
          recoveryCode,
        );

        if (cancelled) return;

        if (exchangeSucceeded) {
          setSessionReady(true);
          setInvalidRecovery(false);
          setSessionChecking(false);
          router.replace(AUTH_UPDATE_PASSWORD_PATH);
          return;
        }
      }

      const hasSession = await waitForRecoverySession(
        client,
        hasHashRecovery || recoveryCode ? RECOVERY_WAIT_MS : 0,
      );

      if (cancelled) return;

      if (hasSession) {
        setSessionReady(true);
        setInvalidRecovery(false);
        if (recoveryCode) {
          router.replace(AUTH_UPDATE_PASSWORD_PATH);
        }
      } else {
        setInvalidRecovery(true);
      }

      setSessionChecking(false);
    }

    void establishRecoverySession();

    return () => {
      cancelled = true;
    };
  }, [showUrlError, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || !sessionReady) return;

    setError(null);

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

    if (!supabase) {
      setError(SUPABASE_ENV_HINT);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        const mapped = mapAuthError(updateError.message, {
          status: updateError.status,
          code: updateError.code,
        });
        setError(mapped.message);
        return;
      }

      await supabase.auth.signOut();
      router.replace(`${AUTH_SIGN_IN_PATH}?passwordUpdated=1`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sessionChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-slate-500">Yükleniyor...</p>
      </main>
    );
  }

  if (invalidRecovery) {
    return <InvalidRecoveryView />;
  }

  return (
    <AuthShell
      title="Yeni şifre belirle"
      subtitle="Hesabın için yeni ve güçlü bir şifre seç."
      footer={
        <Link
          href={AUTH_SIGN_IN_PATH}
          className="font-semibold text-kodmigo-orange hover:underline"
        >
          Giriş sayfasına dön
        </Link>
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
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-kodmigo-navy"
          >
            Yeni şifre
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
            placeholder="Güçlü bir şifre seç"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-kodmigo-navy"
          >
            Yeni şifre tekrar
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

        <PasswordChecklist password={password} confirmPassword={confirmPassword} />

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isConfigured || !isFormValid}
          className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Güncelleniyor..." : "Şifreyi güncelle"}
        </button>
      </form>
    </AuthShell>
  );
}
