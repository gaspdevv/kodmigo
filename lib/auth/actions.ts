import { createClient } from "@/lib/supabase/client";
import { resetLoginSyncState } from "@/lib/appStatePersist";

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

  resetLoginSyncState();
  return null;
}

export function mapAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

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

  return message;
}
