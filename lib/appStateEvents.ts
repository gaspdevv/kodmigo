export const APP_STATE_STORAGE_KEYS = {
  profile: "kodmigo_profile",
  userProgress: "kodmigo_user_progress",
  learningProgress: "kodmigo_learning_progress",
  streakProgress: "kodmigo_streak_progress",
  onboardingProfile: "kodmigo_onboarding_profile",
} as const;

export const APP_STATE_SYNCED_EVENT = "kodmigo:app-state-synced";
export const APP_STATE_CHANGED_EVENT = "kodmigo:app-state-changed";

export function subscribeAppStateRefresh(onRefresh: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => onRefresh();
  window.addEventListener(APP_STATE_SYNCED_EVENT, handler);
  window.addEventListener(APP_STATE_CHANGED_EVENT, handler);

  return () => {
    window.removeEventListener(APP_STATE_SYNCED_EVENT, handler);
    window.removeEventListener(APP_STATE_CHANGED_EVENT, handler);
  };
}
