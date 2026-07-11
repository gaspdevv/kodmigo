"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { mapAuthError } from "@/lib/auth/actions";
import {
  isPasswordResetOnCooldown,
  markPasswordResetCooldown,
  PASSWORD_RESET_COOLDOWN_MESSAGE,
} from "@/lib/auth/password-reset-cooldown";
import {
  AUTH_SIGN_IN_PATH,
} from "@/lib/auth/routes";
import { normalizeEmail, validateEmail } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/client";
import { SUPABASE_ENV_HINT } from "@/lib/supabase/env";

const PASSWORD_RESET_SUCCESS_MESSAGE =
  "Eğer bu e-posta ile kayıtlı bir hesap varsa, şifre yenileme bağlantısını gönderdik.";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const supabase = createClient();
  const isConfigured = Boolean(supabase);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setError(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const normalizedEmail = normalizeEmail(email);

    if (isPasswordResetOnCooldown(normalizedEmail)) {
      setError(PASSWORD_RESET_COOLDOWN_MESSAGE);
      return;
    }

    if (!supabase) {
      setError(SUPABASE_ENV_HINT);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        normalizedEmail,
        {
          redirectTo: `${window.location.origin}/auth/update-password`,
        },
      );

      if (resetError) {
        const mapped = mapAuthError(resetError.message, {
          status: resetError.status,
          code: resetError.code,
        });

        if (mapped.kind === "rate_limit" || mapped.kind === "email_rate_limit") {
          setError(mapped.message);
          return;
        }

        // Güvenlik: kullanıcı bulunamadı vb. durumlarda da genel başarı mesajı göster
      }

      markPasswordResetCooldown(normalizedEmail);
      setRequestSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (requestSent) {
    return (
      <AuthShell
        title="Şifreni mi unuttun?"
        subtitle="E-posta adresini yaz, sana şifreni yenilemen için bir bağlantı gönderelim."
        footer={
          <>
            <Link
              href={AUTH_SIGN_IN_PATH}
              className="font-semibold text-kodmigo-orange hover:underline"
            >
              Giriş sayfasına dön
            </Link>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
            <p className="text-sm font-semibold leading-relaxed text-emerald-900">
              {PASSWORD_RESET_SUCCESS_MESSAGE}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-800/90">
              E-postayı göremiyorsan spam/gereksiz klasörünü kontrol et.
            </p>
          </div>

          <p className="text-center text-sm text-slate-500">
            <span className="font-medium text-slate-700">{email}</span> adresine
            gönderildi.
          </p>

          <Link
            href={AUTH_SIGN_IN_PATH}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-kodmigo-orange text-base font-semibold text-white shadow-lg shadow-kodmigo-orange/25 transition hover:bg-orange-600"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Şifreni mi unuttun?"
      subtitle="E-posta adresini yaz, sana şifreni yenilemen için bir bağlantı gönderelim."
      footer={
        <>
          <Link
            href={AUTH_SIGN_IN_PATH}
            className="font-semibold text-kodmigo-orange hover:underline"
          >
            Giriş sayfasına dön
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
            maxLength={254}
            disabled={isSubmitting}
            className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-kodmigo-orange/50 focus:ring-2 focus:ring-kodmigo-orange/20 disabled:opacity-60"
            placeholder="ornek@email.com"
          />
        </div>

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
          {isSubmitting ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </AuthShell>
  );
}
