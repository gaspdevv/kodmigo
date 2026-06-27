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
    return error.message || "Kullanıcı adı güncellenemedi.";
  }

  return null;
}

export async function signOutUser(): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) return "Supabase bağlantısı yapılandırılmamış.";

  const { error } = await supabase.auth.signOut();
  if (error) {
    return error.message || "Çıkış yapılamadı.";
  }

  cancelScheduledPersist();
  clearAllKodmigoLocalState();
  resetLoginSyncState();
  return null;
}

export function mapAuthErrorMessage(
  message: string,
  options?: { status?: number },
): string {
  const normalized = message.toLowerCase();

  if (
    options?.status === 429 ||
    normalized.includes("over_email_send_rate_limit") ||
    (normalized.includes("email") &&
      (normalized.includes("rate limit") ||
        normalized.includes("too many") ||
        normalized.includes("once every")))
  ) {
    return "Çok fazla doğrulama e-postası istedin. Lütfen birkaç dakika sonra tekrar dene.";
  }

  if (
    options?.status === 429 ||
    normalized.includes("rate limit") ||
    normalized.includes("too many requests") ||
    normalized.includes("too many attempts")
  ) {
    return "Çok fazla deneme yaptın. Güvenlik nedeniyle kısa bir süre bekleyip tekrar denemelisin.";
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return "E-posta veya şifre hatalı olabilir.";
  }

  if (
    normalized.includes("user already registered") ||
    normalized.includes("already been registered")
  ) {
    return "Bu e-posta zaten kullanılıyor olabilir.";
  }

  if (normalized.includes("password should be at least")) {
    return "Şifre en az 6 karakter olmalı.";
  }

  if (normalized.includes("unable to validate email")) {
    return "Geçerli bir e-posta adresi gir.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Giriş yapmadan önce e-postanı doğrulamalısın.";
  }

  if (
    normalized.includes("network") ||
    normalized.includes("fetch failed")
  ) {
    return "Bağlantı sorunu oluştu. İnternetini kontrol edip tekrar dene.";
  }

  if (/^[a-z]/.test(message.trim())) {
    return "Bir sorun oluştu. Bilgilerini kontrol edip tekrar dene.";
  }

  return message;
}
