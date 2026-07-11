export const MAX_EMAIL_LENGTH = 254;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 72;

export const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`;~']/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;

export type PasswordRequirementKey =
  | "length"
  | "uppercase"
  | "lowercase"
  | "number"
  | "special"
  | "match";

export type PasswordRequirement = {
  key: PasswordRequirementKey;
  label: string;
  met: boolean;
};

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

export function getPasswordRequirements(
  password: string,
  confirmPassword?: string,
): PasswordRequirement[] {
  const requirements: PasswordRequirement[] = [
    {
      key: "length",
      label: "En az 8 karakter",
      met:
        password.length >= MIN_PASSWORD_LENGTH &&
        password.length <= MAX_PASSWORD_LENGTH,
    },
    {
      key: "uppercase",
      label: "Büyük harf içerir",
      met: UPPERCASE_REGEX.test(password),
    },
    {
      key: "lowercase",
      label: "Küçük harf içerir",
      met: LOWERCASE_REGEX.test(password),
    },
    {
      key: "number",
      label: "Sayı içerir",
      met: NUMBER_REGEX.test(password),
    },
    {
      key: "special",
      label: "Özel karakter içerir",
      met: SPECIAL_CHAR_REGEX.test(password),
    },
  ];

  if (confirmPassword !== undefined) {
    requirements.push({
      key: "match",
      label: "Şifreler eşleşiyor",
      met: password.length > 0 && password === confirmPassword,
    });
  }

  return requirements;
}

export function isStrongPasswordValid(password: string): boolean {
  if (!password || password.trim().length === 0) {
    return false;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return false;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return false;
  }

  if (!UPPERCASE_REGEX.test(password)) {
    return false;
  }

  if (!LOWERCASE_REGEX.test(password)) {
    return false;
  }

  if (!NUMBER_REGEX.test(password)) {
    return false;
  }

  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return false;
  }

  return true;
}

export function validatePassword(password: string): string | null {
  if (!password || password.trim().length === 0) {
    return "Şifren güvenlik kurallarını karşılamıyor.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return "Şifren güvenlik kurallarını karşılamıyor.";
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return "Şifre en fazla 72 karakter olabilir.";
  }

  if (!isStrongPasswordValid(password)) {
    return "Şifren güvenlik kurallarını karşılamıyor.";
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

export function isPasswordFormValid(
  password: string,
  confirmPassword: string,
): boolean {
  return (
    isStrongPasswordValid(password) &&
    validatePasswordMatch(password, confirmPassword) === null
  );
}
