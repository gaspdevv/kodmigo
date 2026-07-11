import { normalizeEmail } from "@/lib/auth/validation";

const PASSWORD_RESET_COOLDOWN_MS = 60 * 1000;

type PasswordResetCooldownRecord = {
  lockedUntil: number;
};

function getStorageKey(email: string): string {
  return `kodmigo_password_reset_cooldown_${normalizeEmail(email)}`;
}

function readRecord(email: string): PasswordResetCooldownRecord {
  if (typeof window === "undefined") {
    return { lockedUntil: 0 };
  }

  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (!raw) return { lockedUntil: 0 };

    const parsed = JSON.parse(raw) as Partial<PasswordResetCooldownRecord>;
    return {
      lockedUntil:
        typeof parsed.lockedUntil === "number" && parsed.lockedUntil >= 0
          ? parsed.lockedUntil
          : 0,
    };
  } catch {
    return { lockedUntil: 0 };
  }
}

function writeRecord(email: string, record: PasswordResetCooldownRecord): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(record));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function getPasswordResetCooldownRemainingMs(email: string): number {
  const record = readRecord(email);
  const remaining = record.lockedUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

export function isPasswordResetOnCooldown(email: string): boolean {
  return getPasswordResetCooldownRemainingMs(email) > 0;
}

export const PASSWORD_RESET_COOLDOWN_MESSAGE =
  "Bu e-posta için şifre yenileme isteği kısa süre önce gönderildi. Lütfen gelen kutunu ve spam klasörünü kontrol et.";

export function markPasswordResetCooldown(email: string): void {
  writeRecord(email, { lockedUntil: Date.now() + PASSWORD_RESET_COOLDOWN_MS });
}

export const PASSWORD_RESET_COOLDOWN_SECONDS =
  PASSWORD_RESET_COOLDOWN_MS / 1000;
