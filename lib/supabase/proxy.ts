import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  fetchUserHasOnboardingProfile,
  ONBOARDING_PATH,
  resolvePostLoginPath,
} from "@/lib/auth/postLoginRedirect";
import {
  AUTH_SIGN_IN_PATH,
  AUTH_SIGN_UP_PATH,
  isProtectedRoute,
  shouldRedirectLoggedInUserFromAuth,
} from "@/lib/auth/routes";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";

function isOnboardingRoute(pathname: string): boolean {
  return pathname === ONBOARDING_PATH;
}

function copyResponseCookies(from: NextResponse, to: NextResponse): void {
  from.cookies.getAll().forEach(({ name, value }) => {
    to.cookies.set(name, value);
  });
}

function redirectWithSessionCookies(
  request: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
  search = "",
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = search;
  const redirectResponse = NextResponse.redirect(url);
  copyResponseCookies(supabaseResponse, redirectResponse);
  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        supabaseResponse = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (isOnboardingRoute(pathname) && !user) {
    return redirectWithSessionCookies(
      request,
      supabaseResponse,
      AUTH_SIGN_UP_PATH,
    );
  }

  if (isProtectedRoute(pathname) && !user) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/auth/sign-in";
    signInUrl.searchParams.set("redirect", pathname);
    const redirectResponse = NextResponse.redirect(signInUrl);
    copyResponseCookies(supabaseResponse, redirectResponse);
    return redirectResponse;
  }

  if (user) {
    const hasOnboardingProfile = await fetchUserHasOnboardingProfile(
      supabase,
      user.id,
    );

    if (pathname === "/") {
      const destinationPath = resolvePostLoginPath(
        "/dashboard",
        hasOnboardingProfile,
      );
      return redirectWithSessionCookies(
        request,
        supabaseResponse,
        destinationPath,
      );
    }

    if (isOnboardingRoute(pathname) && hasOnboardingProfile) {
      return redirectWithSessionCookies(
        request,
        supabaseResponse,
        "/dashboard",
      );
    }

    if (isProtectedRoute(pathname) && !hasOnboardingProfile) {
      return redirectWithSessionCookies(
        request,
        supabaseResponse,
        ONBOARDING_PATH,
      );
    }

    if (shouldRedirectLoggedInUserFromAuth(pathname)) {
      if (
        pathname === AUTH_SIGN_IN_PATH &&
        request.nextUrl.searchParams.get("passwordUpdated") === "1"
      ) {
        return supabaseResponse;
      }

      const redirectTarget = request.nextUrl.searchParams.get("redirect");
      const destinationPath = resolvePostLoginPath(
        redirectTarget,
        hasOnboardingProfile,
      );
      return redirectWithSessionCookies(
        request,
        supabaseResponse,
        destinationPath,
      );
    }
  }

  return supabaseResponse;
}
