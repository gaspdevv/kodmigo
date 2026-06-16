import { isLessonCompleted } from "@/lib/progress";

const STORAGE_KEY = "kodmigo_pending_xp_reward";

export type PendingXpReward = {
  lessonId: string;
  xp: number;
  createdAt: number;
};

export function parseXpAmount(xpLabel?: string): number {
  if (!xpLabel) return 10;
  const match = xpLabel.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10;
}

export function savePendingXpReward(lessonId: string, xp: number): void {
  if (typeof window === "undefined") return;
  if (isLessonCompleted("python", lessonId)) return;

  try {
    const existing = getPendingXpReward();
    if (existing?.lessonId === lessonId) return;

    const reward: PendingXpReward = {
      lessonId,
      xp,
      createdAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reward));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function getPendingXpReward(): PendingXpReward | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PendingXpReward;
    if (
      typeof parsed.lessonId !== "string" ||
      typeof parsed.xp !== "number" ||
      typeof parsed.createdAt !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingXpReward(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

const PENDING_LESSON_KEY = "kodmigo_pending_lesson_completion";

export type PendingLessonCompletion = {
  lessonId: string;
  courseId: string;
  createdAt: number;
};

export function savePendingLessonCompletion(
  courseId: string,
  lessonId: string,
): void {
  if (typeof window === "undefined") return;
  if (isLessonCompleted(courseId, lessonId)) return;

  try {
    const existing = getPendingLessonCompletion();
    if (existing?.lessonId === lessonId) return;

    const completion: PendingLessonCompletion = {
      lessonId,
      courseId,
      createdAt: Date.now(),
    };
    localStorage.setItem(PENDING_LESSON_KEY, JSON.stringify(completion));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function saveLessonRewardsIfNew(
  courseId: string,
  lessonId: string,
  xp: number,
): boolean {
  if (isLessonCompleted(courseId, lessonId)) return false;

  savePendingXpReward(lessonId, xp);
  savePendingLessonCompletion(courseId, lessonId);
  return true;
}

export function getPendingLessonCompletion(): PendingLessonCompletion | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(PENDING_LESSON_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as PendingLessonCompletion;
    if (
      typeof parsed.lessonId !== "string" ||
      typeof parsed.courseId !== "string" ||
      typeof parsed.createdAt !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingLessonCompletion(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(PENDING_LESSON_KEY);
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}
