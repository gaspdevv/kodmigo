/** Default XP for normal lessons (Kısa ders, Pratik, Uygulama). */
export const NORMAL_LESSON_XP = 70;

/** XP for mini tasks / mini projects — higher than normal lessons. */
export const MINI_TASK_XP = 100;

/** XP for full project lessons. */
export const PROJECT_LESSON_XP = 150;

const LEGACY_NORMAL_XP = new Set([10, 15]);
const LEGACY_MINI_XP = new Set([25]);
const LEGACY_PROJECT_XP = new Set([40]);

/**
 * Resolves the XP reward for a lesson, upgrading legacy low values to the
 * current reward tiers while preserving custom high values.
 */
export function resolveLessonXpReward(
  xpReward: number | undefined,
  fallback?: number,
): number {
  const raw = xpReward ?? fallback ?? NORMAL_LESSON_XP;

  if (LEGACY_NORMAL_XP.has(raw)) return NORMAL_LESSON_XP;
  if (LEGACY_MINI_XP.has(raw)) return MINI_TASK_XP;
  if (LEGACY_PROJECT_XP.has(raw)) return PROJECT_LESSON_XP;

  return raw;
}
