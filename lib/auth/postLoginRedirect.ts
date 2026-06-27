import type { SupabaseClient } from "@supabase/supabase-js";
import { isOnboardingProfileComplete } from "@/lib/onboarding-data";

export const ONBOARDING_PATH = "/onboarding";

export function isEmptyOnboardingProfile(raw: unknown): boolean {
  return !isOnboardingProfileComplete(raw);
}

export function hasOnboardingProfile(raw: unknown): boolean {
  return isOnboardingProfileComplete(raw);
}

export function resolvePostLoginPath(
  redirectTo: string | null,
  onboardingComplete: boolean,
): string {
  if (!onboardingComplete) {
    return ONBOARDING_PATH;
  }

  if (redirectTo?.startsWith("/")) {
    if (redirectTo === ONBOARDING_PATH) {
      return "/dashboard";
    }
    return redirectTo;
  }

  return "/dashboard";
}

export async function fetchUserHasOnboardingProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_app_state")
    .select("onboarding_profile")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return hasOnboardingProfile(data.onboarding_profile);
}

export async function resolvePostLoginPathAfterSync(
  supabase: SupabaseClient,
  redirectTo: string | null,
): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return ONBOARDING_PATH;
  }

  const onboardingComplete = await fetchUserHasOnboardingProfile(
    supabase,
    session.user.id,
  );

  return resolvePostLoginPath(redirectTo, onboardingComplete);
}
