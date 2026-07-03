export const MAX_EMAIL_LENGTH = 254;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  const normalized = normalizeEmail(email);

  if (!normalized) {
    return "Geçerli bir e-posta adresi gir.";
  }

  if (normalized.length > MAX_EMAIL_LENGTH) {
    return "Geçerli bir e-posta adresi gir.";
  }

  if (!EMAIL_REGEX.test(normalized)) {
    return "Geçerli bir e-posta adresi gir.";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password || password.trim().length === 0) {
    return "Şifre en az 8 karakter olmalı.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return "Şifre en az 8 karakter olmalı.";
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return "Şifre en fazla 72 karakter olabilir.";
  }

  return null;
}

export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
): string | null {
  if (password !== confirmPassword) {
    return "Şifreler eşleşmiyor.";
  }

  return null;
}
