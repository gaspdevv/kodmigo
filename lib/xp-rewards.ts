/** Default XP for normal lessons (Kısa ders, Pratik, Uygulama). */
export const NORMAL_LESSON_XP = 70;

/** XP for mini tasks / mini projects — higher than normal lessons. */
export const MINI_TASK_XP = 100;

/** XP for full project lessons. */
export const PROJECT_LESSON_XP = 150;

/** XP deducted per activity with at least one wrong attempt. */
export const LESSON_XP_PENALTY_PER_WRONG = 10;

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

/** Minimum XP reward: 50% of base, rounded up to nearest multiple of 5. */
export function getMinimumLessonXpReward(baseXp: number): number {
  return Math.ceil((baseXp * 0.5) / 5) * 5;
}

/** Applies wrong-answer penalties with a minimum reward floor. */
export function calculateLessonXpReward(
  baseXp: number,
  wrongCount: number,
): number {
  const minReward = getMinimumLessonXpReward(baseXp);
  const rawReward = baseXp - wrongCount * LESSON_XP_PENALTY_PER_WRONG;
  return Math.max(minReward, rawReward);
}

export type LessonXpRewardMessage = {
  headline: string;
  detail?: string;
};

export function getLessonXpRewardMessage(
  baseXp: number,
  wrongCount: number,
): LessonXpRewardMessage {
  const finalXp = calculateLessonXpReward(baseXp, wrongCount);

  if (wrongCount === 0) {
    return { headline: `Harika! Tam ödül: +${finalXp} XP` };
  }

  const rawReward = baseXp - wrongCount * LESSON_XP_PENALTY_PER_WRONG;
  const minReward = getMinimumLessonXpReward(baseXp);

  if (rawReward < minReward) {
    return {
      headline: `+${finalXp} XP kazandın`,
      detail:
        "Minimum ödül koruması sayesinde ders XP'sinin en az yarısını aldın.",
    };
  }

  const penalty = baseXp - finalXp;
  return {
    headline: `+${finalXp} XP kazandın`,
    detail: `${wrongCount} yanlış cevap nedeniyle -${penalty} XP uygulandı.`,
  };
}
