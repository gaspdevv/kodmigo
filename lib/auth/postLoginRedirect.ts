import type { SupabaseClient } from "@supabase/supabase-js";
import { hasCompletedOnboarding, parseOnboardingProfile } from "@/lib/onboarding-data";

export const ONBOARDING_PATH = "/onboarding";

export function isEmptyOnboardingProfile(raw: unknown): boolean {
  if (raw === null || raw === undefined) return true;
  if (typeof raw === "object" && !Array.isArray(raw) && Object.keys(raw).length === 0) {
    return true;
  }
  return parseOnboardingProfile(raw) === null;
}

export function resolvePostLoginPath(
  redirectTo: string | null,
  hasOnboardingProfile: boolean,
): string {
  if (!hasOnboardingProfile) {
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

export function resolvePostLoginPathFromLocalState(
  redirectTo: string | null,
): string {
  return resolvePostLoginPath(redirectTo, hasCompletedOnboarding());
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

  return !isEmptyOnboardingProfile(data.onboarding_profile);
}
