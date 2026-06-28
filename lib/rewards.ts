import { isLessonCompleted } from "@/lib/progress";
import { NORMAL_LESSON_XP } from "@/lib/xp-rewards";

const STORAGE_KEY = "kodmigo_pending_xp_reward";

export type PendingXpReward = {
  lessonId: string;
  xp: number;
  createdAt: number;
};

export function parseXpAmount(xpLabel?: string): number {
  if (!xpLabel) return NORMAL_LESSON_XP;
  const match = xpLabel.match(/\d+/);
  return match ? parseInt(match[0], 10) : NORMAL_LESSON_XP;
}

function parsePendingXpRewardEntry(raw: unknown): PendingXpReward | null {
  if (!raw || typeof raw !== "object") return null;

  const parsed = raw as Partial<PendingXpReward>;
  if (
    typeof parsed.lessonId !== "string" ||
    typeof parsed.xp !== "number" ||
    typeof parsed.createdAt !== "number"
  ) {
    return null;
  }

  return {
    lessonId: parsed.lessonId,
    xp: parsed.xp,
    createdAt: parsed.createdAt,
  };
}

function readPendingXpRewardsRaw(): PendingXpReward[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed)) {
      return parsed
        .map(parsePendingXpRewardEntry)
        .filter((entry): entry is PendingXpReward => entry !== null);
    }

    const single = parsePendingXpRewardEntry(parsed);
    return single ? [single] : [];
  } catch {
    return [];
  }
}

function writePendingXpRewards(rewards: PendingXpReward[]): void {
  if (typeof window === "undefined") return;

  try {
    if (rewards.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rewards));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

/** Dashboard celebration queue — XP is applied at lesson completion; this is display-only. */
export function getPendingXpRewards(): PendingXpReward[] {
  return readPendingXpRewardsRaw();
}

/** @deprecated Use getPendingXpRewards — returns first pending reward for backward compatibility. */
export function getPendingXpReward(): PendingXpReward | null {
  return getPendingXpRewards()[0] ?? null;
}

export function addPendingXpReward(lessonId: string, xp: number): void {
  if (typeof window === "undefined") return;

  const rewards = readPendingXpRewardsRaw();
  if (rewards.some((reward) => reward.lessonId === lessonId)) return;

  writePendingXpRewards([
    ...rewards,
    { lessonId, xp, createdAt: Date.now() },
  ]);
}

export function clearPendingXpRewards(): void {
  writePendingXpRewards([]);
}

/** @deprecated Use clearPendingXpRewards */
export function clearPendingXpReward(): void {
  clearPendingXpRewards();
}

const PENDING_LESSON_KEY = "kodmigo_pending_lesson_completion";

export type PendingLessonCompletion = {
  lessonId: string;
  courseId: string;
  createdAt: number;
};

function parsePendingLessonCompletionEntry(
  raw: unknown,
): PendingLessonCompletion | null {
  if (!raw || typeof raw !== "object") return null;

  const parsed = raw as Partial<PendingLessonCompletion>;
  if (
    typeof parsed.lessonId !== "string" ||
    typeof parsed.courseId !== "string" ||
    typeof parsed.createdAt !== "number"
  ) {
    return null;
  }

  return {
    lessonId: parsed.lessonId,
    courseId: parsed.courseId,
    createdAt: parsed.createdAt,
  };
}

function readPendingLessonCompletionsRaw(): PendingLessonCompletion[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(PENDING_LESSON_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;

    if (Array.isArray(parsed)) {
      return parsed
        .map(parsePendingLessonCompletionEntry)
        .filter((entry): entry is PendingLessonCompletion => entry !== null);
    }

    const single = parsePendingLessonCompletionEntry(parsed);
    return single ? [single] : [];
  } catch {
    return [];
  }
}

function writePendingLessonCompletions(
  completions: PendingLessonCompletion[],
): void {
  if (typeof window === "undefined") return;

  try {
    if (completions.length === 0) {
      localStorage.removeItem(PENDING_LESSON_KEY);
      return;
    }
    localStorage.setItem(PENDING_LESSON_KEY, JSON.stringify(completions));
  } catch {
    // localStorage kullanılamıyorsa sessizce geç
  }
}

export function getPendingLessonCompletions(): PendingLessonCompletion[] {
  return readPendingLessonCompletionsRaw();
}

/** @deprecated Use getPendingLessonCompletions */
export function getPendingLessonCompletion(): PendingLessonCompletion | null {
  return getPendingLessonCompletions()[0] ?? null;
}

export function addPendingLessonCompletion(
  courseId: string,
  lessonId: string,
): void {
  if (typeof window === "undefined") return;
  if (isLessonCompleted(courseId, lessonId)) return;

  const completions = readPendingLessonCompletionsRaw();
  if (completions.some((entry) => entry.lessonId === lessonId)) return;

  writePendingLessonCompletions([
    ...completions,
    { lessonId, courseId, createdAt: Date.now() },
  ]);
}

export function clearPendingLessonCompletions(): void {
  writePendingLessonCompletions([]);
}

/** @deprecated Use clearPendingLessonCompletions */
export function clearPendingLessonCompletion(): void {
  clearPendingLessonCompletions();
}
