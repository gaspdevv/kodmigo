import { notifyAppStateLocalChanged } from "@/lib/appStateNotify";

export type CodingLevel = "none" | "some" | "basic";
export type PathLevel = "beginner" | "basic" | "intermediate";
export type LearningGoal =
  | "start"
  | "school"
  | "career"
  | "ai"
  | "projects";
export type DailyTime = "5" | "10" | "15" | "30";

export type OnboardingSelections = {
  level: CodingLevel | null;
  goals: LearningGoal[];
  dailyTime: DailyTime | null;
};

export type OnboardingProfile = {
  codingLevel: PathLevel;
  learningGoals: LearningGoal[];
  /** @deprecated İlk seçilen hedef — geriye dönük uyumluluk için korunur. */
  learningGoal: LearningGoal;
  dailyTime: DailyTime;
  completedAt?: string;
};

export const ONBOARDING_STORAGE_KEY = "kodmigo-onboarding";
export const ONBOARDING_PROFILE_KEY = "kodmigo_onboarding_profile";

const CODING_LEVEL_TO_PATH: Record<CodingLevel, PathLevel> = {
  none: "beginner",
  some: "basic",
  basic: "intermediate",
};

const DAILY_TIME_MAP: Record<string, DailyTime> = {
  "5": "5",
  "10": "10",
  "10min": "10",
  "15": "15",
  "15min": "15",
  "30": "30",
  "30min": "30",
};

export function normalizeCodingLevel(value: unknown): PathLevel {
  if (typeof value !== "string") return "beginner";

  const normalized = value.trim().toLowerCase();
  const pathAliases: Record<string, PathLevel> = {
    beginner: "beginner",
    basic: "basic",
    intermediate: "intermediate",
  };

  if (pathAliases[normalized]) {
    return pathAliases[normalized];
  }

  const legacyAliases: Record<string, PathLevel> = {
    none: "beginner",
    some: "basic",
    basic: "intermediate",
  };

  return legacyAliases[normalized] ?? "beginner";
}

export function normalizeLegacyCodingLevel(level: CodingLevel): PathLevel {
  return pathLevelFromCodingLevel(level);
}

export function pathLevelFromCodingLevel(level: CodingLevel): PathLevel {
  return CODING_LEVEL_TO_PATH[level];
}

export function getPathLevelLabel(level: PathLevel): string {
  switch (level) {
    case "beginner":
      return "Başlangıç Seviyesi";
    case "basic":
      return "Temel Seviye";
    case "intermediate":
      return "İleri Seviye";
    default:
      return "Başlangıç";
  }
}

function normalizeDailyTime(value: unknown): DailyTime {
  if (typeof value !== "string") return "10";
  return DAILY_TIME_MAP[value] ?? "10";
}

const VALID_LEARNING_GOALS: LearningGoal[] = [
  "start",
  "school",
  "career",
  "ai",
  "projects",
];

function isValidLearningGoal(value: string): value is LearningGoal {
  return VALID_LEARNING_GOALS.includes(value as LearningGoal);
}

export function normalizeLearningGoals(value: unknown): LearningGoal[] {
  if (Array.isArray(value)) {
    return [
      ...new Set(
        value
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(isValidLearningGoal),
      ),
    ];
  }

  if (typeof value === "string" && value.trim()) {
    return isValidLearningGoal(value) ? [value] : [];
  }

  return [];
}

function buildLearningGoalsFromProfileData(
  data: Record<string, unknown>,
): LearningGoal[] {
  const fromArray = normalizeLearningGoals(
    data.learningGoals ?? data.learningReasons,
  );
  if (fromArray.length > 0) return fromArray;

  const legacySingle = normalizeLearningGoals(
    data.learningGoal ?? data.goal ?? data.reason,
  );
  return legacySingle;
}

export function parseOnboardingProfile(raw: unknown): OnboardingProfile | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const data = raw as Record<string, unknown>;

  if (Object.keys(data).length === 0) return null;

  if (data.codingLevel !== undefined || data.pathLevel !== undefined) {
    const learningGoals = buildLearningGoalsFromProfileData(data);
    if (learningGoals.length === 0) return null;

    return {
      codingLevel: normalizeCodingLevel(data.codingLevel ?? data.pathLevel),
      learningGoals,
      learningGoal: learningGoals[0],
      dailyTime: normalizeDailyTime(data.dailyTime ?? data.time),
      completedAt:
        typeof data.completedAt === "string" ? data.completedAt : undefined,
    };
  }

  if (data.level !== undefined && typeof data.level === "string") {
    const legacyLevel = data.level as CodingLevel;
    const learningGoals = buildLearningGoalsFromProfileData(data);
    if (learningGoals.length === 0) return null;

    return {
      codingLevel: pathLevelFromCodingLevel(legacyLevel),
      learningGoals,
      learningGoal: learningGoals[0],
      dailyTime: normalizeDailyTime(data.dailyTime),
      completedAt:
        typeof data.completedAt === "string" ? data.completedAt : undefined,
    };
  }

  return null;
}

export function hasCompletedOnboarding(profile: unknown): boolean {
  if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
    return false;
  }

  const data = profile as Record<string, unknown>;
  if (Object.keys(data).length === 0) return false;

  const parsed = parseOnboardingProfile(profile);
  if (!parsed) return false;

  if (parsed.completedAt) return true;

  const hasLevel =
    data.codingLevel !== undefined ||
    data.pathLevel !== undefined ||
    data.level !== undefined;
  const hasGoal =
    (Array.isArray(data.learningGoals) && data.learningGoals.length > 0) ||
    (Array.isArray(data.learningReasons) && data.learningReasons.length > 0) ||
    data.learningGoal !== undefined ||
    data.goal !== undefined ||
    data.reason !== undefined;
  const hasTime = data.dailyTime !== undefined || data.time !== undefined;

  return hasLevel && hasGoal && hasTime;
}

export function isOnboardingProfileComplete(raw: unknown): boolean {
  return hasCompletedOnboarding(raw);
}

export function clearOnboardingProfileStorage(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ONBOARDING_PROFILE_KEY);
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function getOnboardingProfile(): OnboardingProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const profileRaw = localStorage.getItem(ONBOARDING_PROFILE_KEY);
    if (profileRaw) {
      const parsed = parseOnboardingProfile(JSON.parse(profileRaw));
      if (parsed) return parsed;
    }

    const legacyRaw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!legacyRaw) return null;

    const legacy = JSON.parse(legacyRaw) as Record<string, unknown>;
    if (legacy.level === undefined || typeof legacy.level !== "string") {
      return null;
    }

    const learningGoals = buildLearningGoalsFromProfileData(legacy);
    if (learningGoals.length === 0) return null;

    return {
      codingLevel: pathLevelFromCodingLevel(legacy.level as CodingLevel),
      learningGoals,
      learningGoal: learningGoals[0],
      dailyTime: normalizeDailyTime(legacy.dailyTime),
      completedAt:
        typeof legacy.completedAt === "string" ? legacy.completedAt : undefined,
    };
  } catch {
    return null;
  }
}

export function getActivePathLevel(): PathLevel {
  return getOnboardingProfile()?.codingLevel ?? "beginner";
}

export function hasCompletedLocalOnboarding(): boolean {
  return hasCompletedOnboarding(getOnboardingProfile());
}

export function saveOnboardingProfile(profile: OnboardingProfile): void {
  if (typeof window === "undefined") return;

  const learningGoals =
    profile.learningGoals.length > 0
      ? profile.learningGoals
      : [profile.learningGoal];
  const learningGoal = learningGoals[0] ?? profile.learningGoal;

  const storedProfile: OnboardingProfile = {
    ...profile,
    learningGoals,
    learningGoal,
  };

  try {
    localStorage.setItem(ONBOARDING_PROFILE_KEY, JSON.stringify(storedProfile));

    const legacyLevel: CodingLevel =
      profile.codingLevel === "beginner"
        ? "none"
        : profile.codingLevel === "basic"
          ? "some"
          : "basic";

    localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      JSON.stringify({
        level: legacyLevel,
        goal: learningGoal,
        learningGoals,
        dailyTime: profile.dailyTime,
        completedAt: profile.completedAt ?? new Date().toISOString(),
      }),
    );
    notifyAppStateLocalChanged(true);
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export const levelOptions: {
  value: CodingLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "none",
    label: "Hiç bilmiyorum",
    description: "Kodlamaya tamamen sıfırdan başlamak istiyorum.",
  },
  {
    value: "some",
    label: "Biraz biliyorum",
    description: "Temel kavramları duydum ama pratik yapmam gerekiyor.",
  },
  {
    value: "basic",
    label: "Temel biliyorum",
    description: "Basit kodlar yazdım, daha düzenli ilerlemek istiyorum.",
  },
];

export const goalOptions: { value: LearningGoal; label: string }[] = [
  { value: "start", label: "Yazılıma başlamak" },
  { value: "school", label: "Okul veya dersler" },
  { value: "career", label: "Kariyer değiştirmek" },
  { value: "ai", label: "AI ve otomasyon" },
  { value: "projects", label: "Kendi projelerimi yapmak" },
];

export const dailyTimeOptions: { value: DailyTime; label: string }[] = [
  { value: "5", label: "5 dakika" },
  { value: "10", label: "10 dakika" },
  { value: "15", label: "15 dakika" },
  { value: "30", label: "30 dakika" },
];

export function getLevelLabel(level: CodingLevel): string {
  return levelOptions.find((o) => o.value === level)?.label ?? level;
}

export function getGoalLabel(goal: LearningGoal): string {
  return goalOptions.find((o) => o.value === goal)?.label ?? goal;
}

export function getGoalsLabel(goals: LearningGoal[]): string {
  return goals.map(getGoalLabel).join(", ");
}

export function getDailyTimeLabel(time: DailyTime): string {
  return dailyTimeOptions.find((o) => o.value === time)?.label ?? time;
}
