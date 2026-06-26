import { APP_STATE_STORAGE_KEYS } from "@/lib/appStateEvents";
import {
  getOnboardingProfile,
  saveOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboarding-data";

export const CURRENT_USER_ID_KEY = "kodmigo_current_user_id";

const EXTRA_APP_STATE_KEYS = [
  "kodmigo_pending_xp_reward",
  "kodmigo_pending_lesson_completion",
] as const;

const AI_CHAT_KEY_PREFIX = "kodmigo_ai_chat_history";

export function getAppStateLocalStorageKeys(): string[] {
  return [...Object.values(APP_STATE_STORAGE_KEYS), ...EXTRA_APP_STATE_KEYS];
}

function removeAiChatHistoryKeys(): void {
  if (typeof window === "undefined") return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(AI_CHAT_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    for (const key of keysToRemove) {
      localStorage.removeItem(key);
    }
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function getStoredCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem(CURRENT_USER_ID_KEY);
  } catch {
    return null;
  }
}

export function setStoredCurrentUserId(userId: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CURRENT_USER_ID_KEY, userId);
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function clearStoredCurrentUserId(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

/** Kodmigo app state key'lerini temizler; `kodmigo_current_user_id` korunur. */
export function clearAppStateLocalStorage(options?: {
  preserveOnboarding?: boolean;
}): void {
  if (typeof window === "undefined") return;

  let preservedOnboarding: OnboardingProfile | null = null;
  if (options?.preserveOnboarding) {
    preservedOnboarding = getOnboardingProfile();
  }

  try {
    for (const key of getAppStateLocalStorageKeys()) {
      localStorage.removeItem(key);
    }
    removeAiChatHistoryKeys();
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }

  if (preservedOnboarding) {
    saveOnboardingProfile(preservedOnboarding);
  }
}

/** Çıkış ve tam sıfırlama için app state + aktif kullanıcı id temizliği. */
export function clearAllKodmigoLocalState(): void {
  clearAppStateLocalStorage();
  clearStoredCurrentUserId();
}
