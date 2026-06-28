import type { StageKey } from "@/components/dashboard/stageThemes";
import type { UserProgress } from "@/lib/progress";

/** Ordered stages from lowest to highest. */
export const STAGE_ORDER: StageKey[] = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
  "master",
];

/** Total XP required to reach each stage (inclusive at threshold). */
export const STAGE_XP_THRESHOLDS: Record<StageKey, number> = {
  bronze: 0,
  silver: 200,
  gold: 500,
  platinum: 900,
  diamond: 1400,
  master: 2000,
};

export function compareStages(a: StageKey, b: StageKey): number {
  return STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b);
}

export function getStageFromXp(totalXp: number): StageKey {
  const xp = Math.max(0, totalXp);
  let stage: StageKey = "bronze";

  for (const key of STAGE_ORDER) {
    if (xp >= STAGE_XP_THRESHOLDS[key]) {
      stage = key;
    }
  }

  return stage;
}

export function getNextStage(stage: StageKey): StageKey | null {
  const index = STAGE_ORDER.indexOf(stage);
  if (index < 0 || index >= STAGE_ORDER.length - 1) return null;
  return STAGE_ORDER[index + 1];
}

export function getStageStartXp(stage: StageKey): number {
  return STAGE_XP_THRESHOLDS[stage];
}

export function calculateStageProgressPercent(
  stageXp: number,
  stageRequiredXp: number,
): number {
  if (stageRequiredXp <= 0) return 100;
  return Math.min(100, Math.round((stageXp / stageRequiredXp) * 100));
}

export function getStageProgressDisplay(progress: UserProgress): {
  stageXp: number;
  stageRequiredXp: number;
} {
  const stageStart = getStageStartXp(progress.currentStage);
  return {
    stageXp: Math.max(0, progress.currentXp - stageStart),
    stageRequiredXp: progress.requiredXp,
  };
}

/** Derive stage fields from lifetime XP so storage stays consistent. */
export function normalizeUserProgressFromXp(
  totalXp: number,
  streakDays = 0,
): UserProgress {
  const currentXp = Math.max(0, totalXp);
  const currentStage = getStageFromXp(currentXp);
  const nextStage = getNextStage(currentStage);
  const stageStartXp = getStageStartXp(currentStage);

  if (!nextStage) {
    return {
      currentXp,
      requiredXp: 0,
      progressPercent: 100,
      currentStage,
      nextStage: null,
      streakDays: Math.max(0, streakDays),
    };
  }

  const nextStageStartXp = getStageStartXp(nextStage);
  const stageXp = currentXp - stageStartXp;
  const stageRequiredXp = nextStageStartXp - stageStartXp;

  return {
    currentXp,
    requiredXp: stageRequiredXp,
    progressPercent: calculateStageProgressPercent(stageXp, stageRequiredXp),
    currentStage,
    nextStage,
    streakDays: Math.max(0, streakDays),
  };
}
