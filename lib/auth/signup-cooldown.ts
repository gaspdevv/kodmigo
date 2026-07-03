import { normalizeEmail } from "@/lib/auth/validation";

const SIGNUP_COOLDOWN_MS = 60 * 1000;

type SignUpCooldownRecord = {
  lockedUntil: number;
};

function getStorageKey(email: string): string {
  return `kodmigo_signup_cooldown_${normalizeEmail(email)}`;
}

function readRecord(email: string): SignUpCooldownRecord {
  if (typeof window === "undefined") {
    return { lockedUntil: 0 };
  }

  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (!raw) return { lockedUntil: 0 };

    const parsed = JSON.parse(raw) as Partial<SignUpCooldownRecord>;
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

function writeRecord(email: string, record: SignUpCooldownRecord): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(record));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function getSignUpCooldownRemainingMs(email: string): number {
  const record = readRecord(email);
  const remaining = record.lockedUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

export function isSignUpOnCooldown(email: string): boolean {
  return getSignUpCooldownRemainingMs(email) > 0;
}

export const SIGNUP_COOLDOWN_MESSAGE =
  "Bu e-posta için doğrulama isteği kısa süre önce gönderildi. Lütfen gelen kutunu ve spam klasörünü kontrol et.";

export const SIGNUP_EMAIL_RATE_LIMIT_MESSAGE =
  "Bu e-posta için kısa süre önce doğrulama isteği gönderildi. Lütfen gelen kutunu ve spam klasörünü kontrol et. Birkaç dakika sonra tekrar deneyebilirsin.";

export function markSignUpCooldown(email: string): void {
  writeRecord(email, { lockedUntil: Date.now() + SIGNUP_COOLDOWN_MS });
}

export const SIGNUP_COOLDOWN_SECONDS = SIGNUP_COOLDOWN_MS / 1000;
