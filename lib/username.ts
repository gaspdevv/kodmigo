import { DEFAULT_USERNAME, MAX_USERNAME_LENGTH } from "@/lib/profile";

export const MIN_USERNAME_LENGTH = 3;

const USERNAME_PATTERN = /^[\p{L}\p{N}_\- ]+$/u;
const UNSAFE_USERNAME_CHARS = /[<>"'`\\]/;

export function sanitizeDisplayUsername(value: string): string {
  const trimmed = value.trim().slice(0, MAX_USERNAME_LENGTH);
  if (!trimmed || UNSAFE_USERNAME_CHARS.test(trimmed)) {
    return DEFAULT_USERNAME;
  }
  if (!USERNAME_PATTERN.test(trimmed)) {
    return DEFAULT_USERNAME;
  }
  return trimmed;
}

export function getAuthUsername(
  userMetadata: Record<string, unknown> | undefined,
): string | null {
  const username = userMetadata?.username;
  if (typeof username !== "string") return null;

  const trimmed = username.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveGreetingName(
  authUsername?: string | null,
  localUsername?: string | null,
): string | null {
  const auth = authUsername?.trim();
  if (auth) {
    const safe = sanitizeDisplayUsername(auth);
    return safe !== DEFAULT_USERNAME ? safe : null;
  }

  const local = localUsername?.trim();
  if (local && local !== DEFAULT_USERNAME) {
    const safe = sanitizeDisplayUsername(local);
    return safe !== DEFAULT_USERNAME ? safe : null;
  }

  return null;
}

export function resolveDisplayUsername(
  authUsername?: string | null,
  localUsername?: string | null,
): string {
  const auth = authUsername?.trim();
  if (auth) return sanitizeDisplayUsername(auth);

  const local = localUsername?.trim();
  if (local) return sanitizeDisplayUsername(local);

  return DEFAULT_USERNAME;
}

export function validateUsername(username: string): string | null {
  const trimmed = username.trim();

  if (!trimmed) {
    return "Kullanıcı adı boş olamaz.";
  }

  if (trimmed.length < MIN_USERNAME_LENGTH) {
    return "Kullanıcı adı 3–24 karakter olmalı ve güvenli karakterler içermeli.";
  }

  if (trimmed.length > MAX_USERNAME_LENGTH) {
    return "Kullanıcı adı 3–24 karakter olmalı ve güvenli karakterler içermeli.";
  }

  if (UNSAFE_USERNAME_CHARS.test(trimmed)) {
    return "Kullanıcı adı 3–24 karakter olmalı ve güvenli karakterler içermeli.";
  }

  if (!USERNAME_PATTERN.test(trimmed)) {
    return "Kullanıcı adı 3–24 karakter olmalı ve güvenli karakterler içermeli.";
  }

  return null;
}

export function formatGreeting(
  authUsername?: string | null,
  localUsername?: string | null,
): string {
  const name = resolveGreetingName(authUsername, localUsername);
  return name ? `Merhaba, ${name}!` : "Merhaba!";
}
