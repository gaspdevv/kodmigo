import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_CONFIRMED_PATH } from "@/lib/auth/routes";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return AUTH_CONFIRMED_PATH;
  }
  return next;
}

function buildConfirmedErrorRedirect(request: NextRequest): NextResponse {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = AUTH_CONFIRMED_PATH;
  redirectUrl.search = "error=1";
  return NextResponse.redirect(redirectUrl);
}

export async function GET(request: NextRequest) {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (searchParams.get("error")) {
    return buildConfirmedErrorRedirect(request);
  }

  if (!supabaseUrl || !supabaseKey || !code) {
    return buildConfirmedErrorRedirect(request);
  }

  const successUrl = request.nextUrl.clone();
  successUrl.pathname = next;
  successUrl.search = "";

  let response = NextResponse.redirect(successUrl);

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return buildConfirmedErrorRedirect(request);
  }

  return response;
}
