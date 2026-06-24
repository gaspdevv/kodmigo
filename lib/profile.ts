import { notifyAppStateLocalChanged } from "@/lib/appStateNotify";

const STORAGE_KEY = "kodmigo_profile";

export type ProfileData = {
  username: string;
  avatarDataUrl: string | null;
  showcasedBadgeId: string | null;
};

export const DEFAULT_USERNAME = "Kodmigo Öğrencisi";
export const MAX_USERNAME_LENGTH = 24;

function normalizeUsername(value: string): string {
  return value.trim().slice(0, MAX_USERNAME_LENGTH);
}

export function getDefaultProfile(): ProfileData {
  return {
    username: DEFAULT_USERNAME,
    avatarDataUrl: null,
    showcasedBadgeId: null,
  };
}

function parseProfile(raw: unknown): ProfileData | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<ProfileData>;

  const username =
    typeof data.username === "string" && data.username.trim().length > 0
      ? data.username.trim()
      : DEFAULT_USERNAME;

  const avatarDataUrl =
    data.avatarDataUrl === null || typeof data.avatarDataUrl === "string"
      ? data.avatarDataUrl
      : null;

  const showcasedBadgeId =
    data.showcasedBadgeId === null || typeof data.showcasedBadgeId === "string"
      ? data.showcasedBadgeId
      : null;

  return { username, avatarDataUrl, showcasedBadgeId };
}

export function getProfile(): ProfileData {
  if (typeof window === "undefined") return getDefaultProfile();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProfile();

    const parsed = parseProfile(JSON.parse(raw));
    return parsed ?? getDefaultProfile();
  } catch {
    return getDefaultProfile();
  }
}

export function saveProfile(profile: ProfileData): void {
  if (typeof window === "undefined") return;

  try {
    const normalized: ProfileData = {
      username: profile.username.trim() || DEFAULT_USERNAME,
      avatarDataUrl: profile.avatarDataUrl,
      showcasedBadgeId: profile.showcasedBadgeId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    notifyAppStateLocalChanged(true);
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function updateProfileAvatar(avatarDataUrl: string | null): ProfileData {
  const profile = getProfile();
  const updated = { ...profile, avatarDataUrl };
  saveProfile(updated);
  return updated;
}

export function updateProfileUsername(username: string): ProfileData | null {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;

  const profile = getProfile();
  const updated = { ...profile, username: normalized };
  saveProfile(updated);
  return updated;
}
