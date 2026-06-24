export const AUTH_SIGN_IN_PATH = "/auth/sign-in";
export const AUTH_SIGN_UP_PATH = "/auth/sign-up";

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

export function buildSignInRedirectUrl(
  targetPath: string,
  origin = "",
): string {
  const params = new URLSearchParams({ redirect: targetPath });
  return `${origin}${AUTH_SIGN_IN_PATH}?${params.toString()}`;
}
