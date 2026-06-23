import { DEFAULT_USERNAME, MAX_USERNAME_LENGTH } from "@/lib/profile";

export const MIN_USERNAME_LENGTH = 3;

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
  if (auth) return auth;

  const local = localUsername?.trim();
  if (local && local !== DEFAULT_USERNAME) return local;

  return null;
}

export function resolveDisplayUsername(
  authUsername?: string | null,
  localUsername?: string | null,
): string {
  const auth = authUsername?.trim();
  if (auth) return auth;

  const local = localUsername?.trim();
  if (local) return local;

  return DEFAULT_USERNAME;
}

export function validateUsername(username: string): string | null {
  const trimmed = username.trim();

  if (!trimmed) {
    return "Kullanıcı adı boş olamaz.";
  }

  if (trimmed.length < MIN_USERNAME_LENGTH) {
    return "Kullanıcı adı en az 3 karakter olmalı.";
  }

  if (trimmed.length > MAX_USERNAME_LENGTH) {
    return "Kullanıcı adı en fazla 24 karakter olabilir.";
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
