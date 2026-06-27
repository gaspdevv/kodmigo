import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  fetchUserHasOnboardingProfile,
  ONBOARDING_PATH,
  resolvePostLoginPath,
} from "@/lib/auth/postLoginRedirect";
import {
  AUTH_SIGN_UP_PATH,
  isProtectedRoute,
  shouldRedirectLoggedInUserFromAuth,
} from "@/lib/auth/routes";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";

function isOnboardingRoute(pathname: string): boolean {
  return pathname === ONBOARDING_PATH;
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
    const signUpUrl = request.nextUrl.clone();
    signUpUrl.pathname = AUTH_SIGN_UP_PATH;
    signUpUrl.search = "";
    return NextResponse.redirect(signUpUrl);
  }

  if (isProtectedRoute(pathname) && !user) {
    const signInUrl = request.nextUrl.clone();
    signInUrl.pathname = "/auth/sign-in";
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (user) {
    const hasOnboardingProfile = await fetchUserHasOnboardingProfile(
      supabase,
      user.id,
    );

    if (isOnboardingRoute(pathname) && hasOnboardingProfile) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/dashboard";
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }

    if (isProtectedRoute(pathname) && !hasOnboardingProfile) {
      const onboardingUrl = request.nextUrl.clone();
      onboardingUrl.pathname = ONBOARDING_PATH;
      onboardingUrl.search = "";
      return NextResponse.redirect(onboardingUrl);
    }

    if (shouldRedirectLoggedInUserFromAuth(pathname)) {
      const redirectTarget = request.nextUrl.searchParams.get("redirect");
      const destinationPath = resolvePostLoginPath(
        redirectTarget,
        hasOnboardingProfile,
      );
      const destination = request.nextUrl.clone();
      destination.pathname = destinationPath;
      destination.search = "";
      return NextResponse.redirect(destination);
    }
  }

  return supabaseResponse;
}
