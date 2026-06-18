import type { StageKey } from "@/components/dashboard/stageThemes";
import { normalizeLessonId, pythonPathUnits, type Unit } from "@/data/pythonPath";
import { mockUser } from "@/lib/mockUser";
import { getPendingLessonCompletion } from "@/lib/rewards";

export type UserProgress = {
  currentXp: number;
  requiredXp: number;
  progressPercent: number;
  currentStage: StageKey;
  nextStage: StageKey | null;
  streakDays: number;
};

const STORAGE_KEY = "kodmigo_user_progress";

export function getDefaultUserProgress(): UserProgress {
  return {
    currentXp: mockUser.currentXp,
    requiredXp: mockUser.requiredXp,
    progressPercent: mockUser.progressPercent,
    currentStage: mockUser.currentStage,
    nextStage: mockUser.nextStage,
    streakDays: mockUser.streakDays,
  };
}

export function calculateProgressPercent(
  currentXp: number,
  requiredXp: number,
): number {
  if (requiredXp <= 0) return 100;
  return Math.min(100, Math.round((currentXp / requiredXp) * 100));
}

function isValidStageKey(value: unknown): value is StageKey {
  return (
    typeof value === "string" &&
    ["bronze", "silver", "gold", "platinum", "diamond", "master"].includes(
      value,
    )
  );
}

function parseUserProgress(raw: unknown): UserProgress | null {
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

export function getUserProgress(): UserProgress {
  if (typeof window === "undefined") return getDefaultUserProgress();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultUserProgress();

    const parsed = parseUserProgress(JSON.parse(raw));
    return parsed ?? getDefaultUserProgress();
  } catch {
    return getDefaultUserProgress();
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;

  try {
    const normalized: UserProgress = {
      ...progress,
      progressPercent: calculateProgressPercent(
        progress.currentXp,
        progress.requiredXp,
      ),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function applyXpReward(progress: UserProgress, xp: number): UserProgress {
  const currentXp = progress.currentXp + xp;

  return {
    ...progress,
    currentXp,
    progressPercent: calculateProgressPercent(currentXp, progress.requiredXp),
  };
}

// --- Python learning path progress ---

const LEARNING_PROGRESS_KEY = "kodmigo_learning_progress";

export type PythonLearningProgress = {
  totalLessons: number;
  completedLessonIds: string[];
  completedCount: number;
  progressPercent: number;
};

export type LearningProgressStore = {
  python: PythonLearningProgress;
};

const DEFAULT_COMPLETED_LESSON_IDS: string[] = [];

export function getPythonTotalLessons(): number {
  return pythonPathUnits.flatMap((unit) => unit.lessons).length;
}

export function getDefaultLearningProgress(): LearningProgressStore {
  const totalLessons = getPythonTotalLessons();
  const completedCount = DEFAULT_COMPLETED_LESSON_IDS.length;

  return {
    python: {
      totalLessons,
      completedLessonIds: [...DEFAULT_COMPLETED_LESSON_IDS],
      completedCount,
      progressPercent: calculateLearningProgressPercent(
        completedCount,
        totalLessons,
      ),
    },
  };
}

export function calculateLearningProgressPercent(
  completedCount: number,
  totalLessons: number,
): number {
  if (totalLessons <= 0) return 0;
  return Math.min(100, (completedCount / totalLessons) * 100);
}

function parsePythonLearningProgress(raw: unknown): PythonLearningProgress | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<PythonLearningProgress>;
  if (
    typeof data.totalLessons !== "number" ||
    !Array.isArray(data.completedLessonIds)
  ) {
    return null;
  }

  const completedLessonIds = [
    ...new Set(
      data.completedLessonIds
        .filter((id): id is string => typeof id === "string")
        .map(normalizeLessonId),
    ),
  ];
  const totalLessons = Math.max(1, data.totalLessons);
  const completedCount = completedLessonIds.length;

  return {
    totalLessons,
    completedLessonIds,
    completedCount,
    progressPercent: calculateLearningProgressPercent(
      completedCount,
      totalLessons,
    ),
  };
}

function parseLearningProgressStore(raw: unknown): LearningProgressStore | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<LearningProgressStore>;
  const python = parsePythonLearningProgress(data.python);
  if (!python) return null;

  return { python };
}

export function getLearningProgress(): LearningProgressStore {
  if (typeof window === "undefined") return getDefaultLearningProgress();

  try {
    const raw = localStorage.getItem(LEARNING_PROGRESS_KEY);
    if (!raw) return getDefaultLearningProgress();

    const parsed = parseLearningProgressStore(JSON.parse(raw));
    return parsed ?? getDefaultLearningProgress();
  } catch {
    return getDefaultLearningProgress();
  }
}

export function getEffectiveCompletedLessonIds(): string[] {
  const savedIds = getLearningProgress().python.completedLessonIds.map(
    normalizeLessonId,
  );
  const uniqueSaved = [...new Set(savedIds)];

  const pending = getPendingLessonCompletion();
  if (!pending || pending.courseId !== "python") return uniqueSaved;

  const pendingId = normalizeLessonId(pending.lessonId);
  if (uniqueSaved.includes(pendingId)) return uniqueSaved;

  return [...uniqueSaved, pendingId];
}

export function isLessonCompleted(
  courseId: string,
  lessonId: string,
): boolean {
  if (courseId !== "python") return false;

  const progress = getLearningProgress();
  const normalizedId = normalizeLessonId(lessonId);
  return progress.python.completedLessonIds.some(
    (id) => normalizeLessonId(id) === normalizedId,
  );
}

export function saveLearningProgress(progress: LearningProgressStore): void {
  if (typeof window === "undefined") return;

  try {
    const normalized: LearningProgressStore = {
      python: {
        ...progress.python,
        completedCount: progress.python.completedLessonIds.length,
        progressPercent: calculateLearningProgressPercent(
          progress.python.completedLessonIds.length,
          progress.python.totalLessons,
        ),
      },
    };
    localStorage.setItem(LEARNING_PROGRESS_KEY, JSON.stringify(normalized));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function applyLessonCompletion(
  progress: PythonLearningProgress,
  lessonId: string,
): { progress: PythonLearningProgress; applied: boolean } {
  const normalizedId = normalizeLessonId(lessonId);

  if (
    progress.completedLessonIds.some(
      (id) => normalizeLessonId(id) === normalizedId,
    )
  ) {
    return { progress, applied: false };
  }

  const completedLessonIds = [...progress.completedLessonIds, normalizedId];
  const completedCount = completedLessonIds.length;

  return {
    applied: true,
    progress: {
      ...progress,
      completedLessonIds,
      completedCount,
      progressPercent: calculateLearningProgressPercent(
        completedCount,
        progress.totalLessons,
      ),
    },
  };
}

export function applyPythonLessonStatuses(
  units: Unit[],
  completedLessonIds: string[],
): Unit[] {
  const completedSet = new Set(completedLessonIds.map(normalizeLessonId));
  let foundCurrent = false;

  return units.map((unit) => ({
    ...unit,
    lessons: unit.lessons.map((lesson) => {
      if (completedSet.has(lesson.slug)) {
        return { ...lesson, status: "completed" as const };
      }

      if (!foundCurrent) {
        foundCurrent = true;
        return { ...lesson, status: "current" as const };
      }

      return { ...lesson, status: "locked" as const };
    }),
  }));
}
