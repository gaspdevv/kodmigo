import {
  getDefaultLearningProgress,
  getDefaultUserProgress,
  getLearningProgress,
  getUserProgress,
  saveLearningProgress,
  saveUserProgress,
  type LearningProgressStore,
  type UserProgress,
} from "@/lib/progress";
import {
  getOnboardingProfile,
  parseOnboardingProfile,
  saveOnboardingProfile,
  type OnboardingProfile,
} from "@/lib/onboarding-data";
import {
  DEFAULT_USERNAME,
  getDefaultProfile,
  getProfile,
  saveProfile,
  type ProfileData,
} from "@/lib/profile";
import {
  getDefaultStreakProgress,
  getStreakProgress,
  saveStreakProgress,
  type StreakProgress,
} from "@/lib/streak";
import { APP_STATE_STORAGE_KEYS } from "@/lib/appStateEvents";
import { withSuppressedPersist } from "@/lib/appStateFlags";
import { normalizeLessonId } from "@/lib/progress";
import {
  filterCompletedForPath,
  getPythonTotalLessons,
} from "@/data/pythonPath";
import type { PathLevel } from "@/lib/onboarding-data";
import { calculateLearningProgressPercent, calculateProgressPercent } from "@/lib/progress";
import { createClient } from "@/lib/supabase/client";
import { logSupabaseError } from "@/lib/supabase/debug";

export type AppState = {
  profile: ProfileData;
  userProgress: UserProgress;
  learningProgress: LearningProgressStore;
  streakProgress: StreakProgress;
  onboardingProfile: OnboardingProfile | null;
};

export type RemoteAppStateRow = {
  user_id: string;
  profile: unknown;
  user_progress: unknown;
  learning_progress: unknown;
  streak_progress: unknown;
  onboarding_profile: unknown;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isEmptyJson(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value !== "object") return false;
  return Object.keys(value as Record<string, unknown>).length === 0;
}

function hasLocalStorageKey(key: string): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export function hasAnyLocalAppState(): boolean {
  return Object.values(APP_STATE_STORAGE_KEYS).some((key) =>
    hasLocalStorageKey(key),
  );
}

function parseRemoteProfile(raw: unknown): ProfileData | null {
  if (isEmptyJson(raw)) return null;
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

function isValidStageKey(
  value: unknown,
): value is import("@/components/dashboard/stageThemes").StageKey {
  return (
    typeof value === "string" &&
    ["bronze", "silver", "gold", "platinum", "diamond", "master"].includes(
      value,
    )
  );
}

function parseRemoteUserProgress(raw: unknown): UserProgress | null {
  if (isEmptyJson(raw)) return null;
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<UserProgress>;
  if (
    typeof data.currentXp !== "number" ||
    typeof data.requiredXp !== "number" ||
    typeof data.streakDays !== "number" ||
    !isValidStageKey(data.currentStage)
  ) {
    return null;
  }

  const nextStage =
    data.nextStage === null
      ? null
      : isValidStageKey(data.nextStage)
        ? data.nextStage
        : null;

  const currentXp = Math.max(0, data.currentXp);
  const requiredXp = Math.max(1, data.requiredXp);

  return {
    currentXp,
    requiredXp,
    progressPercent: calculateProgressPercent(currentXp, requiredXp),
    currentStage: data.currentStage,
    nextStage,
    streakDays: Math.max(0, data.streakDays),
  };
}

function buildPythonProgressFromIds(
  activePathLevel: PathLevel,
  completedLessonIds: string[],
): LearningProgressStore["python"] {
  const pathFiltered = filterCompletedForPath(
    completedLessonIds,
    activePathLevel,
  );
  const totalLessons = getPythonTotalLessons(activePathLevel);
  const completedCount = pathFiltered.length;

  return {
    activePathLevel,
    totalLessons,
    completedLessonIds: pathFiltered,
    completedCount,
    progressPercent: calculateLearningProgressPercent(
      completedCount,
      totalLessons,
    ),
  };
}

function parseRemoteLearningProgress(raw: unknown): LearningProgressStore | null {
  if (isEmptyJson(raw)) return null;
  if (!raw || typeof raw !== "object") return null;

  const data = raw as { python?: unknown };
  const pythonRaw = data.python;
  if (!pythonRaw || typeof pythonRaw !== "object") return null;

  const pythonData = pythonRaw as {
    activePathLevel?: unknown;
    completedLessonIds?: unknown;
  };

  if (!Array.isArray(pythonData.completedLessonIds)) return null;

  const activePathLevel =
    typeof pythonData.activePathLevel === "string"
      ? (pythonData.activePathLevel as PathLevel)
      : "beginner";

  const completedLessonIds = [
    ...new Set(
      pythonData.completedLessonIds
        .filter((id): id is string => typeof id === "string")
        .map(normalizeLessonId),
    ),
  ];

  return {
    python: buildPythonProgressFromIds(activePathLevel, completedLessonIds),
  };
}

function parseRemoteStreakProgress(raw: unknown): StreakProgress | null {
  if (isEmptyJson(raw)) return null;
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<StreakProgress>;

  if (
    typeof data.currentStreak !== "number" ||
    typeof data.longestStreak !== "number" ||
    typeof data.restoreMonth !== "string" ||
    typeof data.restoresUsedThisMonth !== "number" ||
    typeof data.monthlyRestoreLimit !== "number" ||
    typeof data.isPremium !== "boolean"
  ) {
    return null;
  }

  const lastCompletedDate =
    data.lastCompletedDate === null || typeof data.lastCompletedDate === "string"
      ? data.lastCompletedDate
      : null;

  const rescueDecision =
    data.rescueDecision === "restored" ||
    data.rescueDecision === "new_streak" ||
    data.rescueDecision === "reset"
      ? data.rescueDecision
      : null;

  return {
    currentStreak: Math.max(0, data.currentStreak),
    longestStreak: Math.max(0, data.longestStreak),
    lastCompletedDate,
    restoreMonth: data.restoreMonth,
    restoresUsedThisMonth: Math.max(0, data.restoresUsedThisMonth),
    monthlyRestoreLimit: Math.max(0, data.monthlyRestoreLimit),
    isPremium: data.isPremium,
    rescueDecision,
    hasUsedStreakRestore:
      typeof data.hasUsedStreakRestore === "boolean"
        ? data.hasUsedStreakRestore
        : data.restoresUsedThisMonth > 0,
  };
}

function parseRemoteOnboardingProfile(raw: unknown): OnboardingProfile | null {
  if (isEmptyJson(raw)) return null;
  return parseOnboardingProfile(raw);
}

export function parseRemoteAppState(row: RemoteAppStateRow | null): AppState | null {
  if (!row) return null;

  const profile = parseRemoteProfile(row.profile);
  const userProgress = parseRemoteUserProgress(row.user_progress);
  const learningProgress = parseRemoteLearningProgress(row.learning_progress);
  const streakProgress = parseRemoteStreakProgress(row.streak_progress);
  const onboardingProfile = parseRemoteOnboardingProfile(row.onboarding_profile);

  if (
    !profile &&
    !userProgress &&
    !learningProgress &&
    !streakProgress &&
    !onboardingProfile
  ) {
    return null;
  }

  const defaults = getDefaultAppState();

  return {
    profile: profile ?? defaults.profile,
    userProgress: userProgress ?? defaults.userProgress,
    learningProgress: learningProgress ?? defaults.learningProgress,
    streakProgress: streakProgress ?? defaults.streakProgress,
    onboardingProfile: onboardingProfile ?? defaults.onboardingProfile,
  };
}

export function isRemoteAppStateEmpty(row: RemoteAppStateRow | null): boolean {
  if (!row) return true;
  return (
    isEmptyJson(row.profile) &&
    isEmptyJson(row.user_progress) &&
    isEmptyJson(row.learning_progress) &&
    isEmptyJson(row.streak_progress) &&
    isEmptyJson(row.onboarding_profile)
  );
}

export function getDefaultAppState(): AppState {
  return {
    profile: getDefaultProfile(),
    userProgress: getDefaultUserProgress(),
    learningProgress: getDefaultLearningProgress(),
    streakProgress: getDefaultStreakProgress(),
    onboardingProfile: null,
  };
}

export function getLocalAppState(): AppState {
  if (!isBrowser()) return getDefaultAppState();

  return {
    profile: getProfile(),
    userProgress: getUserProgress(),
    learningProgress: getLearningProgress(),
    streakProgress: getStreakProgress(),
    onboardingProfile: getOnboardingProfile(),
  };
}

export function saveLocalAppState(state: AppState): void {
  writeLocalAppState(state);
}

export function writeLocalAppState(state: AppState): void {
  if (!isBrowser()) return;

  withSuppressedPersist(() => {
    saveProfile(state.profile);
    saveUserProgress(state.userProgress);
    saveLearningProgress(state.learningProgress);
    saveStreakProgress(state.streakProgress);

    if (state.onboardingProfile) {
      saveOnboardingProfile(state.onboardingProfile);
    }
  });
}

function mergeUserProgress(
  local: UserProgress,
  remote: UserProgress,
): UserProgress {
  const winner = remote.currentXp >= local.currentXp ? remote : local;

  return {
    ...winner,
    currentXp: Math.max(local.currentXp, remote.currentXp),
    progressPercent: calculateProgressPercent(
      Math.max(local.currentXp, remote.currentXp),
      winner.requiredXp,
    ),
  };
}

function mergeLearningProgress(
  local: LearningProgressStore,
  remote: LearningProgressStore,
  onboardingProfile: OnboardingProfile | null,
): LearningProgressStore {
  const activePathLevel =
    onboardingProfile?.codingLevel ??
    remote.python.activePathLevel ??
    local.python.activePathLevel;

  const mergedIds = [
    ...new Set([
      ...local.python.completedLessonIds.map(normalizeLessonId),
      ...remote.python.completedLessonIds.map(normalizeLessonId),
    ]),
  ];

  return {
    python: buildPythonProgressFromIds(activePathLevel, mergedIds),
  };
}

function mergeStreakProgress(
  local: StreakProgress,
  remote: StreakProgress,
): StreakProgress {
  const pickPrimary = (): StreakProgress => {
    if (!local.lastCompletedDate) return remote;
    if (!remote.lastCompletedDate) return local;
    return local.lastCompletedDate >= remote.lastCompletedDate ? local : remote;
  };

  const primary = pickPrimary();

  return {
    ...primary,
    longestStreak: Math.max(local.longestStreak, remote.longestStreak),
  };
}

function mergeProfile(
  local: ProfileData,
  remote: ProfileData,
  authUsername?: string | null,
): ProfileData {
  const authName = authUsername?.trim();

  let username = local.username;
  if (remote.username && remote.username !== DEFAULT_USERNAME) {
    username = remote.username;
  }
  if (authName) {
    username = authName;
  }

  return {
    username,
    avatarDataUrl: remote.avatarDataUrl ?? local.avatarDataUrl,
    showcasedBadgeId: remote.showcasedBadgeId ?? local.showcasedBadgeId,
  };
}

function mergeOnboardingProfile(
  local: OnboardingProfile | null,
  remote: OnboardingProfile | null,
): OnboardingProfile | null {
  return remote ?? local;
}

export function mergeAppState(
  local: AppState,
  remote: AppState,
  authUsername?: string | null,
): AppState {
  const onboardingProfile = mergeOnboardingProfile(
    local.onboardingProfile,
    remote.onboardingProfile,
  );

  return {
    profile: mergeProfile(local.profile, remote.profile, authUsername),
    userProgress: mergeUserProgress(local.userProgress, remote.userProgress),
    learningProgress: mergeLearningProgress(
      local.learningProgress,
      remote.learningProgress,
      onboardingProfile,
    ),
    streakProgress: mergeStreakProgress(
      local.streakProgress,
      remote.streakProgress,
    ),
    onboardingProfile,
  };
}

export async function loadRemoteAppState(
  userId: string,
): Promise<{ row: RemoteAppStateRow | null; state: AppState | null }> {
  const supabase = createClient();
  if (!supabase) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Kodmigo] loadRemoteAppState: Supabase yapılandırması eksik");
    }
    return { row: null, state: null };
  }

  const { data, error } = await supabase
    .from("user_app_state")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    logSupabaseError("user_app_state load hatası", error);
    return { row: null, state: null };
  }

  const row = (data as RemoteAppStateRow | null) ?? null;
  return {
    row,
    state: parseRemoteAppState(row),
  };
}

export async function upsertRemoteAppState(
  userId: string,
  state: AppState,
): Promise<string | null> {
  const supabase = createClient();
  if (!supabase) {
    return "Supabase bağlantısı yapılandırılmamış.";
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    logSupabaseError("upsertRemoteAppState oturum hatası", sessionError ?? {
      message: "Oturum bulunamadı",
    });
    return sessionError?.message ?? "Oturum bulunamadı.";
  }

  if (session.user.id !== userId) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Kodmigo] upsertRemoteAppState: user_id eşleşmedi", {
        expected: userId,
        actual: session.user.id,
      });
    }
    return "Kullanıcı kimliği eşleşmedi.";
  }

  const payload = {
    user_id: session.user.id,
    profile: state.profile,
    user_progress: state.userProgress,
    learning_progress: state.learningProgress,
    streak_progress: state.streakProgress,
    onboarding_profile: state.onboardingProfile ?? {},
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("user_app_state").upsert(payload, {
    onConflict: "user_id",
  });

  if (error) {
    logSupabaseError("user_app_state upsert hatası", error);
    return error.message;
  }

  return null;
}

/** @deprecated upsertRemoteAppState kullanın */
export async function saveRemoteAppState(
  userId: string,
  state: AppState,
): Promise<string | null> {
  return upsertRemoteAppState(userId, state);
}

export async function syncLocalToRemote(userId: string): Promise<string | null> {
  const local = getLocalAppState();
  return upsertRemoteAppState(userId, local);
}

export async function syncRemoteToLocal(
  userId: string,
  authUsername?: string | null,
): Promise<AppState> {
  const local = getLocalAppState();
  const { row, state: remoteState } = await loadRemoteAppState(userId);

  let merged: AppState;

  if (!row || isRemoteAppStateEmpty(row) || !remoteState) {
    merged = local;
  } else if (!hasAnyLocalAppState()) {
    merged = remoteState;
    if (authUsername) {
      merged = {
        ...merged,
        profile: mergeProfile(merged.profile, merged.profile, authUsername),
      };
    }
  } else {
    merged = mergeAppState(local, remoteState, authUsername);
  }

  writeLocalAppState(merged);

  const saveError = await upsertRemoteAppState(userId, merged);
  if (saveError && process.env.NODE_ENV !== "production") {
    console.error("[Kodmigo] syncRemoteToLocal upsert başarısız:", saveError);
  }

  return merged;
}
