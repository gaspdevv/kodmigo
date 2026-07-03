import {
  cancelScheduledPersist,
  resetLoginSyncState,
} from "@/lib/appStatePersist";
import { clearAllKodmigoLocalState } from "@/lib/appStateStorage";
import { createClient } from "@/lib/supabase/client";

export async function updateAuthUsername(username: string): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return "Supabase bağlantısı yapılandırılmamış.";

  const { error } = await supabase.auth.updateUser({
    data: { username },
  });

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Kodmigo] updateAuthUsername error:", error.message);
    }
    return "Kullanıcı adı güncellenemedi.";
  }

  return null;
}

export async function signOutUser(): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return "Supabase bağlantısı yapılandırılmamış.";

  const { error } = await supabase.auth.signOut();
  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Kodmigo] signOut error:", error.message);
    }
    return "Çıkış yapılamadı.";
  }

  cancelScheduledPersist();
  clearAllKodmigoLocalState();
  resetLoginSyncState();
  return null;
}

export type AuthErrorKind =
  | "invalid_credentials"
  | "rate_limit"
  | "email_rate_limit"
  | "email_not_confirmed"
  | "user_exists"
  | "captcha_failed"
  | "validation"
  | "network"
  | "generic";

export type MappedAuthError = {
  message: string;
  kind: AuthErrorKind;
};

function isRateLimitError(message: string, status?: number): boolean {
  const normalized = message.toLowerCase();

  return (
    status === 429 ||
    normalized.includes("rate limit") ||
    normalized.includes("too many") ||
    normalized.includes("over_request_rate_limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("too many attempts")
  );
}

function isEmailRateLimitError(message: string, status?: number): boolean {
  const normalized = message.toLowerCase();

  return (
    status === 429 ||
    normalized.includes("over_email_send_rate_limit") ||
    (normalized.includes("email") &&
      (normalized.includes("rate limit") ||
        normalized.includes("too many") ||
        normalized.includes("once every")))
  );
}

export function mapAuthError(
  message: string,
  options?: { status?: number; code?: string },
): MappedAuthError {
  const normalized = message.toLowerCase();
  const code = options?.code?.toLowerCase();

  if (
    code === "invalid_credentials" ||
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return {
      kind: "invalid_credentials",
      message: "E-posta veya şifre hatalı.",
    };
  }

  if (
    normalized.includes("captcha") ||
    normalized.includes("turnstile") ||
    normalized.includes("bot")
  ) {
    return {
      kind: "captcha_failed",
      message: "Güvenlik doğrulaması tamamlanamadı. Lütfen tekrar dene.",
    };
  }

  if (isEmailRateLimitError(message, options?.status)) {
    return {
      kind: "email_rate_limit",
      message:
        "Bu e-posta için kısa süre önce doğrulama isteği gönderildi. Lütfen gelen kutunu ve spam klasörünü kontrol et. Birkaç dakika sonra tekrar deneyebilirsin.",
    };
  }

  if (isRateLimitError(message, options?.status)) {
    return {
      kind: "rate_limit",
      message:
        "Çok fazla deneme yaptın. Lütfen birkaç dakika sonra tekrar dene.",
    };
  }

  if (
    normalized.includes("user already registered") ||
    normalized.includes("already been registered")
  ) {
    return {
      kind: "user_exists",
      message:
        "Bu e-posta ile bir hesap zaten var. Giriş yapmayı deneyebilirsin.",
    };
  }

  if (normalized.includes("password should be at least")) {
    return {
      kind: "validation",
      message: "Şifre en az 8 karakter olmalı.",
    };
  }

  if (normalized.includes("unable to validate email")) {
    return {
      kind: "validation",
      message: "Geçerli bir e-posta adresi gir.",
    };
  }

  if (normalized.includes("email not confirmed")) {
    return {
      kind: "email_not_confirmed",
      message: "Hesabını doğrulamak için e-postanı kontrol et.",
    };
  }

  if (
    normalized.includes("network") ||
    normalized.includes("fetch failed")
  ) {
    return {
      kind: "network",
      message: "Bağlantı sorunu oluştu. İnternetini kontrol edip tekrar dene.",
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[Kodmigo] Auth error:", message);
  }

  return {
    kind: "generic",
    message: "Bir şey ters gitti. Lütfen tekrar dene.",
  };
}

/** @deprecated mapAuthError kullanın */
export function mapAuthErrorMessage(
  message: string,
  options?: { status?: number; code?: string },
): string {
  return mapAuthError(message, options).message;
}
