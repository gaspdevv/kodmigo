export const AUTH_SIGN_IN_PATH = "/auth/sign-in";
export const AUTH_SIGN_UP_PATH = "/auth/sign-up";
export const AUTH_START_PATH = "/auth/start";
export const AUTH_CALLBACK_PATH = "/auth/callback";
export const AUTH_CONFIRM_PATH = "/auth/confirm";
export const AUTH_CONFIRMED_PATH = "/auth/confirmed";

/** Giriş yapmış kullanıcıyı dashboard'a yönlendirmeyen auth sayfaları */
export const AUTH_ROUTES_SKIP_LOGGED_IN_REDIRECT = [
  AUTH_CALLBACK_PATH,
  AUTH_CONFIRM_PATH,
  AUTH_CONFIRMED_PATH,
] as const;

export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/learn",
  "/lesson",
  "/profile",
  "/settings",
  "/streak-rescue",
] as const;

export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isAuthRoute(pathname: string): boolean {
  return (
    pathname === AUTH_SIGN_IN_PATH ||
    pathname === AUTH_SIGN_UP_PATH ||
    pathname.startsWith("/auth/")
  );
}

export function shouldRedirectLoggedInUserFromAuth(pathname: string): boolean {
  if (!isAuthRoute(pathname)) return false;

  return !AUTH_ROUTES_SKIP_LOGGED_IN_REDIRECT.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function buildSignInRedirectUrl(
  targetPath: string,
  origin = "",
): string {
  const params = new URLSearchParams({ redirect: targetPath });
  return `${origin}${AUTH_SIGN_IN_PATH}?${params.toString()}`;
}

export function buildEmailConfirmationRedirectUrl(origin: string): string {
  return `${origin}${AUTH_CONFIRMED_PATH}`;
}
