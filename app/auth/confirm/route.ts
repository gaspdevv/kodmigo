import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { AUTH_CONFIRMED_PATH } from "@/lib/auth/routes";
import { getSupabaseKey, getSupabaseUrl } from "@/lib/supabase/env";

function buildConfirmedRedirect(
  request: NextRequest,
  error = false,
): NextResponse {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = AUTH_CONFIRMED_PATH;
  redirectUrl.search = error ? "error=1" : "";
  return NextResponse.redirect(redirectUrl);
}

/** token_hash tabanlı doğrulama (varsayılan e-posta dışı senaryolar için yedek) */
export async function GET(request: NextRequest) {
  const supabaseUrl = getSupabaseUrl();
  const supabaseKey = getSupabaseKey();
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;

  if (!supabaseUrl || !supabaseKey || !tokenHash || !type) {
    return buildConfirmedRedirect(request, true);
  }

  let response = buildConfirmedRedirect(request);

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

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return buildConfirmedRedirect(request, true);
  }

  return response;
}
